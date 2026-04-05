"""
email_sender.py — Sends job application emails via Gmail SMTP.
Respects dry_run mode: when dry_run=True, prints email instead of sending.
"""

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from rich.console import Console
from rich.panel import Panel

console = Console()


def send_application_email(
    to_email: str,
    job_title: str,
    company: str,
    cover_letter_plain: str,
    cover_letter_html: str,
    profile: dict,
    config: dict,
) -> bool:
    """
    Send a job application email.
    If dry_run is True, prints email to console and returns True without sending.
    Returns True on success, False on failure.
    """
    dry_run = config.get("dry_run", True)
    sender_email = profile.get("email", "Uabdul88@gmail.com")
    name = profile.get("name", "Dan Usman")
    title = profile.get("title", "AI Prompt Engineer")

    subject = f"Application for {job_title} — {name} | {title}"

    # ── DRY RUN (preview mode) ──────────────────────────────────────
    if dry_run:
        console.print(Panel(
            f"[bold yellow]🔍 DRY RUN — Email NOT sent[/bold yellow]\n\n"
            f"[bold]To:[/bold] {to_email}\n"
            f"[bold]From:[/bold] {sender_email}\n"
            f"[bold]Subject:[/bold] {subject}\n\n"
            f"[dim]─── COVER LETTER PREVIEW ───[/dim]\n\n"
            f"{cover_letter_plain[:1000]}{'...' if len(cover_letter_plain) > 1000 else ''}",
            title=f"[cyan]📧 Application → {company}[/cyan]",
            border_style="yellow",
        ))
        return True

    # ── REAL EMAIL SEND ─────────────────────────────────────────────
    gmail_app_password = os.environ.get("GMAIL_APP_PASSWORD", "")
    if not gmail_app_password:
        console.log("[red]GMAIL_APP_PASSWORD env var not set. Cannot send email.[/red]")
        return False

    smtp_server = config.get("email", {}).get("smtp_server", "smtp.gmail.com")
    smtp_port = config.get("email", {}).get("smtp_port", 587)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{name} <{sender_email}>"
    msg["To"] = to_email
    msg["Reply-To"] = sender_email

    # Attach both plain text and HTML versions
    msg.attach(MIMEText(cover_letter_plain, "plain", "utf-8"))
    msg.attach(MIMEText(cover_letter_html, "html", "utf-8"))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.login(sender_email, gmail_app_password)
            server.sendmail(sender_email, to_email, msg.as_string())

        console.log(f"[green]✅ Email sent to {to_email} for {job_title} @ {company}[/green]")
        return True

    except smtplib.SMTPAuthenticationError:
        console.log("[red]SMTP Authentication failed. Check your GMAIL_APP_PASSWORD.[/red]")
        return False
    except Exception as e:
        console.log(f"[red]Email send failed: {e}[/red]")
        return False


def find_recruiter_email(company: str, job_description: str) -> str:
    """
    Try to extract a recruiter email from the job description.
    Falls back to a generic placeholder.
    """
    import re
    emails = re.findall(r"[\w\.-]+@[\w\.-]+\.\w+", job_description)
    if emails:
        # Filter out common non-recruiter emails
        skip = ["example.com", "privacypolicy", "noreply", "support"]
        for e in emails:
            if not any(s in e.lower() for s in skip):
                return e
    # If no email found, return a placeholder (user can update manually)
    return f"careers@{company.lower().replace(' ', '').replace(',', '')}.com"
