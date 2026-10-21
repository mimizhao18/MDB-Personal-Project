# Livery detail: report

Overnight pass of 2026-10-21 on branch `livery-detail-opus` (from `main` at `a400094`, tag `pre-livery-detail`).
Nothing was pushed; `main` is untouched. Every step is a commit with a tag. The running log, with every round and
decision, is in [NOTES.md](NOTES.md); the pictures are in the folders next to this file.

## Summary

**All five generations are done: all 42 liveries were rebuilt with real logos, curved shapes, gradients, fades and
outlined lettering.** The paint engine was extended in place (still a CPU rasterizer, no browser canvas, so it runs on
a phone through expo-gl), and a logo library of 292 hand-drawn vector logos was added. The pilot (2022 Ferrari,
Mercedes, Red Bull) passed the 7.5 gate at 7.7; every generation averages 7.6 to 7.7 after the pass (7.0 to 7.3
before). No livery fell below 6, so none was kept at its old version. Lint, typecheck and `npm run check` pass at the
final commit.

The old liveries still paint exactly as before with the new engine: all 42 were hashed with the original code and the
new one (0 differences), and `npm run check` keeps proving it on frozen copies of them.

Paint time per livery is the same or better: **on web 248 ms average (310 ms before), in Node 69 ms (72 ms before)**.
Logos replaced thousands of stroke-font polygons, which paid for the curves and gradients. No optimization was needed.

| Generation | State | Average before | Average after | Roll back to |
|---|---|---|---|---|
| 2022 | done | 7.0 | 7.7 | `checkpoint-livery-2022` |
| 2026 | done | 7.0 | 7.6 | `checkpoint-livery-2026` |
| 2014 | done | 7.1 | 7.6 | `checkpoint-livery-2014` |
| 2004 | done | 7.1 | 7.6 | `checkpoint-livery-2004` |
| 1980s | done | 7.3 | 7.6 | `checkpoint-livery-1980s` |

Other tags: `pre-livery-detail` (the start), `checkpoint-livery-inventory` (step 1), `checkpoint-livery-engine`
(step 2), `checkpoint-livery-pilot-fixed` (the pilot; not `checkpoint-livery-pilot`, which was committed with a
failing rule check, see "Decisions"), `checkpoint-livery-final` (this report).

"Before" scores are the previous pass's own scores (docs/car-realism/REPORT.md); "after" scores are mine, from the
side, top and three-quarter renders against the reference photos (shape and placement of the paint, logos, colors,
detail). A 10 would be indistinguishable from the photo at that size.

## What changed in the engine (step 2)

- **Curved shapes:** a livery shape can be an SVG path (`path`, M L H V C S Q T A Z, absolute and relative) in the
  car's metres, flattened at 0.12 px. Compound paths with holes work. **Fill rule: non-zero winding** (draw a hole the
  other way round from its outer edge, as fonts do); `rule: 'evenodd'` can be asked for per shape.
- **Outlines:** `stroke: { color, width }` on any shape or logo part (pinstripes, rings, keylines); open paths are
  stroked as lines with round ends.
- **Gradients:** `gradient: { from, to, stops }`, two or more stops; and `opacity`.
- **Symmetry:** `symmetric: true` mirrors a top-view shape onto the other side of the car.
- **Decals:** `decals: LiveryDecal[]` places a library logo (view top or side, position, width and/or height,
  rotate, mirror, `orient` across a wing, color overrides by named slot, opacity), and `plateDecals` on the end
  plates. Side decals read correctly from both sides (the left side gets a mirror image, as lettering always did);
  `farSide: 'same'` keeps the pixels for graphics that must not flip.
- **Lettering:** `font: 'sans'` is the Inter typeface (SIL Open Font License, already shipped in the app through
  @expo-google-fonts/inter) at weights 400 / 600 / 800 / 900 with its kerning, extracted to outlines by
  `tools/extract-font.mjs`. Any lettering can be slanted (`slant`), condensed or widened (`condense`), outlined
  (`outline`), tracked (`spacing`) and multi-line (`\n`, `lineHeight`). The bold stroke font and the pixel font still
  work, and plain old lettering is drawn by the old code, byte for byte.
- **Halftone fades** (`halftone()` in liveryHelpers.ts): dots that shrink along the car (Alpine 2022, McLaren 2014,
  Cadillac 2026).
