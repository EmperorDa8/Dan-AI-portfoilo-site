"""
job_scraper.py — Scrapes LinkedIn, Indeed, and Glassdoor for entry-level/intern AI jobs.
Uses Playwright with stealth mode to avoid detection.
"""

import asyncio
import json
import re
import time
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Optional
from playwright.async_api import async_playwright, Page
from rich.console import Console

console = Console()


@dataclass
class JobListing:
    title: str
    company: str
    location: str
    description: str
    apply_url: str
    platform: str
    level: str = ""  # intern / entry-level / junior
    salary: str = ""
    posted_date: str = ""


# User-agent rotation pool
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
]

ENTRY_LEVEL_KEYWORDS = {"intern", "internship", "entry", "entry-level", "junior", "graduate", "trainee", "associate"}


def is_entry_level(title: str, description: str) -> bool:
    """Returns True if the job appears to be entry/intern level."""
    combined = (title + " " + description[:500]).lower()
    return any(kw in combined for kw in ENTRY_LEVEL_KEYWORDS)


async def _random_delay(min_s=1.5, max_s=4.0):
    await asyncio.sleep(random.uniform(min_s, max_s))


# ─────────────────────────────────────────────
#  LINKEDIN SCRAPER
# ─────────────────────────────────────────────

async def scrape_linkedin(page: Page, role: str, config: dict, cookie_file: Optional[str] = None) -> list[JobListing]:
    """Scrape LinkedIn Jobs for entry-level/intern positions matching the role."""
    jobs: list[JobListing] = []

    # Load saved cookies if available (avoids repeated login)
    if cookie_file and Path(cookie_file).exists():
        with open(cookie_file) as f:
            cookies = json.load(f)
        await page.context.add_cookies(cookies)
        console.log(f"[green]LinkedIn: loaded saved cookies[/green]")

    # LinkedIn job search URL with entry-level (f_E=1) and internship (f_E=2) filters
    encoded_role = role.replace(" ", "%20")
    locations_param = "Remote"
    url = (
        f"https://www.linkedin.com/jobs/search/?keywords={encoded_role}"
        f"&f_E=1%2C2"       # Entry Level + Internship
        f"&f_TPR=r604800"   # Past week
        f"&location={locations_param}"
        f"&sortBy=DD"       # Most recent
    )

    console.log(f"[cyan]LinkedIn: searching for '{role}'[/cyan]")
    try:
        await page.goto(url, timeout=20000)
        await _random_delay()
        await page.wait_for_load_state("networkidle", timeout=15000)

        # Collect job cards
        job_cards = await page.query_selector_all("div.job-search-card, li.jobs-search-results__list-item")
        console.log(f"[blue]LinkedIn: found {len(job_cards)} cards[/blue]")

        for card in job_cards[:8]:  # Limit per role
            try:
                title_el = await card.query_selector("h3.base-search-card__title, span.sr-only")
                company_el = await card.query_selector("h4.base-search-card__subtitle, a.job-card-container__company-name")
                location_el = await card.query_selector("span.job-search-card__location, li.job-card-container__metadata-item")
                link_el = await card.query_selector("a.base-card__full-link, a.job-card-list__title")

                if not link_el:
                    continue

                title = (await title_el.inner_text()).strip() if title_el else "Unknown"
                company = (await company_el.inner_text()).strip() if company_el else "Unknown"
                location = (await location_el.inner_text()).strip() if location_el else ""
                job_url = await link_el.get_attribute("href") or ""

                # Quick level filter
                if not is_entry_level(title, ""):
                    continue

                # Visit job page to get description
                desc = ""
                if job_url:
                    try:
                        await page.goto(job_url, timeout=15000)
                        await _random_delay(1, 2.5)
                        desc_el = await page.query_selector("div.show-more-less-html__markup, div.jobs-description")
                        desc = (await desc_el.inner_text()).strip()[:3000] if desc_el else ""
                        await page.go_back()
                        await _random_delay()
                    except Exception:
                        pass

                jobs.append(JobListing(
                    title=title,
                    company=company,
                    location=location,
                    description=desc,
                    apply_url=job_url,
                    platform="LinkedIn",
                    level="entry/intern",
                ))
            except Exception as e:
                console.log(f"[yellow]LinkedIn card error: {e}[/yellow]")
                continue

    except Exception as e:
        console.log(f"[red]LinkedIn scrape error for '{role}': {e}[/red]")

    return jobs


# ─────────────────────────────────────────────
#  INDEED SCRAPER
# ─────────────────────────────────────────────

