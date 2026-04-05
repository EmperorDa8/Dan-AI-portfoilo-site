# 🤖 AI Job Application Agent

> Automatically applies for intern & entry-level AI jobs on **LinkedIn**, **Indeed**, and **Glassdoor** on behalf of **Dan Usman** — personalized cover letters, project links, EMEA relocation flag, and full application log included.

---

## 📁 Structure

```
job_agent/
├── main.py               ← CLI entry point (run this)
├── agent.py              ← Orchestrator (scrape→score→write→send→log)
├── profile.yaml          ← YOUR CV (edit this with extra work history)
├── config.yaml           ← Settings (platforms, roles, LLM, email)
├── .env.example          ← Copy to .env and fill in your API keys
├── requirements.txt
└── tools/
    ├── job_scraper.py    ← LinkedIn + Indeed + Glassdoor scraper
    ├── job_matcher.py    ← AI fit scorer (0–100%)
    ├── cover_letter.py   ← Personalized cover letter generator
    ├── email_sender.py   ← Gmail SMTP sender (with dry-run preview)
    └── tracker.py        ← SQLite log of all applications
```

---

## ⚡ Quick Start

### 1. Install dependencies

```powershell
cd c:\Users\Dan\Documents\moc\Dan-AI-portfoilo-site\job_agent
pip install -r requirements.txt
playwright install chromium
```

### 2. Set up API keys

```powershell
copy .env.example .env
# Edit .env and add your OPENAI_API_KEY (or GOOGLE_API_KEY)
# Add your GMAIL_APP_PASSWORD for sending emails
```

**Get your keys:**
- OpenAI: https://platform.openai.com/api-keys
- Gemini: https://aistudio.google.com/app/apikey
- Gmail App Password: [Google Account](https://myaccount.google.com) → Security → App Passwords

### 3. Load .env and run (preview mode — no emails sent)

```powershell
# PowerShell: load .env manually
Get-Content .env | ForEach-Object { if ($_ -match '^([^#=]+)=(.*)$') { [System.Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim()) } }

# Run the agent in dry-run (preview) mode
python main.py
```

### 4. Check the output, then go LIVE

```powershell
# When you're happy with the previewed emails, send them for real:
python main.py --live
```

---

## 🎛️ CLI Commands

| Command | Description |
|---------|-------------|
| `python main.py` | Preview mode — shows emails but doesn't send |
| `python main.py --live` | Live mode — sends real emails |
| `python main.py --max 5` | Apply to at most 5 jobs |
| `python main.py --platform glassdoor indeed` | Specific platforms only |
| `python main.py --list` | Show full application history table |
| `python main.py --stats` | Show campaign statistics |

---

## 🔑 What the Agent Does

1. **Scrapes** LinkedIn, Indeed, and Glassdoor for **intern/entry-level** AI roles matching your target titles
2. **Scores** each job 0–100% using LLM intelligence against your profile
3. **Skips** jobs scoring below `min_fit_score` (default: 72%)
4. **Generates** a personalized cover letter specific to each company/role — includes your portfolio, GitHub, and live project links
5. **Sends** (or previews) the application email via Gmail
6. **Logs** everything to `applications.db` (SQLite) — no duplicate applications

---

## ✏️ Customizing Your Profile

Edit `profile.yaml` to add your education, additional experience, or extra projects:

```yaml
education:
  - degree: "BSc Computer Science"
    school: "Your University"
    year: "2024"
```

---

## 🌍 Platforms & Target Roles

Configured in `config.yaml`:

- **Platforms:** LinkedIn, Indeed, Glassdoor
- **Levels:** Intern, Entry-Level, Junior, Graduate
- **Locations:** Remote + EMEA (open to relocation)
- **Roles:** AI Prompt Engineer, Generative AI Specialist, AI Content Creator, AI Automation Engineer, Creative AI Developer, Generative Media Specialist

---

## ⚠️ Important Notes

- **Start with dry-run mode** (`dry_run: true` in config) to preview before sending
- LinkedIn may require a manual login first — export cookies using the [Cookie-Editor](https://cookie-editor.com/) browser extension and save to `linkedin_cookies.json`
- Be respectful to platforms — the agent uses delays between requests
- Check `applications.db` to review all logged applications anytime

---

## 📊 Track Your Applications

```powershell
python main.py --list    # Rich table of all applications
python main.py --stats   # Summary statistics
```

---

*Built by Dan Usman's AI system — [dan-ai-portfoilo-site.vercel.app](https://dan-ai-portfoilo-site.vercel.app/)*
