# Car realism: working notes

A running log of what was done, in order, with the decisions taken along the way. The summary is in REPORT.md.

## Step 0: safety net

- Branch `car-realism-sonnet`, commit "Car realism: Sonnet pass (before Fable)", tag `pre-fable-start`. The uncommitted
  work it holds is the 2026 calendar track outlines and the track tracing tool, not car work (the previous session's car
  work was already committed in `ed6b8ce` and `b7dc3e5`).
- All work on `car-realism-fable`, branched from there.

## Step 1: audit of the previous pass

What the previous session left, and the verdict:

- `/dev/car-views` (commits ed6b8ce, b7dc3e5): five fixed angles of one livery, `?view=` for one angle big. Good and
  kept. Extended here with a capture mode (see below), `?liveries=a,b,c` for several liveries on one model, `?sheet=`
  for contact sheets, `?zoom=` and `?tile=`.
- `reference/ferrari-2022/` (not in git: `reference/` is ignored): 10 photos of the F1-75 from Wikimedia Commons with
  URLs and licences, wrong-year photos discarded. Good. Moved to `reference/gen2022/`.
- `reference/ferrari-2022/dimensions.md`: the FIA 2022 reference volumes against the model, with a mismatch table
  (rear wing 0.28 m too long and 0.14 m too tall, floor 0.1 m too wide per side, tyres too narrow, roll hoop slightly
  tall). Valuable; it drives the 2022 geometry pass.
- No geometry or material had been changed yet.

The models before any change (docs/car-realism/before/):

| Generation | Proportions | Silhouette | Materials | Lighting | Main defects |
|---|---|---|---|---|---|
| 2022 | 5 | 5 | 5 | 4 | rear wing far too big, floor too wide, thin pointed nose, engine cover a smooth blob with no slope to the tail, bulbous sidepods, car dim against a loud colored floor glow, pixel-font lettering |
| 2026 | 5 | 5 | 5 | 4 | same body as 2022 with smaller numbers; front wing a thick flat plank, raised nose looks like a tube |
| 2014 | 4 | 5 | 5 | 4 | hammer nose too thick, sidepods bulge, rear wing end plates oversize, bargeboards read as a stack of plates |
| 2004 | 5 | 5 | 4 | 4 | tyres too wide for 2004, airbox too tall and square, sidepods too round |
| 1980s | 4 | 5 | 4 | 4 | floor-less look, rear wing end plates a plain box, tiny front wing, body too smooth for a 1980s slab |

Common to all: the paint has almost no reflection detail (a 256 x 128 fake studio map), the tyres are flat black with
no sidewall shading, no soft shadow under the car (only a radial blur), and the lettering uses a 5 x 7 pixel font.

## Capture tooling (dev only)

- `tools/shot-sink.mjs`: a local server on port 8787 that saves PNGs under docs/car-realism/. Run it with
  `node tools/shot-sink.mjs` next to the web preview.
- `Car3DView` has a `capture` prop: keeps the drawn frame readable (`preserveDrawingBuffer`) and registers an
  on-demand draw in `renderNow`. Needed because the desktop app's hidden browser pane gets no animation frames and no
  layout passes, so the normal loop never draws there.
- `/dev/car-views`: `__shoot('<name>')` in the console saves every tile and a composite; `?sheet=gen2022&save=<name>`
  renders every livery of a generation (three angles each) and saves one contact sheet.

## 2022 model (checkpoint-2022-model)

Geometry from reference/gen2022/dimensions.md and the F1-75 photos: rear wing shrunk into its 2022 box (end plates
0.28 m shorter and 0.14 m lower), floor narrowed to the reference volume (0.685 m half width), tyres widened to their
measured inflated widths (350 / 450 mm) on 18-inch rims with a 0.68 cover, nose tip widened and rounded onto the
second wing element, roll hoop lowered under 0.97 m, three pod designs redrawn, a bathtub wall on the scooped
(Ferrari) pods, the flap vanes removed (banned in 2022), the engine cover tail closed, a taller halo in bare carbon
(liveries may paint it with `parts.halo`).

