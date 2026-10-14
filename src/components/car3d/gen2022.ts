import * as THREE from 'three';

import { GEN2022, frontWingSection, rearWingSection } from '../../data/cars/gen2022';
import { spline } from '../../data/cars/spline';
import type { Livery } from '../../data/liveries';
import { applyCarbonWeave, applyLiveryPaint, buildLiveryPictures } from './paint';
import { arm, box, buildWheel, loftGeometry, plateGeometry, range, rod, wingGeometry } from './parts';

// The 2022 (ground effect) car: a low nose, one smooth hump from the cockpit back over the airbox and engine cover,
// downwash sidepods, a flat floor with an edge wing and a diffuser, an arrow-shaped front wing with curved stacked
// flaps and tall end plates, a wide bowl-shaped rear wing on two pillars, a low halo, and wheels with covers.
// All measurements are in src/data/cars/gen2022.ts, which the 2D race icon uses too.

const DEG = Math.PI / 180;
const FLOOR = GEN2022.floor;

/** The floor outline on the right side, as [x, half width], front to back. */
function floorEdge(steps = 44): [number, number][] {
  return Array.from({ length: steps + 1 }, (_, i) => [spline(FLOOR.x, i / steps), spline(FLOOR.hw, i / steps)] as [number, number]);
}

/** The flat floor plank: widest beside the sidepods, tapering to the front and back, inside the wheels. */
function floorGeometry(): THREE.BufferGeometry {
  const right = floorEdge().map(([x, hw]) => new THREE.Vector2(x, hw));
  const left = right.map((p) => new THREE.Vector2(p.x, -p.y)).reverse();
  const geometry = new THREE.ExtrudeGeometry(new THREE.Shape([...right, ...left]), { depth: FLOOR.thickness, bevelEnabled: false });
  geometry.rotateX(-Math.PI / 2); // lie flat: the outline becomes the floor plan, extruded upward
  geometry.translate(0, FLOOR.y, 0);
  return geometry;
}

