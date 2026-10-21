# Livery detail: working notes

A running log of the pass, with the decisions taken along the way. The summary is in REPORT.md.

## Step 0: safety net

- `main` had nothing to commit (only the untracked `.claude/` folder, which stays out of git). Tagged `pre-livery-detail`
  on `a400094`; all work on branch `livery-detail-opus`.

## Step 1: inventory and before pictures (checkpoint-livery-inventory)

- `/dev/car-views` works on web; `tools/shot-sink.mjs` now takes `SHOT_SINK_DIR=livery-detail` to save under
  docs/livery-detail/. Before sheets: docs/livery-detail/before/gen*.jpg.
- INVENTORY.md: 252 names and 15 numbers. Everything was stroke-font lettering, 20-point ellipses and straight polygons.

## Step 2: paint engine (checkpoint-livery-engine)

- New modules, all plain TypeScript with no DOM (they run on the phone through expo-gl and in Node):
  - `path.ts`: SVG path parser (M L H V C S Q T A Z, absolute and relative, arcs to cubics), affine transforms,
    flattening at 0.12 px.
  - `raster.ts`: compound polygon fill with soft edges (4 sample rows per pixel, exact coverage across), non-zero
    winding by default, even-odd on request; linear gradients through a 256-step table; outlines as the union of a
    band per edge plus round joins.
  - `outlineFont.ts` + `outlineFontData.ts`: the Inter typeface (OFL, from @expo-google-fonts/inter, already a
    dependency) at weights 400 / 600 / 800 / 900, outlines and GPOS pair kerning extracted by
    `tools/extract-font.mjs` (151 KB of source).
  - `liveryRaster.ts`: the livery painter. The original pipeline is kept verbatim for plain polygons and plain
    lettering, so old liveries are pixel-identical; anything using the new options goes through the vector pipeline.
- Livery types: `LiveryLayer` gains `path`, `gradient`, `stroke`, `opacity`, `rule`, `symmetric`; `LiveryText` gains
  `font: 'sans'`, `weight`, `slant`, `condense`, `outline`, multi-line text and `lineHeight`; new `LiveryDecal` and
  `decals` / `plateDecals` for logos from src/data/logos.
- Proof of backward compatibility: all 42 liveries (top, both sides and every end plate) hashed with the old code (a
  scratch worktree at `pre-livery-detail`) and the new: 0 differences. The 42 old liveries are frozen in
  scripts/fixtures/legacy/ with their hashes; `npm run check` repaints six of them (one per generation and the pixel
  font) every time, `CHECK_ALL_LIVERIES=1` all 43.
- Paint time on web (dev build, `/dev/car-views?bench=1`): 310 ms average per livery, 363 ms at most, before any
  livery uses the new tools. Budget from the brief: about 465 ms average.
- Cache: the painted pixels of the last 3 liveries are kept (paint.ts), so going back to a car does not repaint it.
- The 2D race icon (CarIcon.tsx) draws path layers too (gradients as their first color; outlines left out).

## Step 3 and pilot: logo library and the 2022 Ferrari, Mercedes and Red Bull (checkpoint-livery-pilot)

- Logo library in src/data/logos: `marks.ts` (team marks: Ferrari shield and horse, Mercedes star, Red Bull bulls),
  `fuel.ts` (Shell pecten, V-Power), `sponsors.ts` (sponsors with a drawn mark), `wordmarks.ts` (lettering-only
  sponsors in the Inter weight closest to the real typeface). `draw.ts` has the helpers (`wordmark()` sizes the box
  to the text). A logo shape can be drawn only when a decal sets a slot (`when`), used for the Shell keyline.
- `/dev/logos` paints every logo with the livery painter on light and dark; `&save=` posts a sheet to the sink.
- `/dev/car-views?views=side,top,three-quarter&shoot=<folder>&queue=a,b` shoots livery after livery unattended;
  `tools/compare.py` puts the renders beside a reference photo.
- Shader: the wing elements now take their paint from the top picture only (`topOnly`). Their steep flap faces used
  to pick up the side picture (the yellow Red Bull nose flank painted the inner front flaps).
- The side projection paints every surface by its (x, y): a side decal that reaches above a crease (sidepod top,
  cover shoulder) spreads onto the inner surfaces there, so side logos are kept below the crease lines.
- Pilot scores (photo against render, three angles): Ferrari 8 (was 7.5), Mercedes 7.5 (7.5), Red Bull 7.5 (7).
  Average 7.7: the gate (7.5) is passed. Weakest: the prancing horse and the bulls are hand-drawn silhouettes,
  recognisable but simpler than the real art.
- Mirrored text on the inner faces of the end plates (the plate is one double-sided mesh with one picture): the
  outer faces read correctly on both sides of the car, the inner faces show the mirror image. Not fixed (it needs
  the plate geometry split into two faces).
