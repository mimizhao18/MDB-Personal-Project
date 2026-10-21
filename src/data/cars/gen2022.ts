import { PAINT_BOX } from './spec';
import type { CarSpec } from './spec';

// The 2022 (ground effect) car, drawn as the Ferrari F1-75 and checked against the FIA 2022 reference volumes
// (reference/gen2022/dimensions.md): a 3.6 m wheelbase, 2.0 m wide over the wheels, 18-inch wheels with wide low
// tyres (front 350 mm, rear 450 mm as measured inflated), a wide four-element front wing whose tips rise toward the
// tyres, a wide floor with a raised edge and three tunnel fences, big sidepods (three team designs), a tall airbox
// with the camera pod on top, a rear wing in its 2022 box (rolled end plates, DRS flap) over a two-element beam wing.
// This is the reference the 2026 car (gen2026.ts) is compared with, so change it only to correct it.

export const GEN2022: CarSpec = {
  id: 'gen2022',
  notes: { label: '2022', frontWing: '4 elements, fixed', rearWing: 'Fixed, DRS flap' },
  halo: true,
  // a 490 mm rim on a 720 mm tyre: the rim fills two thirds of the wheel
  wheelLook: { style: 'cover', coverRatio: 0.68, grooves: 0, rimColor: '#9A9DA3' },
  centreX: 0.15,
  paint: PAINT_BOX,

  // Nose, chassis, cockpit, airbox and engine cover. The nose tip sits on the second front wing element and is wide
  // and rounded (not a needle); the chassis is at full width by the front axle; the top line rises steadily to the
  // cockpit (0.63 m) and the engine cover peaks behind the airbox then falls to a narrow tail over the beam wing.
  spine: {
    x: [2.95, 2.86, 2.68, 2.45, 2.15, 1.8, 1.45, 1.1, 0.78, 0.45, 0.15, -0.15, -0.5, -0.95, -1.4, -1.85, -2.25, -2.34],
    hw: [0.075, 0.1, 0.12, 0.135, 0.15, 0.17, 0.2, 0.235, 0.26, 0.27, 0.27, 0.24, 0.21, 0.19, 0.15, 0.11, 0.07, 0.01],
    bottom: [0.12, 0.12, 0.13, 0.15, 0.17, 0.17, 0.15, 0.12, 0.1, 0.1, 0.1, 0.1, 0.1, 0.11, 0.14, 0.2, 0.3, 0.37],
    top: [0.2, 0.23, 0.27, 0.32, 0.38, 0.45, 0.53, 0.6, 0.63, 0.63, 0.65, 0.72, 0.9, 0.82, 0.68, 0.55, 0.45, 0.4],
    squareness: [0.85, 0.8, 0.75, 0.72, 0.7, 0.68, 0.65, 0.6, 0.58, 0.58, 0.6, 0.7, 0.78, 0.78, 0.75, 0.75, 0.75, 0.75],
  },

  // the shoulder behind the cockpit: wide at the base of the airbox, sloping down toward the tail
  shoulder: {
    x: [0.1, -0.15, -0.45, -0.9, -1.4, -1.8],
    hw: [0.22, 0.3, 0.34, 0.3, 0.22, 0.12],
    bottom: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    top: [0.64, 0.7, 0.82, 0.74, 0.58, 0.44],
    squareness: [0.85, 0.85, 0.85, 0.85, 0.85, 0.85],
  },

  // Teams went different ways in 2022: a downwash ramp (Red Bull), a scooped bathtub (Ferrari), or very slim pods
  // (Mercedes). All start just behind the front wheel and fade into the floor ahead of the rear wheel. The pod
  // reference volume ends at 0.775 m from the middle.
  pods: {
    downwash: {
      x: [0.98, 0.8, 0.5, 0.1, -0.35, -0.8, -1.25, -1.65, -1.95],
      zIn: [0.19, 0.2, 0.22, 0.22, 0.2, 0.16, 0.11, 0.08, 0.07],
      zOut: [0.5, 0.64, 0.72, 0.72, 0.66, 0.52, 0.36, 0.22, 0.14],
      bottom: [0.3, 0.24, 0.17, 0.13, 0.12, 0.12, 0.13, 0.16, 0.2],
      top: [0.54, 0.62, 0.6, 0.52, 0.42, 0.34, 0.28, 0.25, 0.23],
    },
    scoop: {
      x: [0.98, 0.8, 0.5, 0.1, -0.35, -0.8, -1.25, -1.65, -1.95],
      zIn: [0.2, 0.22, 0.25, 0.26, 0.25, 0.2, 0.14, 0.1, 0.08],
      zOut: [0.52, 0.66, 0.74, 0.75, 0.72, 0.6, 0.42, 0.26, 0.16],
      bottom: [0.26, 0.2, 0.14, 0.12, 0.12, 0.12, 0.13, 0.16, 0.2],
      top: [0.56, 0.6, 0.56, 0.5, 0.46, 0.4, 0.32, 0.27, 0.24],
    },
    slim: {
      x: [0.98, 0.8, 0.5, 0.1, -0.35, -0.8, -1.25, -1.65, -1.95],
      zIn: [0.19, 0.2, 0.2, 0.18, 0.16, 0.12, 0.09, 0.07, 0.06],
      zOut: [0.4, 0.48, 0.5, 0.46, 0.4, 0.3, 0.2, 0.14, 0.1],
      bottom: [0.24, 0.2, 0.16, 0.14, 0.14, 0.14, 0.15, 0.18, 0.2],
      top: [0.46, 0.54, 0.54, 0.48, 0.4, 0.33, 0.27, 0.24, 0.22],
    },
  },

  // the roll hoop may not stand above 0.97 m; the camera pod sits on top of it
  airbox: {
    x: [0.08, 0.0, -0.2, -0.5, -0.9, -1.3],
    hw: [0.1, 0.13, 0.14, 0.13, 0.1, 0.05],
    bottom: [0.74, 0.7, 0.62, 0.6, 0.6, 0.6],
    top: [0.86, 0.95, 0.96, 0.92, 0.78, 0.62],
    squareness: [0.7, 0.7, 0.7, 0.75, 0.8, 0.8],
  },

  // The floor body: inside 0.685 m from the middle beside the sidepods, 0.59 m by the rear of the pods, 0.43 m ahead
  // of the rear wheels (the reference volume), so it stays clear of the tyres.
  floor: {
    x: [1.5, 1.3, 1.0, 0.84, 0.4, -0.2, -0.8, -1.3, -1.55],
    hw: [0.26, 0.4, 0.6, 0.685, 0.66, 0.59, 0.52, 0.45, 0.43],
    y: 0.035,
    thickness: 0.03,
  },
  // the raised floor edge: a wedge, tall at the front, low at the back
  edgeWing: { xFront: 1.3, xBack: -1.4, low: 0.04, high: 0.1, rampFrom: -0.6, rampSpan: 1.7 },
  diffuser: { xStart: -1.55, xEnd: -2.3, hw: 0.45, rise: 0.28, strakes: [0.16, 0.32] },
  fences: [0.4, 0.5, 0.6],

  // 18-inch wheels; the tyre as measured inflated is wider than its 305 / 405 name
  wheels: {
    front: { x: 1.8, radius: 0.36, width: 0.35, z: 0.825 },
    rear: { x: -1.8, radius: 0.36, width: 0.45, z: 0.775 },
  },

  // A wide arrow-shaped wing (profiles to 0.9 m from the middle, end plates just beyond): a flat main plane whose
  // tips curl up to the end plates, and three flaps stacked behind it with open slot gaps, each sweeping up at its
  // inner end to meet the side of the nose and curling up again at the tip. The nose runs into the second element.
  frontWing: {
    span: 0.93,
    sweep: 0.3,
    sweepPower: 1.5,
    concave: 0.08,
    elements: [
      { x: 3.0, chord: 0.32, y: 0.07, rise: 0.06, angle: 3, dAngle: 3, camber: 0.03, from: 0, flap: false, lift: 0, risePower: 2.2 },
      { x: 2.8, chord: 0.22, y: 0.135, rise: 0.09, angle: 11, dAngle: 7, camber: 0.08, from: 0.12, flap: true, lift: 0.08, liftSpan: 0.36, risePower: 1.4 },
      { x: 2.7, chord: 0.18, y: 0.2, rise: 0.1, angle: 19, dAngle: 7, camber: 0.09, from: 0.15, flap: true, lift: 0.11, liftSpan: 0.33, risePower: 1.4 },
      { x: 2.62, chord: 0.15, y: 0.265, rise: 0.1, angle: 27, dAngle: 5, camber: 0.1, from: 0.18, flap: true, lift: 0.13, liftSpan: 0.3, risePower: 1.4 },
    ],
    // low and rounded at the front, rising to a tall rear corner
    endplate: [[2.98, 0.06], [3.0, 0.14], [2.92, 0.26], [2.7, 0.36], [2.45, 0.42], [2.28, 0.43], [2.24, 0.36], [2.3, 0.2], [2.5, 0.1], [2.75, 0.06]],
    footplate: { x: 2.6, length: 0.5 },
    vanes: true, // small vortex vanes along the top flap
    pylons: false, // the nose runs all the way into the wing
  },

  // In its 2022 box: profiles from 0.14 to 0.555 m behind the rear axle, between 0.67 and 0.91 m up, end plates to
  // 0.68 m behind the axle. Two thin swan-neck pillars, a DRS flap, and a two-element beam wing below.
  rearWing: {
    span: 0.48,
    elements: [
      { x: -1.96, chord: 0.3, dChord: 0.05, y: 0.69, rise: 0.08, angle: 9, dAngle: 5, sweep: 0.08, camber: 0.06, flap: false },
      { x: -2.14, chord: 0.24, dChord: 0.05, y: 0.79, rise: 0.1, angle: 22, dAngle: 6, sweep: 0.08, camber: 0.1, flap: true },
    ],
    endplate: [[-1.92, 0.44], [-2.3, 0.44], [-2.44, 0.56], [-2.48, 0.76], [-2.44, 0.9], [-2.2, 0.91], [-1.98, 0.88], [-1.9, 0.72]],
    supports: [{ outline: [[-1.75, 0.46], [-1.86, 0.46], [-2.05, 0.72], [-1.96, 0.74]], z: 0.1, thickness: 0.02, mirror: true }],
    beam: [
      { x: -2.05, y: 0.4, chord: 0.16, angle: 8, camber: 0.05, span: 0.45 },
      { x: -2.1, y: 0.48, chord: 0.13, angle: 16, camber: 0.06, span: 0.45 },
    ],
    boxes: [
      { size: [0.03, 0.07, 0.1], at: [-2.3, 0.55, 0], part: 'light' },
      { size: [0.1, 0.04, 0.07], at: [-2.22, 0.9, 0], part: 'carbon' }, // DRS actuator pod on the flap
    ],
  },

  // a single dive plane along the top of each front wing end plate (2022 banned the cascade stacks)
  extras: {
    plates: [],
    wings: [{ x: 2.5, y: 0.38, chord: 0.11, angle: 14, camber: 0.05, span: 0.92, from: 0.84, part: 'carbon' }],
    rods: [],
    boxes: [{ size: [0.45, 0.18, 0.2], at: [-2.05, 0.3, 0], mirror: false, part: 'carbon' }],
  },

  details: {
    cockpit: { x: 0.5, rx: 0.4, rz: 0.17, y: 0.625, rimRx: 0.44, rimRz: 0.19 },
    mirror: [0.75, 0.72, 0.42],
    intake: [-0.02, 0.69],
    cameraPod: [-0.25, 0.955],
    exhaust: [-2.25, 0.46],
    slats: { x: -0.9, ys: [0.62, 0.69, 0.76] },
  },
};
