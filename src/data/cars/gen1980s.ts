import { PAINT_BOX } from './spec';
import type { CarSpec } from './spec';

// The turbo-era car (1986-88): a 2.86 m wheelbase and 2.1 m wide (the limit then), a slim long nose running straight
// into a small front wing, boxy radiator sidepods, a tall engine cover with a roll-hoop airbox behind the open cockpit,
// big gold dished wheels with slick tires, exposed twin exhaust pipes and a tall rear wing with huge end plates.

export const GEN1980S: CarSpec = {
  id: 'gen1980s',
  notes: { label: '1980s', frontWing: '2 elements, on the nose', rearWing: 'Tall single wing, big end plates' },
  halo: false,
  wheelLook: { style: 'dish', coverRatio: 0.5, grooves: 0, rimColor: '#D4AF37' },
  centreX: 0.3,
  paint: PAINT_BOX,

  spine: {
    x: [2.45, 2.35, 2.1, 1.8, 1.45, 1.1, 0.75, 0.4, 0.05, -0.3, -0.7, -1.05, -1.35, -1.65, -1.9],
    hw: [0.06, 0.09, 0.11, 0.13, 0.15, 0.18, 0.21, 0.23, 0.25, 0.25, 0.24, 0.22, 0.19, 0.14, 0.1],
    bottom: [0.14, 0.14, 0.13, 0.13, 0.12, 0.12, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.11, 0.13, 0.17],
    top: [0.2, 0.22, 0.27, 0.32, 0.38, 0.46, 0.5, 0.52, 0.54, 0.6, 0.66, 0.64, 0.6, 0.5, 0.4],
    squareness: [0.9, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.62, 0.62, 0.65, 0.7, 0.75, 0.75, 0.75, 0.75],
  },
  shoulder: {
    x: [0.0, -0.3, -0.7, -1.05, -1.4, -1.75],
    hw: [0.22, 0.3, 0.34, 0.32, 0.24, 0.12],
    bottom: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    top: [0.56, 0.64, 0.68, 0.64, 0.56, 0.46],
    squareness: [0.85, 0.85, 0.85, 0.85, 0.85, 0.85],
  },
  // the roll-hoop airbox behind the driver
  airbox: {
    x: [0.0, -0.1, -0.3, -0.6, -0.95, -1.25],
    hw: [0.1, 0.12, 0.13, 0.12, 0.1, 0.06],
    bottom: [0.68, 0.66, 0.6, 0.58, 0.58, 0.58],
    top: [0.8, 0.92, 0.96, 0.92, 0.78, 0.66],
    squareness: [0.7, 0.7, 0.7, 0.75, 0.8, 0.8],
  },

  pods: {
    turbo: {
      x: [0.7, 0.5, 0.15, -0.3, -0.75, -1.15, -1.5, -1.7],
      zIn: [0.17, 0.17, 0.18, 0.18, 0.16, 0.12, 0.09, 0.07],
      zOut: [0.45, 0.58, 0.64, 0.64, 0.58, 0.46, 0.3, 0.16],
      bottom: [0.14, 0.12, 0.11, 0.11, 0.11, 0.12, 0.14, 0.18],
      top: [0.4, 0.5, 0.54, 0.54, 0.5, 0.42, 0.34, 0.26],
    },
  },

  floor: {
    x: [1.2, 1.0, 0.7, 0.35, 0.0, -0.5, -0.95, -1.25, -1.45],
    hw: [0.24, 0.34, 0.44, 0.5, 0.52, 0.52, 0.5, 0.46, 0.42],
    y: 0.04,
    thickness: 0.03,
  },
  edgeWing: { xFront: 1.0, xBack: -1.4, low: 0.015, high: 0.02, rampFrom: -0.6, rampSpan: 1.7 },
  diffuser: { xStart: -1.45, xEnd: -1.85, hw: 0.4, rise: 0.18, strakes: [0.14] },
  fences: [],

  // 13-inch wheels, slicks: 270 mm front, 420 mm rear, on a 2.1 m wide car
  wheels: {
    front: { x: 1.43, radius: 0.315, width: 0.27, z: 0.84 },
    rear: { x: -1.43, radius: 0.335, width: 0.42, z: 0.84 },
  },

  // a small wing on the nose
  frontWing: {
    span: 0.95,
    sweep: 0.03,
    sweepPower: 1.4,
    concave: 0.01,
    elements: [
      { x: 2.5, chord: 0.4, y: 0.08, rise: 0.02, angle: 5, dAngle: 2, camber: 0.04, from: 0, flap: false },
      { x: 2.33, chord: 0.28, y: 0.14, rise: 0.05, angle: 16, dAngle: 4, camber: 0.07, from: 0.1, flap: true },
    ],
    endplate: [[2.52, 0.06], [2.52, 0.3], [2.38, 0.4], [2.1, 0.43], [2.03, 0.3], [2.06, 0.12], [2.15, 0.07]],
    footplate: null,
    vanes: false,
    pylons: false,
  },

  // one tall wing with huge end plates
  rearWing: {
    span: 0.52,
    elements: [
      { x: -1.38, chord: 0.36, dChord: 0.02, y: 0.78, rise: 0, angle: 7, dAngle: 2, sweep: 0, camber: 0.06, flap: false },
      { x: -1.55, chord: 0.3, dChord: 0.02, y: 0.92, rise: 0, angle: 22, dAngle: 3, sweep: 0, camber: 0.1, flap: true },
    ],
    endplate: [[-1.36, 0.55], [-1.84, 0.55], [-1.87, 0.8], [-1.84, 1.05], [-1.5, 1.07], [-1.4, 0.98]],
    supports: [{ outline: [[-1.25, 0.5], [-1.38, 0.5], [-1.58, 0.82], [-1.48, 0.84]], z: 0, thickness: 0.1, mirror: false }],
    beam: [],
    boxes: [],
  },

  extras: {
    plates: [],
    wings: [],
    // the two turbo exhaust pipes pointing back past the gearbox
    rods: [{ from: [-1.6, 0.44, 0.07], to: [-1.95, 0.48, 0.1], radius: 0.04, mirror: true, part: 'carbon' }],
    boxes: [
      // the exposed gearbox casing at the back
      { size: [0.3, 0.2, 0.22], at: [-1.6, 0.36, 0], mirror: false, part: 'dark' },
      // the headrest behind the driver
      { size: [0.12, 0.1, 0.2], at: [-0.12, 0.6, 0], mirror: false, part: 'dark' },
    ],
  },

  details: {
    cockpit: { x: 0.3, rx: 0.36, rz: 0.16, y: 0.54, rimRx: 0.4, rimRz: 0.18 },
    mirror: [0.55, 0.64, 0.3],
    intake: [-0.03, 0.64],
    exhaust: [-1.95, 0.4],
    slats: { x: -0.8, ys: [] },
  },
};
