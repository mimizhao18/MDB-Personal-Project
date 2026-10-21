import { PAINT_BOX } from './spec';
import type { CarSpec } from './spec';

// The 2014 car, drawn as the Mercedes F1 W05 Hybrid (reference/gen2014/): 3.6 m wheelbase, 1.8 m wide, 0.95 m high,
// 13-inch open-spoke wheels with tall sidewalls (245 / 325 tyres), a low finger nose on pylons, a 1.65 m front wing
// with big end plates and cascades, small bargeboards ahead of undercut sidepods, a plain engine cover with a single
// exhaust in the tail, no halo, and a narrow (750 mm) DRS rear wing with no beam wing.

export const GEN2014: CarSpec = {
  id: 'gen2014',
  notes: { label: '2014', frontWing: '4 elements, low finger nose', rearWing: 'Narrow, DRS flap, no beam wing' },
  halo: false,
  // a 13-inch rim on a 670 mm tyre: the rim is only half the wheel, the sidewall is tall
  wheelLook: { style: 'spokes', coverRatio: 0.5, grooves: 0, rimColor: '#8C8F95' },
  centreX: 0.18,
  paint: PAINT_BOX,

  spine: {
    x: [2.75, 2.65, 2.45, 2.2, 1.85, 1.5, 1.1, 0.8, 0.45, 0.15, -0.1, -0.5, -0.95, -1.4, -1.9, -2.3],
    hw: [0.05, 0.08, 0.11, 0.14, 0.16, 0.18, 0.2, 0.23, 0.25, 0.26, 0.23, 0.22, 0.17, 0.12, 0.09, 0.06],
    bottom: [0.17, 0.18, 0.2, 0.2, 0.19, 0.17, 0.14, 0.12, 0.1, 0.1, 0.1, 0.1, 0.12, 0.14, 0.18, 0.26],
    top: [0.25, 0.29, 0.36, 0.44, 0.5, 0.56, 0.61, 0.65, 0.68, 0.72, 0.78, 0.94, 0.86, 0.72, 0.56, 0.42],
    squareness: [0.9, 0.85, 0.8, 0.75, 0.72, 0.7, 0.66, 0.64, 0.64, 0.66, 0.7, 0.8, 0.8, 0.8, 0.8, 0.8],
  },
  shoulder: {
    x: [0.1, -0.15, -0.5, -0.95, -1.4, -1.9],
    hw: [0.2, 0.3, 0.34, 0.3, 0.22, 0.12],
    bottom: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    top: [0.66, 0.72, 0.86, 0.8, 0.66, 0.5],
    squareness: [0.85, 0.85, 0.85, 0.85, 0.85, 0.85],
  },
  airbox: {
    x: [0.06, -0.02, -0.2, -0.55, -1.0, -1.4],
    hw: [0.11, 0.135, 0.15, 0.14, 0.11, 0.06],
    bottom: [0.74, 0.72, 0.62, 0.6, 0.6, 0.6],
    top: [0.9, 1.0, 1.05, 1.0, 0.86, 0.72],
    squareness: [0.7, 0.7, 0.7, 0.75, 0.8, 0.8],
  },

  pods: {
    hybrid: {
      x: [1.0, 0.75, 0.35, -0.15, -0.7, -1.2, -1.75, -2.1],
      zIn: [0.2, 0.2, 0.22, 0.22, 0.2, 0.15, 0.1, 0.08],
      zOut: [0.5, 0.62, 0.7, 0.72, 0.62, 0.44, 0.27, 0.15],
      bottom: [0.17, 0.14, 0.12, 0.12, 0.12, 0.12, 0.14, 0.2],
      top: [0.48, 0.58, 0.62, 0.6, 0.5, 0.38, 0.3, 0.26],
    },
  },

  floor: {
    x: [1.45, 1.25, 0.95, 0.5, 0.0, -0.6, -1.0, -1.35, -1.6],
    hw: [0.28, 0.42, 0.6, 0.7, 0.72, 0.68, 0.6, 0.54, 0.52],
    y: 0.035,
    thickness: 0.03,
  },
  edgeWing: { xFront: 1.2, xBack: -1.4, low: 0.04, high: 0.09, rampFrom: -0.6, rampSpan: 1.7 },
  diffuser: { xStart: -1.6, xEnd: -2.35, hw: 0.5, rise: 0.26, strakes: [0.15, 0.3] },
  fences: [],

  // 13-inch wheels (a tall sidewall), the 2014 tyres: 245 mm front, 325 mm rear, on a 1.8 m wide car
  wheels: {
    front: { x: 1.8, radius: 0.33, width: 0.245, z: 0.7775 },
    rear: { x: -1.8, radius: 0.33, width: 0.325, z: 0.7375 },
  },

  // 1.65 m wide (the 2014 rule), with big end plates and cascades
  frontWing: {
    span: 0.825,
    sweep: 0.2,
    sweepPower: 1.4,
    concave: 0.05,
    elements: [
      { x: 2.98, chord: 0.3, y: 0.06, rise: 0.08, angle: 2, dAngle: 4, camber: 0.03, from: 0, flap: false },
      { x: 2.8, chord: 0.24, y: 0.12, rise: 0.14, angle: 10, dAngle: 10, camber: 0.07, from: 0.12, flap: true },
      { x: 2.68, chord: 0.2, y: 0.17, rise: 0.2, angle: 18, dAngle: 12, camber: 0.08, from: 0.16, flap: true },
      { x: 2.58, chord: 0.17, y: 0.22, rise: 0.24, angle: 26, dAngle: 8, camber: 0.08, from: 0.2, flap: true },
    ],
    endplate: [[2.9, 0.05], [2.9, 0.16], [2.78, 0.26], [2.5, 0.34], [2.2, 0.4], [2.05, 0.4], [2.04, 0.3], [2.1, 0.16], [2.3, 0.1], [2.6, 0.06]],
    footplate: { x: 2.45, length: 0.5 },
    vanes: true,
    pylons: true,
  },

  // 750 mm wide and no higher than 950 mm (the 2014 rule), nearly flat, on a single swan-neck pillar, no beam wing
  rearWing: {
    span: 0.375,
    elements: [
      { x: -2.2, chord: 0.3, dChord: 0.04, y: 0.72, rise: 0.03, angle: 8, dAngle: 2, sweep: 0.04, camber: 0.06, flap: false },
      { x: -2.34, chord: 0.26, dChord: 0.04, y: 0.83, rise: 0.04, angle: 20, dAngle: 3, sweep: 0.04, camber: 0.1, flap: true },
    ],
    endplate: [[-2.1, 0.5], [-2.55, 0.5], [-2.6, 0.75], [-2.58, 0.95], [-2.3, 0.96], [-2.12, 0.9]],
    supports: [{ outline: [[-1.9, 0.55], [-2.0, 0.55], [-2.3, 0.78], [-2.2, 0.8]], z: 0, thickness: 0.07, mirror: false }],
    beam: [],
    boxes: [
      { size: [0.03, 0.07, 0.12], at: [-2.45, 0.6, 0], part: 'light' },
      { size: [0.1, 0.05, 0.07], at: [-2.45, 0.94, 0], part: 'carbon' },
    ],
  },

  extras: {
    plates: [
      // small turning vanes between the front wheel and the sidepod (the tall 2017 bargeboards came later)
      { outline: [[1.3, 0.06], [1.28, 0.2], [1.14, 0.3], [0.96, 0.26], [0.9, 0.06]], z: 0.3, thickness: 0.008, mirror: true, part: 'carbon' },
      { outline: [[1.28, 0.06], [1.26, 0.17], [1.12, 0.25], [0.94, 0.22], [0.88, 0.06]], z: 0.38, thickness: 0.008, mirror: true, part: 'carbon' },
      { outline: [[1.26, 0.06], [1.24, 0.14], [1.1, 0.2], [0.92, 0.18], [0.86, 0.06]], z: 0.46, thickness: 0.008, mirror: true, part: 'carbon' },
    ],
    // the cascade winglets on the front wing end plates
    wings: [
      { x: 2.5, y: 0.36, chord: 0.12, angle: 12, camber: 0.05, span: 0.81, from: 0.58, part: 'carbon' },
      { x: 2.4, y: 0.42, chord: 0.1, angle: 16, camber: 0.05, span: 0.81, from: 0.66, part: 'carbon' },
    ],
    rods: [],
    boxes: [{ size: [0.5, 0.2, 0.22], at: [-2.0, 0.33, 0], mirror: false, part: 'carbon' }],
  },

  details: {
    cockpit: { x: 0.5, rx: 0.42, rz: 0.18, y: 0.625, rimRx: 0.46, rimRz: 0.2 },
    mirror: [0.7, 0.74, 0.4],
    intake: [-0.03, 0.69],
    cameraPod: [-0.3, 1.06],
    exhaust: [-2.32, 0.5], // the single central exhaust of the 2014 rules
    slats: { x: -0.8, ys: [0.62, 0.7, 0.78] },
  },
};
