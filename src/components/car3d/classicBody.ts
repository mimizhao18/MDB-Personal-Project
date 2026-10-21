import * as THREE from 'three';

import type { PodShape } from '../../data/cars/spec';
import { diffuserGeometry, diffuserStrake, floorEdgeWingGeometry, floorGeometry } from './modernCar';
import type { BodyContext } from './modernCar';
import type { LoftSpec } from './parts';
import { arm, box, loftGeometry, plateGeometry, rod } from './parts';

// The bodies of the three older generations, each built its own way from reference photos instead of sharing the
// smooth ground-effect body of the 2022 and 2026 cars:
//  - 1980s: a flat-sided slab of a car. A long needle nose, a bathtub cockpit with the driver's helmet and a small
//    windscreen, tall box radiator pods with upright inlets, a blade of a roll hoop and a narrow tall engine cover.
//  - 2004: a slim, high-nosed cigar with a very narrow tail, a tall periscope airbox, round pillow sidepods with
//    big scoop inlets high beside the driver, and an open cockpit with the helmet showing.
//  - 2014: a wide, busy car with a halo, a thick hammer-head nose, huge sidepod mouths over a deep undercut,
//    a narrow engine cover, and floor-edge fences and winglets everywhere.

type Mat = THREE.Material;

const loft = (spec: LoftSpec, material: Mat, rings = 60, sides = 28, squareness = 0.7, side: 1 | -1 = 1) =>
  new THREE.Mesh(loftGeometry(spec, { rings, sides, squareness, side }), material);

const ellipsoid = (rx: number, ry: number, rz: number, material: Mat, x: number, y: number, z: number) => {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), material);
  mesh.scale.set(rx, ry, rz);
  mesh.position.set(x, y, z);
  return mesh;
};

/** The sidepod design the livery asks for, or the generation's only one. */
function podOf({ spec, livery }: BodyContext): PodShape {
  return spec.pods[livery.sidepod] ?? Object.values(spec.pods)[0]!;
}

/** A pod as a loft: both sides, with the given adjustment to its bottom and top. */
function addPods(c: BodyContext, squareness: number, bottomLift: (i: number) => number = () => 0, topScale: (i: number) => number = () => 1) {
  const sp = podOf(c);
  const podSpec: LoftSpec = {
    x: sp.x,
    zc: sp.zIn.map((zi, i) => (zi + sp.zOut[i]) / 2),
    hw: sp.zIn.map((zi, i) => (sp.zOut[i] - zi) / 2),
    bottom: sp.bottom.map((b, i) => b + bottomLift(i)),
    top: sp.top.map((t, i) => t * topScale(i)),
  };
  for (const side of [1, -1] as const) c.car.add(loft(podSpec, c.paint, 70, 28, squareness, side));
  return sp;
}

/** Floor, with or without an edge wing and a diffuser. */
function addFloor(c: BodyContext, edge: boolean, diffuser: boolean) {
  c.car.add(new THREE.Mesh(floorGeometry(c.spec), c.m.floor));
  if (diffuser) {
    c.car.add(new THREE.Mesh(diffuserGeometry(c.spec), c.m.floor));
    for (const side of [1, -1] as const) for (const z of c.spec.diffuser.strakes) c.car.add(new THREE.Mesh(diffuserStrake(c.spec, z * side), c.m.carbon));
  }
  if (edge) for (const side of [1, -1] as const) c.car.add(new THREE.Mesh(floorEdgeWingGeometry(c.spec, side), c.m.floor));
}

/** The driver: a helmet and a dark visor, and the shoulders, sitting low in the cockpit. */
function addDriver(c: BodyContext, x: number, y: number, size = 0.12) {
  const helmet = ellipsoid(size * 1.05, size, size * 0.95, c.m.helmet, x, y, 0);
  c.car.add(helmet);
  const visor = ellipsoid(size * 0.5, size * 0.38, size * 0.82, c.m.dark, x + size * 0.62, y + size * 0.1, 0);
  c.car.add(visor);
  c.car.add(box(0.16, 0.1, 0.4, c.m.dark, x - size * 1.1, y - size * 0.9, 0));
}

