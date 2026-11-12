# Profile assets

`build-hero.cjs` renders the title, scrolling capability commands and supplied Mitten video as a single 9.6-second looping GIF. It also creates a static reduced-motion poster and editable SVG layout.

Requirements: Node.js, `sharp`, FFmpeg. Run from this repository:

```sh
node scripts/build-hero.cjs /path/to/mitten.mp4
```

Set `FFMPEG_BIN` if FFmpeg is not on PATH. The original video stays local; the public repository contains only the composed assets. The renderer uses a fixed crop from the supplied 1280 × 756 video. Revisit the crop if the source changes.

The command lines are a visual introduction to areas of practice, not software installation logs or benchmark results. Project thumbnails are native SVG interaction studies, not photographs of completed devices.
