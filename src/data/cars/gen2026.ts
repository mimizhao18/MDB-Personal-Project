import { PAINT_BOX } from './spec';
import type { CarSpec } from './spec';

// The 2026 car, next to the 2022 one (gen2022.ts): a shorter wheelbase (3.4 m instead of 3.6), 1.9 m wide instead of
// 2.0, narrower tires (front 280 mm, rear 375 mm instead of 305 and 405), slimmer sidepods with a small inlet and no
// deep undercut, a narrower and plainer floor, a raised nose held on pylons, and active wings: a two-element front
// wing whose flap is built in sections, and a rear wing with no separate DRS flap and no beam wing. The measurements
// shown are the cornering (high-downforce) setting; the straight (low-drag) setting flattens the active elements.

export const GEN2026: CarSpec = {
  id: 'gen2026',
  notes: { label: '2026', frontWing: '2 elements, active flap', rearWing: 'Active, no DRS flap' },
  halo: true,
  wheelLook: { style: 'cover', coverRatio: 0.6, grooves: 0, rimColor: '#9A9DA3' },
  centreX: 0.12,
  paint: PAINT_BOX,

  // Shorter and tighter than the 2022 car, with a slightly raised nose. The cockpit and airbox stay where they were so the halo
  // (the same on both cars) sits in the same place.
  spine: {
    x: [2.78, 2.68, 2.48, 2.2, 1.85, 1.45, 1.05, 0.8, 0.45, 0.15, -0.15, -0.45, -0.9, -1.35, -1.8, -2.15],
    hw: [0.05, 0.075, 0.1, 0.12, 0.14, 0.165, 0.19, 0.215, 0.24, 0.25, 0.21, 0.18, 0.17, 0.14, 0.1, 0.07],
    bottom: [0.16, 0.16, 0.16, 0.16, 0.15, 0.14, 0.13, 0.12, 0.1, 0.1, 0.1, 0.1, 0.1, 0.11, 0.13, 0.18],
    top: [0.24, 0.26, 0.28, 0.32, 0.38, 0.47, 0.57, 0.64, 0.62, 0.64, 0.7, 0.9, 0.84, 0.72, 0.6, 0.5],
    squareness: [0.9, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.6, 0.62, 0.7, 0.8, 0.8, 0.75, 0.75, 0.75],
  },

  // a slimmer shoulder than the 2022 car's
  shoulder: {
    x: [0.1, -0.15, -0.45, -0.9, -1.35, -1.7],
    hw: [0.2, 0.27, 0.3, 0.26, 0.19, 0.1],
    bottom: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    top: [0.66, 0.72, 0.84, 0.8, 0.7, 0.56],
    squareness: [0.85, 0.85, 0.85, 0.85, 0.85, 0.85],
  },

  // Slim, low pods that hug the body: a smaller inlet, less undercut, tighter engine-cover bodywork.
  pods: {
    compact: {
      x: [0.85, 0.62, 0.25, -0.2, -0.65, -1.1, -1.55, -1.9],
      zIn: [0.17, 0.17, 0.18, 0.17, 0.15, 0.12, 0.09, 0.07],
      zOut: [0.37, 0.48, 0.55, 0.55, 0.48, 0.36, 0.23, 0.14],
      bottom: [0.14, 0.12, 0.11, 0.1, 0.1, 0.11, 0.13, 0.17],
      top: [0.44, 0.54, 0.56, 0.52, 0.44, 0.34, 0.26, 0.22],
    },
  },

  airbox: {
    x: [0.06, -0.02, -0.2, -0.5, -0.9, -1.25],
    hw: [0.09, 0.115, 0.13, 0.12, 0.09, 0.045],
    bottom: [0.72, 0.7, 0.6, 0.6, 0.6, 0.6],
    top: [0.88, 1.02, 1.08, 1.02, 0.9, 0.78],
    squareness: [0.7, 0.7, 0.7, 0.75, 0.8, 0.8],
  },

  // narrower, with no tunnel fences and only a low edge
  floor: {
    x: [1.4, 1.2, 0.9, 0.45, 0.0, -0.55, -0.95, -1.3, -1.5],
    hw: [0.26, 0.38, 0.52, 0.62, 0.64, 0.6, 0.54, 0.48, 0.46],
    y: 0.035,
    thickness: 0.03,
  },
  edgeWing: { xFront: 1.2, xBack: -1.3, low: 0.025, high: 0.04, rampFrom: -0.6, rampSpan: 1.7 },
  diffuser: { xStart: -1.5, xEnd: -2.15, hw: 0.44, rise: 0.22, strakes: [0.18] },
  fences: [],

  // 18-inch wheels like the 2022 car (same diameter), but narrower tires and a narrower track
  wheels: {
    front: { x: 1.7, radius: 0.36, width: 0.28, z: 0.78 },
    rear: { x: -1.7, radius: 0.365, width: 0.375, z: 0.7625 },
  },

  // Two elements: a fixed main plane and an active flap in three sections. A less swept, flatter, narrower wing
  // (1.76 m instead of 2.0, about as wide as the front tires' outer edges, its tips swept back and curved up) with
  // small plain end plates.
  frontWing: {
    span: 0.88,
    sweep: 0.3,
    sweepPower: 2.1,
    concave: 0.07,
    elements: [
      { x: 2.8, chord: 0.3, y: 0.055, rise: 0.065, angle: 2, dAngle: 3, camber: 0.03, from: 0, flap: false },
      { x: 2.6, chord: 0.26, y: 0.115, rise: 0.105, angle: 22, dAngle: 9, camber: 0.09, from: 0.08, flap: true, active: true, straightAngle: 3, sections: 3 },
    ],
    endplate: [[2.58, 0.05], [2.59, 0.14], [2.48, 0.23], [2.3, 0.3], [2.12, 0.32], [2.08, 0.23], [2.14, 0.11], [2.3, 0.06]],
    footplate: null,
    vanes: false,
    pylons: true, // the raised nose is held clear of the wing on two pylons
  },

  // No DRS flap and no beam wing: both elements are active, on one centre pylon, with small end plates.
  rearWing: {
    span: 0.45,
    elements: [
      { x: -1.95, chord: 0.3, dChord: 0.04, y: 0.62, rise: 0.06, angle: 8, dAngle: 3, sweep: 0.06, camber: 0.05, flap: false, active: true, straightAngle: 2 },
      { x: -2.1, chord: 0.26, dChord: 0.04, y: 0.71, rise: 0.08, angle: 26, dAngle: 4, sweep: 0.06, camber: 0.09, flap: true, active: true, straightAngle: 3 },
    ],
    endplate: [[-1.9, 0.5], [-2.4, 0.5], [-2.5, 0.72], [-2.46, 0.92], [-2.24, 0.93], [-1.98, 0.88]],
    supports: [{ outline: [[-1.78, 0.4], [-1.9, 0.4], [-2.08, 0.64], [-1.98, 0.66]], z: 0, thickness: 0.07, mirror: false }],
    beam: [],
    boxes: [
      { size: [0.03, 0.06, 0.1], at: [-2.2, 0.5, 0], part: 'light' },
      { size: [0.06, 0.035, 0.05], at: [-2.1, 0.745, 0.14], part: 'carbon' }, // actuator pods at the flap hinge
      { size: [0.06, 0.035, 0.05], at: [-2.1, 0.745, -0.14], part: 'carbon' },
    ],
  },

  extras: { plates: [], wings: [], rods: [], boxes: [{ size: [0.42, 0.18, 0.2], at: [-1.8, 0.33, 0], mirror: false, part: 'carbon' }] },

  details: {
    cockpit: { x: 0.5, rx: 0.42, rz: 0.18, y: 0.625, rimRx: 0.46, rimRz: 0.2 },
    mirror: [0.7, 0.74, 0.4],
    intake: [-0.03, 0.67],
    cameraPod: [-0.3, 1.0],
    exhaust: [-2.15, 0.4],
    slats: { x: -0.8, ys: [0.63, 0.71] },
  },
};
