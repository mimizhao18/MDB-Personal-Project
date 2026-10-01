"""Trace a circuit's centerline from the official F1 track graphic into a TypeScript shape file.

Usage (from the project root):
    python tools/trace_track.py silverstone
    python tools/trace_track.py monaco --debug-dir some/folder    # also writes mask/overlay/preview images
    python tools/trace_track.py spa --out some/other/file.ts      # write somewhere else

Needs: pip install -r tools/requirements.txt
Input:  reference/<track>.webp  (the "detailed" track image from formula1.com; kept out of git, it is F1 artwork)
Output: src/data/tracks/<track>Shape.ts

The method (the same for every track, so all shapes are consistent):
 1. Put the image on white and build a mask. Default ("outline"): every non-white pixel except the light-green
    overlay labels, then a morphological opening removes thin things (turn-number rings, leader lines, text),
    then leftover label boxes listed in the config ("drop_near") are dropped. Mode "line": only the thin colored
    centerline (pink, yellow, blue), for tracks where the road outlines fuse together (Monaco, Spa).
 2. (Silverstone uses the outline mode; the line mode is the same pipeline on a cleaner mask.)
 3. See "drop_near" in CONFIGS for stray labels that survive the mask.
 4. Skeletonize to a 1 px centerline, prune short spurs, and take the longest path of each piece.
 5. Chain the pieces into one closed loop, bridging the gaps left by sector labels and overlay dots.
 6. Fit a periodic smoothing spline, start at the start/finish line, and orient it in race direction.
 7. Resample to 360 points evenly spaced by distance, smooth lightly (2 passes), and normalize into a
    1000-unit-wide box with 40 units of padding.
"""

import argparse
import os
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageDraw
from scipy.interpolate import splev, splprep
from scipy.ndimage import gaussian_filter1d
from skimage import measure, morphology

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

N_POINTS = 360
MIN_PIECE_PIXELS = 8
BOX_WIDTH = 920.0
PADDING = 40.0

# Pixel coordinates are (x, y) in the downloaded image.
CONFIGS = {
    "silverstone": {
        "const": "SILVERSTONE",
        "title": "Silverstone",
        "start_finish": (405, 72),  # the chequered flag
        "toward": (650, 230),  # turn 1: the car heads this way after the line
        "drop_near": [(278, 340, 60, 25)],  # the "speed trap" label bar: (x, y, half-width, half-height)
        "road_width": 26,
    },
    "monaco": {
        "const": "MONACO",
        "title": "Monaco",
        "start_finish": (193, 266),
        "toward": (373, 120),  # turn 1
        "drop_near": [],
        "mask": "line",
        "road_width": 14,  # Monaco's strands run only ~25 units apart, so a standard 26-wide road would merge them
    },
    "spa": {
        "const": "SPA",
        "title": "Spa-Francorchamps",
        "start_finish": (330, 526),
        "toward": (170, 640),  # turn 1 (La Source)
        "drop_near": [],
        "mask": "line",
        "road_width": 26,
    },
}


def load_on_white(path):
    raw = Image.open(path).convert("RGBA")
    im = Image.new("RGB", raw.size, (255, 255, 255))
    im.paste(raw, mask=raw.split()[3])
    return im


def neighbors(y, x):
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy or dx:
                yield y + dy, x + dx


def bfs(pix, src):
    par = {src: None}
    dq = deque([src])
    last = src
    while dq:
        cur = dq.popleft()
        last = cur
        for n in neighbors(*cur):
            if n in pix and n not in par:
                par[n] = cur
                dq.append(n)
    return last, par


def extract_line_mask(a):
    """The thin colored centerline (pink, yellow, blue sector colors). Stays separate even where road outlines fuse."""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    pink = (r > 150) & (g < 90) & (b > 80) & (b < 170)
    yellow = (r > 200) & (g > 150) & (g < 236) & (b < 75)
    blue = (r < 130) & (g > 110) & (g < 195) & (b > 165)
    return morphology.opening(pink | yellow | blue, morphology.disk(1))


