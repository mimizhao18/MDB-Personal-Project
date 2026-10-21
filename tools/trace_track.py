"""Trace a circuit's centerline from the official F1 track graphic into a TypeScript shape file.

Usage (from the project root):
    python tools/trace_track.py silverstone
    python tools/trace_track.py monaco --debug-dir some/folder    # also writes mask/overlay/preview images
    python tools/trace_track.py spa --out some/other/file.ts      # write somewhere else

Needs: pip install -r tools/requirements.txt
Input:  reference/<track>.webp  (the "detailed" track image from formula1.com; kept out of git, it is F1 artwork)
Output: src/data/tracks/<track>Shape.ts  (the "file" name in the config, when there is one)

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

# The rest of the 2026 calendar, traced the same way. "hsv" picks the thin colored centerline by hue (pink / yellow / blue),
# "hsv_red" the newer graphics (red / yellow / blue), "grey" the plain grey line of Bahrain's graphic.
# The chequered flag is the start/finish pixel (on the newer graphics it sits beside the road, so the point is on the line
# next to it), and "toward" is turn 1, which the arrow beside the flag points to.
def line(const, title, start_finish, toward, road_width=26, file=None, mask="hsv", drop_near=(), **options):
    cfg = {
        "directional": True,
        **options,
        "const": const,
        "title": title,
        "start_finish": start_finish,
        "toward": toward,
        "drop_near": list(drop_near),
        "mask": mask,
        "road_width": road_width,
    }
    if file:
        cfg["file"] = file
    return cfg


CONFIGS.update(
    {
        "australia": line("AUSTRALIA", "Albert Park", (716, 619), (480, 650)),
        "china": line("CHINA", "Shanghai", (473, 441), (655, 33)),
        "japan": line("JAPAN", "Suzuka", (918, 275), (1177, 568), split_junctions=True, order=[7, 6, -2, 1, 9, -8, 5, -3, -4]),  # the track crosses itself on a bridge
        "bahrain": line("BAHRAIN", "Bahrain", (763, 655), (127, 664), mask="dark", close=4, open=6, min_piece=40, erase=[(1096, 645, 1200, 695)], drop_near=[(1142, 664, 50, 22), (989, 594, 55, 22), (323, 598, 20, 10)]),
        "miami": line("MIAMI", "Miami", (471, 234), (808, 330), road_width=16),
        "canada": line("CANADA", "Montreal", (1017, 398), (1134, 510), road_width=22),
        "barcelona": line("BARCELONA", "Barcelona-Catalunya", (944, 387), (288, 671)),
        "austria": line("AUSTRIA", "Red Bull Ring", (934, 508), (601, 681)),
        "hungary": line("HUNGARY", "Hungaroring", (360, 487), (364, 22)),
        "netherlands": line("NETHERLANDS", "Zandvoort", (361, 283), (484, 67)),
        "italy": line("ITALY", "Monza", (958, 646), (469, 670)),
        "madrid": line("MADRID", "Madring", (248, 553), (182, 358)),
        "azerbaijan": line("AZERBAIJAN", "Baku", (969, 586), (1092, 685), road_width=12),
        "singapore": line("SINGAPORE", "Marina Bay", (1106, 367), (1083, 61), split_junctions=True),  # crosses itself too
        "united-states": line("UNITED_STATES", "Austin", (133, 382), (432, 661), file="unitedStates"),
        "mexico": line("MEXICO", "Mexico City", (244, 50), (1080, 52), mask="hsv_red"),
        "brazil": line("BRAZIL", "Interlagos", (386, 100), (105, 210), mask="hsv_red", min_piece=100),
        "las-vegas": line("LAS_VEGAS", "Las Vegas", (1152, 152), (1054, 30), file="lasVegas", mask="hsv_red"),
        "qatar": line("QATAR", "Lusail", (684, 683), (232, 650), mask="hsv_red"),
        "abu-dhabi": line("ABU_DHABI", "Yas Marina", (562, 270), (550, 576), file="abuDhabi", mask="hsv_red"),
    }
)


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


def extract_line_mask(a, red=False):
    """The thin colored centerline (pink, yellow, blue sector colors). Stays separate even where road outlines fuse.

    The newer graphics (Mexico, Brazil, Las Vegas, Qatar, Abu Dhabi) color sector 1 pure red instead of pink; pass red=True
    for those. The older style also has red dashes (the straight mode zones), so red is only taken when asked for.
    """
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    pink = (r > 150) & (g < 90) & (b > 80) & (b < 170)
    if red:
        pink = pink | ((r > 170) & (g < 70) & (b < 80))
    yellow = (r > 200) & (g > 150) & (g < 236) & (b < 75)
    blue = (r < 130) & (g > 110) & (g < 195) & (b > 165)
    return morphology.opening(pink | yellow | blue, morphology.disk(1))


def extract_hue_mask(a, red):
    """The colored centerline picked by hue, so the darker anti-aliased pixels at its edge count too.

    Pink (red too when `red`), yellow and blue. Not the magenta or yellow-green speed trap dots, not the green labels, and (unless
    `red`) not the red dashes of the straight mode zones.
    """
    from skimage.color import rgb2hsv

    hsv = rgb2hsv(a.astype(np.uint8))
    h, sat, val = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    colored = (sat > 0.55) & (val > 0.28)
    pink = (h > 0.88) & (h < 0.97)
    red_hue = (h >= 0.97) | (h < 0.03)
    yellow = (h > 0.10) & (h < 0.17)
    blue = (h > 0.52) & (h < 0.63)
    return colored & (pink | yellow | blue | (red_hue if red else False))


def extract_grey_mask(a):
    """The grey and white centerline of the graphics that have no sector colors (Bahrain).

    Bright, colorless pixels, minus the white page around the track, minus the thick white things (label boxes, the number
    circles). What is left is the thin line in the road.
    """
    mx, mn = a.max(axis=2), a.min(axis=2)
    bright = (mx > 90) & (mx - mn < 40)
    white = mn > 244
    lab = measure.label(white, connectivity=1)
    page = np.zeros_like(white)
    for r in measure.regionprops(lab):
        if r.area > 3000:  # the page inside and outside the track
            page[lab == r.label] = True
    thick = morphology.opening(bright, morphology.disk(2))
    line = bright & ~morphology.dilation(page, morphology.disk(3)) & ~morphology.dilation(thick, morphology.disk(3))
    return morphology.opening(line, morphology.disk(1))


def extract_mask(im, cfg):
    a = np.asarray(im).astype(int)
    if cfg.get("mask") in ("hsv", "hsv_red"):
        mask = extract_hue_mask(a, red=cfg["mask"] == "hsv_red")
        return morphology.closing(mask, morphology.disk(cfg.get("close", 2)))
    if cfg.get("mask") == "grey":
        return morphology.closing(extract_grey_mask(a), morphology.disk(cfg.get("close", 2)))
    if cfg.get("mask") in ("line", "line_red"):
        return extract_line_mask(a, red=cfg["mask"] == "line_red")
    if cfg.get("mask") == "dark":
        # the black road, with the light line down its middle filled in (Bahrain)
        dark = a.max(axis=2) < 110
        for x0, y0, x1, y1 in cfg.get("erase", []):  # a label box that touches the road
            dark[y0:y1, x0:x1] = False
        road = morphology.closing(dark, morphology.disk(cfg.get("close", 3)))
        return drop_components(morphology.opening(road, morphology.disk(cfg.get("open", 9))), cfg)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    nonwhite = a.min(axis=2) < 215
    green = (g > r + 40) & (g > b - 10) & (r < 170)
    return drop_components(morphology.opening(nonwhite & ~green, morphology.disk(9)), cfg)


def drop_components(mask, cfg):
    """Remove the label boxes: every piece of the mask whose center is inside one of the `drop_near` boxes (x, y, half width, half height)."""
    lab = measure.label(mask, connectivity=2)
    for p in measure.regionprops(lab):
        cy, cx = p.centroid
        for (x, y, hw, hh) in cfg["drop_near"]:
            if abs(cx - x) < hw and abs(cy - y) < hh:
                print(f"drop component {p.label} ({int(p.area)} px) at x={cx:.0f}, y={cy:.0f}")
                mask[lab == p.label] = False
    return mask


def skeleton_chains(mask, cfg=None):
    cfg = cfg or {}
    labels = []
    skel = morphology.skeletonize(mask)
    for _ in range(4):  # prune spurs
        rm = [(y, x) for y, x in np.argwhere(skel) if sum(skel[yy, xx] for yy, xx in neighbors(y, x)) <= 1]
        for y, x in rm:
            skel[y, x] = False
    if cfg.get("split_junctions"):
        # where the track crosses itself the skeleton has a junction; take it out so each arm is its own piece
        junction = np.zeros_like(skel)
        for y, x in np.argwhere(skel):
            if sum(skel[yy, xx] for yy, xx in neighbors(y, x)) >= 3:
                junction[y, x] = True
        skel = skel & ~morphology.dilation(junction, morphology.disk(2))
    lab = measure.label(skel, connectivity=2)
    chains = []
    for p in measure.regionprops(lab):
        if p.area < cfg.get("min_piece", MIN_PIECE_PIXELS):
            continue
        pix = {tuple(int(v) for v in c) for c in p.coords}
        a0, _ = bfs(pix, next(iter(pix)))
        b0, par = bfs(pix, a0)
        chain, cur = [], b0
        while cur is not None:
            chain.append(cur)
            cur = par[cur]
        print(f"piece {p.label}: {int(p.area)} px, longest path {len(chain)}, from ({chain[0][1]}, {chain[0][0]}) to ({chain[-1][1]}, {chain[-1][0]})")
        chains.append(np.array([(x, y) for y, x in chain], float))
        labels.append(p.label)
    return chains, labels


def unit(v):
    n = float(np.hypot(*v))
    return v / n if n > 1e-9 else v


def chain_in_order(chains, labels, order):
    """Join the pieces in a given order: `order` lists piece numbers, negative for a piece that is walked backwards."""
    loop = []
    for k in order:
        c = chains[labels.index(abs(k))]
        c = c[::-1] if k < 0 else c
        if loop:
            print(f"bridge gap {float(np.hypot(*(c[0] - loop[-1][-1]))):.1f} px to piece {abs(k)}{' (reversed)' if k < 0 else ''}")
        loop.append(c)
    loop = np.vstack(loop)
    print(f"closing gap {float(np.hypot(*(loop[0] - loop[-1]))):.1f} px")
    return loop


def chain_into_loop(chains, directional=False):
    used = [False] * len(chains)
    loop = chains[0]
    used[0] = True
    while not all(used):
        tail = loop[-1]
        tail_dir = unit(tail - loop[max(0, len(loop) - 14)])
        best = None
        for i, c in enumerate(chains):
            if used[i]:
                continue
            for rev in (False, True):
                start = c[-1] if rev else c[0]
                d = float(np.hypot(*(start - tail)))
                score = d
                if directional and d > 1:
                    # a gap is crossed straight on: both ends should point along the bridge
                    ahead = c[::-1][min(13, len(c) - 1)] if rev else c[min(13, len(c) - 1)]
                    bridge = unit(start - tail)
                    score = d * (1 + 1.5 * (1 - float(np.dot(tail_dir, bridge))) + 1.5 * (1 - float(np.dot(unit(ahead - start), bridge))))
                if best is None or score < best[0]:
                    best = (score, i, rev, d)
        _, i, rev, d = best
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


def clearance(pts):
    """The smallest distance between two strands of the track (points more than a twelfth of a lap apart), in box units."""
    n = len(pts)
    best = float("inf")
    for i in range(n):
        for j in range(i + n // 12, n - n // 12 + i):
            best = min(best, float(np.hypot(*(pts[i] - pts[j % n]))))
    return best


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
    out_path = args.out or os.path.join(ROOT, "src", "data", "tracks", f"{cfg.get('file', args.track)}Shape.ts")

    im = load_on_white(image_path)
    mask = extract_mask(im, cfg)
    chains, labels = skeleton_chains(mask, cfg)
    loop = chain_in_order(chains, labels, cfg["order"]) if cfg.get("order") else chain_into_loop(chains, cfg.get("directional", False))
    curve = fit_curve(loop, cfg)
    pts, width, height = normalize(curve)
    gap = clearance(pts)
    print(f"closest strands: {gap:.1f} units apart (a road of {cfg['road_width']} plus its edge needs about {cfg['road_width'] + 6})")
    a, b = write_ts(pts, width, height, cfg, out_path)
    if args.debug_dir:
        write_debug(im, mask, curve, pts, width, height, a, b, args.debug_dir)
    print(f"wrote {out_path} ({int(width)} x {int(height)})")


if __name__ == "__main__":
    main()