Materials and light: clearcoat paint, satin carbon with the weave, sheen on the tyres, glossy wheel covers; a warm
key light that throws a soft shadow on the ground, a cool rim light, a 512 x 256 studio map with strip lights.
Every mesh is in a named group (body, sidepods, floor, frontWing, rearWing, cockpit, halo, wheels, extras) and the
materials hang on `car.userData.materials`.

Lettering: a new bold stroke font (strokeFont.ts) replaces the 5 x 7 pixel font as the default (`font: 'pixel'`
keeps the old one); the livery pictures went from 1536 to 2048 pixels wide.

| Round | Proportions | Silhouette | Materials | Lighting | Fixed next |
|---|---|---|---|---|---|
| 1 | 6.5 | 6.5 | 6 | 7 | flap vanes, open tail, bright carbon |
| 2 | 7 | 7 | 6.5 | 7.5 | stray inlet-lip line, carbon reflections, thinner flaps |
| 3 | 7 | 7 | 7 | 7.5 | lettering across the rear wing read rotated from behind; top view yaw; wheel covers |
| 4 (final) | 7.5 | 7.5 | 7 | 7.5 | |

Still weak: the front wing elements read as stacked dark slabs from the front; the airbox "ears" and the engine
cover ridge are simpler than the real car's; no sidewall lettering on the tyres beyond the dashes.

## 2022 liveries (checkpoint-2022-liveries)

References: reference/gen2022/liveries/<id>/ (three Commons photos each, fetched with tools/fetch_refs.py, licences
in sources.txt). All ten liveries redrawn against the photos and the new geometry. Biggest corrections: the
Mercedes W13 was silver, not black; Alfa Romeo's sidepods and airbox are white with the red kept to the nose and the
tail; McLaren's engine cover flanks are black; Red Bull's nose is yellow with the bulls on it and the engine cover
carries the Red Bull badge instead of an orange panel; painted halos where the team painted them (McLaren papaya,
Alpine blue, AlphaTauri, Alfa Romeo and Haas white, Red Bull and Aston Martin in their body color).

| Livery | Before | After | Notes |
|---|---|---|---|
| ferrari-2022 | 6 | 7.5 | Shell roundel, Ceva, Ray-Ban, Santander placed as on the F1-75; red front flaps; carbon halo |
| mercedes-2022 | 3 | 7.5 | silver body, teal swoosh, INEOS on the airbox, black tail |
| mclaren-2022 | 5 | 7 | black engine cover flanks with android, blue swoosh, DeWalt box, papaya halo |
| redbull-2022 | 5 | 7 | yellow nose with the bulls, ORACLE on the pod, Red Bull badge on the cover, red floor edge |
| alpine-2022 | 5 | 7 | brighter blue, pink BWT panel, MAPFRE box, Castrol badge, blue halo |
| astonmartin-2022 | 6 | 7 | lime line, aramco on the cover, JCB, lime rear wing edge |
| alphatauri-2022 | 6 | 7 | white upper body with the bull splash, white halo, FASHION MEETS FUNCTION on the rear wing |
| alfaromeo-2022 | 4 | 7 | white pods and airbox, red nose and tail, white halo |
| haas-2022 | 6 | 7 | red HAAS, red floor band and nose stripe, 1&1 box, white halo |
| williams-2022 | 5 | 6.5 | bright blue cover and nose, black lower body |

Two rounds: the second only moved ALFA ROMEO clear of the rear wheel and ARAMCO clear of the halo.

## 2026 model (checkpoint-2026-model)

References: reference/gen2026/ (nine Commons photos of the Alpine A526 and Aston Martin AMR26 at the 2026 Chinese GP;
a show car was discarded) and dimensions.md (wheelbase 3400, width 1900, tyres 25 / 30 mm narrower, floor 150 mm
narrower, front wing 100 mm narrower, active wings, no beam wing). Redrawn: a long low nose onto a three-element
front wing (top flap active, in sections) with small plain end plates; sidepods set back behind the front wheels
with a deep undercut and a flat rear deck; a slimmer engine cover with a fin; a three-element rear wing on one
central pillar; narrower floor without fences.

