# Profile assets

`build-hero.cjs` renders the title, scrolling capability commands and the original Mitten character as a 14-second looping GIF at 25 fps. The cat runs toward the terminal, taps its cursor, then turns and runs home. It also creates a static reduced-motion poster and a self-contained SVG layout.

Requirements: Node.js, `sharp`, Python 3 with Pillow, and FFmpeg. Run from this repository:

```sh
node scripts/build-hero.cjs /path/to/mitten.mp4
```

Set `FFMPEG_BIN` or `PYTHON_BIN` if those executables are not on PATH, and `NODE_PATH` if using an existing external `sharp` installation. The original video stays local; the public repository contains only the composed assets and reproducible scripts.

The renderer calls `extract-mitten.py` to extract 14 consecutive hopping poses plus idle and paw-lift poses from the supplied 1280 × 756 video. Hand-keyed masks remove the surrounding screen content, and a luminance matte preserves the original scanline drawing. These masks and timestamps are specific to this source; revisit them if the source changes. All processing is local.

Running uses the original hopping poses in alternating forward/reverse order, so the tail follows a continuous path between strides. Position uses an integrated velocity curve for gentle starts and stops. A single silhouette turns without crossfade ghosting. The cat returns to its opening pose and the terminal quietly resets before the loop boundary. The GIF uses a fixed 40 ms frame duration and a shared palette; the terminal renders at most three rows, in 18 px type with 32 px line spacing.

For iteration, `MITTEN_SPRITES` can point to an already extracted sprite directory. Set `KEEP_HERO_FRAMES=1` to retain rendered PNG frames for visual checks.

The command lines are a visual introduction to areas of practice, not software installation logs or benchmark results. Project thumbnails are native SVG interaction studies, not photographs of completed devices.
