"""
tracker.py — SQLite-based application log.
Tracks all jobs applied to, prevents duplicates, stores fit scores and statuses.
"""

import sqlite3
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass
from typing import Optional
from rich.console import Console
from rich.table import Table

console = Console()

DB_PATH = Path(__file__).parent.parent / "applications.db"


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize the database schema if not already created."""
    conn = _get_conn()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            job_title   TEXT NOT NULL,
            company     TEXT NOT NULL,
            platform    TEXT,
            apply_url   TEXT UNIQUE,
            location    TEXT,
            fit_score   INTEGER,
            matching_skills TEXT,
            reasoning   TEXT,
            cover_letter TEXT,
            status      TEXT DEFAULT 'applied',
            applied_at  TEXT DEFAULT (datetime('now')),
            dry_run     INTEGER DEFAULT 1
        )
    """)
    conn.commit()
    conn.close()


def is_already_applied(apply_url: str) -> bool:
    """Returns True if we've already applied to this job URL."""
    conn = _get_conn()
    row = conn.execute(
        "SELECT id FROM applications WHERE apply_url = ?", (apply_url,)
    ).fetchone()
    conn.close()
    return row is not None


def log_application(
    job_title: str,
    company: str,
    platform: str,
    apply_url: str,
    location: str,
    fit_score: int,
    matching_skills: list[str],
    reasoning: str,
    cover_letter: str,
    dry_run: bool = True,
):
    """Log a job application to the database."""
    conn = _get_conn()
    try:
        conn.execute("""
            INSERT OR IGNORE INTO applications
            (job_title, company, platform, apply_url, location, fit_score, matching_skills, reasoning, cover_letter, dry_run)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            job_title,
            company,
            platform,
            apply_url,
            location,
            fit_score,
            ", ".join(matching_skills),
            reasoning,
            cover_letter[:2000],    # Store first 2000 chars
            1 if dry_run else 0,
        ))
        conn.commit()
        console.log(f"[dim]Tracked: {job_title} @ {company} (score: {fit_score})[/dim]")
    except Exception as e:
        console.log(f"[red]Tracker error: {e}[/red]")
    finally:
        conn.close()


def list_applications(limit: int = 50):
    """Print a rich table of all logged applications."""
    init_db()
    conn = _get_conn()
    rows = conn.execute("""
        SELECT job_title, company, platform, fit_score, status, dry_run, applied_at
        FROM applications
        ORDER BY applied_at DESC
        LIMIT ?
    """, (limit,)).fetchall()
    conn.close()

    table = Table(title="📋 Job Applications Log", show_lines=True)
    table.add_column("Role", style="bold cyan", max_width=30)
    table.add_column("Company", style="white", max_width=20)
    table.add_column("Platform", style="dim", max_width=12)
    table.add_column("Score", justify="center")
    table.add_column("Status", style="green")
    table.add_column("Mode", justify="center")
    table.add_column("Date", style="dim", max_width=20)

    for row in rows:
        mode = "🔍 DRY" if row["dry_run"] else "✅ SENT"
        score_color = "green" if (row["fit_score"] or 0) >= 80 else "yellow" if (row["fit_score"] or 0) >= 65 else "red"
        table.add_row(
            row["job_title"],
            row["company"],
            row["platform"] or "-",
            f"[{score_color}]{row['fit_score'] or '?'}%[/{score_color}]",
            row["status"] or "applied",
            mode,
            row["applied_at"][:16] if row["applied_at"] else "-",
        )

    if rows:
        console.print(table)
        console.print(f"\n[dim]Total: {len(rows)} applications logged[/dim]")
    else:
        console.print("[yellow]No applications logged yet. Run main.py to get started![/yellow]")


def get_stats() -> dict:
    """Return basic statistics about the application campaign."""
    conn = _get_conn()
    total = conn.execute("SELECT COUNT(*) as c FROM applications").fetchone()["c"]
    sent = conn.execute("SELECT COUNT(*) as c FROM applications WHERE dry_run=0").fetchone()["c"]
    avg_score = conn.execute("SELECT AVG(fit_score) as a FROM applications").fetchone()["a"]
    conn.close()
    return {"total": total, "sent": sent, "avg_score": round(avg_score or 0, 1)}


# Initialize on import
init_db()