/** The curled-up edge along the side of the floor (the "edge wing"), for one side. */
function floorEdgeWingGeometry(side: 1 | -1): THREE.BufferGeometry {
  const points = floorEdge().filter(([x]) => x < 1.35 && x > -1.4);
  const positions: number[] = [];
  const indices: number[] = [];
  const y0 = FLOOR.y + FLOOR.thickness;
  for (const [x, hw] of points) {
    const height = 0.045 + 0.1 * Math.min(1, Math.max(0, (x + 0.6) / 1.7)); // a tall wedge at the front, low at the back
    positions.push(x, y0, hw * side, x, y0 + height, (hw - 0.03) * side);
  }
  for (let i = 0; i < points.length - 1; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Height of the diffuser's upper surface at `s` (0 at the front of it, 1 at the very back). */
const diffuserY = (s: number) => FLOOR.y + FLOOR.thickness + GEN2022.diffuser.rise * Math.pow(s, 1.7);

/** The diffuser: the floor sweeping up and back into the air between the rear wheels. */
function diffuserGeometry(): THREE.BufferGeometry {
  const { xStart, xEnd, hw } = GEN2022.diffuser;
  const columns = 14;
  const rows = 10;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= columns; i++) {
    const s = i / columns;
    const half = hw * (1 - 0.06 * s);
    for (let j = 0; j <= rows; j++) positions.push(xStart + (xEnd - xStart) * s, diffuserY(s), -half + (2 * half * j) / rows);
  }
  const row = rows + 1;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      const a = i * row + j;
      indices.push(a, a + 1, a + row, a + 1, a + row + 1, a + row);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** A thin vertical fin in the diffuser, following its curve. */
function diffuserStrake(z: number): THREE.BufferGeometry {
  const { xStart, xEnd } = GEN2022.diffuser;
  const steps = 10;
  const lower: [number, number][] = [];
  const upper: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const s = i / steps;
    const x = xStart + (xEnd - xStart) * s;
    lower.push([x, diffuserY(s) - 0.002]);
    upper.push([x, diffuserY(s) + 0.11 * (1 - 0.4 * s)]);
  }
  return plateGeometry([...lower, ...upper.reverse()], z, 0.012);
}

/** How dark a #RRGGBB color is, 0 (black) to 1. */
function lightness(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

/** Where the side of the spine is at height `y` and distance `x` along the car (to sit small details on its surface). */
function spineSurfaceZ(x: number, y: number, squareness = 0.76): number {
  const S = GEN2022.spine;
  let best = 0;
  let bestDistance = Infinity;
  for (let i = 0; i <= 400; i++) {
    const d = Math.abs(spline(S.x, i / 400) - x);
    if (d < bestDistance) {
      bestDistance = d;
      best = i / 400;
    }
  }
  const yb = spline(S.bottom, best);
  const yt = spline(S.top, best);
  const u = Math.min(0.999, Math.abs((y - (yb + yt) / 2) / ((yt - yb) / 2)));
  const cos = Math.pow(u, 1 / squareness);
  return spline(S.hw, best) * Math.pow(Math.sqrt(1 - cos * cos), squareness);
}

/** Builds the 2022 car in the given livery. Free it with `disposeCar` (see buildCar.ts). */
export function buildGen2022(livery: Livery): THREE.Group {
  const car = new THREE.Group();
  const matte = livery.finish === 'matte';
  const pictures = buildLiveryPictures(livery);

  // body paint: its color comes from the livery pictures, by position on the car
  const paint = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: matte ? 0.1 : 0.25,
    roughness: matte ? 0.6 : 0.3,
    clearcoat: matte ? 0.15 : 1,
    clearcoatRoughness: matte ? 0.5 : 0.08,
  });
  applyLiveryPaint(paint, pictures);

  const solid = (hex: string) =>
    new THREE.MeshPhysicalMaterial({
      color: hex,
      metalness: 0.2,
      roughness: matte ? 0.55 : 0.35,
      clearcoat: matte ? 0.1 : 0.8,
      clearcoatRoughness: 0.15,
      side: THREE.DoubleSide,
    });
  const m = {
    wing: solid(livery.parts.wing),
    flap: solid(livery.parts.flap),
    endplate: solid(livery.parts.endplate),
    floor: new THREE.MeshStandardMaterial({ color: livery.parts.floor, metalness: 0.1, roughness: 0.85, side: THREE.DoubleSide }),
    carbon: new THREE.MeshStandardMaterial({ color: 0x131316, metalness: 0.45, roughness: 0.5, side: THREE.DoubleSide }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x0f0f11, metalness: 0, roughness: 0.92 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x9a9da3, metalness: 0.9, roughness: 0.35 }),
    band: new THREE.MeshStandardMaterial({ color: 0xf5d90a, metalness: 0, roughness: 0.6 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x050507, metalness: 0.1, roughness: 0.8 }),
    light: new THREE.MeshStandardMaterial({ color: 0xff2a2a, emissive: 0xff0000, emissiveIntensity: 1.2 }),
  };

  // carbon-fibre weave on the floor and on any wing that is carbon black
  applyCarbonWeave(m.floor);
  for (const key of ['wing', 'flap', 'endplate'] as const) if (lightness(livery.parts[key]) < 0.12) applyCarbonWeave(m[key]);

  // ---- bodywork: nose, cockpit, airbox and engine cover are one smooth surface ----
  car.add(new THREE.Mesh(loftGeometry(GEN2022.spine, { rings: 110, sides: 36, squareness: 0.76 }), paint));

  // the engine air intake: a dark opening in the front of the hump, with the camera pod on top
  const intake = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), m.dark);
  intake.scale.set(0.045, 0.075, 0.09);
  intake.position.set(0.0, 0.735, 0);
  car.add(intake);
  const cameraPod = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 0.1, 14), m.carbon);
  cameraPod.position.set(-0.46, 1.02, 0);
  car.add(cameraPod);
  car.add(box(0.1, 0.035, 0.065, m.carbon, -0.46, 1.08, 0));

  // the cockpit opening, with a dark seat showing in it (no driver)
  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 12), m.dark);
  cockpit.scale.set(0.42, 0.045, 0.18);
  cockpit.position.set(0.5, 0.625, 0);
  car.add(cockpit);
  // the raised rim around the cockpit opening, in body paint
  const rimPoints = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    return new THREE.Vector3(0.5 + 0.46 * Math.cos(a), 0.635, 0.2 * Math.sin(a));
  });
  car.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPoints, true), 56, 0.022, 8, true), paint));

  // cooling slats on the sides of the engine cover
  for (const side of [1, -1] as const) {
    for (const y of [0.6, 0.67, 0.74]) {
      const slat = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), m.dark);
      slat.scale.set(0.11, 0.009, 0.014);
      slat.position.set(-0.8, y, (spineSurfaceZ(-0.8, y) + 0.002) * side);
      car.add(slat);
    }
  }

  // sidepods, with a wide dark inlet at the front of each
  const sp = GEN2022.pods[livery.sidepod];
  const podSpec = {
    x: sp.x,
    zc: sp.zIn.map((zi, i) => (zi + sp.zOut[i]) / 2),
    hw: sp.zIn.map((zi, i) => (sp.zOut[i] - zi) / 2),
    bottom: sp.bottom,
    top: sp.top,
  };
  for (const side of [1, -1] as const) {
    car.add(new THREE.Mesh(loftGeometry(podSpec, { rings: 70, sides: 28, squareness: 0.7, side }), paint));
    const inlet = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), m.dark);
    inlet.scale.set(0.04, (sp.top[0] - sp.bottom[0]) * 0.3, (sp.zOut[0] - sp.zIn[0]) * 0.46);
    inlet.position.set(sp.x[0] - 0.02, (sp.top[0] + sp.bottom[0]) / 2, ((sp.zOut[0] + sp.zIn[0]) / 2) * side);
    car.add(inlet);
    // thin vertical fences ahead of the sidepod, behind the front wheel
    for (const z of [0.42, 0.52, 0.62]) {
      car.add(new THREE.Mesh(plateGeometry([[1.3, 0.07], [1.24, 0.19], [1.08, 0.24], [0.94, 0.2], [0.92, 0.07]], z * side, 0.008), m.carbon));
    }
  }

  // ---- floor, edge wing, diffuser and rear end ----
  car.add(new THREE.Mesh(floorGeometry(), m.floor));
  car.add(new THREE.Mesh(diffuserGeometry(), m.floor));
  for (const side of [1, -1] as const) {
    car.add(new THREE.Mesh(floorEdgeWingGeometry(side), m.floor));
    for (const z of [0.17, 0.34]) car.add(new THREE.Mesh(diffuserStrake(z * side), m.carbon));
  }
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.14, 16), m.carbon);
  exhaust.rotation.z = Math.PI / 2;
  exhaust.position.set(-2.3, 0.42, 0);
  car.add(exhaust);

  // ---- front wing: swept back like an arrow from above, a shallow V from the front ----
  const fw = GEN2022.frontWing;
  for (const side of [1, -1] as const) {
    for (const e of fw.elements) {
      const zs = range(e.from, fw.span - 0.01, 26).map((z) => z * side);
      const geometry = wingGeometry(
        zs,
        (z) => {
          const s = frontWingSection(e, z);
          return { x: s.x, y: s.y, chord: s.chord, angle: s.angleDeg * DEG };
        },
        e.camber,
        0.045,
      );
      car.add(new THREE.Mesh(geometry, e.flap ? m.flap : m.wing));
    }
    // small vertical vanes along the flaps
    for (const e of fw.elements.filter((el) => el.flap)) {
      for (const z of [0.3, 0.5, 0.7, 0.85]) {
        const s = frontWingSection(e, z);
        const top = s.y + 0.45 * s.chord * Math.sin(s.angleDeg * DEG) + e.camber * s.chord + 0.012;
        car.add(box(0.05, 0.04, 0.006, m.carbon, s.x - s.chord * 0.45, top + 0.02, z * side));
      }
    }
    car.add(new THREE.Mesh(plateGeometry(fw.endplate, fw.span * side, 0.014), m.endplate));
    car.add(box(0.5, 0.012, 0.08, m.endplate, 2.35, 0.055, (fw.span + 0.035) * side)); // footplate flaring outward
  }

  // ---- rear wing: wide bowl, two pillars, big swept end plates, beam wing ----
  const rw = GEN2022.rearWing;
  for (const side of [1, -1] as const) {
    for (const e of rw.elements) {
      const zs = range(0, rw.span - 0.01, 22).map((z) => z * side);
      const geometry = wingGeometry(
        zs,
        (z) => {
          const s = rearWingSection(e, z);
          return { x: s.x, y: s.y, chord: s.chord, angle: s.angleDeg * DEG };
        },
        e.camber,
        0.05,
      );
      car.add(new THREE.Mesh(geometry, e.flap ? m.flap : m.wing));
    }
    car.add(new THREE.Mesh(wingGeometry(range(0, 0.5, 12).map((z) => z * side), () => ({ x: -2.1, y: 0.42, chord: 0.17, angle: 8 * DEG }), 0.05, 0.04), m.carbon));
    car.add(new THREE.Mesh(wingGeometry(range(0, 0.5, 12).map((z) => z * side), () => ({ x: -2.16, y: 0.5, chord: 0.14, angle: 14 * DEG }), 0.06, 0.04), m.carbon));
    car.add(new THREE.Mesh(plateGeometry(rw.endplate, rw.span * side, 0.014), m.endplate));
    // the two thin pillars holding the wing up
    car.add(new THREE.Mesh(plateGeometry([[-1.98, 0.46], [-2.06, 0.46], [-2.3, 0.7], [-2.2, 0.72]], 0.09 * side, 0.02), m.carbon));
  }
  car.add(box(0.03, 0.07, 0.12, m.light, -2.38, 0.56, 0));
  car.add(box(0.12, 0.05, 0.08, m.carbon, -2.4, 0.86, 0)); // DRS actuator pod on the flap
  car.add(box(0.06, 0.2, 0.03, m.carbon, -2.32, 0.62, 0)); // centre support below the wing

  // ---- halo: a short pillar up from the nose cowl, then two arms running almost straight back over the driver
  // to land on the airbox hump behind the cockpit ----
  const front = new THREE.CatmullRomCurve3([new THREE.Vector3(0.98, 0.6, 0), new THREE.Vector3(0.93, 0.72, 0), new THREE.Vector3(0.84, 0.8, 0)]);
  car.add(new THREE.Mesh(new THREE.TubeGeometry(front, 16, 0.027, 8), m.metal));
  for (const side of [1, -1] as const) {
    const arm = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.84, 0.8, 0),
      new THREE.Vector3(0.5, 0.83, 0.15 * side),
      new THREE.Vector3(0.15, 0.8, 0.23 * side),
      new THREE.Vector3(-0.2, 0.74, 0.19 * side),
    ]);
    car.add(new THREE.Mesh(new THREE.TubeGeometry(arm, 28, 0.025, 8), m.metal));
    // mirrors on short stalks beside the halo
    car.add(box(0.1, 0.05, 0.13, m.carbon, 0.7, 0.74, 0.4 * side));
    car.add(rod(new THREE.Vector3(0.72, 0.64, 0.34 * side), new THREE.Vector3(0.7, 0.73, 0.4 * side), 0.012, m.carbon));
  }

  // ---- wheels and suspension ----
  for (const [axle, isFront] of [[GEN2022.wheels.front, true], [GEN2022.wheels.rear, false]] as const) {
    for (const side of [1, -1] as const) {
      const wheel = buildWheel(axle.radius, axle.width, side, m);
      wheel.position.set(axle.x, axle.radius, axle.z * side);
      car.add(wheel);

      const hubZ = (axle.z - axle.width / 2 - 0.07) * side;
      const root = isFront ? 0.12 : 0.1;
      const lower = isFront ? 0.15 : 0.17;
      const upper = isFront ? 0.33 : 0.38;
      const chord = isFront ? 0.055 : 0.045;
      for (const dx of [-0.22, 0.22]) {
        car.add(arm(new THREE.Vector3(axle.x + dx, lower, root * side), new THREE.Vector3(axle.x, axle.radius - 0.1, hubZ), chord, 0.014, m.carbon));
        car.add(arm(new THREE.Vector3(axle.x + dx, upper, root * side), new THREE.Vector3(axle.x, axle.radius + 0.1, hubZ), chord, 0.014, m.carbon));
      }
      // push rod from the top of the wheel upright up and in, and a track rod
      car.add(rod(new THREE.Vector3(axle.x, axle.radius + 0.12, hubZ), new THREE.Vector3(axle.x + (isFront ? -0.1 : 0.1), upper + 0.1, (root + 0.02) * side), 0.013, m.carbon));
      car.add(rod(new THREE.Vector3(axle.x + (isFront ? -0.12 : 0.12), 0.27, root * side), new THREE.Vector3(axle.x - 0.04, axle.radius + 0.02, hubZ), 0.011, m.carbon));
    }
  }

  car.userData.dispose = () => {
    pictures.top.dispose();
    pictures.side.dispose();
    car.traverse((object) => {
      if (object instanceof THREE.Mesh) object.geometry.dispose();
    });
    paint.dispose();
    Object.values(m).forEach((material) => material.dispose());
  };
  return car;
}
