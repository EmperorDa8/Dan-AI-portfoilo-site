"""Generate src/data/music.ts from the MP3 ID3 lyric tags.

The lyrics and the bracketed arrangement directions are Dan's own writing, so
they are extracted verbatim from the files rather than retyped — a transcription
slip here would misquote him on his own portfolio.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

SRC = Path(r"C:\Users\Dan\Downloads")
OUT = Path(r"C:\Users\Dan\Documents\moc\Dan-AI-portfoilo-site\src\data\music.ts")

# slug, source filename, editorial fields that are NOT in the tags
TRACKS = [
    ("go-well", "Go Well", "Afrobeats", "Nigerian Pidgin",
     "Sub bass, one dry guitar lick, brass stab — and nothing else until the chorus."),
    ("time-no-dey-wait", "Time No Dey Wait", "Afrobeats", "Nigerian Pidgin",
     "A wedding invitation from the woman you loved first. Mid-tempo, held back."),
    ("empty-glass-of-maybe", "Empty Glass of Maybe", "Afrobeats", "Nigerian Pidgin",
     "Bar chatter and soft guitar under a man who never said hello."),
    ("the-engine", "The Engine", "Duet", "Pidgin · English · French",
     "Call-and-response duet across two languages, harp and sea under it."),
    ("paper-and-frost", "Paper and Frost", "Cinematic", "English",
     "Wuse market to Zurich on one folded visa page. Built to swell."),
    ("greener-ground", "Greener Ground", "Folk", "English",
     "Rhodes chord, rain on glass, a year of leave. The quietest one here."),
]

SECTION_WORDS = (
    "intro", "verse", "pre-chorus", "prechorus", "chorus", "bridge", "outro",
    "hook", "refrain", "interlude", "final chorus",
)


def probe(path: Path) -> dict:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries",
         "format=duration:format_tags=lyrics,title,artist",
         "-of", "json", str(path)],
        capture_output=True, text=True, encoding="utf-8", check=True,
    )
    return json.loads(out.stdout)["format"]


def is_section_header(text: str) -> bool:
    """A bracketed line is a section header if it names a song part."""
    head = re.split(r"\s[-–—]\s|:", text, maxsplit=1)[0].strip().lower()
    return any(head.startswith(w) for w in SECTION_WORDS)


def parse(lyrics: str):
    """Split the lyric block into sections of {label, direction, lines}."""
    sections = []
    current = None

    for raw in lyrics.splitlines():
        line = raw.strip()
        if not line:
            continue

        bracketed = line.startswith("[") and line.endswith("]")
        inner = line[1:-1].strip() if bracketed else ""

        if bracketed and is_section_header(inner):
            # "[Verse 1 – Male, soft and close]" -> label + inline direction
            parts = re.split(r"\s[-–—]\s", inner, maxsplit=1)
            label = parts[0].strip()
            direction = parts[1].strip() if len(parts) > 1 else ""
            current = {"label": label, "direction": direction, "lines": []}
            sections.append(current)
            continue

        if current is None:
            current = {"label": "Intro", "direction": "", "lines": []}
            sections.append(current)

        if bracketed:
            # A standalone stage direction inside a section.
            if current["direction"]:
                # Separate stacked directions so two cues never read as one
                # run-on sentence, e.g. "...sea, cicadas Female, breath only".
                current["direction"] += " · " + inner
            else:
                current["direction"] = inner
            continue

        current["lines"].append(line)

    return [s for s in sections if s["lines"] or s["direction"]]


def ts(value) -> str:
    """JSON strings are valid TS string literals."""
    return json.dumps(value, ensure_ascii=False)


def main():
    rows = []
    for slug, name, genre, language, note in TRACKS:
        path = SRC / f"{name}.mp3"
        if not path.exists():
            sys.exit(f"missing: {path}")
        fmt = probe(path)
        tags = fmt.get("tags", {})
        lyrics = tags.get("lyrics", "")
        if not lyrics:
            sys.exit(f"no lyrics tag in {path}")

        sections = parse(lyrics)
        rows.append({
            "id": slug,
            "title": tags.get("title", name),
            "genre": genre,
            "language": language,
            "duration": round(float(fmt["duration"])),
            "note": note,
            "sections": sections,
        })
        print(f"{slug:24} {len(sections):2} sections  {round(float(fmt['duration']))}s")

    body = ",\n".join(
        "    {\n"
        f"        id: {ts(r['id'])},\n"
        f"        title: {ts(r['title'])},\n"
        f"        genre: {ts(r['genre'])},\n"
        f"        language: {ts(r['language'])},\n"
        f"        duration: {r['duration']},\n"
        f"        note: {ts(r['note'])},\n"
        "        sections: [\n"
        + ",\n".join(
            "            { label: %s, direction: %s, lines: [%s] }"
            % (
                ts(s["label"]),
                ts(s["direction"]),
                ", ".join(ts(line) for line in s["lines"]),
            )
            for s in r["sections"]
        )
        + ",\n        ],\n    }"
        for r in rows
    )

    OUT.write_text(
        '/* AI music — six tracks written and directed by Dan, performed by Flow.\n'
        ' *\n'
        ' * GENERATED by scripts/gen_music_data.py from the MP3 ID3 lyric tags.\n'
        ' * The lyrics and the bracketed arrangement directions are Dan\'s own\n'
        ' * writing and are extracted verbatim — do not retype them by hand. Only\n'
        ' * `genre`, `language` and `note` are editorial and safe to edit here.\n'
        ' */\n\n'
        "export type MusicSection = {\n"
        "    /** Song part, e.g. \"Verse 1\", \"Pre-Chorus\". */\n"
        "    label: string;\n"
        "    /** Arrangement direction written alongside the part, if any. */\n"
        "    direction: string;\n"
        "    lines: string[];\n"
        "};\n\n"
        "export type Track = {\n"
        "    id: string;\n"
        "    title: string;\n"
        "    genre: string;\n"
        "    language: string;\n"
        "    /** Seconds, read from the file so the UI never guesses. */\n"
        "    duration: number;\n"
        "    note: string;\n"
        "    sections: MusicSection[];\n"
        "};\n\n"
        "export const ARTIST = 'LastingJuniper';\n"
        "export const MUSIC_MODEL = 'Flow';\n\n"
        "export const TRACKS: Track[] = [\n"
        + body
        + ",\n];\n",
        encoding="utf-8",
    )
    print(f"\nwrote {OUT}")


if __name__ == "__main__":
    main()