async def scrape_indeed(page: Page, role: str, config: dict) -> list[JobListing]:
    """Scrape Indeed for entry-level/intern AI jobs."""
    jobs: list[JobListing] = []
    encoded_role = role.replace(" ", "+")

    # Indeed URL with entry-level and internship filters
    url = (
        f"https://www.indeed.com/jobs?q={encoded_role}"
        f"&jt=internship"    # internship type filter
        f"&explvl=entry_level"
        f"&l=Remote"
        f"&sort=date"
    )

    console.log(f"[cyan]Indeed: searching for '{role}'[/cyan]")
    try:
        await page.goto(url, timeout=20000)
        await _random_delay()

        job_cards = await page.query_selector_all("div.job_seen_beacon, div.resultContent")
        console.log(f"[blue]Indeed: found {len(job_cards)} cards[/blue]")

        for card in job_cards[:8]:
            try:
                title_el = await card.query_selector("h2.jobTitle span, a.jcs-JobTitle")
                company_el = await card.query_selector("span[data-testid='company-name'], span.companyName")
                location_el = await card.query_selector("div[data-testid='text-location'], div.companyLocation")
                link_el = await card.query_selector("a.jcs-JobTitle, h2.jobTitle a")

                title = (await title_el.inner_text()).strip() if title_el else "Unknown"
                company = (await company_el.inner_text()).strip() if company_el else "Unknown"
                location = (await location_el.inner_text()).strip() if location_el else ""
                href = await link_el.get_attribute("href") if link_el else ""
                job_url = f"https://www.indeed.com{href}" if href and href.startswith("/") else href

                if not is_entry_level(title, ""):
                    continue

                # Get description
                desc = ""
                if job_url:
                    try:
                        await page.goto(job_url, timeout=15000)
                        await _random_delay(1, 2)
                        desc_el = await page.query_selector("div#jobDescriptionText")
                        desc = (await desc_el.inner_text()).strip()[:3000] if desc_el else ""
                        await page.go_back()
                        await _random_delay()
                    except Exception:
                        pass

                jobs.append(JobListing(
                    title=title,
                    company=company,
                    location=location,
                    description=desc,
                    apply_url=job_url,
                    platform="Indeed",
                    level="entry/intern",
                ))
            except Exception as e:
                console.log(f"[yellow]Indeed card error: {e}[/yellow]")
                continue

    except Exception as e:
        console.log(f"[red]Indeed scrape error for '{role}': {e}[/red]")

    return jobs


# ─────────────────────────────────────────────
#  GLASSDOOR SCRAPER
# ─────────────────────────────────────────────

async def scrape_glassdoor(page: Page, role: str, config: dict) -> list[JobListing]:
    """Scrape Glassdoor for entry-level/intern AI jobs."""
    jobs: list[JobListing] = []
    encoded_role = role.replace(" ", "-").lower()

    # Glassdoor uses slug-based URLs
    url = f"https://www.glassdoor.com/Job/{encoded_role}-jobs-SRCH_KO0,{len(role)}.htm?seniorityType=internship,entry_level"

    console.log(f"[cyan]Glassdoor: searching for '{role}'[/cyan]")
    try:
        await page.goto(url, timeout=25000)
        await _random_delay(2, 4)

        job_cards = await page.query_selector_all("li[data-test='jobListing'], div.JobCard_jobCardContent__ZpeBh")
        console.log(f"[blue]Glassdoor: found {len(job_cards)} cards[/blue]")

        for card in job_cards[:8]:
            try:
                title_el = await card.query_selector("a.JobCard_seoLink__WdqHZ, a[data-test='job-title']")
                company_el = await card.query_selector("span.EmployerProfile_compactEmployerName__9MGcV, span[data-test='employer-name']")
                location_el = await card.query_selector("div.JobCard_location__N_iYE, span[data-test='emp-location']")

                title = (await title_el.inner_text()).strip() if title_el else "Unknown"
                company = (await company_el.inner_text()).strip() if company_el else "Unknown"
                location = (await location_el.inner_text()).strip() if location_el else ""
                job_url = await title_el.get_attribute("href") if title_el else ""
                if job_url and not job_url.startswith("http"):
                    job_url = f"https://www.glassdoor.com{job_url}"

                if not is_entry_level(title, ""):
                    continue

                desc = ""
                if job_url:
                    try:
                        await page.goto(job_url, timeout=15000)
                        await _random_delay(1.5, 3)
                        desc_el = await page.query_selector("div.JobDetails_jobDescription__uW_fK, div[class*='jobDescription']")
                        desc = (await desc_el.inner_text()).strip()[:3000] if desc_el else ""
                        await page.go_back()
                        await _random_delay()
                    except Exception:
                        pass

                jobs.append(JobListing(
                    title=title,
                    company=company,
                    location=location,
                    description=desc,
                    apply_url=job_url,
                    platform="Glassdoor",
                    level="entry/intern",
                ))
            except Exception as e:
                console.log(f"[yellow]Glassdoor card error: {e}[/yellow]")
                continue

    except Exception as e:
        console.log(f"[red]Glassdoor scrape error for '{role}': {e}[/red]")

    return jobs


# ─────────────────────────────────────────────
#  MAIN SCRAPER ENTRY POINT
# ─────────────────────────────────────────────

async def scrape_all_jobs(config: dict) -> list[JobListing]:
    """Run all enabled platform scrapers and return combined job listings."""
    all_jobs: list[JobListing] = []
    platforms = config.get("platforms", ["linkedin", "indeed", "glassdoor"])
    roles = config.get("target_roles", ["AI Prompt Engineer"])

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            viewport={"width": 1280, "height": 720},
            java_script_enabled=True,
        )
        page = await context.new_page()

        for role in roles:
            if "linkedin" in platforms:
                cookie_file = config.get("linkedin_cookie_file")
                jobs = await scrape_linkedin(page, role, config, cookie_file)
                all_jobs.extend(jobs)

            if "indeed" in platforms:
                jobs = await scrape_indeed(page, role, config)
                all_jobs.extend(jobs)

            if "glassdoor" in platforms:
                jobs = await scrape_glassdoor(page, role, config)
                all_jobs.extend(jobs)

            await _random_delay(2, 5)  # Respectful delay between roles

        await browser.close()

    # Deduplicate by URL
    seen = set()
    unique_jobs = []
    for j in all_jobs:
        if j.apply_url not in seen:
            seen.add(j.apply_url)
            unique_jobs.append(j)

    console.log(f"[green]Total unique jobs found: {len(unique_jobs)}[/green]")
    return unique_jobs


# CLI test
if __name__ == "__main__":
    import yaml
    cfg = yaml.safe_load(open("../config.yaml"))
    jobs = asyncio.run(scrape_all_jobs(cfg))
    for j in jobs:
        print(f"[{j.platform}] {j.title} @ {j.company} — {j.location}")
        print(f"  URL: {j.apply_url}\n")
