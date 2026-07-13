#!/usr/bin/env python3
"""
Recolour the Ajdam mark to the single accent blue.

    python3 scripts/recolor-logo.py path/to/original.jpg

Writes public/logo-blue.png, public/logo-mark.png and public/logo-mark-dark.png.

The original is a bicultural calligram on a saffron slab with two red strokes
through it. The slab becomes SLAB, the strokes become SCRIBE, and the
letterforms are left exactly as they are: the original glyph colour is #333333,
which is already the site's `ink` token. Nothing is recoloured that does not
need to be, and no colour in the output is absent from globals.css.

The source is a JPEG, so every edge is antialiased and every region bleeds a
little warmth into its neighbours. A hard mask leaves those blend pixels behind
as a yellow fringe. So after the main pass, any pixel still warmer than it is
cool gets reassigned to whichever of white / slab / scribe / ink it sits nearest
in luminance. That clears the fringe without hardening the edges.
"""
import sys

import numpy as np
from PIL import Image

SCRIBE = (0x1B, 0x4F, 0xC7)  # the stroke, and the site's accent
SLAB = (0xD1, 0xDC, 0xF4)    # the field: SCRIBE at 20% over white
INK = (0x33, 0x33, 0x33)     # unchanged from the original letterforms
PAPER = (0xF7, 0xF5, 0xF1)   # letterforms on the dark surface


def luminance(a):
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def main(src):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(2), a.min(2)
    sat = mx - mn

    is_white = (mx > 240) & (sat < 18)
    is_dark = mx < 110
    is_slab = (sat > 40) & (r > 150) & (g > 120) & (b < 170) & (r >= g)
    is_stroke = (sat > 60) & (r > 150) & (g < 130) & (b < 130)
    # The circle rule is a neutral grey. Defining it by elimination instead
    # would sweep up every antialiased fringe pixel and protect it from the
    # warm pass below, which is exactly the bug that left yellow in the file.
    is_rule = ~is_white & ~is_dark & ~is_slab & ~is_stroke & (sat < 14)

    out = np.full_like(a, 255)

    def paint(mask, colour):
        for i, c in enumerate(colour):
            out[..., i] = np.where(mask, c, out[..., i])

    paint(is_slab, SLAB)
    paint(is_stroke, SCRIBE)
    paint(is_dark, INK)
    for i in range(3):  # the thin circle rule keeps its original grey
        out[..., i] = np.where(is_rule, a[..., i], out[..., i])

    # Sweep the warm fringe left behind on antialiased edges.
    warm = (out[..., 0] > out[..., 2] + 12) & ~is_rule
    out_lum = luminance(out)
    targets = [(235, (255, 255, 255)), (150, SLAB), (90, SCRIBE), (0, INK)]
    for i in range(3):
        chan = out[..., i]
        for threshold, colour in targets:
            chan = np.where(warm & (out_lum >= threshold), colour[i], chan)
        out[..., i] = chan

    res = Image.fromarray(out.astype(np.uint8))
    res.save("public/logo-blue.png")

    def knockout(img):
        arr = np.asarray(img.convert("RGBA")).copy()
        arr[..., 3] = np.where(is_white, 0, 255)
        return Image.fromarray(arr)

    knockout(res).save("public/logo-mark.png")

    dark = np.asarray(res).copy()
    glyphs = dark.max(2) < 110
    for i, c in enumerate(PAPER):
        dark[..., i] = np.where(glyphs, c, dark[..., i])
    knockout(Image.fromarray(dark)).save("public/logo-mark-dark.png")

    print("wrote logo-blue.png, logo-mark.png, logo-mark-dark.png")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
