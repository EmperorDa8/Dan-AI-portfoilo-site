#!/usr/bin/env bash
# Re-encode finished videos for the web, matching the convention the existing
# 31 Studio items already use: 540p H.264 + AAC, plus a 480px webp poster.
#
# (The planning doc suggested 720p webm. That describes the /ambient background
#  loops, which are silent and decorative. Studio tiles carry sound and open in
#  a lightbox, and every existing tile is 540p H.264, so these match those.)
#
# Usage: bash scripts/encode_studio_media.sh
set -euo pipefail

SRC="/c/Users/Dan/Downloads"
REPO="/c/Users/Dan/Documents/moc/Dan-AI-portfoilo-site"
OUT="$REPO/public/studio"
MUSIC_OUT="$REPO/public/music"

mkdir -p "$OUT" "$MUSIC_OUT"

# slug|source file|poster timestamp (seconds into the clip)
JOBS=(
  "mg-personal-best|Ziafam_PersonalBest_Reels_9x16.mp4|12"
  "mg-ctrl-z|ziafam-ctrlz-hyperframes.mp4|6"
  "mg-exploded-laptop|ziafam-stack-remotion.mp4|6"
  "mg-the-office|ziafam-the-office.mp4|10"
  "mg-ndpc|ziafam-ndpc-reaction.mp4|7"
  "puffy-demo|Woman_pressing_and_sitting_on_20261013193205.mp4|3"
  "puffy-ad|puffy_ad_v3.mp4|6"
)

encode() {
  local slug="$1" src="$2" ts="$3" dest="$4"
  echo "--- $slug"
  ffmpeg -nostdin -v error -y -i "$SRC/$src" \
    -vf "scale=540:-2:flags=lanczos" \
    -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p \
    -c:a aac -b:a 96k -ac 2 \
    -movflags +faststart \
    "$dest/$slug.mp4"

  ffmpeg -nostdin -v error -y -ss "$ts" -i "$SRC/$src" \
    -frames:v 1 -vf "scale=480:-2:flags=lanczos" -quality 82 \
    "$dest/$slug.webp"

  printf '    %-22s %6s KB mp4   %5s KB poster\n' "$slug" \
    "$(( $(stat -c%s "$dest/$slug.mp4") / 1024 ))" \
    "$(( $(stat -c%s "$dest/$slug.webp") / 1024 ))"
}

for job in "${JOBS[@]}"; do
  IFS='|' read -r slug src ts <<< "$job"
  encode "$slug" "$src" "$ts" "$OUT"
done

# The lyric video belongs with its track, not in the Studio grid.
encode "empty-glass-of-maybe" "empty-glass-tiktok.mp4" "14" "$MUSIC_OUT"

echo
echo "done."
