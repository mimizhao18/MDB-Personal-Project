# Car realism: report

Overnight pass of 2026-10-21 on branch `car-realism-fable` (from `car-realism-sonnet`, tag `pre-fable-start`). Every
step is a commit with a tag, so any point can be restored with `git checkout <tag>`. Nothing was pushed; `main` is
untouched. The running log with the per-round scores is in [NOTES.md](NOTES.md); the pictures are in the folders
next to it.

## Summary

All five generations were done, in the order asked: 2022, 2026, 2014, 2004, 1980s. Each has its car model redrawn
from reference photos and real dimensions, and every one of the 42 liveries was redrawn from one to three photos of
the real car. No livery was left as "no reference found". The livery paint layer is proven generic: four liveries of
a generation render side by side on one model with no change to the model. `npm run check` now fails if a livery id
disappears or a generation's livery count changes. Lint, typecheck and the rule checks pass at every commit.

| Generation | State | Car score (of 10) | Tag |
|---|---|---|---|
| 2022 | done | 7.5 | `checkpoint-2022-liveries` (model: `checkpoint-2022-model`) |
| 2026 | done | 7.5 | `checkpoint-2026-liveries` (model: `checkpoint-2026-model`) |
| 2014 | done (redone as the 2014 cars in the morning) | 7 | `checkpoint-2014-v2` (the 2018 version: `checkpoint-2014`) |
| 2004 | done | 7 | `checkpoint-2004` |
| 1980s | done | 7 | `checkpoint-1980s` |

Scores are my own, from the five-angle pictures against the photos (proportions, silhouette, materials, lighting
averaged). Before the pass every car was a 4 to 5. None reached 8, so each ran its rounds until the top defects were
fixed and stopped there; what is still weak is listed per generation below.

What changed for everyone, built once on the 2022 car and shared by all five:

- **Materials:** clearcoat paint (gloss or matte per team), satin carbon with a weave on every bare part, tyres with a
  rubber sheen, glossy wheel covers, a clearcoat helmet.
- **Lighting:** a warm key light that throws a soft shadow on the ground, a cool rim light from behind, a soft fill,
  and a larger studio reflection map with strip lights along the flanks.
- **Lettering:** a bold stroke font (`src/components/car3d/strokeFont.ts`) replaces the 5 x 7 pixel font; the livery
  pictures went from 1536 to 2048 pixels wide. The pixel font is kept for any text that asks for `font: 'pixel'`.
- **Named parts:** every mesh is in a group named body, sidepods, floor, frontWing, rearWing, cockpit, halo, wheels or
  extras, and the materials hang on `car.userData.materials`.
- **Halo slot:** a livery can paint the halo with `parts.halo`; otherwise it is bare carbon (several 2022 and 2026
  teams paint it, and the photos show which).
- **Dev page** `/dev/car-views`: `?livery=`, `?view=` with `&yaw=&pitch=&zoom=&tile=`, `?liveries=a,b,c` for several
  liveries on one model, `?sheet=gen2022&save=name` for a contact sheet, and `__shoot('name')` in the console to save
  the tiles. Pictures are saved by `node tools/shot-sink.mjs` under docs/car-realism/.

## Per generation

### 2022 (reference: Ferrari F1-75)

Done. Final score 7.5. Before and after: [gen2022/before.jpg](gen2022/before.jpg), [gen2022/final-model.jpg](gen2022/final-model.jpg);
all ten liveries: [gen2022/liveries-final.jpg](gen2022/liveries-final.jpg); the generic-layer proof:
[gen2022/livery-layer-4-liveries.jpg](gen2022/livery-layer-4-liveries.jpg).

The geometry was corrected against the FIA 2022 reference volumes (reference/gen2022/dimensions.md, written by the
previous session and used here): the rear wing was 0.28 m too long and 0.14 m too tall, the floor 0.1 m too wide per
side, the tyres too narrow, the roll hoop too tall; the nose was a needle. Three sidepod designs (downwash, scoop with
a bathtub wall, slim) are kept. Still weak: the front wing elements read as stacked dark slabs from dead ahead; the
airbox ears and engine-cover ridge are simpler than the real car's.

### 2026 (reference: the 2026 Chinese GP cars, Alpine A526 and Aston Martin AMR26)

Done. Final score 7.5. [gen2026/before.jpg](gen2026/before.jpg), [gen2026/final-model.jpg](gen2026/final-model.jpg),
[gen2026/liveries-final.jpg](gen2026/liveries-final.jpg).

