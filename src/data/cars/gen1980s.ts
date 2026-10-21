import { PAINT_BOX } from './spec';
import type { CarSpec } from './spec';

// The turbo-era car, drawn as the 1988 McLaren MP4/4 (reference/gen1980s/): a 2.875 m wheelbase, 2.13 m wide, only
// 0.94 m high, a low flat wedge nose onto a plank front wing with big flat end plates, long box sidepods with upright
// inlets, a low engine cover with a slim roll hoop behind the open cockpit, 13-inch wheels with slicks (the rears much
// wider than the fronts), and a wide rear wing on tall flat end plates well behind the rear axle.

export const GEN1980S: CarSpec = {
  id: 'gen1980s',
  notes: { label: '1980s', frontWing: '2 elements, on the nose', rearWing: 'Tall single wing, big end plates' },
  halo: false,
  wheelLook: { style: 'dish', coverRatio: 0.5, grooves: 0, rimColor: '#34343A' },
  centreX: 0.3,
  paint: PAINT_BOX,

  spine: {
    x: [2.45, 2.32, 2.05, 1.75, 1.4, 1.05, 0.78, 0.48, 0.18, -0.1, -0.45, -0.85, -1.25, -1.55, -1.85],
    hw: [0.07, 0.09, 0.115, 0.14, 0.16, 0.19, 0.22, 0.24, 0.25, 0.22, 0.2, 0.18, 0.15, 0.11, 0.08],
    bottom: [0.13, 0.13, 0.13, 0.12, 0.12, 0.11, 0.1, 0.1, 0.1, 0.11, 0.11, 0.12, 0.14, 0.18, 0.22],
    top: [0.19, 0.22, 0.27, 0.33, 0.4, 0.48, 0.58, 0.68, 0.72, 0.74, 0.7, 0.64, 0.56, 0.5, 0.44],
    squareness: [0.7, 0.5, 0.38, 0.32, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
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
    x: [0.04, -0.1, -0.3, -0.55, -0.8, -0.9],
    hw: [0.05, 0.06, 0.06, 0.055, 0.04, 0.03],
    bottom: [0.66, 0.66, 0.66, 0.66, 0.66, 0.66],
    top: [0.88, 0.94, 0.93, 0.8, 0.68, 0.66],
    squareness: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
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

  // 13-inch wheels, 660 mm slicks: 255 mm front on a 1.82 m track, 355 mm rear on a 1.67 m track
  wheels: {
    front: { x: 1.43, radius: 0.32, width: 0.26, z: 0.91 },
    rear: { x: -1.43, radius: 0.33, width: 0.36, z: 0.835 },
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
    endplate: [[2.55, 0.06], [2.55, 0.34], [2.3, 0.38], [2.05, 0.38], [2.02, 0.06]],
    footplate: null,
    vanes: false,
    pylons: false,
  },

  // one tall wing with huge end plates
  rearWing: {
    span: 0.52,
    elements: [
      { x: -1.4, chord: 0.36, dChord: 0.0, y: 0.7, rise: 0, angle: 7, dAngle: 1, sweep: 0, camber: 0.06, flap: false },
      { x: -1.58, chord: 0.26, dChord: 0.0, y: 0.82, rise: 0, angle: 22, dAngle: 2, sweep: 0, camber: 0.1, flap: true },
    ],
    endplate: [[-1.3, 0.42], [-1.86, 0.42], [-1.86, 0.94], [-1.32, 0.94]],
    supports: [{ outline: [[-1.25, 0.46], [-1.38, 0.46], [-1.58, 0.74], [-1.48, 0.76]], z: 0, thickness: 0.1, mirror: false }],
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
