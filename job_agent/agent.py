"""
agent.py — Main ReAct-style orchestrator agent.
Coordinates the full job application pipeline:
  1. Scrape jobs → 2. Score fit → 3. Generate cover letter → 4. Send/preview email → 5. Log
"""

import asyncio
from pathlib import Path
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn

import yaml

from tools.job_scraper import scrape_all_jobs, JobListing
from tools.job_matcher import score_job_fit
from tools.cover_letter import generate_cover_letter, to_html
from tools.email_sender import send_application_email, find_recruiter_email
from tools.tracker import is_already_applied, log_application, get_stats

console = Console()


class JobApplicationAgent:
    def __init__(self, config_path: str = "config.yaml", profile_path: str = "profile.yaml"):
        self.config = yaml.safe_load(open(config_path))
        self.profile = yaml.safe_load(open(profile_path))
        self.min_score = self.config.get("min_fit_score", 72)
        self.max_apps = self.config.get("max_applications_per_run", 15)
        self.dry_run = self.config.get("dry_run", True)

    def _print_banner(self):
        console.print(Panel(
            f"[bold cyan]🤖 AI Job Application Agent[/bold cyan]\n\n"
            f"[white]Candidate:[/white] {self.profile.get('name')} — {self.profile.get('title')}\n"
            f"[white]Platforms:[/white] {', '.join(self.config.get('platforms', []))}\n"
            f"[white]Target roles:[/white] {len(self.config.get('target_roles', []))} roles\n"
            f"[white]Min fit score:[/white] {self.min_score}%\n"
            f"[white]Max applications:[/white] {self.max_apps}\n"
            f"[white]Mode:[/white] {'🔍 DRY RUN (preview only)' if self.dry_run else '🚀 LIVE — Emails will be sent!'}",
            border_style="cyan",
            title="[bold]Starting Agent[/bold]",
        ))

    async def run(self, override_max: int = None):
        """Run the full job application pipeline."""
        self._print_banner()
        max_apps = override_max or self.max_apps
        applied_count = 0

        # ── PHASE 1: Scrape jobs ────────────────────────────────────
        console.rule("[bold cyan]Phase 1: Scraping Jobs[/bold cyan]")
        with Progress(SpinnerColumn(), TextColumn("[progress.description]{task.description}"), console=console) as prog:
            task = prog.add_task("Scraping platforms...", total=None)
            jobs: list[JobListing] = await scrape_all_jobs(self.config)
            prog.update(task, description=f"Found {len(jobs)} unique jobs")

        if not jobs:
            console.print("[yellow]No jobs scraped. Try again later or check your network/cookies.[/yellow]")
            return

        # ── PHASE 2 + 3 + 4: Score → Generate → Apply ──────────────
        console.rule("[bold cyan]Phase 2-4: Match → Write → Apply[/bold cyan]")

        for job in jobs:
            if applied_count >= max_apps:
                console.log(f"[yellow]Reached max applications limit ({max_apps}). Stopping.[/yellow]")
                break

            # Skip duplicates
            if is_already_applied(job.apply_url):
                console.log(f"[dim]Already applied: {job.title} @ {job.company}[/dim]")
                continue

            console.print(f"\n[bold]Evaluating:[/bold] {job.title} @ {job.company} [{job.platform}]")

            # Score fit
            match = score_job_fit(
                profile=self.profile,
                job_title=job.title,
                company=job.company,
                job_description=job.description,
                config=self.config,
            )

            score_color = "green" if match.fit_score >= 80 else "yellow" if match.fit_score >= 65 else "red"
            console.print(f"  Fit score: [{score_color}]{match.fit_score}%[/{score_color}] — {match.reasoning[:120]}...")

            # Skip low-scoring jobs
            if match.fit_score < self.min_score:
                console.log(f"  [dim]Skipping (score {match.fit_score} < {self.min_score})[/dim]")
                continue

            # Generate cover letter
            console.log(f"  [cyan]Generating personalized cover letter...[/cyan]")
            letter_plain = generate_cover_letter(
                profile=self.profile,
                job_title=job.title,
                company=job.company,
                job_description=job.description,
                match_reasoning=match.reasoning,
                pitch_angle=match.pitch_angle,
                matching_skills=match.matching_skills,
                config=self.config,
            )
            letter_html = to_html(letter_plain, self.profile)

            # Find recruiter email
            recruiter_email = find_recruiter_email(job.company, job.description)

            # Send / preview email
            success = send_application_email(
                to_email=recruiter_email,
                job_title=job.title,
                company=job.company,
                cover_letter_plain=letter_plain,
                cover_letter_html=letter_html,
                profile=self.profile,
                config=self.config,
            )

            if success:
                # Log to SQLite
                log_application(
                    job_title=job.title,
                    company=job.company,
                    platform=job.platform,
                    apply_url=job.apply_url,
                    location=job.location,
                    fit_score=match.fit_score,
                    matching_skills=match.matching_skills,
                    reasoning=match.reasoning,
                    cover_letter=letter_plain,
                    dry_run=self.dry_run,
                )
                applied_count += 1
                console.log(f"  [green]✓ Application logged ({applied_count}/{max_apps})[/green]")

        # ── SUMMARY ──────────────────────────────────────────────────
        console.rule("[bold green]Done[/bold green]")
        stats = get_stats()
        console.print(Panel(
            f"[green]Applications this run: {applied_count}[/green]\n"
            f"Total all-time: {stats['total']} | Sent: {stats['sent']} | Avg score: {stats['avg_score']}%",
            title="📊 Session Summary",
            border_style="green",
        ))
