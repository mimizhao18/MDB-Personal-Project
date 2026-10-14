// Measurements of the 2022 (ground effect) car, in metres. x runs from the tail (negative) to the nose (positive),
// z is across the car (right side positive) and y is up from the ground. Shared by the 3D model and the 2D race icon.
// Each table is a list of stations along the car and is smoothed between them (see spline.ts).

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
}

export type PodStyle = 'downwash' | 'scoop' | 'slim';

type Outline = readonly (readonly [number, number])[];

export const GEN2022 = {
  /** The box the livery pictures cover: x from tail to nose, z across, y up. */
  paint: { xMin: -2.8, xMax: 3.1, zHalf: 1.1, yMax: 1.2 },

  /** Nose, monocoque, airbox and engine cover in one: half width and bottom/top height at each x. */
  spine: {
    x: [2.92, 2.82, 2.6, 2.3, 1.95, 1.55, 1.15, 0.8, 0.45, 0.15, -0.15, -0.45, -0.9, -1.4, -1.9, -2.3],
    hw: [0.06, 0.085, 0.11, 0.135, 0.16, 0.185, 0.21, 0.235, 0.26, 0.27, 0.23, 0.2, 0.2, 0.16, 0.12, 0.08],
    bottom: [0.09, 0.1, 0.12, 0.15, 0.17, 0.17, 0.15, 0.13, 0.1, 0.1, 0.1, 0.1, 0.1, 0.11, 0.14, 0.2],
    top: [0.15, 0.185, 0.24, 0.3, 0.37, 0.46, 0.57, 0.64, 0.62, 0.64, 0.85, 0.98, 0.88, 0.67, 0.5, 0.4],
  },

  /**
   * Sidepod shapes (one pod; the other is its mirror image): inner and outer edge across the car, bottom and top.
   * Teams went different ways in 2022: a downwash ramp, a scooped channel beside the cockpit, or very slim pods.
   */
  pods: {
    downwash: {
      x: [0.95, 0.7, 0.3, -0.2, -0.7, -1.2, -1.7, -2.05],
      zIn: [0.18, 0.18, 0.2, 0.2, 0.18, 0.14, 0.1, 0.08],
      zOut: [0.46, 0.6, 0.7, 0.72, 0.62, 0.45, 0.28, 0.16],
      bottom: [0.2, 0.16, 0.13, 0.12, 0.12, 0.12, 0.14, 0.2],
      top: [0.5, 0.62, 0.62, 0.56, 0.46, 0.34, 0.26, 0.24],
    },
    scoop: {
      x: [0.95, 0.7, 0.3, -0.2, -0.7, -1.2, -1.7, -2.05],
      zIn: [0.2, 0.24, 0.27, 0.27, 0.24, 0.18, 0.12, 0.08],
      zOut: [0.5, 0.64, 0.74, 0.74, 0.64, 0.46, 0.28, 0.16],
      bottom: [0.24, 0.18, 0.14, 0.13, 0.12, 0.12, 0.14, 0.2],
      top: [0.52, 0.64, 0.62, 0.54, 0.44, 0.34, 0.26, 0.24],
    },
    slim: {
      x: [0.95, 0.7, 0.3, -0.2, -0.7, -1.2, -1.7, -2.05],
      zIn: [0.18, 0.17, 0.17, 0.15, 0.13, 0.1, 0.08, 0.06],
      zOut: [0.38, 0.46, 0.5, 0.46, 0.38, 0.28, 0.18, 0.12],
      bottom: [0.22, 0.2, 0.16, 0.14, 0.14, 0.14, 0.15, 0.2],
      top: [0.42, 0.5, 0.5, 0.42, 0.34, 0.26, 0.22, 0.22],
    },
  },

  /** The flat floor: half width at each x. It stays inside the wheels at the back. */
  floor: {
    x: [1.5, 1.3, 1.0, 0.5, 0.0, -0.6, -1.0, -1.35, -1.55],
    hw: [0.28, 0.42, 0.62, 0.76, 0.78, 0.74, 0.65, 0.56, 0.54],
    y: 0.035,
    thickness: 0.03,
  },

  /** Where the floor sweeps up into the diffuser at the back. */
  diffuser: { xStart: -1.55, xEnd: -2.3, hw: 0.5, rise: 0.3 },

  wheels: {
    front: { x: 1.8, radius: 0.36, width: 0.305, z: 0.81 },
    rear: { x: -1.8, radius: 0.365, width: 0.405, z: 0.8 },
  },

  /** A wide arrow-shaped wing, slightly wider than the front tires. */
  frontWing: {
    span: 1.0,
    /** How far the tips are swept back from the middle, and how sharply (a higher power keeps the middle flatter). */
    sweep: 0.32,
    sweepPower: 1.4,
    elements: [
      { x: 2.95, chord: 0.36, y: 0.06, rise: 0.06, angle: 2, dAngle: 4, camber: 0.03, from: 0, flap: false },
      { x: 2.78, chord: 0.26, y: 0.115, rise: 0.09, angle: 12, dAngle: 8, camber: 0.07, from: 0.11, flap: true },
      { x: 2.66, chord: 0.22, y: 0.17, rise: 0.11, angle: 20, dAngle: 8, camber: 0.08, from: 0.15, flap: true },
      { x: 2.56, chord: 0.18, y: 0.225, rise: 0.12, angle: 28, dAngle: 6, camber: 0.08, from: 0.2, flap: true },
    ] as readonly FrontWingElement[],
    /** Side view of an end plate: low and short at the front, tall at the back. */
    endplate: [[2.66, 0.05], [2.67, 0.14], [2.55, 0.24], [2.35, 0.35], [2.15, 0.41], [2.04, 0.4], [2.03, 0.3], [2.07, 0.16], [2.2, 0.09], [2.4, 0.06]] as Outline,
  },

  /** A wide wing on two thin pillars, with big swept end plates. */
  rearWing: {
    span: 0.55,
    elements: [
      { x: -2.15, chord: 0.34, dChord: 0.06, y: 0.66, rise: 0.1, angle: 8, dAngle: 6, sweep: 0.1, camber: 0.06, flap: false },
      { x: -2.32, chord: 0.28, dChord: 0.06, y: 0.76, rise: 0.14, angle: 20, dAngle: 8, sweep: 0.1, camber: 0.1, flap: true },
    ] as readonly RearWingElement[],
    endplate: [[-2.1, 0.42], [-2.5, 0.44], [-2.7, 0.7], [-2.76, 0.96], [-2.66, 1.05], [-2.42, 1.04], [-2.2, 0.98], [-2.1, 0.86]] as Outline,
  },
} as const;

/** Where a front wing element is at distance `z` from the middle line (either side). */
export function frontWingSection(e: FrontWingElement, z: number) {
  const { span, sweep, sweepPower } = GEN2022.frontWing;
  const a = Math.abs(z);
  const t = a / span;
  const centreLift = e.flap ? 0.04 * Math.exp(-((a / 0.4) ** 2)) : 0;
  return {
    x: e.x - sweep * t ** sweepPower,
    y: e.y + e.rise * t ** 1.6 + centreLift,
    chord: e.chord * (1 - 0.06 * t),
    angleDeg: e.angle + e.dAngle * t,
  };
}

/** Where a rear wing element is at distance `z` from the middle line (either side). */
export function rearWingSection(e: RearWingElement, z: number) {
  const t = Math.abs(z) / GEN2022.rearWing.span;
  return {
    x: e.x - e.sweep * t * t,
    y: e.y + e.rise * t * t,
    chord: e.chord + e.dChord * t,
    angleDeg: e.angle + e.dAngle * t,
  };
}