def extract_mask(im, cfg):
    a = np.asarray(im).astype(int)
    if cfg.get("mask") == "line":
        return extract_line_mask(a)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    nonwhite = a.min(axis=2) < 215
    green = (g > r + 40) & (g > b - 10) & (r < 170)
    mask = morphology.opening(nonwhite & ~green, morphology.disk(9))
    lab = measure.label(mask, connectivity=2)
    for p in measure.regionprops(lab):
        cy, cx = p.centroid
        for (x, y, hw, hh) in cfg["drop_near"]:
            if abs(cx - x) < hw and abs(cy - y) < hh:
                print(f"drop component {p.label} ({int(p.area)} px) at x={cx:.0f}, y={cy:.0f}")
                mask[lab == p.label] = False
    return mask


def skeleton_chains(mask):
    skel = morphology.skeletonize(mask)
    for _ in range(4):  # prune spurs
        rm = [(y, x) for y, x in np.argwhere(skel) if sum(skel[yy, xx] for yy, xx in neighbors(y, x)) <= 1]
        for y, x in rm:
            skel[y, x] = False
    lab = measure.label(skel, connectivity=2)
    chains = []
    for p in measure.regionprops(lab):
        if p.area < MIN_PIECE_PIXELS:
            continue
        pix = {tuple(int(v) for v in c) for c in p.coords}
        a0, _ = bfs(pix, next(iter(pix)))
        b0, par = bfs(pix, a0)
        chain, cur = [], b0
        while cur is not None:
            chain.append(cur)
            cur = par[cur]
        print(f"piece {p.label}: {int(p.area)} px, longest path {len(chain)}")
        chains.append(np.array([(x, y) for y, x in chain], float))
    return chains


def chain_into_loop(chains):
    used = [False] * len(chains)
    loop = chains[0]
    used[0] = True
    while not all(used):
        tail = loop[-1]
        best = None
        for i, c in enumerate(chains):
            if used[i]:
                continue
            for rev in (False, True):
                start = c[-1] if rev else c[0]
                d = float(np.hypot(*(start - tail)))
                if best is None or d < best[0]:
                    best = (d, i, rev)
        d, i, rev = best
        print(f"bridge gap {d:.1f} px to piece {i}{' (reversed)' if rev else ''}")
        loop = np.vstack([loop, chains[i][::-1] if rev else chains[i]])
        used[i] = True
    print(f"closing gap {float(np.hypot(*(loop[0] - loop[-1]))):.1f} px")
    return loop


def fit_curve(loop, cfg):
    loop = loop[::4]
    loop = np.vstack([loop, loop[:1]])
    tck, _ = splprep([loop[:, 0], loop[:, 1]], s=len(loop) * 1.5, per=True)
    x, y = splev(np.linspace(0, 1, 4000, endpoint=False), tck)
    curve = np.column_stack([x, y])
    sf = np.array(cfg["start_finish"], float)
    curve = np.roll(curve, -int(np.argmin(np.hypot(*(curve - sf).T))), axis=0)
    toward = np.array(cfg["toward"], float)
    if np.hypot(*(curve[60] - toward)) > np.hypot(*(curve[-60] - toward)):  # wrong way round
        curve = np.vstack([curve[:1], curve[1:][::-1]])
    return curve


def resample_even(pts, n):
    closed = np.vstack([pts, pts[:1]])
    cum = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(closed, axis=0).T))])
    t = np.linspace(0, cum[-1], n, endpoint=False)
    return np.column_stack([np.interp(t, cum, closed[:, 0]), np.interp(t, cum, closed[:, 1])])


def normalize(curve):
    pts = resample_even(curve, N_POINTS)
    for _ in range(2):  # light circular smoothing to remove tracing wobble
        pts = np.column_stack([gaussian_filter1d(pts[:, k], sigma=2.0, mode="wrap") for k in (0, 1)])
        pts = resample_even(pts, N_POINTS)
    mn, mx = pts.min(axis=0), pts.max(axis=0)
    scale = BOX_WIDTH / (mx[0] - mn[0])
    pts = (pts - mn) * scale + PADDING
    return pts, 2 * PADDING + BOX_WIDTH, float((mx[1] - mn[1]) * scale + 2 * PADDING)