Drawn to the 2026 rules (3400 mm wheelbase, 1900 wide, tyres 25 / 30 mm narrower, floor 150 mm narrower, front wing
100 mm narrower, active wings, no beam wing) and the photos: a long low nose, sidepods set back with a deep undercut
and a flat rear deck, a slim engine cover with a fin, a three-element rear wing on one pillar. Still weak: the
active flap sections have slightly wide gaps; the pod inlet is a plain dark ellipse.

### 2014 (reference: Mercedes F1 W05 Hybrid)

Done. Final score 7. [gen2014/before.jpg](gen2014/before.jpg), [gen2014/final-model.jpg](gen2014/final-model.jpg),
[gen2014/liveries-final.jpg](gen2014/liveries-final.jpg).

Redone in the morning as the real 2014 car after the overnight pass had drawn it as the 2018 W09: no halo, the low
finger nose on pylons, the 1.65 m front wing, the 750 mm rear wing with no beam wing, 245 / 325 tyres on open-spoke
13-inch wheels, a 1.8 m car, small turning vanes, no shark fin, a single central exhaust. The 2018 version stays in git
at `checkpoint-2014` and in gen2014/as-2018/. Still weak: the sidepod inlets are plain; the nose tip is a smooth
taper rather than the W05's stepped finger.

### 2004 (reference: Ferrari F2004)

Done. Final score 7. [gen2004/before.jpg](gen2004/before.jpg), [gen2004/final-model.jpg](gen2004/final-model.jpg),
[gen2004/liveries-final.jpg](gen2004/liveries-final.jpg).

The nose lowered to the F2004's drooping line, the airbox brought down from 1.17 m to the real 0.98 with its
winglet, tyres narrowed to 270 / 350 with four grooves. Still weak: plain sidepod inlets, no bargeboards, the front
wing's raised middle section is missing.

### 1980s (reference: 1988 McLaren MP4/4)

Done. Final score 7. [gen1980s/before.jpg](gen1980s/before.jpg), [gen1980s/final-model.jpg](gen1980s/final-model.jpg),
[gen1980s/liveries-final.jpg](gen1980s/liveries-final.jpg).

A wide flat wedge nose instead of the needle, the roll hoop lowered to the real 0.94 m, louvres on the engine cover,
big flat end plates front and rear, the rear wing lowered into its box, rear tyres much wider than the fronts on the
real tracks. Still weak: the sidepods are plain boxes; the reclined driver position of the MP4/4 is not shown.

## Per livery

Before and after scores (of 10) against the photos in reference/<generation>/liveries/<id>/. No livery is marked
"no reference found": Wikimedia Commons had one to three usable photos of every car.

| Livery | Before | After | Livery | Before | After |
|---|---|---|---|---|---|
| ferrari-2022 | 6 | 7.5 | ferrari-2026 | 6 | 7.5 |
| mercedes-2022 | 3 | 7.5 | mercedes-2026 | 5 | 7 |
| mclaren-2022 | 5 | 7 | mclaren-2026 | 5 | 7 |
| redbull-2022 | 5 | 7 | redbull-2026 | 5 | 7 |
| alpine-2022 | 5 | 7 | racingbulls-2026 | 5 | 7 |
| astonmartin-2022 | 6 | 7 | alpine-2026 | 5 | 7 |
| alphatauri-2022 | 6 | 7 | astonmartin-2026 | 6 | 7 |
| alfaromeo-2022 | 4 | 7 | williams-2026 | 5 | 7 |
| haas-2022 | 6 | 7 | haas-2026 | 5 | 7 |
| williams-2022 | 5 | 6.5 | audi-2026 | 4 | 7 |
| | | | cadillac-2026 | 4 | 7 |
| ferrari-2014 (F14 T) | 6 | 7 | ferrari-2004 | 6 | 7.5 |
| mercedes-2014 (W05) | 4 | 7.5 | mclaren-2004 | 5 | 7 |
| mclaren-2014 (MP4-29) | 5 | 7 | williams-2004 | 5 | 7.5 |
| redbull-2014 (RB10) | 6 | 7 | renault-2004 | 5 | 7.5 |
| forceindia-2014 (VJM07) | 5 | 7 | bar-2004 | 5 | 7 |
| renault-2014 (Lotus E22) | 5 | 7 | jaguar-2004 | 5 | 7 |
| williams-2014 (FW36) | 5 | 7.5 | toyota-2004 | 5 | 7 |
| ferrari-1980s | 5 | 7 | benetton-1980s | 3 | 7 |
| mclaren-1980s | 6 | 8 | lotuscamel-1980s | 6 | 7.5 |
| lotus-1980s | 6 | 7 | brabham-1980s | 3 | 7 |
| williams-1980s | 6 | 7.5 | | | |

