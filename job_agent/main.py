"""
main.py — CLI entry point for the AI Job Application Agent.

Usage:
  python main.py                          # Full run (dry-run mode by default)
  python main.py --live                   # LIVE mode — sends real emails
  python main.py --platform linkedin      # LinkedIn only
  python main.py --platform glassdoor    # Glassdoor only
  python main.py --max 5                  # Apply to max 5 jobs
  python main.py --list                   # Show all logged applications
"""

import asyncio
import argparse
import sys
from pathlib import Path
from rich.console import Console

console = Console()

# Paths
BASE_DIR = Path(__file__).parent
CONFIG_PATH = BASE_DIR / "config.yaml"
PROFILE_PATH = BASE_DIR / "profile.yaml"

# Ensure tools/ is on path
sys.path.insert(0, str(BASE_DIR))


def parse_args():
    parser = argparse.ArgumentParser(
        description="🤖 AI Job Application Agent — applies to jobs on your behalf",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py                 # Preview mode (no emails sent)
  python main.py --live          # Enable real email sending
  python main.py --max 3         # Apply to at most 3 jobs
  python main.py --platform indeed glassdoor  # Specific platforms only
  python main.py --list          # Show application history
  python main.py --stats         # Show campaign statistics
        """
    )
    parser.add_argument("--live", action="store_true",
                        help="Actually send emails (default: dry-run/preview only)")
    parser.add_argument("--platform", nargs="+",
                        choices=["linkedin", "indeed", "glassdoor"],
                        help="Only scrape specific platforms")
    parser.add_argument("--max", type=int, default=None,
                        help="Maximum applications this run")
    parser.add_argument("--list", action="store_true",
                        help="List all logged applications and exit")
    parser.add_argument("--stats", action="store_true",
                        help="Show application campaign stats and exit")
    return parser.parse_args()


async def main():
    args = parse_args()

    # ── LIST MODE ──────────────────────────────────────────────────
    if args.list:
        from tools.tracker import list_applications
        list_applications()
        return

    if args.stats:
        from tools.tracker import get_stats
        stats = get_stats()
        console.print(f"[bold]📊 Application Stats[/bold]")
        console.print(f"  Total logged:  {stats['total']}")
        console.print(f"  Emails sent:   {stats['sent']}")
        console.print(f"  Average score: {stats['avg_score']}%")
        return

    # ── LOAD CONFIG ────────────────────────────────────────────────
    import yaml
    if not CONFIG_PATH.exists():
        console.print(f"[red]config.yaml not found at {CONFIG_PATH}[/red]")
        console.print("[yellow]Run from the job_agent/ directory.[/yellow]")
        sys.exit(1)

    config = yaml.safe_load(open(CONFIG_PATH))
    profile = yaml.safe_load(open(PROFILE_PATH))

    # Apply CLI overrides
    if args.live:
        config["dry_run"] = False
        console.print("[bold red]⚠️  LIVE MODE: Real emails will be sent![/bold red]")
    else:
        config["dry_run"] = True  # Default safety

    if args.platform:
        config["platforms"] = args.platform
        console.print(f"[dim]Platforms override: {args.platform}[/dim]")

    # ── RUN AGENT ─────────────────────────────────────────────────
    from agent import JobApplicationAgent
    agent = JobApplicationAgent.__new__(JobApplicationAgent)
    agent.config = config
    agent.profile = profile
    agent.min_score = config.get("min_fit_score", 72)
    agent.max_apps = config.get("max_applications_per_run", 15)
    agent.dry_run = config.get("dry_run", True)

    await agent.run(override_max=args.max)


if __name__ == "__main__":
    asyncio.run(main())
