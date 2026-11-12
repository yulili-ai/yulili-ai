#!/usr/bin/env python3
"""Extract original Mitten poses as transparent, neutral-ink PNGs.

Usage: FFMPEG_BIN=/path/to/ffmpeg python extract-mitten.py mitten.mp4 output-dir
Requires Pillow. These hand-keyed masks belong to the supplied 1280x756 video,
not to arbitrary cat videos. No model, upload, or external service is used.
"""

import argparse
import os
from pathlib import Path
import subprocess
import tempfile

from PIL import Image, ImageChops, ImageDraw, ImageFilter


SIZE = (580, 610)
CROP = "crop=580:610:670:90"
RUN_FRAMES = 14

# Envelopes follow the original scanline character while excluding the large
# background shape above/right. White fur and the video backdrop are cleared
# by a continuous luminance matte, rather than a hard threshold.
HEAD = [
    (5,143),(25,137),(112,176),(177,168),(202,126),(235,120),
    (255,202),(274,257),(293,313),(310,340),(350,355),(405,370),
    (425,410),(415,450),(397,479),(399,518),(403,551),(387,579),
    (345,591),(310,589),(281,592),(230,596),(196,600),(165,599),
    (143,592),(118,593),(83,586),(75,575),(84,553),(105,546),
    (117,519),(121,488),(112,453),(92,428),(77,407),(54,393),
    (42,379),(38,351),(49,315),(49,282),(25,262),(5,258),
]
TAIL_KEYS = {
    0: [(351,377),(351,338),(363,295),(337,280),(324,252),(320,215),
        (321,185),(332,160),(351,140),(380,134),(410,148),(439,180),
        (462,214),(479,251),(488,286),(487,327),(478,362),(458,398),
        (433,424),(397,446),(361,441)],
    6: [(351,354),(350,321),(365,281),(343,258),(325,229),(319,190),
        (329,160),(345,139),(364,115),(392,107),(424,115),(451,139),
        (476,173),(491,210),(499,245),(497,285),(481,324),(458,356),
        (429,380),(394,402),(363,401)],
    10: [(348,360),(349,330),(364,299),(378,274),(377,241),(382,209),
         (378,175),(383,150),(396,127),(421,114),(451,115),(477,128),
         (493,153),(497,188),(495,225),(484,260),(477,295),(464,329),
         (445,358),(414,387),(380,408)],
    13: [(347,378),(348,341),(369,304),(372,274),(376,239),(388,211),
         (402,184),(424,166),(448,154),(478,155),(501,170),(508,198),
         (504,231),(492,261),(485,295),(479,333),(466,366),(445,400),
         (420,424),(389,445),(354,437)],
}
IDLE_TAIL = [
    (345,374),(342,335),(341,298),(349,262),(357,228),(365,196),
    (387,169),(413,145),(438,135),(470,144),(491,165),(501,197),
    (498,226),(483,257),(469,287),(465,321),(451,355),(431,381),
    (405,406),(372,418),(350,405),
]
TAP_HEAD = [
    (70,112),(96,110),(132,137),(175,169),(178,195),(221,197),
    (250,190),(291,188),(330,182),(346,198),(351,233),(326,289),
    (312,323),(341,342),(385,355),(385,430),(380,495),(365,557),
    (364,580),(321,584),(302,579),(264,586),(239,583),(227,595),
    (195,598),(167,592),(162,581),(169,562),(194,550),(184,525),
    (176,494),(145,480),(128,481),(124,513),(112,531),(91,535),
    (69,524),(66,506),(79,491),(84,457),(82,429),(95,420),
    (119,424),(140,419),(148,383),(141,369),(114,360),(103,353),
    (97,333),(88,309),(84,276),(81,250),(79,215),(71,189),
]
TAP_TAIL = [
    (341,351),(328,322),(330,287),(343,248),(350,211),(372,184),
    (399,165),(426,151),(459,151),(487,164),(505,190),(511,220),
    (502,254),(486,279),(460,298),(434,322),(415,349),(392,367),
    (362,381),
]
HEAD_OFFSETS = [0,0,-4,-6,-28,-30,-30,-27,-23,-18,-8,-5,0,0]
FOOT_BOTTOMS = [596,596,578,574,535,535,535,535,540,543,583,589,596,596]


def tail_at(frame):
    """Interpolate the matte envelope, never the original pose pixels."""
    a, b = next((a, b) for a, b in [(0,6), (6,10), (10,13)]
                if a <= frame <= b)
    u = (frame - a) / (b - a)
    return [(p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u)
            for p, q in zip(TAIL_KEYS[a], TAIL_KEYS[b])]


def save_pose(source, target, polygons, foot_bottom):
    width, height = SIZE
    mask = Image.new("L", (width * 2, height * 2))
    draw = ImageDraw.Draw(mask)
    for polygon in polygons:
        draw.polygon([(round(x * 2), round(y * 2)) for x, y in polygon],
                     fill=255)
    mask = mask.resize(SIZE, Image.Resampling.LANCZOS)
    mask = mask.filter(ImageFilter.GaussianBlur(0.45))
    # Keep the paws, excluding the detached shadow below airborne poses.
    ImageDraw.Draw(mask).rectangle((0, foot_bottom, width, height), fill=0)
    with Image.open(source) as image:
        luminance = image.convert("L")
    alpha = luminance.point(
        lambda value: max(0, min(255, round((234 - value) * 255 / 214))))
    alpha = ImageChops.multiply(alpha, mask)
    result = Image.new("RGBA", SIZE, (20, 20, 19, 0))
    result.putalpha(alpha)
    result.save(target)


def extract(video, destination):
    ffmpeg = os.environ.get("FFMPEG_BIN", "ffmpeg")
    destination.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="mitten-extract-") as directory:
        temporary = Path(directory)

        def frames(start, count, output):
            subprocess.run([
                ffmpeg, "-hide_banner", "-loglevel", "error",
                "-ss", str(start), "-i", str(video),
                "-vf", CROP + ",fps=30", "-frames:v", str(count),
                "-y", str(output),
            ], check=True)

        frames(4.3, RUN_FRAMES, temporary / "run-%02d.png")
        frames(1.5, 1, temporary / "idle.png")
        frames(6.0, 1, temporary / "tap.png")
        for frame in range(RUN_FRAMES):
            offset = HEAD_OFFSETS[frame]
            head = [(x, y + offset if y < 470 else y) for x, y in HEAD]
            bottom = FOOT_BOTTOMS[frame]
            foreleg = [(40,410), (175,410), (175,bottom), (40,bottom)]
            save_pose(temporary / f"run-{frame + 1:02}.png",
                      destination / f"run-{frame:02}.png",
                      [head, tail_at(frame), foreleg], bottom)
        idle_head = [(x, y - 15 if y < 470 else y) for x, y in HEAD]
        save_pose(temporary / "idle.png", destination / "idle-1.500.png",
                  [idle_head, IDLE_TAIL], 596)
        save_pose(temporary / "tap.png", destination / "tap-6.000.png",
                  [TAP_HEAD, TAP_TAIL], 600)
    print(f"Extracted 14 run poses, idle and tap into {destination}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("video", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    if not args.video.is_file():
        parser.error(f"Video does not exist: {args.video}")
    extract(args.video.resolve(), args.destination.resolve())