/** The steering wheel on its column inside the cockpit. */
function addSteering(c: BodyContext, x: number, y: number) {
  const wheel = box(0.02, 0.07, 0.2, c.m.dark, x, y, 0, -0.6);
  c.car.add(wheel);
}

/** A ring of body paint around the cockpit opening. */
function addRim(c: BodyContext, x: number, y: number, rx: number, rz: number, radius = 0.022) {
  const points = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    return new THREE.Vector3(x + rx * Math.cos(a), y, rz * Math.sin(a));
  });
  c.car.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, true), 56, radius, 8, true), c.paint));
}

// ---------------------------------------------------------------------------------------------------------------
// 1980s
// ---------------------------------------------------------------------------------------------------------------

function body1980s(c: BodyContext) {
  const { car, m, paint } = c;

  // the needle nose and the bathtub: low and flat at the front, rising to the raised rim around the driver, boxy with
  // flat sides and a flat top
  car.add(
    loft(
      {
        x: [2.45, 2.32, 2.05, 1.75, 1.4, 1.05, 0.78, 0.48, 0.18, -0.12],
        hw: [0.07, 0.09, 0.115, 0.14, 0.16, 0.19, 0.22, 0.24, 0.25, 0.23],
        bottom: [0.13, 0.13, 0.13, 0.12, 0.12, 0.11, 0.1, 0.1, 0.1, 0.1],
        top: [0.19, 0.22, 0.27, 0.33, 0.4, 0.48, 0.58, 0.68, 0.72, 0.72],
        squareness: [0.7, 0.5, 0.38, 0.32, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
      },
      paint,
      70,
      32,
    ),
  );
  // the open cockpit with the driver in it, a small raked windscreen and the steering wheel
  car.add(ellipsoid(0.36, 0.05, 0.15, m.dark, 0.32, 0.725, 0));
  addRim(c, 0.32, 0.73, 0.4, 0.18, 0.025);
  addDriver(c, 0.2, 0.82);
  car.add(box(0.02, 0.13, 0.28, m.dark, 0.7, 0.78, 0, -0.95));
  addSteering(c, 0.52, 0.8);

  // the engine cover behind the driver: a low flat-topped box with upright sides, sloping down to the gearbox
  car.add(
    loft(
      {
        x: [-0.1, -0.45, -0.85, -1.25, -1.55, -1.8],
        hw: [0.2, 0.2, 0.18, 0.15, 0.11, 0.08],
        bottom: [0.11, 0.11, 0.12, 0.14, 0.18, 0.22],
        top: [0.74, 0.7, 0.64, 0.56, 0.5, 0.44],
        squareness: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
      },
      paint,
      50,
      28,
    ),
  );
  // the roll hoop: a tall, thin blade standing well above the engine cover, with the engine intake in its front face
  car.add(new THREE.Mesh(plateGeometry([[0.04, 0.66], [0.02, 0.88], [-0.1, 0.94], [-0.3, 0.93], [-0.55, 0.8], [-0.8, 0.68]], 0, 0.11), paint));
  car.add(box(0.03, 0.12, 0.09, m.dark, 0.035, 0.8, 0));
  // the louvred engine cover behind the roll hoop
  for (let i = 0; i < 6; i++) car.add(box(0.012, 0.004, 0.32, m.dark, -0.35 - i * 0.06, 0.712 - i * 0.006, 0));

  // the box radiator pods beside the cockpit: flat sided and flat topped, with a tall upright inlet in the front of each
  const sp = addPods(c, 0.3);
  for (const side of [1, -1] as const) {
    const zMid = ((sp.zOut[0] + sp.zIn[0]) / 2) * side;
    const high = sp.top[1] - sp.bottom[1];
    car.add(box(0.05, high * 0.8, (sp.zOut[0] - sp.zIn[0]) * 0.6, m.dark, sp.x[0] - 0.015, (sp.top[0] + sp.bottom[0]) / 2 + 0.03, zMid));
    // a flat dark radiator exit grille on the rear flank
    car.add(box(0.22, 0.12, 0.01, m.dark, -0.7, 0.34, (sp.zOut[4] + 0.002) * side));
  }

  // a flat plank floor, no edge wing and only a small step at the back
  addFloor(c, false, false);
  car.add(box(0.5, 0.012, 0.8, m.floor, c.spec.diffuser.xStart - 0.12, 0.09, 0));
  // the exposed rear suspension
  for (const side of [1, -1] as const) {
    car.add(rod(new THREE.Vector3(-1.2, 0.3, 0.22 * side), new THREE.Vector3(-1.43, 0.34, 0.7 * side), 0.016, m.carbon));
    car.add(rod(new THREE.Vector3(-1.5, 0.15, 0.2 * side), new THREE.Vector3(-1.43, 0.3, 0.7 * side), 0.016, m.carbon));
  }
}

// ---------------------------------------------------------------------------------------------------------------
// 2004
// ---------------------------------------------------------------------------------------------------------------

function body2004(c: BodyContext) {
  const { car, m, paint, spec } = c;

  // a high, slim nose that rises off the front wing pylons and widens into a narrow, tall tub
  car.add(
    loft(
      {
        x: [2.3, 2.1, 1.85, 1.55, 1.25, 0.95, 0.65, 0.35, 0.05, -0.25],
        hw: [0.06, 0.085, 0.11, 0.135, 0.165, 0.2, 0.22, 0.23, 0.23, 0.2],
        bottom: [0.22, 0.24, 0.26, 0.25, 0.21, 0.16, 0.12, 0.1, 0.1, 0.1],
        top: [0.34, 0.38, 0.44, 0.52, 0.6, 0.68, 0.75, 0.8, 0.82, 0.84],
        squareness: [0.9, 0.85, 0.8, 0.78, 0.76, 0.74, 0.72, 0.7, 0.7, 0.72],
      },
      paint,
      80,
      32,
    ),
  );
  // the open cockpit, the high rim and the helmet showing above it
  car.add(ellipsoid(spec.details.cockpit.rx, 0.05, spec.details.cockpit.rz, m.dark, spec.details.cockpit.x, spec.details.cockpit.y + 0.03, 0));
  addRim(c, spec.details.cockpit.x, spec.details.cockpit.y + 0.04, spec.details.cockpit.rimRx, spec.details.cockpit.rimRz);
  addDriver(c, spec.details.cockpit.x - 0.1, 0.9, 0.11);
  addSteering(c, spec.details.cockpit.x + 0.22, 0.9);

  // the smooth engine cover and the tail between the rear wheels
  car.add(
    loft(
      {
        x: [-0.1, -0.5, -0.95, -1.4, -1.75, -1.95],
        hw: [0.22, 0.21, 0.17, 0.12, 0.08, 0.06],
        bottom: [0.1, 0.1, 0.11, 0.14, 0.19, 0.24],
        top: [0.82, 0.8, 0.72, 0.62, 0.54, 0.48],
        squareness: [0.78, 0.78, 0.78, 0.78, 0.78, 0.78],
      },
      paint,
      60,
      28,
    ),
  );
  // the tall periscope airbox over the driver's head, with its round intake facing forward
  car.add(
    loft(
      {
        x: [0.05, -0.05, -0.3, -0.65, -1.05, -1.4],
        hw: [0.11, 0.13, 0.135, 0.12, 0.085, 0.04],
        bottom: [0.8, 0.76, 0.72, 0.68, 0.64, 0.62],
        top: [0.9, 0.97, 0.98, 0.93, 0.84, 0.72],
        squareness: [0.5, 0.5, 0.5, 0.55, 0.6, 0.7],
      },
      paint,
      50,
      28,
    ),
  );
  car.add(ellipsoid(0.04, 0.075, 0.075, m.dark, 0.05, 0.89, 0));
  // the small winglet on top of the airbox
  car.add(box(0.14, 0.012, 0.3, m.carbon, -0.15, 1.0, 0, 0.08));

  // round pillow sidepods with a big oval scoop high beside the driver
  const sp = addPods(c, 0.82, (i) => (i < 3 ? 0.03 : 0), (i) => (i >= 2 && i <= 4 ? 1.04 : 1));
  for (const side of [1, -1] as const) {
    const zMid = ((sp.zOut[0] + sp.zIn[0]) / 2) * side;
    car.add(ellipsoid(0.05, (sp.top[0] - sp.bottom[0]) * 0.46, (sp.zOut[0] - sp.zIn[0]) * 0.4, m.dark, sp.x[0] - 0.01, (sp.top[0] + sp.bottom[0]) / 2 + 0.02, zMid));
    // a thin lip of body paint around the scoop
    const lip = ellipsoid(0.04, (sp.top[0] - sp.bottom[0]) * 0.52, (sp.zOut[0] - sp.zIn[0]) * 0.46, paint, sp.x[0] + 0.03, (sp.top[0] + sp.bottom[0]) / 2 + 0.02, zMid);
    car.add(lip);
  }

  addFloor(c, true, true);
  car.add(ellipsoid(0.07, 0.05, 0.05, m.carbon, spec.details.exhaust[0], spec.details.exhaust[1], 0));
}

// ---------------------------------------------------------------------------------------------------------------
// 2014
// ---------------------------------------------------------------------------------------------------------------

function body2014(c: BodyContext) {
  const { car, m, paint, spec } = c;

  // a thick, high nose with a hammer-head tip, dropping into the wide monocoque
  car.add(
    loft(
      {
        x: [2.82, 2.72, 2.52, 2.2, 1.85, 1.5, 1.1, 0.8, 0.45, 0.15, -0.15],
        hw: [0.09, 0.12, 0.135, 0.15, 0.165, 0.185, 0.205, 0.235, 0.25, 0.26, 0.22],
        bottom: [0.34, 0.33, 0.3, 0.26, 0.22, 0.18, 0.14, 0.12, 0.1, 0.1, 0.1],
        top: [0.44, 0.48, 0.5, 0.53, 0.56, 0.6, 0.63, 0.66, 0.68, 0.72, 0.74],
        squareness: [0.9, 0.85, 0.8, 0.75, 0.72, 0.7, 0.66, 0.64, 0.64, 0.66, 0.7],
      },
      paint,
      90,
      32,
    ),
  );
  // the thumb: the drooping tip of the nose
  car.add(ellipsoid(0.16, 0.06, 0.1, paint, 2.78, 0.38, 0));
  // the cockpit, the dark seat and the steering wheel; the driver's helmet just shows
  car.add(ellipsoid(spec.details.cockpit.rx, 0.045, spec.details.cockpit.rz, m.dark, spec.details.cockpit.x, spec.details.cockpit.y + 0.06, 0));
  addRim(c, spec.details.cockpit.x, spec.details.cockpit.y + 0.07, spec.details.cockpit.rimRx, spec.details.cockpit.rimRz);
  addDriver(c, spec.details.cockpit.x - 0.12, 0.8, 0.1);
  addSteering(c, spec.details.cockpit.x + 0.22, 0.86);

  // a narrow tall engine cover with sharply pinched sides, and a thin airbox with a round intake
  car.add(
    loft(
      {
        x: [-0.1, -0.5, -0.95, -1.4, -1.9, -2.3],
        hw: [0.23, 0.22, 0.17, 0.12, 0.09, 0.07],
        bottom: [0.1, 0.1, 0.12, 0.14, 0.18, 0.24],
        top: [0.88, 0.94, 0.88, 0.76, 0.6, 0.48],
        squareness: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
      },
      paint,
      60,
      28,
    ),
  );
  car.add(
    loft(
      {
        x: [0.06, -0.02, -0.22, -0.55, -1.0, -1.4],
        hw: [0.1, 0.125, 0.14, 0.13, 0.1, 0.05],
        bottom: [0.74, 0.72, 0.64, 0.62, 0.62, 0.62],
        top: [0.92, 1.02, 1.06, 1.0, 0.86, 0.72],
        squareness: [0.7, 0.7, 0.7, 0.75, 0.8, 0.8],
      },
      paint,
      50,
      28,
    ),
  );
  car.add(ellipsoid(0.04, 0.09, 0.075, m.dark, 0.04, 0.88, 0));

  // the halo: a pillar up from the front of the cockpit and two arms back to the airbox
  const haloMaterial = m.halo ?? m.carbon;
  const front = new THREE.CatmullRomCurve3([new THREE.Vector3(0.98, 0.68, 0), new THREE.Vector3(0.94, 0.8, 0), new THREE.Vector3(0.86, 0.9, 0)]);
  car.add(new THREE.Mesh(new THREE.TubeGeometry(front, 16, 0.032, 10), haloMaterial));
  for (const side of [1, -1] as const) {
    const arc = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.86, 0.9, 0),
      new THREE.Vector3(0.5, 0.93, 0.2 * side),
      new THREE.Vector3(0.1, 0.9, 0.27 * side),
      new THREE.Vector3(-0.2, 0.82, 0.22 * side),
      new THREE.Vector3(-0.3, 0.76, 0.2 * side),
    ]);
    car.add(new THREE.Mesh(new THREE.TubeGeometry(arc, 36, 0.03, 10), haloMaterial));
  }

  // wide sidepods: a huge oval mouth in the front, and a deep undercut from the inlet back
  const sp = addPods(c, 0.55, (i) => (i >= 1 && i <= 5 ? 0.13 : 0));
  for (const side of [1, -1] as const) {
    const zMid = ((sp.zOut[0] + sp.zIn[0]) / 2) * side;
    car.add(ellipsoid(0.06, (sp.top[0] - sp.bottom[0]) * 0.5, (sp.zOut[0] - sp.zIn[0]) * 0.48, m.dark, sp.x[0] - 0.01, (sp.top[0] + sp.bottom[0]) / 2 + 0.02, zMid));
    // a dark undercut tray under the pod, so the cut-away shows
    car.add(box(1.0, 0.1, 0.3, m.dark, -0.2, 0.17, (sp.zOut[3] - 0.2) * side));
    // a deflector winglet on top of the pod, and a row of small fences on the floor edge ahead of the rear wheel
    car.add(box(0.28, 0.01, 0.12, m.carbon, 0.45, sp.top[2] + 0.015, (sp.zOut[2] - 0.12) * side, 0.05));
    for (let i = 0; i < 4; i++) car.add(box(0.2, 0.1 - i * 0.012, 0.006, m.carbon, -0.9 - i * 0.04, 0.1, (0.6 + i * 0.03) * side));
    // the mirror's winglet and the brake-duct winglets on the front wheels' inner side
    car.add(box(0.12, 0.008, 0.08, m.carbon, 0.68, 0.7, (spec.details.mirror[2] - 0.05) * side));
    for (let i = 0; i < 3; i++) car.add(box(0.14, 0.006, 0.07, m.carbon, spec.wheels.front.x - 0.02, 0.17 + i * 0.07, (spec.wheels.front.z - 0.25) * side));
  }

  addFloor(c, true, true);
  car.add(ellipsoid(0.06, 0.05, 0.05, m.carbon, spec.details.exhaust[0], spec.details.exhaust[1], 0));
  car.add(
    arm(new THREE.Vector3(spec.wheels.front.x + 0.28, 0.2, 0.1), new THREE.Vector3(spec.wheels.front.x + 0.28, 0.2, -0.1), 0.05, 0.012, m.carbon),
  );
}

/** Builds the body of a generation that has its own construction (1980s, 2004, 2014); other generations use the generic body. */
export function classicBody(context: BodyContext): void {
  if (context.spec.id === 'gen1980s') body1980s(context);
  else if (context.spec.id === 'gen2004') body2004(context);
  else if (context.spec.id === 'gen2014') body2014(context);
}

export const hasClassicBody = (id: string): boolean => id === 'gen1980s' || id === 'gen2004' || id === 'gen2014';
