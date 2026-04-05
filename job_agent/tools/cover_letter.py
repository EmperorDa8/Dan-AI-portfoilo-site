"""
cover_letter.py — AI-powered personalized cover letter generator.
Creates tailored cover letters that highlight Dan's most relevant work and project links.
"""

import os
import json
from typing import Optional

import yaml
from rich.console import Console

console = Console()

# Dan's portfolio project links (formatted for inclusion in letters)
PORTFOLIO_LINKS = """
🔗 Key Projects & Links:
• Portfolio:         https://dan-ai-portfoilo-site.vercel.app/
• GitHub:            https://github.com/EmperorDa8
• AZer-t Studio:     https://drive.google.com/drive/folders/1O8acef1kl6LuIFuo7I3l3vauvuBl_4Fu
• Voice Bot App:     https://vermillion-travesseiro-d1b2de.netlify.app/
• PDF Gallery App:   https://pdf-platf.vercel.app/
• Art Cover Gen:     https://github.com/EmperorDa8/art-app-cover-gen
• Gen-AI Repo:       https://github.com/EmperorDa8/generativeAI
• 3D World Sim:      https://marble.worldlabs.ai/world/0007ca41-6e04-47a7-b3cf-f4c2c9f372d5
• LinkedIn:          https://www.linkedin.com/in/dan-usman-b87282134/
"""


def _build_cover_letter_prompt(
    profile: dict,
    job_title: str,
    company: str,
    job_description: str,
    match_reasoning: str,
    pitch_angle: str,
    matching_skills: list[str],
) -> str:
    name = profile.get("name", "Dan Usman")
    title = profile.get("title", "AI Prompt Engineer & Vibe Coder")
    email = profile.get("email", "Uabdul88@gmail.com")
    linkedin = profile.get("linkedin", "")
    portfolio = profile.get("portfolio", "")
    location = profile.get("location", "Remote")
    relocation_note = ""
    if profile.get("relocation"):
        regions = ", ".join(profile.get("relocation_regions", ["EMEA"]))
        relocation_note = f"I am also open to relocation to {regions} if required."

    # Build experience summary
    exp_lines = ""
    for exp in profile.get("experience", []):
        exp_lines += f"\n- {exp['role']} at {exp['company']} ({exp.get('period', '')})"

    # Build project highlights relevant to the role
    projects_text = "\n".join(
        f"- {p['name']}: {p['description']} → {p['url']}"
        for p in profile.get("projects", [])[:5]
    )

    return f"""You are a professional cover letter writer. Write a compelling, personalized cover letter for the following job application.

CANDIDATE: {name} ({title})
ROLE APPLYING FOR: {job_title} at {company}
CANDIDATE EMAIL: {email}
CANDIDATE LINKEDIN: {linkedin}
CANDIDATE PORTFOLIO: {portfolio}
CANDIDATE LOCATION: {location}
RELOCATION NOTE: {relocation_note}

KEY MATCHING SKILLS FOR THIS ROLE:
{', '.join(matching_skills)}

AI RECRUITER ANALYSIS (use this to angle the letter):
{match_reasoning}
PITCH ANGLE: {pitch_angle}

CANDIDATE EXPERIENCE:
{exp_lines}

CANDIDATE'S KEY PROJECTS (include the most relevant 2-3 with their URLs):
{projects_text}

JOB DESCRIPTION EXCERPT:
{job_description[:1500]}

INSTRUCTIONS:
- Write a professional yet enthusiastic cover letter (300-400 words)
- Address it "Dear Hiring Team at {company},"
- Open with an attention-grabbing hook that mentions the specific role and company
- Highlight the 2-3 most relevant skills/projects for THIS specific role
- Include actual project URLs inline (e.g., "as seen at [URL]")
- Mention availability to work remotely or relocate to EMEA if relevant
- End with a confident call to action + contact details
- Use a natural, confident tone — not stiff/corporate, not too casual
- Sign off as:
  {name}
  {title}
  {email}
  {linkedin}
  {portfolio}

Output ONLY the cover letter text — no preamble, no notes, no markdown headers."""


