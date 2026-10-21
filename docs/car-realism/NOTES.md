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