| Round | Proportions | Silhouette | Materials | Lighting | Fixed next |
|---|---|---|---|---|---|
| 1 | 7 | 7 | 7 | 7.5 | lettering across the wings read mirrored (glyph tops now point to the rear on both wings) |
| 2 (final) | 7.5 | 7.5 | 7 | 7.5 | |

Still weak: the active flaps' section gaps are a little wide; the pod inlet is a plain dark ellipse.

## 2026 liveries (checkpoint-2026-liveries)

References: reference/gen2026/liveries/<id>/ (three Commons photos each from the 2026 Chinese GP). All eleven
redrawn. Biggest corrections: Ferrari's white engine cover with the blue HP and carbon wings with red; Mercedes'
teal and silver swooshes and the silver stars on the engine cover; McLaren's anthracite engine cover with Gemini and
the black lower body with its diagonal cut; Red Bull's yellow airbox with the bull across the cover; Racing Bulls'
yellow airbox and navy sweep; Alpine's pink airbox, halo and end plates; Williams' white lower panel with Komatsu and
the black cover top; Haas' black HAAS lettering and red airbox; Audi's red ring around the airbox and the red rear
pod with Revolut; Cadillac's black nose and chassis under the white upper body.

| Livery | Before | After | Livery | Before | After |
|---|---|---|---|---|---|
| ferrari-2026 | 6 | 7.5 | alpine-2026 | 5 | 7 |
| mercedes-2026 | 5 | 7 | astonmartin-2026 | 6 | 7 |
| mclaren-2026 | 5 | 7 | williams-2026 | 5 | 7 |
| redbull-2026 | 5 | 7 | haas-2026 | 5 | 7 |
| racingbulls-2026 | 5 | 7 | audi-2026 | 4 | 7 |
| cadillac-2026 | 4 | 7 | | | |

One round: the second only checked a suspected end-plate defect (it was the flap lettering seen edge-on, not a bug).
The dev page gained `?yaw=&pitch=` for free camera angles.

## 2014 generation (checkpoint-2014)

Decision: the brief names a W05-style (2014) car, but this generation's liveries are the 2018 ones (Force India with
BWT, Williams Martini, Aston Martin Red Bull, McLaren papaya) and the model has a halo, so the 2018 Mercedes W09 is
the reference (reference/gen2014/, ten Commons photos; dimensions.md). The real wheelbase (3.73 m) is kept at 3.6 so
the comparison with the 2022 car stays honest.

Model: open-spoke 13-inch wheels with tall sidewalls (they were covers), the 1.8 m front wing, a wider floor, the
T-wing removed (banned in 2018) and a low shark fin, the rear wing shrunk into its 950 x 950 mm box on one pillar,
the halo on the halo slot (bare carbon unless painted).

| Round | Proportions | Silhouette | Materials | Lighting | Fixed next |
|---|---|---|---|---|---|
| 1 | 6 | 6.5 | 7 | 7.5 | Mercedes still black (livery), rear wing too tall and wide |
| 2 | 6.5 | 6.5 | 7 | 7.5 | rear wing |
| 3 (final) | 7 | 7 | 7 | 7.5 | |

Still weak: the bargeboards are a stack of flat plates; the thumb nose is simpler than the real one; the flap vanes
are one row of small boxes.

Liveries (reference/gen2014/liveries/<id>/, three photos each, all seven redrawn from the 2018 cars):

| Livery | Before | After | Notes |
|---|---|---|---|
| ferrari-2014 | 6 | 7 | red wings and halo, white number boxes, Shell roundel, 2018 sponsors |
| mercedes-2014 | 4 | 7.5 | silver all over with the teal swooshes (it was black from the airbox back) |
| mclaren-2014 | 5 | 7 | blue rear engine cover and rear wing, Kimoa box, blue end plates |
| redbull-2014 | 6 | 7 | yellow nose and airbox with the bulls, Aston Martin lettering, Esso |
| forceindia-2014 | 5 | 7 | silver-white cover and fin with BWT, white lower panel, pink halo |
| renault-2014 | 5 | 7 | yellow nose top and cover edges, RCi roundel, yellow rear wing |
| williams-2014 | 5 | 7.5 | diagonal Martini bands over the cover and fin, striped nose and rear wing |

