"""Dev only: puts a livery's renders next to a reference photo, for scoring (needs Pillow: pip install pillow).

Usage: python tools/compare.py <out.jpg> <photo> <render> [<render> ...]

The photo goes on the left at the same height as the renders stacked on the right. Reference photos stay under
reference/ (never shipped); the comparison sheets go under docs/livery-detail/.
"""
import sys

from PIL import Image

H = 360


def fit(path, h):
    im = Image.open(path).convert('RGB')
    return im.resize((int(im.width * h / im.height), h), Image.LANCZOS)


def main():
    out, photo, renders = sys.argv[1], sys.argv[2], sys.argv[3:]
    tiles = [fit(r, H) for r in renders]
    right_w = max(t.width for t in tiles)
    ph = fit(photo, H * len(tiles))
    if ph.width > right_w * 1.4:
        ph = ph.resize((int(right_w * 1.4), int(ph.height * right_w * 1.4 / ph.width)), Image.LANCZOS)
    sheet = Image.new('RGB', (ph.width + right_w + 8, max(ph.height, H * len(tiles))), (14, 14, 16))
    sheet.paste(ph, (0, 0))
    for i, t in enumerate(tiles):
        sheet.paste(t, (ph.width + 8, i * H))
    sheet.save(out, quality=86)
    print(out, sheet.size)


if __name__ == '__main__':
    main()
