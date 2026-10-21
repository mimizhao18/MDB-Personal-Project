import { PAINT_BOX } from './spec';
import type { CarSpec } from './spec';

// The 2026 car, next to the 2022 one (gen2022.ts) and drawn from the 2026 Chinese GP photos in reference/gen2026/:
// a shorter wheelbase (3.4 m instead of 3.6), 1.9 m wide instead of 2.0, tyres 25 / 30 mm narrower on the same 18-inch
// wheels, a floor 150 mm narrower with a low edge and no tunnel fences, a long low nose over a simple three-element
// front wing (100 mm narrower, small plain end plates, the top flap active and built in sections), sidepods set far
// back with a deep undercut and a flat rear deck, a slim engine cover with a fin, and a three-element active rear wing
// on one central pillar with no beam wing. The measurements shown are the cornering (high-downforce) setting; the
// straight (low-drag) setting flattens the active elements.

export const GEN2026: CarSpec = {
  id: 'gen2026',
  notes: { label: '2026', frontWing: '3 elements, active flap', rearWing: 'Active, 3 elements, no beam wing' },
  halo: true,
  wheelLook: { style: 'cover', coverRatio: 0.68, grooves: 0, rimColor: '#9A9DA3' },
  centreX: 0.12,
  paint: PAINT_BOX,

  // A long, low, slim nose that reaches the front wing, a chassis at full width by the front axle, the cockpit and
  // airbox where the 2022 car has them (so the halo is the same), and a slimmer engine cover that falls to a narrow
  // closed tail.
  spine: {
    x: [2.85, 2.76, 2.6, 2.4, 2.1, 1.75, 1.4, 1.05, 0.75, 0.45, 0.15, -0.15, -0.5, -0.9, -1.3, -1.7, -2.1, -2.2],
    hw: [0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.19, 0.225, 0.25, 0.26, 0.26, 0.23, 0.2, 0.17, 0.13, 0.1, 0.06, 0.01],
    bottom: [0.2, 0.2, 0.2, 0.19, 0.18, 0.17, 0.15, 0.12, 0.1, 0.1, 0.1, 0.1, 0.1, 0.11, 0.14, 0.2, 0.3, 0.36],
    top: [0.27, 0.29, 0.31, 0.34, 0.39, 0.45, 0.52, 0.59, 0.62, 0.63, 0.65, 0.72, 0.86, 0.78, 0.64, 0.52, 0.42, 0.38],
    squareness: [0.9, 0.85, 0.8, 0.75, 0.72, 0.7, 0.66, 0.6, 0.58, 0.58, 0.6, 0.7, 0.78, 0.78, 0.75, 0.75, 0.75, 0.75],
  },

  // a slimmer shoulder than the 2022 car's
  shoulder: {
    x: [0.1, -0.15, -0.45, -0.85, -1.3, -1.65],
    hw: [0.2, 0.26, 0.29, 0.25, 0.18, 0.1],
    bottom: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    top: [0.64, 0.7, 0.8, 0.72, 0.58, 0.46],
    squareness: [0.85, 0.85, 0.85, 0.85, 0.85, 0.85],
  },

  // Set back behind the front wheels: a tall inlet with a deep undercut, a short rounded top, then a long flat deck
  // sloping down to the floor well ahead of the rear wheels.
  pods: {
    compact: {
      x: [0.75, 0.6, 0.3, -0.1, -0.5, -0.9, -1.3, -1.6, -1.85],
      zIn: [0.19, 0.2, 0.21, 0.2, 0.18, 0.14, 0.1, 0.08, 0.07],
      zOut: [0.42, 0.56, 0.63, 0.63, 0.58, 0.46, 0.32, 0.2, 0.13],
      bottom: [0.3, 0.22, 0.15, 0.12, 0.12, 0.12, 0.13, 0.15, 0.18],
      top: [0.5, 0.55, 0.52, 0.46, 0.38, 0.3, 0.25, 0.22, 0.2],
    },
  },

  // a smaller airbox, the camera pod on top
  airbox: {
    x: [0.08, 0.0, -0.2, -0.5, -0.85, -1.2],
    hw: [0.09, 0.115, 0.125, 0.115, 0.09, 0.045],
    bottom: [0.72, 0.68, 0.6, 0.6, 0.6, 0.6],
    top: [0.84, 0.92, 0.93, 0.88, 0.76, 0.62],
    squareness: [0.7, 0.7, 0.7, 0.75, 0.8, 0.8],
  },

  // 150 mm narrower than the 2022 floor, with only a low edge and no tunnel fences
  floor: {
    x: [1.4, 1.2, 0.9, 0.7, 0.3, -0.2, -0.75, -1.2, -1.45],
    hw: [0.24, 0.36, 0.52, 0.61, 0.59, 0.53, 0.47, 0.41, 0.39],
    y: 0.035,
    thickness: 0.03,
  },
  edgeWing: { xFront: 1.2, xBack: -1.3, low: 0.03, high: 0.08, rampFrom: -0.6, rampSpan: 1.7 },
  diffuser: { xStart: -1.45, xEnd: -2.15, hw: 0.4, rise: 0.24, strakes: [0.15] },
  fences: [],

  // 18-inch wheels like the 2022 car (same diameter), but tyres 25 / 30 mm narrower (measured inflated, like the 2022 car's) and a narrower track
  wheels: {
    front: { x: 1.7, radius: 0.36, width: 0.325, z: 0.7875 },
    rear: { x: -1.7, radius: 0.36, width: 0.42, z: 0.74 },
  },

  // Three elements: a fixed main plane, a fixed flap and an active top flap in three sections. 100 mm narrower than
  // the 2022 wing, flatter and less swept, with small plain end plates and no footplate.
  frontWing: {
    span: 0.88,
    sweep: 0.22,
    sweepPower: 1.8,
    concave: 0.04,
    elements: [
      { x: 2.9, chord: 0.3, y: 0.07, rise: 0.05, angle: 3, dAngle: 2, camber: 0.03, from: 0, flap: false, lift: 0, risePower: 2.2 },
      { x: 2.72, chord: 0.2, y: 0.14, rise: 0.07, angle: 12, dAngle: 4, camber: 0.08, from: 0.1, flap: true, lift: 0.08, liftSpan: 0.34, risePower: 1.4 },
      { x: 2.62, chord: 0.17, y: 0.21, rise: 0.08, angle: 24, dAngle: 4, camber: 0.1, from: 0.14, flap: true, lift: 0.11, liftSpan: 0.3, risePower: 1.4, active: true, straightAngle: 3, sections: 3 },
    ],
    endplate: [[2.86, 0.06], [2.88, 0.14], [2.78, 0.24], [2.6, 0.3], [2.42, 0.32], [2.36, 0.26], [2.4, 0.12], [2.6, 0.06]],
    footplate: null,
    vanes: true, // small vortex vanes along the top flap
    pylons: false, // the low nose reaches the wing
  },

  // No DRS flap and no beam wing: three elements that all move, on one centre pillar, with cut-away end plates.
  rearWing: {
    span: 0.46,
    elements: [
      { x: -1.9, chord: 0.26, dChord: 0.04, y: 0.62, rise: 0.05, angle: 8, dAngle: 3, sweep: 0.05, camber: 0.05, flap: false, active: true, straightAngle: 2 },
      { x: -2.05, chord: 0.2, dChord: 0.04, y: 0.7, rise: 0.06, angle: 20, dAngle: 4, sweep: 0.05, camber: 0.08, flap: true, active: true, straightAngle: 3 },
      { x: -2.16, chord: 0.16, dChord: 0.03, y: 0.78, rise: 0.07, angle: 30, dAngle: 4, sweep: 0.05, camber: 0.09, flap: true, active: true, straightAngle: 4 },
    ],
    endplate: [[-1.86, 0.5], [-2.2, 0.5], [-2.34, 0.62], [-2.36, 0.82], [-2.3, 0.9], [-2.1, 0.9], [-1.92, 0.86], [-1.84, 0.7]],
    supports: [{ outline: [[-1.6, 0.4], [-1.72, 0.4], [-1.95, 0.66], [-1.86, 0.68]], z: 0, thickness: 0.07, mirror: false }],
    beam: [],
    boxes: [
      { size: [0.03, 0.06, 0.1], at: [-2.2, 0.5, 0], part: 'light' },
      { size: [0.05, 0.03, 0.04], at: [-2.1, 0.79, 0.14], part: 'carbon' }, // actuator pods at the flap hinge
      { size: [0.05, 0.03, 0.04], at: [-2.1, 0.79, -0.14], part: 'carbon' },
    ],
  },

  // a fin along the spine of the engine cover ahead of the rear wing, and the gearbox case at the back
  extras: {
    plates: [{ outline: [[-0.9, 0.8], [-1.4, 0.64], [-1.75, 0.5], [-1.75, 0.44], [-1.4, 0.58], [-0.9, 0.76]], z: 0, thickness: 0.012, mirror: false, part: 'paint' }],
    wings: [],
    rods: [],
    boxes: [{ size: [0.4, 0.16, 0.18], at: [-1.95, 0.3, 0], mirror: false, part: 'carbon' }],
  },

  details: {
    cockpit: { x: 0.5, rx: 0.4, rz: 0.17, y: 0.625, rimRx: 0.44, rimRz: 0.19 },
    mirror: [0.75, 0.72, 0.4],
    intake: [-0.02, 0.67],
    cameraPod: [-0.25, 0.925],
    exhaust: [-2.1, 0.42],
    slats: { x: -0.8, ys: [0.63, 0.71] },
  },
};