def write_ts(pts, width, height, cfg, out_path):
    c = cfg["const"]
    d = pts[1] - pts[-1]
    d /= np.hypot(*d)
    nrm = np.array([-d[1], d[0]]) * (cfg["road_width"] * 22 / 26)  # start line spans the road
    a, b = pts[0] - nrm, pts[0] + nrm
    r = lambda v: f"{v:.1f}"
    path = "M" + " L".join(f"{r(p[0])} {r(p[1])}" for p in pts) + " Z"
    out = f"""// Traced from the official F1 {cfg['title']} circuit graphic (centerline only, no labels), lightly smoothed.
// Generated by tools/trace_track.py. Coordinates are in a {int(width)} x {int(height)} box. Points are evenly spaced by distance along the lap,
// starting at the start/finish line and running in race direction, so point i is i/{N_POINTS} of a lap.

export const {c}_VIEWBOX = {{ width: {int(width)}, height: {int(height)} }};

/** Width of the drawn road in box units. Narrow where strands of the track run close together. */
export const {c}_ROAD_WIDTH = {cfg['road_width']};

export const {c}_START_FINISH = {{
  from: {{ x: {r(a[0])}, y: {r(a[1])} }},
  to: {{ x: {r(b[0])}, y: {r(b[1])} }},
}};

export const {c}_PATH =
  '{path}';

export const {c}_POINTS: readonly (readonly [number, number])[] = [
"""
    for i in range(0, N_POINTS, 6):
        out += "  " + " ".join(f"[{r(p[0])}, {r(p[1])}]," for p in pts[i : i + 6]) + "\n"
    out += "];\n"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf8", newline="\n") as f:
        f.write(out)
    return a, b


def write_debug(im, mask, curve, pts, width, height, a, b, folder):
    os.makedirs(folder, exist_ok=True)
    Image.fromarray((mask * 255).astype(np.uint8)).save(os.path.join(folder, "mask.png"))
    ov = im.copy()
    d = ImageDraw.Draw(ov)
    d.line([tuple(p) for p in curve] + [tuple(curve[0])], fill=(255, 0, 255), width=3)
    d.ellipse([curve[0][0] - 8, curve[0][1] - 8, curve[0][0] + 8, curve[0][1] + 8], outline=(0, 160, 0), width=3)
    k = len(curve) // 4  # a blue ring a quarter lap along shows the direction of travel
    d.ellipse([curve[k][0] - 6, curve[k][1] - 6, curve[k][0] + 6, curve[k][1] + 6], outline=(0, 0, 255), width=3)
    ov.save(os.path.join(folder, "overlay.png"))
    pv = Image.new("RGB", (int(width), int(height)), (17, 17, 17))
    dr = ImageDraw.Draw(pv)
    dr.line([tuple(p) for p in pts] + [tuple(pts[0])], fill=(230, 230, 230), width=14, joint="curve")
    dr.line([tuple(a), tuple(b)], fill=(255, 255, 255), width=6)
    pv.save(os.path.join(folder, "preview.png"))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("track", choices=sorted(CONFIGS))
    ap.add_argument("--out", help="output .ts path (default: src/data/tracks/<track>Shape.ts)")
    ap.add_argument("--debug-dir", help="also write mask.png, overlay.png and preview.png here")
    args = ap.parse_args()

    cfg = CONFIGS[args.track]
    image_path = os.path.join(ROOT, "reference", f"{args.track}.webp")
    if not os.path.exists(image_path):
        sys.exit(f"Missing {image_path}. Download the track graphic from formula1.com first.")
    out_path = args.out or os.path.join(ROOT, "src", "data", "tracks", f"{args.track}Shape.ts")

    im = load_on_white(image_path)
    mask = extract_mask(im, cfg)
    curve = fit_curve(chain_into_loop(skeleton_chains(mask)), cfg)
    pts, width, height = normalize(curve)
    a, b = write_ts(pts, width, height, cfg, out_path)
    if args.debug_dir:
        write_debug(im, mask, curve, pts, width, height, a, b, args.debug_dir)
    print(f"wrote {out_path} ({int(width)} x {int(height)})")


if __name__ == "__main__":
    main()