## 2004 generation (checkpoint-2004)

References: reference/gen2004/ (ten Commons photos of the F2004; several downloads were refused by Commons' rate
limit and skipped) and dimensions.md (wheelbase 3050, width 1796, height 959, 13-inch grooved tyres 270 / 350).

Model: the nose lowered to the F2004's drooping line (its bottom was 0.34 m up, now 0.22), the periscope airbox
brought down from 1.17 m to the real 0.98 with a winglet on top, tyres narrowed to 270 / 350 with four grooves.

| Round | Proportions | Silhouette | Materials | Lighting | Fixed next |
|---|---|---|---|---|---|
| 1 (final) | 7 | 7 | 7 | 7.5 | two sponsor names moved |

Still weak: the sidepod inlets are plain dark ellipses; no bargeboards; the front wing's raised middle section is
missing (the F2004's main plane rises under the nose).

Liveries (reference/gen2004/liveries/<id>/, two or three photos each, all seven redrawn):

| Livery | Before | After | Notes |
|---|---|---|---|
| ferrari-2004 | 6 | 7.5 | red wings with white end plates, white barcode on the cover, Vodafone roundel, Shell scallop, white lower pod panel |
| mclaren-2004 | 5 | 7 | lighter silver, black rear cover and pod tops, red-orange flash, West on the rear wing |
| williams-2004 | 5 | 7.5 | navy sidepods under a white body, navy nose band and roundel, white rear wing with HP invent |
| renault-2004 | 5 | 7.5 | yellow front half with light blue behind, navy nose tip, wings and floor edge; Mild Seven, Hanjin, elf |
| bar-2004 | 5 | 7 | red airbox, white Honda band and black rear cover; Lucky Strike roundel and red lower band |
| jaguar-2004 | 5 | 7 | British racing green over silver sidepods with a red lower stripe; AT&T, HSBC, Becks |
| toyota-2004 | 5 | 7 | the red brush over the sidepod fronts and nose, red end plates; Panasonic, Denso, Esso |

## 1980s generation (checkpoint-1980s)

References: reference/gen1980s/ (ten Commons photos of the MP4/4) and dimensions.md (wheelbase 2875, width 2134,
height 940, tracks 1824 / 1670, tyres 255 / 355 on 13-inch rims).

Model: a wider flat wedge nose instead of the needle, the roll hoop lowered from 1.03 m to the real 0.94, louvres on
the engine cover, big flat rectangular end plates front and rear, the rear wing lowered into its 0.94 box, the rear
tyres much wider than the fronts on the real tracks.

| Round | Proportions | Silhouette | Materials | Lighting | Fixed next |
|---|---|---|---|---|---|
| 1 | 6 | 6.5 | 7 | 7.5 | nose, roll hoop, end plates, tyres |
| 2 (final) | 7 | 7 | 7 | 7.5 | |

Still weak: the sidepods are plain boxes with no radiator detail; the MP4/4's reclined driver position is not shown
(the helmet sits as high as on the other cars); the front wing has no raised middle section.

Liveries (reference/gen1980s/liveries/<id>/, two or three photos each, all seven redrawn):

| Livery | Before | After | Notes |
|---|---|---|---|
| ferrari-1980s | 5 | 7 | 1987 F1/87: Enichem and 28 on the nose, Agip, Fiat label, carbon wings |
| mclaren-1980s | 6 | 8 | the MP4/4 red chevron cowl and sweep, red lower rear body, red rear wing with 12, Shell on the pod and front wing |
| lotus-1980s | 6 | 7 | gold pinstripes, John Player Special, DeLonghi, 12, elf on the end plates |
| williams-1980s | 6 | 7.5 | navy nose, yellow Tactel cowl with the ICI roundel, Canon in red, Mobil 1 and 5 on the nose |
| benetton-1980s | 3 | 7 | it was blue: now the turquoise B186 with the white rear and coloured streaks, Sisley, Riello, black wings |
| lotuscamel-1980s | 6 | 7.5 | Camel in blue on the pods, DeLonghi box, Honda, 12, elf on the rear wing |
| brabham-1980s | 3 | 7 | it was white with a navy nose: now the navy BT52 with the white upper nose and cockpit, parmalat, Santal front wing |

## 2014 generation, redone as the 2014 cars (checkpoint-2014-v2)

Asked for in the morning: no halo, a 2014 car, 2014 liveries. The 2018 version is kept in git (checkpoint-2014) and
its pictures in gen2014/as-2018/; its references moved to reference/gen2014-as-2018/.

References: reference/gen2014/ (eight Commons photos of the Mercedes F1 W05 Hybrid) and dimensions.md (width 1800,
height 950, front wing 1650, rear wing 750, no beam wing, 245 / 325 tyres on 13-inch rims, a low nose).

Model: halo removed (classicBody only builds it when the spec says so), the low finger nose, the 1.65 m front wing,
the 750 mm rear wing with no beam wing, a narrower floor, 2014 tyre widths on a 1.8 m car, three small turning vanes
instead of the 2017 bargeboards, the shark fin gone, a single central exhaust.

| Round | Proportions | Silhouette | Materials | Lighting |
|---|---|---|---|---|
| 1 (final) | 7 | 7 | 7 | 7.5 |

Liveries (reference/gen2014/liveries/<id>/, three 2014 photos each). The save keys are unchanged; `renault-2014`
now draws the Renault-engined Lotus E22 (Lotus F1 Team), since Renault had no works team in 2014.

| Livery | Car | After | Notes |
|---|---|---|---|
| ferrari-2014 | Ferrari F14 T | 7 | Santander flashes, Shell roundel, UPS box, white cover panel with the shield, black rear wing |
| mercedes-2014 | Mercedes W05 | 7.5 | silver with the teal Petronas sweep, BlackBerry, 44 in red |
| mclaren-2014 | McLaren MP4-29 | 7 | chrome with the black engine cover and rear, red Santander bands, Johnnie Walker, asos rear wing |
| redbull-2014 | Red Bull RB10 | 7 | yellow nose and airbox with the bulls, Infiniti, red Total end plates |
| forceindia-2014 | Force India VJM07 | 7 | silver-white nose, saffron sidepods with Sahara, green band, black rear |
| renault-2014 | Lotus E22 | 7 | black with gold pinstripes, red airbox, EMC, burn, red PDVSA rear wing end plates |
| williams-2014 | Williams FW36 | 7.5 | white with the Martini stripes down the middle, Martini on the pods, striped rear wing |

## 2022 and 2026 front wings (checkpoint-front-wings)

Asked for in the morning: the 2022 and 2026 front wings read as stacked slabs next to the older cars. Against a
reference photo of a 2022 wing, each element is now shaped on its own: `FrontWingElement` gained `lift` and
`liftSpan` (how far the flap's inner end sweeps up to meet the side of the nose) and `risePower` (how the tip curl is
spread along the span). The 2022 wing is a flat main plane with its tips curled to the end plates and three thinner,
more cambered flaps behind it with open slot gaps, each sweeping up toward the nose and curling at the tip; the 2026
wing does the same with two flaps. Six small vortex vanes stand on the top flap. The front wing now has its own paint
materials (it reused the rear wing's, which put the carbon weave on Ferrari's red front flaps).

Pictures: gen2022/wing-round1-front.jpg and wing-round2-front.jpg (before the material fix, after), the
final-model.jpg of both generations re-taken. Front-wing detail is the one thing that moved: the 2022 car's
proportions score goes from 7.5 to 8 by my reckoning; the overall scores stay 7.5.
