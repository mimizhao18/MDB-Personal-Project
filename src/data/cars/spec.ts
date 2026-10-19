// What a car's measurements look like, shared by the generations built from the same kind of parts (2022 and 2026).
// All lengths are metres. x runs from the tail (negative) to the nose (positive), z is across the car (right side
// positive) and y is up from the ground. The 3D model and the 2D race icon are both drawn from these.

/** The box the livery pictures cover: x from tail to nose, z across, y up. */
export const PAINT_BOX = { xMin: -2.8, xMax: 3.1, zHalf: 1.1, yMax: 1.2 } as const;

/** Cornering is the high-downforce setting; straight is the low-drag "X-mode" (only cars with active wings change). */
export type AeroMode = 'corner' | 'straight';

/** A sidepod design: three used in 2022, one in 2026, and one for each of the older generations. */
export type PodStyle = 'downwash' | 'scoop' | 'slim' | 'compact' | 'hybrid' | 'v10' | 'turbo';

/** Stations along the car; the shape is smoothed between them (see spline.ts). */
export interface Stations {
  x: readonly number[];
  hw: readonly number[];
  bottom: readonly number[];
  top: readonly number[];
  /** How boxy the cross-section is at each station (lower is boxier, with flatter sides). */
  squareness?: readonly number[];
}

/** One sidepod (the other is its mirror image): inner and outer edge across the car, bottom and top. */
export interface PodShape {
  x: readonly number[];
  zIn: readonly number[];
  zOut: readonly number[];
  bottom: readonly number[];
  top: readonly number[];
}

export interface Wheel {
  x: number;
  radius: number;
  width: number;
  z: number;
}

/** One element of the front wing: stacked above and behind the one before it, swept back toward the tips. */
export interface FrontWingElement {
  /** Leading edge on the middle line. */
  x: number;
  chord: number;
  /** Height on the middle line, and how much higher the tip is (the wing is a shallow V from the front). */
  y: number;
  rise: number;
  /** Degrees at the middle, and how much more at the tip. */
  angle: number;
  dAngle: number;
  camber: number;
  /** Where the element starts out from the middle line (the nose passes between the upper flaps). */
  from: number;
  flap: boolean;
  /** An active element moves: in the straight (low-drag) mode it flattens to `straightAngle` degrees. */
  active?: boolean;
  straightAngle?: number;
  /** Split into this many separate sections across the span (active flaps are built in sections). */
  sections?: number;
}

/** One element of the rear wing: a bowl, lower in the middle and higher toward the end plates. */
export interface RearWingElement {
  x: number;
  chord: number;
  /** Extra chord at the tip. */
  dChord: number;
  y: number;
  rise: number;
  angle: number;
  dAngle: number;
  /** How far the tip trails behind the middle. */
  sweep: number;
  camber: number;
  flap: boolean;
  active?: boolean;
  straightAngle?: number;
}

/** Which material an extra part is made of. */
export type ExtraPart = 'carbon' | 'paint' | 'wing' | 'flap' | 'endplate' | 'dark';

/** A side-view outline: [x, y] points. */
export type Outline = readonly (readonly [number, number])[];

/** A small wing under the main rear wing. */
export interface BeamElement {
  x: number;
  y: number;
  chord: number;
  angle: number;
  camber: number;
  span: number;
}

