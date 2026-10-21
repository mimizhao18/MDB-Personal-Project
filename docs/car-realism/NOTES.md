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
