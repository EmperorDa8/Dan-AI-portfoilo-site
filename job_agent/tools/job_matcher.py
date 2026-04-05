"""
job_matcher.py — Uses LLM intelligence to score job fit against Dan's profile.
Returns a fit score (0-100) with reasoning for which jobs to apply to.
"""

import os
import json
from dataclasses import dataclass
from typing import Optional

import yaml
from rich.console import Console

console = Console()


@dataclass
class MatchResult:
    job_title: str
    company: str
    fit_score: int          # 0-100
    is_qualified: bool
    matching_skills: list[str]
    missing_skills: list[str]
    reasoning: str
    pitch_angle: str        # How to angle the cover letter


def _build_profile_summary(profile: dict) -> str:
    """Build a concise CV summary string for the LLM."""
    skills = "\n".join(f"  - {s}" for s in profile.get("skills", []))
    experience = ""
    for exp in profile.get("experience", []):
        bullets = "\n".join(f"      • {h}" for h in exp.get("highlights", []))
        experience += f"\n  - {exp['role']} at {exp['company']} ({exp.get('period','')}):\n{bullets}"
    projects = ""
    for proj in profile.get("projects", []):
        projects += f"\n  - {proj['name']}: {proj['description']} ({proj['url']})"

    location = profile.get("location", "Remote")
    relocation = profile.get("notes", "")

    return f"""
=== CANDIDATE PROFILE ===
Name: {profile.get('name', 'Dan Usman')}
Title: {profile.get('title', 'AI Prompt Engineer')}
Location: {location}
{relocation}

Skills:
{skills}

Work Experience:{experience}

Projects:{projects}
"""


def _build_match_prompt(profile_summary: str, job_title: str, company: str, job_description: str) -> str:
    return f"""You are an expert technical recruiter. Assess how well this candidate's profile matches the job listing.

{profile_summary}

=== JOB LISTING ===
Role: {job_title}
Company: {company}
Description:
{job_description[:2500]}

=== YOUR TASK ===
Evaluate the match on a scale of 0-100 where:
- 90-100: Perfect match — almost all skills match
- 75-89: Strong match — most key skills present
- 60-74: Good match — solid overlap but some gaps
- 40-59: Partial match — related field but missing key requirements
- 0-39: Poor fit — very different domain

Respond ONLY with valid JSON in this exact structure:
{{
  "fit_score": <integer 0-100>,
  "is_qualified": <true if score >= 70>,
  "matching_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1"] or [],
  "reasoning": "<2-3 sentence explanation>",
  "pitch_angle": "<1 sentence on how to angle the cover letter for this specific role>"
}}"""


def _call_openai(prompt: str, model: str) -> str:
    from openai import OpenAI
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=600,
    )
    return response.choices[0].message.content.strip()


def _call_gemini(prompt: str, model: str) -> str:
    import google.generativeai as genai
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
    m = genai.GenerativeModel(model)
    response = m.generate_content(prompt)
    return response.text.strip()


def score_job_fit(
    profile: dict,
    job_title: str,
    company: str,
    job_description: str,
    config: dict,
) -> MatchResult:
    """Score how well Dan's profile matches the given job listing."""

    profile_summary = _build_profile_summary(profile)
    prompt = _build_match_prompt(profile_summary, job_title, company, job_description)

    provider = config.get("llm_provider", "openai")
    model = config.get("llm_model", "gpt-4o-mini")

    try:
        if provider == "gemini":
            model = config.get("gemini_model", "gemini-1.5-flash")
            raw = _call_gemini(prompt, model)
        else:
            raw = _call_openai(prompt, model)

        # Clean up markdown code fences if present
        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip().rstrip("`")

        data = json.loads(raw)
        return MatchResult(
            job_title=job_title,
            company=company,
            fit_score=data.get("fit_score", 0),
            is_qualified=data.get("is_qualified", False),
            matching_skills=data.get("matching_skills", []),
            missing_skills=data.get("missing_skills", []),
            reasoning=data.get("reasoning", ""),
            pitch_angle=data.get("pitch_angle", ""),
        )

    except Exception as e:
        console.log(f"[red]Matcher error for {job_title}: {e}[/red]")
        return MatchResult(
            job_title=job_title,
            company=company,
            fit_score=0,
            is_qualified=False,
            matching_skills=[],
            missing_skills=[],
            reasoning=f"Error during matching: {e}",
            pitch_angle="",
        )


# CLI test
if __name__ == "__main__":
    cfg = yaml.safe_load(open("../config.yaml"))
    profile = yaml.safe_load(open("../profile.yaml"))
    result = score_job_fit(
        profile=profile,
        job_title="AI Prompt Engineer Intern",
        company="Meta",
        job_description="We are looking for an AI Prompt Engineer intern to help optimize prompts for our generative AI models including text-to-image and video generation workflows. Experience with Midjourney, DALL-E, or similar tools preferred.",
        config=cfg,
    )
    print(f"Fit Score: {result.fit_score}/100")
    print(f"Qualified: {result.is_qualified}")
    print(f"Matching: {result.matching_skills}")
    print(f"Reasoning: {result.reasoning}")
    print(f"Pitch angle: {result.pitch_angle}")
