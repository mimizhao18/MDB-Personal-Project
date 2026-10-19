import { PAINT_BOX } from './spec';
import type { CarSpec } from './spec';

// The 2022 (ground effect) car: a long wheelbase (3.6 m), 2.0 m wide, with a wide arrow-shaped four-element front wing,
// big sidepods over a large tunnel floor, a bowl-shaped rear wing with a DRS flap and a separate beam wing below it.
// This is the reference the 2026 car (gen2026.ts) is compared with, so change it only to correct it.

export const GEN2022: CarSpec = {
  id: 'gen2022',
  notes: { label: '2022', frontWing: '4 elements, fixed', rearWing: 'Fixed, DRS flap' },
  halo: true,
  wheelLook: { style: 'cover', coverRatio: 0.6, grooves: 0, rimColor: '#9A9DA3' },
  centreX: 0.15,
  paint: PAINT_BOX,

  spine: {
    x: [2.92, 2.82, 2.6, 2.3, 1.95, 1.55, 1.15, 0.8, 0.45, 0.15, -0.15, -0.45, -0.9, -1.4, -1.9, -2.3],
    hw: [0.06, 0.085, 0.11, 0.135, 0.16, 0.185, 0.21, 0.235, 0.26, 0.27, 0.23, 0.2, 0.2, 0.16, 0.12, 0.08],
    bottom: [0.09, 0.1, 0.12, 0.15, 0.17, 0.17, 0.15, 0.13, 0.1, 0.1, 0.1, 0.1, 0.1, 0.11, 0.14, 0.2],
    top: [0.15, 0.185, 0.24, 0.3, 0.37, 0.46, 0.57, 0.64, 0.62, 0.64, 0.7, 0.93, 0.8, 0.64, 0.5, 0.4],
    squareness: [0.9, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.6, 0.62, 0.7, 0.8, 0.8, 0.75, 0.75, 0.75],
  },

  // the shoulder behind the cockpit: wide at the base of the airbox, sloping down toward the tail
  shoulder: {
    x: [0.1, -0.15, -0.45, -0.9, -1.4, -1.8],
    hw: [0.22, 0.31, 0.35, 0.3, 0.22, 0.12],
    bottom: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    top: [0.66, 0.72, 0.86, 0.76, 0.6, 0.46],
    squareness: [0.85, 0.85, 0.85, 0.85, 0.85, 0.85],
  },

  // Teams went different ways in 2022: a downwash ramp, a scooped channel beside the cockpit, or very slim pods.
  pods: {
    downwash: {
      x: [0.95, 0.7, 0.3, -0.2, -0.7, -1.2, -1.7, -2.05],
      zIn: [0.18, 0.18, 0.2, 0.2, 0.18, 0.14, 0.1, 0.08],
      zOut: [0.46, 0.6, 0.7, 0.72, 0.62, 0.45, 0.28, 0.16],
      bottom: [0.2, 0.16, 0.13, 0.12, 0.12, 0.12, 0.14, 0.2],
      top: [0.5, 0.64, 0.66, 0.62, 0.52, 0.4, 0.3, 0.26],
    },
    scoop: {
      x: [0.95, 0.7, 0.3, -0.2, -0.7, -1.2, -1.7, -2.05],
      zIn: [0.2, 0.24, 0.27, 0.27, 0.24, 0.18, 0.12, 0.08],
      zOut: [0.5, 0.64, 0.74, 0.74, 0.64, 0.46, 0.28, 0.16],
      bottom: [0.24, 0.18, 0.14, 0.13, 0.12, 0.12, 0.14, 0.2],
      top: [0.52, 0.66, 0.66, 0.6, 0.5, 0.4, 0.3, 0.26],
    },
    slim: {
      x: [0.95, 0.7, 0.3, -0.2, -0.7, -1.2, -1.7, -2.05],
      zIn: [0.18, 0.17, 0.17, 0.15, 0.13, 0.1, 0.08, 0.06],
      zOut: [0.38, 0.46, 0.5, 0.46, 0.38, 0.28, 0.18, 0.12],
      bottom: [0.22, 0.2, 0.16, 0.14, 0.14, 0.14, 0.15, 0.2],
      top: [0.42, 0.52, 0.54, 0.48, 0.4, 0.32, 0.26, 0.24],
    },
  },

  airbox: {
    x: [0.06, -0.02, -0.2, -0.5, -0.9, -1.25],
    hw: [0.1, 0.125, 0.14, 0.13, 0.1, 0.05],
    bottom: [0.74, 0.72, 0.62, 0.6, 0.6, 0.6],
    top: [0.9, 1.0, 1.03, 0.97, 0.8, 0.66],
    squareness: [0.7, 0.7, 0.7, 0.75, 0.8, 0.8],
  },

  floor: {
    x: [1.5, 1.3, 1.0, 0.5, 0.0, -0.6, -1.0, -1.35, -1.55],
    hw: [0.28, 0.42, 0.62, 0.76, 0.78, 0.74, 0.65, 0.56, 0.54],
    y: 0.035,
    thickness: 0.03,
  },
  // a tall wedge at the front, low at the back
  edgeWing: { xFront: 1.35, xBack: -1.4, low: 0.045, high: 0.145, rampFrom: -0.6, rampSpan: 1.7 },
  diffuser: { xStart: -1.55, xEnd: -2.3, hw: 0.5, rise: 0.3, strakes: [0.17, 0.34] },
  fences: [0.42, 0.52, 0.62],

  wheels: {
    front: { x: 1.8, radius: 0.36, width: 0.305, z: 0.81 },
    rear: { x: -1.8, radius: 0.365, width: 0.405, z: 0.8 },
  },

  // A wide arrow-shaped wing, slightly wider than the front tires.
  frontWing: {
    span: 1.0,
    sweep: 0.32,
    sweepPower: 1.4,
    concave: 0.07,
    elements: [
      { x: 2.95, chord: 0.36, y: 0.06, rise: 0.06, angle: 2, dAngle: 4, camber: 0.03, from: 0, flap: false },
      { x: 2.78, chord: 0.26, y: 0.115, rise: 0.09, angle: 12, dAngle: 8, camber: 0.07, from: 0.11, flap: true },
      { x: 2.66, chord: 0.22, y: 0.17, rise: 0.11, angle: 20, dAngle: 8, camber: 0.08, from: 0.15, flap: true },
      { x: 2.56, chord: 0.18, y: 0.225, rise: 0.12, angle: 28, dAngle: 6, camber: 0.08, from: 0.2, flap: true },
    ],
    // low and short at the front, tall at the back
    endplate: [[2.66, 0.05], [2.67, 0.14], [2.55, 0.24], [2.35, 0.35], [2.15, 0.41], [2.04, 0.4], [2.03, 0.3], [2.07, 0.16], [2.2, 0.09], [2.4, 0.06]],
    footplate: { x: 2.35, length: 0.5 },
    vanes: true,
    pylons: false, // the nose runs all the way into the wing
  },

  // A wide wing on two thin pillars, with big swept end plates, a DRS flap, and a beam wing below.
  rearWing: {
    span: 0.55,
    elements: [
      { x: -2.15, chord: 0.34, dChord: 0.06, y: 0.66, rise: 0.1, angle: 8, dAngle: 6, sweep: 0.1, camber: 0.06, flap: false },
      { x: -2.32, chord: 0.28, dChord: 0.06, y: 0.76, rise: 0.14, angle: 20, dAngle: 8, sweep: 0.1, camber: 0.1, flap: true },
    ],
    endplate: [[-2.1, 0.42], [-2.5, 0.44], [-2.7, 0.7], [-2.76, 0.96], [-2.66, 1.05], [-2.42, 1.04], [-2.2, 0.98], [-2.1, 0.86]],
    supports: [{ outline: [[-1.98, 0.46], [-2.06, 0.46], [-2.3, 0.7], [-2.2, 0.72]], z: 0.09, thickness: 0.02, mirror: true }],
    beam: [
      { x: -2.1, y: 0.42, chord: 0.17, angle: 8, camber: 0.05, span: 0.5 },
      { x: -2.16, y: 0.5, chord: 0.14, angle: 14, camber: 0.06, span: 0.5 },
    ],
    boxes: [
      { size: [0.03, 0.07, 0.12], at: [-2.38, 0.56, 0], part: 'light' },
      { size: [0.12, 0.05, 0.08], at: [-2.4, 0.86, 0], part: 'carbon' }, // DRS actuator pod on the flap
      { size: [0.06, 0.2, 0.03], at: [-2.32, 0.62, 0], part: 'carbon' }, // centre support below the wing
    ],
  },

  extras: { plates: [], wings: [], rods: [], boxes: [] },

  details: {
    cockpit: { x: 0.5, rx: 0.42, rz: 0.18, y: 0.625, rimRx: 0.46, rimRz: 0.2 },
    mirror: [0.7, 0.74, 0.4],
    intake: [-0.03, 0.69],
    cameraPod: [-0.3, 1.03],
    exhaust: [-2.3, 0.42],
    slats: { x: -0.8, ys: [0.6, 0.67, 0.74] },
  },
};