export interface CarSpec {
  id: 'gen1980s' | 'gen2004' | 'gen2014' | 'gen2022' | 'gen2026';
  /** Short texts for the comparison screen. */
  notes: { label: string; frontWing: string; rearWing: string };
  /** False for the cars from before the halo was made compulsory (2018). */
  halo: boolean;
  /** How the wheels look: flat covers, open spokes or a gold dish; the tire's grooves; the color of the rims. */
  wheelLook: { style: 'cover' | 'spokes' | 'dish'; coverRatio: number; grooves: number; rimColor: string };
  /** The middle of the car's length (x), where the 2D icon is centred. */
  centreX: number;
  paint: typeof PAINT_BOX;
  /** Nose, monocoque, airbox and engine cover in one. */
  spine: Stations;
  /** A wider, lower layer under the airbox and engine cover: the shoulder that slopes down to the sidepods. */
  shoulder: Stations;
  /** The airbox / roll structure standing on the engine cover behind the driver, with a steep front face. */
  airbox: Stations;
  /** The sidepod designs this generation's teams used. */
  pods: Partial<Record<PodStyle, PodShape>>;
  /** The flat floor: half width at each x. It stays inside the wheels at the back. */
  floor: { x: readonly number[]; hw: readonly number[]; y: number; thickness: number };
  /** The curled-up edge along the floor: a wedge between `high` (front) and `low` (back). */
  edgeWing: { xFront: number; xBack: number; low: number; high: number; rampFrom: number; rampSpan: number };
  /** Where the floor sweeps up into the diffuser, and where its dividing fins stand (distance from the middle). */
  diffuser: { xStart: number; xEnd: number; hw: number; rise: number; strakes: readonly number[] };
  /** Thin vertical fences ahead of the sidepods (distances from the middle). */
  fences: readonly number[];
  wheels: { front: Wheel; rear: Wheel };
  frontWing: {
    span: number;
    /** How far the tips are swept back from the middle, and how sharply (a higher power keeps the middle flatter). */
    sweep: number;
    sweepPower: number;
    /** How far the middle of each element's span is pulled back, so every flap curves in (concave) toward the rear. */
    concave: number;
    elements: readonly FrontWingElement[];
    /** Side view of an end plate. */
    endplate: Outline;
    /** A flat plate flaring outward under the end plate. */
    footplate: { x: number; length: number } | null;
    /** Small vertical vanes along the flaps. */
    vanes: boolean;
    /** Pylons holding the wing under a nose that does not reach it. */
    pylons: boolean;
  };
  rearWing: {
    span: number;
    elements: readonly RearWingElement[];
    endplate: Outline;
    /** Flat supports under the wing: a side-view outline, how far from the middle, thickness, and whether mirrored. */
    supports: readonly { outline: Outline; z: number; thickness: number; mirror: boolean }[];
    /** Wings below the main wing (the 2022 beam wing). */
    beam: readonly BeamElement[];
    /** Small boxes: the rear light, actuator pods. */
    boxes: readonly { size: readonly [number, number, number]; at: readonly [number, number, number]; part: 'light' | 'carbon' }[];
  };
  /** Extra parts that only some generations have: shark fins, bargeboards, T-wings, exhaust pipes. */
  extras: {
    plates: readonly { outline: Outline; z: number; thickness: number; mirror: boolean; part: ExtraPart }[];
    wings: readonly { x: number; y: number; chord: number; angle: number; camber: number; span: number; from: number; part: ExtraPart }[];
    rods: readonly { from: readonly [number, number, number]; to: readonly [number, number, number]; radius: number; mirror: boolean; part: ExtraPart }[];
    boxes: readonly { size: readonly [number, number, number]; at: readonly [number, number, number]; mirror: boolean; part: ExtraPart }[];
  };
  details: {
    intake: readonly [number, number];
    /** The cockpit opening and the raised rim around it: where it is, how big, and its height. */
    cockpit: { x: number; rx: number; rz: number; y: number; rimRx: number; rimRz: number };
    /** A mirror: where its housing is (x, y, distance from the middle). */
    mirror: readonly [number, number, number];
    /** x and the height of the camera pod's base, for the generations that have one. */
    cameraPod?: readonly [number, number];
    exhaust: readonly [number, number];
    slats: { x: number; ys: readonly number[] };
  };
}

/** Where a front wing element is at distance `z` from the middle line (either side). */
export function frontWingSection(spec: CarSpec, e: FrontWingElement, z: number, mode: AeroMode = 'corner') {
  const { span, sweep, sweepPower } = spec.frontWing;
  const a = Math.abs(z);
  const t = a / span;
  const centreLift = e.flap ? 0.04 * Math.exp(-((a / 0.4) ** 2)) : 0;
  const flat = mode === 'straight' && e.active;
  return {
    x: e.x - sweep * t ** sweepPower - spec.frontWing.concave * (e.flap ? 1 : 0.5) * Math.sin(Math.PI * t),
    y: e.y + e.rise * t ** 1.6 + centreLift,
    chord: e.chord * (1 - 0.06 * t),
    angleDeg: flat ? (e.straightAngle ?? 3) : e.angle + e.dAngle * t,
  };
}

/** Where a rear wing element is at distance `z` from the middle line (either side). */
export function rearWingSection(spec: CarSpec, e: RearWingElement, z: number, mode: AeroMode = 'corner') {
  const t = Math.abs(z) / spec.rearWing.span;
  const flat = mode === 'straight' && e.active;
  return {
    x: e.x - e.sweep * t * t,
    y: e.y + e.rise * t * t,
    chord: e.chord + e.dChord * t,
    angleDeg: flat ? (e.straightAngle ?? 3) : e.angle + e.dAngle * t,
  };
}

/** The headline numbers of a car, for showing next to it. */
export function specFacts(spec: CarSpec, pod: PodStyle) {
  const { front, rear } = spec.wheels;
  return {
    wheelbase: front.x - rear.x,
    width: 2 * (rear.z + rear.width / 2),
    frontWingWidth: 2 * spec.frontWing.span,
    frontTire: front.width,
    rearTire: rear.width,
    podWidth: 2 * Math.max(...(spec.pods[pod]?.zOut ?? [0])),
  };
}
