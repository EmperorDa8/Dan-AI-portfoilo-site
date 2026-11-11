#!/usr/bin/env bash
# Build the hero showreel: a silent 16:9 "wall" cut from finished work.
#
# The work comes in three shapes, and stretching any of it to 16:9 would crop
# most of the frame away. So each beat fills 1280x720 with whole panels:
#   landscape  -> one panel, full frame
#   9:16       -> three panels side by side (3 x 424 + 2 gaps of 4 = 1280)
#   4:5        -> two panels side by side   (2 x 638 + 1 gap of 4  = 1280)
#
# Only finished pieces go in: the painting loops, client work for Ziafam, the
# music videos and cinematic shots. No spec ads carrying someone else's brand.
#
# Usage: bash scripts/build_showreel.sh
set -euo pipefail

REPO="/c/Users/Dan/Documents/moc/Dan-AI-portfoilo-site"
ST="$REPO/public/studio"
MU="$REPO/public/music"
AM="$REPO/public/ambient"
DA="/c/Users/Dan/flow-mcp-out/Ziafam-Dither-Ads"
OUT="$REPO/public/reel"
mkdir -p "$OUT"

D=2.6   # seconds per beat

# index: start offset, file
ffmpeg -nostdin -v error -y \
  -ss 1  -t $D -i "$AM/library.mp4" \
  -ss 0  -t $D -i "$AM/coder.mp4" \
  -ss 4  -t $D -i "$MU/go-well-video.mp4" \
  -ss 7  -t $D -i "$ST/mg-ctrl-z.mp4" \
  -ss 3  -t $D -i "$DA/02-launch.mp4" \
  -ss 5  -t $D -i "$DA/03-noise-to-signal.mp4" \
  -ss 1  -t $D -i "$ST/king.mp4" \
  -ss 22 -t $D -i "$MU/one-more-day-video.mp4" \
  -ss 10 -t $D -i "$ST/mg-personal-best.mp4" \
  -ss 8  -t $D -i "$ST/mg-the-office.mp4" \
  -ss 2.6 -t $D -i "$DA/01-the-stack.mp4" \
  -ss 9  -t $D -i "$DA/04-uptime.mp4" \
  -ss 1  -t $D -i "$AM/schoolroom.mp4" \
  -ss 4  -t $D -i "$ST/mg-exploded-laptop.mp4" \
  -ss 5  -t $D -i "$ST/mg-ndpc.mp4" \
  -ss 1  -t $D -i "$ST/camille.mp4" \
  -filter_complex "
    [0:v]scale=1280:720:force_original_aspect_ratio=increase:flags=lanczos,crop=1280:720,fps=24,setsar=1[b1];

    [1:v]scale=424:720:force_original_aspect_ratio=increase,crop=424:720,fps=24,setsar=1,pad=428:720:0:0:black[p1];
    [2:v]scale=424:720:force_original_aspect_ratio=increase,crop=424:720,fps=24,setsar=1,pad=428:720:0:0:black[p2];
    [3:v]scale=424:720:force_original_aspect_ratio=increase,crop=424:720,fps=24,setsar=1[p3];
    [p1][p2][p3]hstack=inputs=3[b2];

    [4:v]scale=638:720:force_original_aspect_ratio=increase,crop=638:720,fps=24,setsar=1,pad=642:720:0:0:black[q1];
    [5:v]scale=638:720:force_original_aspect_ratio=increase,crop=638:720,fps=24,setsar=1[q2];
    [q1][q2]hstack=inputs=2[b3];

    [6:v]scale=1280:720:force_original_aspect_ratio=increase:flags=lanczos,crop=1280:720,fps=24,setsar=1[b4];

    [7:v]scale=424:720:force_original_aspect_ratio=increase,crop=424:720,fps=24,setsar=1,pad=428:720:0:0:black[r1];
    [8:v]scale=424:720:force_original_aspect_ratio=increase,crop=424:720,fps=24,setsar=1,pad=428:720:0:0:black[r2];
    [9:v]scale=424:720:force_original_aspect_ratio=increase,crop=424:720,fps=24,setsar=1[r3];
    [r1][r2][r3]hstack=inputs=3[b5];

    [10:v]scale=638:720:force_original_aspect_ratio=increase,crop=638:720,fps=24,setsar=1,pad=642:720:0:0:black[s1];
    [11:v]scale=638:720:force_original_aspect_ratio=increase,crop=638:720,fps=24,setsar=1[s2];
    [s1][s2]hstack=inputs=2[b6];

    [12:v]scale=1280:720:force_original_aspect_ratio=increase:flags=lanczos,crop=1280:720,fps=24,setsar=1[b7];

    [13:v]scale=424:720:force_original_aspect_ratio=increase,crop=424:720,fps=24,setsar=1,pad=428:720:0:0:black[t1];
    [14:v]scale=424:720:force_original_aspect_ratio=increase,crop=424:720,fps=24,setsar=1,pad=428:720:0:0:black[t2];
    [15:v]scale=424:720:force_original_aspect_ratio=increase,crop=424:720,fps=24,setsar=1[t3];
    [t1][t2][t3]hstack=inputs=3[b8];

    [b1][b2][b3][b4][b5][b6][b7][b8]concat=n=8:v=1:a=0[out]
  " \
  -map "[out]" -an -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart \
  "$OUT/showreel.mp4"

# Poster: the first three-up beat reads as "a body of work" at a glance.
ffmpeg -nostdin -v error -y -ss 3.4 -i "$OUT/showreel.mp4" -frames:v 1 -quality 82 "$OUT/showreel.webp"

ffprobe -v error -select_streams v:0 -show_entries stream=width,height -show_entries format=duration,size -of csv=p=0 "$OUT/showreel.mp4"