def _call_openai(prompt: str, model: str) -> str:
    from openai import OpenAI
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=800,
    )
    return response.choices[0].message.content.strip()


def _call_gemini(prompt: str, model: str) -> str:
    import google.generativeai as genai
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
    m = genai.GenerativeModel(model)
    response = m.generate_content(prompt)
    return response.text.strip()


def generate_cover_letter(
    profile: dict,
    job_title: str,
    company: str,
    job_description: str,
    match_reasoning: str = "",
    pitch_angle: str = "",
    matching_skills: Optional[list] = None,
    config: dict = None,
) -> str:
    """Generate a personalized cover letter for the given job."""
    if config is None:
        config = {}
    if matching_skills is None:
        matching_skills = profile.get("skills", [])[:5]

    prompt = _build_cover_letter_prompt(
        profile=profile,
        job_title=job_title,
        company=company,
        job_description=job_description,
        match_reasoning=match_reasoning,
        pitch_angle=pitch_angle,
        matching_skills=matching_skills,
    )

    provider = config.get("llm_provider", "openai")
    model = config.get("llm_model", "gpt-4o-mini")

    try:
        if provider == "gemini":
            model = config.get("gemini_model", "gemini-1.5-flash")
            letter = _call_gemini(prompt, model)
        else:
            letter = _call_openai(prompt, model)
        return letter
    except Exception as e:
        console.log(f"[red]Cover letter generation error: {e}[/red]")
        return _fallback_letter(profile, job_title, company)


def _fallback_letter(profile: dict, job_title: str, company: str) -> str:
    """Simple fallback template if LLM is unavailable."""
    name = profile.get("name", "Dan Usman")
    email = profile.get("email", "")
    portfolio = profile.get("portfolio", "")
    linkedin = profile.get("linkedin", "")
    return f"""Dear Hiring Team at {company},

I am writing to express my strong interest in the {job_title} position. As an AI Prompt Engineer and Vibe Coder with hands-on experience in generative AI (Sora, Kling 2.6, Midjourney, ElevenLabs) and full-stack vibe coding, I am excited by the opportunity to bring these skills to your team.

My recent work at AZer-t (French Video Game Studio) involved engineering production-quality AI game assets and building voice AI agents for in-game NPCs. I also built an enterprise banking voice bot, a PDF gallery app, and maintain an active generative AI repository on GitHub.

Portfolio: {portfolio}
LinkedIn: {linkedin}

I am available for remote work and open to relocation to EMEA. I would love to discuss how I can contribute to your team.

Best regards,
{name}
{email}"""


# HTML wrapper for email
def to_html(text: str, profile: dict) -> str:
    """Wrap plain text cover letter in clean HTML for email sending."""
    lines = text.replace("\n\n", "<br><br>").replace("\n", "<br>")
    return f"""<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; font-size: 15px; color: #222; max-width: 680px; margin: 0 auto; padding: 32px;">
<p>{lines}</p>
<hr style="border: 1px solid #eee; margin: 32px 0;">
<p style="font-size: 12px; color: #888;">
  Portfolio: <a href="{profile.get('portfolio','')}">dan-ai-portfoilo-site.vercel.app</a> |
  GitHub: <a href="https://github.com/EmperorDa8">github.com/EmperorDa8</a> |
  LinkedIn: <a href="{profile.get('linkedin','')}">linkedin.com/in/dan-usman-b87282134</a>
</p>
</body>
</html>"""


# CLI test
if __name__ == "__main__":
    cfg = yaml.safe_load(open("../config.yaml"))
    profile = yaml.safe_load(open("../profile.yaml"))
    letter = generate_cover_letter(
        profile=profile,
        job_title="AI Prompt Engineer Intern",
        company="Adobe",
        job_description="We are looking for an intern to help with generative AI prompt workflows for our Creative Cloud suite. Experience with Midjourney, Sora, or video generation tools is a plus.",
        match_reasoning="Strong match — candidate has direct experience with all mentioned tools.",
        pitch_angle="Lead with game asset production experience to show production-quality AI output.",
        matching_skills=["Midjourney", "Sora", "Kling 2.6", "Prompt Engineering", "Generative AI"],
        config=cfg,
    )
    print(letter)
