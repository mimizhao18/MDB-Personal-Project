import { PAINT_BOX } from './spec';
import type { CarSpec } from './spec';

// The hybrid-era car (2014-2021), drawn as the 2018-2020 cars: 3.6 m wheelbase, 2.0 m wide, tall 13-inch wheels with
// covers, a thumb-tip nose on pylons, a wide front wing with big end plates and cascades, bargeboards ahead of wide
// sidepods, a tall finned engine cover with a shark fin and T-wing, a halo, and a DRS rear wing with a beam wing.

export const GEN2014: CarSpec = {
  id: 'gen2014',
  notes: { label: '2014', frontWing: '4 elements, pylon nose', rearWing: 'Fixed, DRS flap, T-wing' },
  halo: true,
  wheelLook: { style: 'cover', coverRatio: 0.52, grooves: 0, rimColor: '#2A2A2E' },
  centreX: 0.18,
  paint: PAINT_BOX,

  spine: {
    x: [2.78, 2.7, 2.5, 2.2, 1.85, 1.5, 1.1, 0.8, 0.45, 0.15, -0.15, -0.5, -0.95, -1.4, -1.9, -2.35],
    hw: [0.1, 0.11, 0.12, 0.14, 0.16, 0.18, 0.2, 0.23, 0.25, 0.26, 0.22, 0.2, 0.18, 0.15, 0.11, 0.08],
    bottom: [0.27, 0.27, 0.25, 0.22, 0.19, 0.17, 0.14, 0.12, 0.1, 0.1, 0.1, 0.1, 0.1, 0.11, 0.14, 0.2],
    top: [0.4, 0.41, 0.43, 0.46, 0.5, 0.55, 0.6, 0.64, 0.62, 0.64, 0.7, 0.93, 0.88, 0.72, 0.56, 0.45],
    squareness: [0.9, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.6, 0.62, 0.7, 0.8, 0.8, 0.75, 0.75, 0.75],
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
    hw: [0.28, 0.42, 0.6, 0.72, 0.74, 0.7, 0.62, 0.56, 0.54],
    y: 0.035,
    thickness: 0.03,
  },
  edgeWing: { xFront: 1.2, xBack: -1.4, low: 0.04, high: 0.09, rampFrom: -0.6, rampSpan: 1.7 },
  diffuser: { xStart: -1.6, xEnd: -2.35, hw: 0.5, rise: 0.26, strakes: [0.15, 0.3] },
  fences: [],

  // 13-inch wheels (a tall sidewall), the wide tires of 2017 on: 305 mm front, 405 mm rear
  wheels: {
    front: { x: 1.8, radius: 0.335, width: 0.305, z: 0.81 },
    rear: { x: -1.8, radius: 0.34, width: 0.405, z: 0.8 },
  },

  frontWing: {
    span: 1.0,
    sweep: 0.2,
    sweepPower: 1.4,
    concave: 0.05,
    elements: [
      { x: 2.98, chord: 0.3, y: 0.06, rise: 0.08, angle: 2, dAngle: 4, camber: 0.03, from: 0, flap: false },
      { x: 2.8, chord: 0.24, y: 0.12, rise: 0.14, angle: 10, dAngle: 10, camber: 0.07, from: 0.12, flap: true },
      { x: 2.68, chord: 0.2, y: 0.17, rise: 0.2, angle: 18, dAngle: 12, camber: 0.08, from: 0.16, flap: true },
      { x: 2.58, chord: 0.17, y: 0.22, rise: 0.24, angle: 26, dAngle: 8, camber: 0.08, from: 0.2, flap: true },
    ],
    endplate: [[2.9, 0.05], [2.9, 0.16], [2.78, 0.28], [2.5, 0.4], [2.2, 0.48], [2.05, 0.48], [2.04, 0.34], [2.1, 0.18], [2.3, 0.1], [2.6, 0.06]],
    footplate: { x: 2.45, length: 0.5 },
    vanes: true,
    pylons: true,
  },

  rearWing: {
    span: 0.5,
    elements: [
      { x: -2.2, chord: 0.3, dChord: 0.05, y: 0.74, rise: 0.08, angle: 8, dAngle: 4, sweep: 0.08, camber: 0.06, flap: false },
      { x: -2.34, chord: 0.26, dChord: 0.05, y: 0.86, rise: 0.1, angle: 20, dAngle: 6, sweep: 0.08, camber: 0.1, flap: true },
    ],
    endplate: [[-2.1, 0.48], [-2.55, 0.5], [-2.62, 0.8], [-2.6, 1.0], [-2.3, 1.02], [-2.12, 0.95]],
    supports: [{ outline: [[-1.9, 0.55], [-2.0, 0.55], [-2.3, 0.78], [-2.2, 0.8]], z: 0, thickness: 0.07, mirror: false }],
    beam: [{ x: -2.1, y: 0.5, chord: 0.2, angle: 10, camber: 0.05, span: 0.45 }],
    boxes: [
      { size: [0.03, 0.07, 0.12], at: [-2.45, 0.6, 0], part: 'light' },
      { size: [0.1, 0.05, 0.07], at: [-2.45, 0.94, 0], part: 'carbon' },
    ],
  },

  extras: {
    plates: [
      // the shark fin along the middle of the engine cover, in body paint
      { outline: [[-2.2, 0.62], [-1.6, 0.66], [-1.0, 0.78], [-0.7, 0.9], [-0.62, 1.04], [-1.2, 1.03], [-1.8, 0.94], [-2.18, 0.8]], z: 0, thickness: 0.012, mirror: false, part: 'paint' },
      // bargeboards: tall curved panels between the front wheel and the sidepod
      { outline: [[1.34, 0.07], [1.3, 0.3], [1.12, 0.4], [0.92, 0.36], [0.9, 0.07]], z: 0.3, thickness: 0.008, mirror: true, part: 'carbon' },
      { outline: [[1.3, 0.07], [1.25, 0.26], [1.05, 0.34], [0.88, 0.3], [0.86, 0.07]], z: 0.38, thickness: 0.008, mirror: true, part: 'carbon' },
      { outline: [[1.26, 0.07], [1.2, 0.2], [1.0, 0.27], [0.86, 0.24], [0.84, 0.07]], z: 0.46, thickness: 0.008, mirror: true, part: 'carbon' },
      { outline: [[1.22, 0.07], [1.16, 0.16], [0.98, 0.21], [0.86, 0.18], [0.84, 0.07]], z: 0.54, thickness: 0.008, mirror: true, part: 'carbon' },
      { outline: [[1.4, 0.07], [1.32, 0.16], [1.1, 0.2], [1.0, 0.16], [0.98, 0.07]], z: 0.62, thickness: 0.008, mirror: true, part: 'carbon' },
    ],
    // the T-wing on top of the shark fin
    wings: [
      { x: 2.5, y: 0.42, chord: 0.13, angle: 12, camber: 0.05, span: 0.97, from: 0.7, part: 'carbon' },
      { x: 2.4, y: 0.5, chord: 0.11, angle: 16, camber: 0.05, span: 0.97, from: 0.78, part: 'carbon' },
      { x: 2.3, y: 0.56, chord: 0.09, angle: 20, camber: 0.05, span: 0.96, from: 0.84, part: 'carbon' },
      { x: -1.88, y: 0.94, chord: 0.13, angle: 6, camber: 0.05, span: 0.27, from: 0, part: 'carbon' },
      { x: -1.9, y: 1.02, chord: 0.1, angle: 10, camber: 0.05, span: 0.22, from: 0, part: 'carbon' },
    ],
    rods: [],
    boxes: [{ size: [0.5, 0.2, 0.22], at: [-2.0, 0.33, 0], mirror: false, part: 'carbon' }],
  },

  details: {
    cockpit: { x: 0.5, rx: 0.42, rz: 0.18, y: 0.625, rimRx: 0.46, rimRz: 0.2 },
    mirror: [0.7, 0.74, 0.4],
    intake: [-0.03, 0.69],
    cameraPod: [-0.3, 1.06],
    exhaust: [-2.35, 0.45],
    slats: { x: -0.8, ys: [0.62, 0.7, 0.78] },
  },
};