The biggest corrections were colors that were simply wrong: the 2022 Mercedes was black (it was silver), the 2014
Mercedes was black from the airbox back, the Benetton B186 was blue (it is turquoise with a white rear), the Brabham
BT52 was white with a navy nose (it is navy with a white upper nose), the Alfa Romeo C42 had red sidepods (white).
Every livery keeps its id, name, team, era and price.

## What to check on your phone

- **Performance.** The car has more going on than before: a 1024 shadow map with soft shadows, a 512 x 256 studio
  map, 2048-pixel paint textures, clearcoat on most materials. On web it is smooth; on a mid-range phone, check the
  Garage and Home screens for frame rate and heat. If it is too slow, the knobs are in `Car3DView.tsx`: `SHADOW_MAP`
  (drop to 512), `shadows="soft"` on the Canvas (drop to plain `shadows`), and the texture sizes at the top of
  `paint.ts`. The float studio map in `studio.ts` already falls back to lights only if the device cannot build it.
- **WebGL differences.** The livery paint and the carbon weave are shader patches (`onBeforeCompile`); they worked on
  web with WebGL 2 and were not run on expo-gl. The shadow map and `MeshPhysicalMaterial` sheen on the tyres are the
  other new features to look at on a phone. The `capture` prop (preserveDrawingBuffer) is only set on the dev page.
- **Lettering size.** The stroke font is bolder than the pixel font; check that small sponsor names are legible at
  phone size and not just at the dev page's size.
- **The Livery screen.** On web its 3D car was confirmed only by the absence of errors; the Garage, Store, Compare
  and Home screens were seen rendering.

## Decisions taken on your behalf

- **2014 is the real 2014 car with 2014 liveries** (your morning instruction; the overnight pass had used the 2018
  W09 and 2018 liveries because the generation's model carried a halo). The livery ids are unchanged; `renault-2014`
  now draws the Renault-engined Lotus E22, since Renault had no works team in 2014. The era label reads "First V6
  turbo-hybrid season".
- **2026 front wing has three elements, not two.** The 2026 Chinese GP photos show three; the rule check was updated
  from "two elements" to "fewer than the 2022 car's four". The 2022-vs-2026 front wing width check was corrected from
  240 mm to the regulation 100 mm.
- **Tyre widths use the measured inflated sizes** (350 / 450 mm in 2022) rather than Pirelli's 305 / 405 names, as
  the previous session's dimensions note suggested; the 2026 tyres are 25 / 30 mm narrower than those.
- **The dev page is dev only** but ships in the bundle like `/dev/design-system` did before; `tools/shot-sink.mjs`
  and `tools/fetch_refs.py` are tools, not app code.
- **Captures are JPEG,** not PNG, to keep the repository small (about 20 MB of pictures in docs/car-realism/).
- **Reference photos** are under reference/, which `.gitignore` already excluded. They are never shipped. Several
  downloads were refused by Commons' rate limit (HTTP 429) and skipped; every car still has at least two photos, and
  the fetch tool now waits two seconds between downloads.
- **No new packages** were installed. Expo's documentation for SDK 57 (expo-gl) was checked before touching the GL
  side; nothing beyond what the project already used was needed.
- **Pod inlet lip lines were removed** from the 2022/2026 cars (they drew a stray dark streak across the pods).
- **Lettering across the wings** now reads correctly from behind (rear wing) and from the front (front wing); it was
  mirrored on one side before this pass, which the stroke font made obvious.

## Tooling added

- `src/app/dev/car-views.tsx`: the review page (see above).
- `src/components/car3d/Car3DView.tsx`: a `capture` prop for the dev page, and `renderNow` so a hidden browser pane
  can still draw a frame.
- `tools/shot-sink.mjs`: saves the dev page's pictures. `tools/fetch_refs.py`: downloads reference photos from Commons
  with their licences into reference/.
- `scripts/check-rules.ts`: livery ids and counts per generation, halo color format.
