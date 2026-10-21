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
- Mistake: the pilot commit (`checkpoint-livery-pilot`, 8cc12b1) went in with `npm run check` failing (an old rule
  required every livery shape to be a polygon; a grep in my command hid the failure). Fixed in the next commit,
  tagged `checkpoint-livery-pilot-fixed`; roll back to that tag, not the first. Commits now go through a script that
  stops on any lint, type or check failure.

## 2022, all ten (checkpoint-livery-2022)

Pictures: docs/livery-detail/gen2022/before.jpg and after.jpg (contact sheets), <id>.jpg (side, top and three-quarter,
large). The side-by-side comparisons with the photos contain the Commons photos, so they are kept out of git, under
reference/compare/gen2022/.

| Livery | Before | After | What changed |
|---|---|---|---|
| ferrari-2022 | 7.5 | 8 | Shell pecten with its white keyline, Ceva with the triangle A, Ray-Ban script, Santander flame, aws smile, Scuderia shield, louvres as darker red slats, curved floor edge, 16 in yellow with a black edge |
| mercedes-2022 | 7.5 | 8 | Petronas drop and wide name, three-pointed star, the red airbox with INEOS, curved teal stripe, TeamViewer box, AMD arrow, 44 in neon yellow |
| redbull-2022 | 7 | 7.5 | charging bulls on the nose and cover, yellow-to-orange airbox gradient, ORACLE, BYBIT with its yellow bar, TAG Heuer shield, "Red" "Bull" across the front wing |
| mclaren-2022 | 7 | 7.5 | the papaya panel tapering back over the blue swoosh, anthracite cover, VELO with chevrons, android with the robot, Gulf roundel, OKX squares, DeWalt box |
| alpine-2022 | 7 | 8 | halftone dot fade from blue to black, the pink panel with BWT outlined in white, Castrol box, Mapfre box, Alpine A, Microsoft squares, pink rear flap |
| astonmartin-2022 | 7 | 7.5 | green-to-dark gradient, lime lines along the floor edge and cover, lowercase aramco and cognizant, the wings, Peroni, JCB box, black end plates |
| alphatauri-2022 | 7 | 8 | white upper body with the navy bull's-head swirl, white pinstripes, ALPHA/TAURI in two weights, TAURI across the front wing |
| alfaromeo-2022 | 7 | 7.5 | Orlen eagle, Alfa Romeo script and quadrifoglio, white pods with a curved red boundary, red halo (as in the Austria photo) |
| haas-2022 | 7 | 7.5 | the red sweep from the nose under HAAS and up the engine cover, slanted HAAS, 1&1 box, 47 |
| williams-2022 | 6.5 | 7.5 | faceted blue panels cut by the long diagonal over the black body, light blue and red accent lines, the W |

Average after: 7.7. Parts colors changed where the photos show them: Alpine's rear flap is pink, Aston Martin's end
plates black (front and rear), the Alfa Romeo halo red, McLaren's front end plates papaya, Mercedes' front end plates
red. Numbers are the race drivers' (Leclerc 16, Hamilton 44, Verstappen 1, Norris 4, Ocon 31, Vettel 5, Tsunoda 22,
Bottas 77, Schumacher 47, Latifi 6).

Paint time (Node, best of 3, `scripts/bench-paint.ts`): the rebuilt 2022 liveries paint in about the same time as
before (0.98x): logos replaced thousands of stroke-font polygons.

## 2026, all eleven (checkpoint-livery-2026)

Pictures: docs/livery-detail/gen2026/before.jpg, after.jpg, <id>.jpg. Two rounds each (positions, then colors and
sizes); a third for the Cadillac (TWG straddled the sidepod crease).

| Livery | Before | After | What changed |
|---|---|---|---|
| ferrari-2026 | 7.5 | 7.5 | the white airbox and cover sweep with the blue HP disc, IBM in blue, pecten, Ceva, Puma, UniCredit mark |
| mercedes-2026 | 7 | 8 | teal and silver speed lines over black, the star fade on the cover, Petronas in white, Microsoft squares |
| mclaren-2026 | 7 | 7.5 | the anthracite rear behind a diagonal with the papaya slash, Gemini with its spark, all win, Dropbox, Etihad |
| redbull-2026 | 7 | 7.5 | the full Red Bull logo (bulls, sun, name) on the cover, yellow airbox gradient, ORACLE, Ford oval |
| racingbulls-2026 | 7 | 7.5 | white body over a navy lower body glowing blue, VISA, Red Bull logo, Cash App square, HUGO |
| alpine-2026 | 7 | 7.5 | a deep blue darkening toward the tail, pink BWT letters, eni with the six-legged dog, MSC, pink halo |
| astonmartin-2026 | 7 | 7.5 | green to dark gradient, lime lines, aramco, Maaden, the wings, Honda, Valvoline |
| williams-2026 | 7 | 8 | white Komatsu panel, Atlassian sail, Barclays eagle, Gulf roundel |
| haas-2026 | 7 | 7.5 | the big GR with its red slash, slanted HAAS, red airbox and chassis line |
| audi-2026 | 7 | 7.5 | titanium shading darker low down, the red rear slash, red ring round the airbox mouth, four rings, Revolut |
| cadillac-2026 | 7 | 7.5 | black nose and diagonal over the white body, the grey checks fading as dots, TWG, the crest |

Average after: 7.6. Numbers are the drivers in the reference photos or the 2026 race numbers (Leclerc 16, Russell 63,
Piastri 81, Verstappen 3, Lawson 30, Colapinto 43, Alonso 14, Albon 23, Bearman 87, Hulkenberg 27, Bottas 77).
