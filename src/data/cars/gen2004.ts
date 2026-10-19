import { PAINT_BOX } from './spec';
import type { CarSpec } from './spec';

// The V10-era car (2004): a shorter 3.1 m wheelbase and 1.8 m wide, grooved tires on 13-inch spoked wheels, a high nose
// carrying a narrow front wing on two pylons, a tall periscope airbox over the driver, rounded sidepods with turning
// vanes ahead of them, a tall rear wing with a small "monkey seat" wing below it, and an open cockpit (no halo).

export const GEN2004: CarSpec = {
  id: 'gen2004',
  notes: { label: '2004', frontWing: '3 elements, high nose', rearWing: 'Tall, two elements, small beam wing' },
  halo: false,
  wheelLook: { style: 'spokes', coverRatio: 0.5, grooves: 3, rimColor: '#B8B8BE' },
  centreX: 0.17,
  paint: PAINT_BOX,

  spine: {
    x: [2.3, 2.1, 1.85, 1.55, 1.25, 0.95, 0.65, 0.35, 0.05, -0.25, -0.5, -0.95, -1.4, -1.75, -1.95],
    hw: [0.045, 0.07, 0.1, 0.13, 0.165, 0.2, 0.22, 0.23, 0.23, 0.22, 0.21, 0.17, 0.12, 0.08, 0.06],
    bottom: [0.34, 0.34, 0.31, 0.27, 0.22, 0.17, 0.12, 0.1, 0.1, 0.1, 0.1, 0.11, 0.14, 0.19, 0.24],
    top: [0.44, 0.46, 0.5, 0.56, 0.63, 0.7, 0.77, 0.81, 0.82, 0.82, 0.8, 0.72, 0.62, 0.54, 0.48],
    squareness: [0.9, 0.85, 0.8, 0.78, 0.76, 0.74, 0.72, 0.7, 0.7, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78],
  },
  shoulder: {
    x: [0.05, -0.2, -0.55, -0.95, -1.4, -1.75],
    hw: [0.2, 0.28, 0.31, 0.27, 0.2, 0.1],
    bottom: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    top: [0.72, 0.78, 0.86, 0.82, 0.74, 0.64],
    squareness: [0.85, 0.85, 0.85, 0.85, 0.85, 0.85],
  },
  // the tall periscope intake above the driver's head
  airbox: {
    x: [0.05, -0.05, -0.3, -0.65, -1.05, -1.4],
    hw: [0.12, 0.14, 0.145, 0.13, 0.09, 0.04],
    bottom: [0.8, 0.76, 0.72, 0.68, 0.64, 0.62],
    top: [1.02, 1.15, 1.17, 1.1, 0.96, 0.8],
    squareness: [0.5, 0.5, 0.5, 0.55, 0.6, 0.7],
  },

  pods: {
    v10: {
      x: [0.85, 0.65, 0.3, -0.15, -0.65, -1.15, -1.6, -1.9],
      zIn: [0.18, 0.18, 0.19, 0.19, 0.17, 0.13, 0.09, 0.07],
      zOut: [0.45, 0.54, 0.6, 0.6, 0.52, 0.38, 0.22, 0.12],
      bottom: [0.16, 0.13, 0.11, 0.11, 0.11, 0.12, 0.14, 0.18],
      top: [0.5, 0.6, 0.64, 0.62, 0.56, 0.46, 0.38, 0.32],
    },
  },

  floor: {
    x: [1.3, 1.1, 0.8, 0.4, 0.0, -0.5, -0.9, -1.25, -1.5],
    hw: [0.26, 0.38, 0.5, 0.58, 0.6, 0.58, 0.52, 0.46, 0.44],
    y: 0.035,
    thickness: 0.03,
  },
  edgeWing: { xFront: 1.2, xBack: -1.3, low: 0.02, high: 0.035, rampFrom: -0.6, rampSpan: 1.7 },
  diffuser: { xStart: -1.5, xEnd: -1.95, hw: 0.42, rise: 0.26, strakes: [0.14, 0.28] },
  fences: [],

  // 13-inch wheels, grooved tires: 280 mm front, 380 mm rear, on a 1.8 m wide car
  wheels: {
    front: { x: 1.55, radius: 0.33, width: 0.28, z: 0.75 },
    rear: { x: -1.55, radius: 0.335, width: 0.38, z: 0.71 },
  },

  // a narrow wing (1.44 m), narrower than the tires, hung low from a high nose
  frontWing: {
    span: 0.72,
    sweep: 0.05,
    sweepPower: 1.4,
    concave: 0.02,
    elements: [
      { x: 2.48, chord: 0.32, y: 0.07, rise: 0.04, angle: 4, dAngle: 2, camber: 0.04, from: 0, flap: false },
      { x: 2.25, chord: 0.25, y: 0.13, rise: 0.06, angle: 14, dAngle: 6, camber: 0.07, from: 0.1, flap: true },
      { x: 2.09, chord: 0.2, y: 0.18, rise: 0.08, angle: 22, dAngle: 6, camber: 0.07, from: 0.14, flap: true },
    ],
    endplate: [[2.51, 0.05], [2.51, 0.2], [2.28, 0.3], [2.01, 0.32], [1.93, 0.2], [1.99, 0.08], [2.23, 0.05]],
    footplate: { x: 2.18, length: 0.45 },
    vanes: false,
    pylons: true,
  },

  rearWing: {
    span: 0.5,
    elements: [
      { x: -1.64, chord: 0.32, dChord: 0.04, y: 0.74, rise: 0.04, angle: 8, dAngle: 3, sweep: 0.03, camber: 0.06, flap: false },
      { x: -1.79, chord: 0.26, dChord: 0.03, y: 0.87, rise: 0.05, angle: 24, dAngle: 4, sweep: 0.03, camber: 0.1, flap: true },
    ],
    endplate: [[-1.54, 0.4], [-2.04, 0.4], [-2.09, 0.65], [-2.07, 0.94], [-1.74, 0.96], [-1.57, 0.88]],
    supports: [{ outline: [[-1.42, 0.45], [-1.54, 0.45], [-1.74, 0.78], [-1.64, 0.8]], z: 0, thickness: 0.08, mirror: false }],
    beam: [{ x: -1.62, y: 0.46, chord: 0.18, angle: 10, camber: 0.05, span: 0.4 }],
    boxes: [{ size: [0.03, 0.06, 0.1], at: [-1.87, 0.5, 0], part: 'light' }],
  },

  extras: {
    plates: [
      // turning vanes ahead of the sidepods
      { outline: [[1.15, 0.07], [1.12, 0.24], [0.98, 0.32], [0.82, 0.28], [0.8, 0.07]], z: 0.3, thickness: 0.008, mirror: true, part: 'carbon' },
      { outline: [[1.1, 0.07], [1.06, 0.2], [0.94, 0.27], [0.8, 0.24], [0.78, 0.07]], z: 0.4, thickness: 0.008, mirror: true, part: 'carbon' },
      { outline: [[1.05, 0.07], [1.0, 0.16], [0.9, 0.21], [0.78, 0.19], [0.76, 0.07]], z: 0.5, thickness: 0.008, mirror: true, part: 'carbon' },
    ],
    // small winglets above the front of the sidepods
    wings: [{ x: 0.55, y: 0.56, chord: 0.13, angle: 8, camber: 0.04, span: 0.42, from: 0.25, part: 'carbon' }],
    rods: [],
    boxes: [
      // the headrest behind the driver
      { size: [0.12, 0.1, 0.22], at: [0.0, 0.84, 0], mirror: false, part: 'dark' },
    ],
  },

  details: {
    cockpit: { x: 0.38, rx: 0.38, rz: 0.17, y: 0.76, rimRx: 0.42, rimRz: 0.19 },
    mirror: [0.55, 0.86, 0.36],
    intake: [-0.04, 0.86],
    exhaust: [-1.85, 0.4],
    slats: { x: -0.8, ys: [] },
  },
};