- **Cache:** the painted pixels of the last 3 liveries are kept, so going back to a car does not repaint it.
- **Wing paint:** the wing elements now take their color from the top picture only; their steep flap faces used to
  pick up the side picture (the 2022 Red Bull's yellow nose painted its inner front flaps).
- **Rule checks** (scripts/check-paint.ts, part of `npm run check`): path parsing (relative commands, implicit
  repeats, S/T reflection, arc flags and sweep direction), flattening tolerance on a circle, holes under both fill
  rules and in a glyph's counter, decals and lettering reading correctly from both sides and on the end plates,
  mirror and recoloring, rich lettering, every logo's colors and paths, every livery's decals referring to real logos
  and slots, and six of the 42 frozen old liveries (all 43 with `CHECK_ALL_LIVERIES=1`) painting exactly as before.
- **The 2D race icon** (CarIcon.tsx) draws path shapes too (a gradient as its first color, a pinstripe as a line).

## Per livery

| Livery | Before | After | Livery | Before | After |
|---|---|---|---|---|---|
| ferrari-2022 | 7.5 | 8 | ferrari-2026 | 7.5 | 7.5 |
| mercedes-2022 | 7.5 | 8 | mercedes-2026 | 7 | 8 |
| redbull-2022 | 7 | 7.5 | mclaren-2026 | 7 | 7.5 |
| mclaren-2022 | 7 | 7.5 | redbull-2026 | 7 | 7.5 |
| alpine-2022 | 7 | 8 | racingbulls-2026 | 7 | 7.5 |
| astonmartin-2022 | 7 | 7.5 | alpine-2026 | 7 | 7.5 |
| alphatauri-2022 | 7 | 8 | astonmartin-2026 | 7 | 7.5 |
| alfaromeo-2022 | 7 | 7.5 | williams-2026 | 7 | 8 |
| haas-2022 | 7 | 7.5 | haas-2026 | 7 | 7.5 |
| williams-2022 | 6.5 | 7.5 | audi-2026 | 7 | 7.5 |
| | | | cadillac-2026 | 7 | 7.5 |
| ferrari-2014 | 7 | 7.5 | ferrari-2004 | 7.5 | 8 |
| mercedes-2014 | 7.5 | 7.5 | mclaren-2004 | 7 | 7.5 |
| mclaren-2014 | 7 | 7.5 | williams-2004 | 7.5 | 7.5 |
| redbull-2014 | 7 | 7.5 | renault-2004 | 7.5 | 7.5 |
| forceindia-2014 | 7 | 7.5 | bar-2004 | 7 | 7.5 |
| renault-2014 (Lotus E22) | 7 | 7.5 | jaguar-2004 | 7 | 7.5 |
| williams-2014 | 7.5 | 8 | toyota-2004 | 7 | 7.5 |
| ferrari-1980s | 7 | 7.5 | benetton-1980s | 7 | 7.5 |
| mclaren-1980s | 8 | 8 | lotuscamel-1980s | 7.5 | 7.5 |
| lotus-1980s | 7 | 8 | brabham-1980s | 7 | 7.5 |
| williams-1980s | 7.5 | 7.5 | | | |

What changed on each car is listed in NOTES.md, generation by generation. Pictures per generation:
docs/livery-detail/<generation>/before.jpg and after.jpg (contact sheets, three angles each) and <id>.jpg (side, top
and three-quarter, large). The side-by-side comparisons with the reference photos contain the Commons photos, so they
are not in git; `tools/compare.py` rebuilds them under reference/compare/.

Ids, names, teams, eras and prices are unchanged. `parts` colors changed only where the photos show it: Alpine 2022
rear flap pink, Aston Martin 2022 end plates black, Alfa Romeo 2022 halo red, McLaren 2022 front end plates papaya,
Mercedes 2022 front end plates red. The race numbers of the drivers in the photos are now drawn on the cars.

## The logo library (step 3)

292 logos in src/data/logos/ (team marks, fuel companies, and one file per generation of first use), every one drawn
here as vector paths and lettering, none downloaded or copied. Each has named color slots, so a decal can recolor it
(a white version on a dark car). `/dev/logos` shows every logo on light and dark backgrounds; the full sheet is
[logos.jpg](logos.jpg). 106 have a drawn mark (a shape beyond lettering); the rest are wordmarks in the Inter
weight, width and slant closest to the real typeface.

**The logos are trademarks of their owners, like the team and sponsor names the app already uses. They would need
clearing before any public release.**

Average logo score: 6.8. The score of every logo is in [LOGO-SCORES.md](LOGO-SCORES.md).

## Still weak

- **Animal and figure marks** are simplified silhouettes: the prancing horse (4), the Jaguar leaper (4), the JPS
  monogram (4), the camel (5), the Red Bull bull (6), the Johnnie Walker striding man (6). They read as what they are
  at car size, not as the real art. The Cadillac crest (4) is a plain frame of squares.
- **Script wordmarks** (Ray-Ban, Alfa Romeo, Telefonica) are pen strokes or a slanted Inter, not the real scripts.
- **Typefaces:** every wordmark is Inter; logos with a distinctive face (Marlboro, Goodyear, Pirelli, Michelin,
  Canon, Petronas) are close in weight and proportion but not in letter shapes. There is no serif face.
- **Paint on creases:** the side picture paints every surface at a given height, so a logo that reaches above the
  sidepod top spreads onto the inner faces. Logos were kept below the creases; large ones (Shell on the 2022 Ferrari,
  the Red Bull logo on the covers) are the closest to the limit.
- **End plates:** the plate is one double-sided mesh with one picture, so its inner face shows the lettering mirrored
  (as before this pass).
- **Small print:** sponsors smaller than about 2 cm of letter height are illegible at the Garage's size and only
  readable on /dev/car-views zoomed in.
- **Weakest liveries** (all 7.5, none below): ferrari-1980s (a mostly plain red car, as the real one), williams-1980s
  (the ICI roundel sits on the nose, not the cowl, because the cockpit opening hides the cowl's top), renault-2004.
- **2D race icon:** shows shapes and pinstripes but not logos (it never showed lettering).

## What to check on your phone

- **Load time when a car is shown:** painting a livery took 248 ms on average on web (dev build, desktop CPU), at most
  376 ms (McLaren 2014, with its halftone fade). Phones are slower: expect several hundred ms the first time a livery
  is shown; the last 3 are cached. If it feels slow, the knobs are `TOLERANCE` and `SUBSAMPLES` at the top of
  src/components/car3d/liveryRaster.ts (flattening and antialiasing) and the halftone spacing in the three liveries
  that use it.
- **Memory:** the textures are the same size as before (2048 x 768 top, two 2048 x 448 sides). The pixel cache keeps 3
  liveries, about 41 MB of JavaScript memory at most; set `CACHE_SIZE` in paint.ts to 1 if the phone is tight.
- **Frame rate:** unchanged in principle (same textures, same materials, one extra uniform); check the Garage and
  Home on a mid-range phone.
- **Bundle size:** the Inter outlines add about 150 KB of source (outlineFontData.ts) and the logo library about
  120 KB.
- **expo-gl:** nothing new on the GL side beyond a uniform in the existing shader patch; the paint itself is plain
  JavaScript. Check one livery of each generation on the phone for a black or white car (a shader compile failure).

## Decisions taken on your behalf

- **Kept the 2048-pixel paint textures** instead of raising the resolution: at the Garage's size the car is shown at
  well under the texture's 350 pixels per metre, so the gain is in drawing quality (curves, real logos), not pixels.
- **Inter for all lettering in logos**, extracted from the font files the app already ships (OFL licence). No package
  was added.
- **Non-zero fill rule** by default, even-odd on request.
- **Old pipeline kept verbatim** for plain polygons and plain lettering, so untouched content is byte-identical. The
  42 original liveries are frozen in scripts/fixtures/legacy/ as the regression fixture.
- **No new reference photos were downloaded:** the previous pass's 2 to 3 Commons photos per car were enough to place
  the sponsors; areas no photo showed (some tops) were filled from the same cars' other photos and my knowledge.
- **Drivers' numbers** are drawn in each team's style, from the car in the reference photo (or the driver's 2026
  number). They are part of the livery; the player's race number stays in the 2D icon as before.
- **Comparison sheets with photos stay out of git** (reference/compare/), since they contain the Commons photos.
  Work-in-progress renders (docs/livery-detail/wip/) are ignored by git.
- **Optional logo parts** (the Shell keyline, the Haas cut, the IBM stripes) are drawn only when a decal sets their
  color slot (`when`), so one logo serves both versions.
- **Wing elements are painted from the top picture only** (shader change, described above).
- **A paint rule was relaxed:** "every livery has top and side shapes" now counts logos as paint (the 1980s Ferrari
  and Camel Lotus carry only logos on top or side).
- **Mistake:** the pilot commit (`checkpoint-livery-pilot`) went in with `npm run check` failing (an old rule wanted
  every shape to be a polygon; a grep in my command hid the failure). The next commit fixed it
  (`checkpoint-livery-pilot-fixed`). From then on every commit went through a script that stops on any lint, type or
  check failure; no other commit is broken.
- **Tooling added (dev only):** `/dev/logos`; `/dev/car-views` gained `?views=` (several big angles),
  `&shoot=&queue=` (unattended shooting) and `?bench=1` (paint times); `tools/shot-sink.mjs` takes `SHOT_SINK_DIR`;
  `tools/compare.py`, `tools/extract-font.mjs`, `scripts/bench-paint.ts`. The Python tools need Pillow (installed
  for the user with pip, not part of the project).
