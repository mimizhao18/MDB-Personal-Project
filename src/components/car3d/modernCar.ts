import * as THREE from 'three';

import { spline } from '../../data/cars/spline';
import { frontWingSection, rearWingSection } from '../../data/cars/spec';
import type { AeroMode, CarSpec, ExtraPart, PodShape } from '../../data/cars/spec';
import type { Livery } from '../../data/liveries';
import { applyCarbonWeave, applyLiveryPaint, buildLiveryPictures, disposePictures } from './paint';
import { arm, box, buildWheel, loftGeometry, plateGeometry, range, rod, wingGeometry } from './parts';

// A modern ground-effect-era car (2022, 2026) built from its measurements (src/data/cars): one smooth surface for the
// nose, cockpit, airbox and engine cover; sidepods; a flat floor with an edge wing and a diffuser; a swept front wing;
// a bowl-shaped rear wing; a low halo; and wheels with covers. Which parts exist, and their sizes, come from the spec,
// so the 2022 and 2026 cars share this code and differ only in their measurements and a few features.

const DEG = Math.PI / 180;

export interface CarOptions {
  /** Cornering (the default, high downforce) or straight (low drag): only cars with active wings change. */
  aero?: AeroMode;
}

/** The floor outline on the right side, as [x, half width], front to back. */
function floorEdge(spec: CarSpec, steps = 44): [number, number][] {
  return Array.from({ length: steps + 1 }, (_, i) => [spline(spec.floor.x, i / steps), spline(spec.floor.hw, i / steps)] as [number, number]);
}

/** The flat floor plank: widest beside the sidepods, tapering to the front and back, inside the wheels. */
function floorGeometry(spec: CarSpec): THREE.BufferGeometry {
  const right = floorEdge(spec).map(([x, hw]) => new THREE.Vector2(x, hw));
  const left = right.map((p) => new THREE.Vector2(p.x, -p.y)).reverse();
  const geometry = new THREE.ExtrudeGeometry(new THREE.Shape([...right, ...left]), { depth: spec.floor.thickness, bevelEnabled: false });
  geometry.rotateX(-Math.PI / 2); // lie flat: the outline becomes the floor plan, extruded upward
  geometry.translate(0, spec.floor.y, 0);
  return geometry;
}

/** The curled-up edge along the side of the floor (the "edge wing"), for one side. */
function floorEdgeWingGeometry(spec: CarSpec, side: 1 | -1): THREE.BufferGeometry {
  const w = spec.edgeWing;
  const points = floorEdge(spec).filter(([x]) => x < w.xFront && x > w.xBack);
  const positions: number[] = [];
  const indices: number[] = [];
  const y0 = spec.floor.y + spec.floor.thickness;
  for (const [x, hw] of points) {
    const height = w.low + (w.high - w.low) * Math.min(1, Math.max(0, (x - w.rampFrom) / w.rampSpan));
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
const diffuserY = (spec: CarSpec, s: number) => spec.floor.y + spec.floor.thickness + spec.diffuser.rise * Math.pow(s, 1.7);

/** The diffuser: the floor sweeping up and back into the air between the rear wheels. */
function diffuserGeometry(spec: CarSpec): THREE.BufferGeometry {
  const { xStart, xEnd, hw } = spec.diffuser;
  const columns = 14;
  const rows = 10;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= columns; i++) {
    const s = i / columns;
    const half = hw * (1 - 0.06 * s);
    for (let j = 0; j <= rows; j++) positions.push(xStart + (xEnd - xStart) * s, diffuserY(spec, s), -half + (2 * half * j) / rows);
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
function diffuserStrake(spec: CarSpec, z: number): THREE.BufferGeometry {
  const { xStart, xEnd } = spec.diffuser;
  const steps = 10;
  const lower: [number, number][] = [];
  const upper: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const s = i / steps;
    const x = xStart + (xEnd - xStart) * s;
    lower.push([x, diffuserY(spec, s) - 0.002]);
    upper.push([x, diffuserY(spec, s) + 0.11 * (1 - 0.4 * s)]);
  }
  return plateGeometry([...lower, ...upper.reverse()], z, 0.012);
}

/** How dark a #RRGGBB color is, 0 (black) to 1. */
function lightness(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

/** Where the side of the spine is at height `y` and distance `x` along the car (to sit small details on its surface). */
function spineSurfaceZ(spec: CarSpec, x: number, y: number): number {
  const S = spec.spine;
  let best = 0;
  let bestDistance = Infinity;
  for (let i = 0; i <= 400; i++) {
    const d = Math.abs(spline(S.x, i / 400) - x);
    if (d < bestDistance) {
      bestDistance = d;
      best = i / 400;
    }
  }
  const squareness = S.squareness ? spline(S.squareness, best) : 0.76;
  const yb = spline(S.bottom, best);
  const yt = spline(S.top, best);
  const u = Math.min(0.999, Math.abs((y - (yb + yt) / 2) / ((yt - yb) / 2)));
  const cos = Math.pow(u, 1 / squareness);
  return spline(S.hw, best) * Math.pow(Math.sqrt(1 - cos * cos), squareness);
}

/** A thin dark strip along the outside of a sidepod at height `y`, from its inlet back a short way. */
function flankLine(sp: PodShape, y: number, side: 1 | -1): THREE.BufferGeometry {
  const samples: [number, number][] = [];
  for (let i = 0; i <= 120; i++) {
    const x = spline(sp.x, i / 120);
    if (x < sp.x[0] - 0.02 && x > 0.2) samples.push([x, spline(sp.zOut, i / 120)]);
  }
  const positions: number[] = [];
  const indices: number[] = [];
  for (const [x, z] of samples) positions.push(x, y, (z + 0.003) * side, x, y + 0.012, (z + 0.003) * side);
  for (let i = 0; i < samples.length - 1; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Splits [from, to] into `count` runs with a small gap between them (the sections of an active flap). */
function sectionRanges(from: number, to: number, count: number, gap = 0.014): [number, number][] {
  if (count <= 1) return [[from, to]];
  const width = (to - from - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, i) => [from + i * (width + gap), from + i * (width + gap) + width] as [number, number]);
}

/** Builds a car from its measurements, in the given livery. Free it with `disposeCar` (see buildCar.ts). */
export function buildModernCar(spec: CarSpec, livery: Livery, options: CarOptions = {}): THREE.Group {
  const aero = options.aero ?? 'corner';
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
    rim: new THREE.MeshStandardMaterial({ color: spec.wheelLook.rimColor, metalness: 0.9, roughness: 0.35 }),
    mark: new THREE.MeshStandardMaterial({ color: 0xe6e6e6, metalness: 0, roughness: 0.7 }),
  };
  const partMaterial = (part: ExtraPart): THREE.Material => (part === 'paint' ? paint : m[part]);

  // carbon-fibre weave on the floor and on any wing that is carbon black
  applyCarbonWeave(m.floor);
  for (const key of ['wing', 'flap', 'endplate'] as const) if (lightness(livery.parts[key]) < 0.12) applyCarbonWeave(m[key]);

  // ---- bodywork: nose, cockpit, airbox and engine cover are one smooth surface ----
  car.add(new THREE.Mesh(loftGeometry(spec.spine, { rings: 110, sides: 36, squareness: 0.76 }), paint));
  // the shoulder that fills in the space between the airbox and the sidepods
  car.add(new THREE.Mesh(loftGeometry(spec.shoulder, { rings: 60, sides: 32 }), paint));

  // the airbox: a tall rounded block standing on the engine cover with a steep front face
  car.add(new THREE.Mesh(loftGeometry(spec.airbox, { rings: 50, sides: 28 }), paint));
  // the intake gap: a dark slot between the cockpit and the front of the airbox, which is lifted clear of the body there
  const [slotX, slotY] = spec.details.intake;
  car.add(box(0.14, 0.07, spec.airbox.hw[1] * 1.7, m.dark, slotX, slotY, 0));

  // the camera pod on top: a short stalk, a boxy housing leaning forward a little, and a lens
  if (spec.details.cameraPod) {
  const [podX, podY] = spec.details.cameraPod;
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.05, 12), m.carbon);
  stalk.position.set(podX, podY + 0.02, 0);
  car.add(stalk);
  const housing = box(0.11, 0.085, 0.085, m.carbon, podX + 0.01, podY + 0.085, 0);
  housing.rotation.z = 0.08;
  car.add(housing);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.02, 14), m.metal);
  lens.rotation.z = Math.PI / 2;
  lens.position.set(podX + 0.07, podY + 0.085, 0);
  car.add(lens);
  }

  // the cockpit opening, with a dark seat showing in it (no driver)
  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 12), m.dark);
  const ck = spec.details.cockpit;
  cockpit.scale.set(ck.rx, 0.045, ck.rz);
  cockpit.position.set(ck.x, ck.y, 0);
  car.add(cockpit);
  // the steering wheel and the dark seat back, so the cockpit is not an empty hole
  const wheelRim = box(0.03, 0.09, 0.2, m.dark, ck.x + ck.rx * 0.55, ck.y + 0.07, 0);
  wheelRim.rotation.z = -0.5;
  car.add(wheelRim);
  car.add(box(0.05, 0.12, ck.rz * 1.5, m.dark, ck.x - ck.rx * 0.65, ck.y + 0.08, 0));
  // the raised rim around the cockpit opening, in body paint
  const rimPoints = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    return new THREE.Vector3(ck.x + ck.rimRx * Math.cos(a), ck.y + 0.01, ck.rimRz * Math.sin(a));
  });
  car.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPoints, true), 56, 0.022, 8, true), paint));

  // cooling slats on the sides of the engine cover
  for (const side of [1, -1] as const) {
    for (const y of spec.details.slats.ys) {
      const slat = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), m.dark);
      slat.scale.set(0.11, 0.009, 0.014);
      slat.position.set(spec.details.slats.x, y, (spineSurfaceZ(spec, spec.details.slats.x, y) + 0.002) * side);
      car.add(slat);
    }
  }

  // sidepods, with a dark inlet at the front of each
  const sp = spec.pods[livery.sidepod] ?? Object.values(spec.pods)[0]!;
  const podSpec = {
    x: sp.x,
    zc: sp.zIn.map((zi, i) => (zi + sp.zOut[i]) / 2),
    hw: sp.zIn.map((zi, i) => (sp.zOut[i] - zi) / 2),
    bottom: sp.bottom,
    top: sp.top,
  };
  for (const side of [1, -1] as const) {
    car.add(new THREE.Mesh(loftGeometry(podSpec, { rings: 70, sides: 28, squareness: 0.5, side }), paint));
    const inlet = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), m.dark);
    inlet.scale.set(0.07, (sp.top[0] - sp.bottom[0]) * 0.3, (sp.zOut[0] - sp.zIn[0]) * 0.46);
    inlet.position.set(sp.x[0] - 0.02, (sp.top[0] + sp.bottom[0]) / 2, ((sp.zOut[0] + sp.zIn[0]) / 2) * side);
    car.add(inlet);
    // a dark line along the flank of the pod behind the inlet: the inlet lip
    car.add(new THREE.Mesh(flankLine(sp, (sp.top[0] + sp.bottom[0]) / 2 - 0.02, side), m.dark));
    // thin vertical fences ahead of the sidepod, behind the front wheel
    for (const z of spec.fences) {
      const f = spec.wheels.front.x - 0.5; // the fences stand just behind the front wheel
      car.add(new THREE.Mesh(plateGeometry([[f, 0.07], [f - 0.06, 0.19], [f - 0.22, 0.24], [f - 0.36, 0.2], [f - 0.38, 0.07]], z * side, 0.008), m.carbon));
    }
  }

  // ---- floor, edge wing, diffuser and rear end ----
  car.add(new THREE.Mesh(floorGeometry(spec), m.floor));
  car.add(new THREE.Mesh(diffuserGeometry(spec), m.floor));
  for (const side of [1, -1] as const) {
    car.add(new THREE.Mesh(floorEdgeWingGeometry(spec, side), m.floor));
    for (const z of spec.diffuser.strakes) car.add(new THREE.Mesh(diffuserStrake(spec, z * side), m.carbon));
  }
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.14, 16), m.carbon);
  exhaust.rotation.z = Math.PI / 2;
  exhaust.position.set(spec.details.exhaust[0], spec.details.exhaust[1], 0);
  car.add(exhaust);

  // ---- front wing ----
  const fw = spec.frontWing;
  for (const side of [1, -1] as const) {
    for (const e of fw.elements) {
      // an active flap is built in separate sections across the span, a thin gap between them
      for (const [from, to] of sectionRanges(e.from, fw.span - 0.01, e.sections ?? 1)) {
        const zs = range(from, to, Math.max(8, Math.round(26 / (e.sections ?? 1)))).map((z) => z * side);
        const geometry = wingGeometry(
          zs,
          (z) => {
            const s = frontWingSection(spec, e, z, aero);
            return { x: s.x, y: s.y, chord: s.chord, angle: s.angleDeg * DEG };
          },
          e.camber,
          0.045,
        );
        car.add(new THREE.Mesh(geometry, e.flap ? m.flap : m.wing));
      }
    }
    if (fw.vanes) {
      // small vertical vanes along the flaps
      for (const e of fw.elements.filter((el) => el.flap)) {
        for (const z of [0.3, 0.5, 0.7, 0.85]) {
          const s = frontWingSection(spec, e, z, aero);
          const top = s.y + 0.45 * s.chord * Math.sin(s.angleDeg * DEG) + e.camber * s.chord + 0.012;
          car.add(box(0.05, 0.04, 0.006, m.carbon, s.x - s.chord * 0.45, top + 0.02, z * side));
        }
      }
    }
    car.add(new THREE.Mesh(plateGeometry(fw.endplate, fw.span * side, 0.014), m.endplate));
    if (fw.footplate) car.add(box(fw.footplate.length, 0.012, 0.08, m.endplate, fw.footplate.x, 0.055, (fw.span + 0.035) * side));
    if (fw.pylons) {
      // the raised nose is held clear of the wing on two pylons
      const noseX = spec.spine.x[0] - 0.2;
      car.add(rod(new THREE.Vector3(noseX, spec.spine.bottom[0] + 0.01, 0.04 * side), new THREE.Vector3(noseX + 0.12, 0.095, 0.07 * side), 0.016, m.carbon));
    }
  }

  // ---- rear wing ----
  const rw = spec.rearWing;
  for (const side of [1, -1] as const) {
    for (const e of rw.elements) {
      const zs = range(0, rw.span - 0.01, 22).map((z) => z * side);
      const geometry = wingGeometry(
        zs,
        (z) => {
          const s = rearWingSection(spec, e, z, aero);
          return { x: s.x, y: s.y, chord: s.chord, angle: s.angleDeg * DEG };
        },
        e.camber,
        0.05,
      );
      car.add(new THREE.Mesh(geometry, e.flap ? m.flap : m.wing));
    }
    for (const b of rw.beam) {
      car.add(new THREE.Mesh(wingGeometry(range(0, b.span, 12).map((z) => z * side), () => ({ x: b.x, y: b.y, chord: b.chord, angle: b.angle * DEG }), b.camber, 0.04), m.carbon));
    }
    car.add(new THREE.Mesh(plateGeometry(rw.endplate, rw.span * side, 0.014), m.endplate));
    for (const s of rw.supports) {
      if (s.mirror || side === 1) car.add(new THREE.Mesh(plateGeometry(s.outline, s.z * (s.mirror ? side : 1), s.thickness), m.carbon));
    }
  }
  for (const b of rw.boxes) car.add(box(b.size[0], b.size[1], b.size[2], b.part === 'light' ? m.light : m.carbon, b.at[0], b.at[1], b.at[2]));

  // ---- halo: a short pillar up from the nose cowl, then two arms running almost straight back over the driver
  // to land on the airbox hump behind the cockpit (cars from 2018 on) ----
  if (spec.halo) {
    const front = new THREE.CatmullRomCurve3([new THREE.Vector3(0.98, 0.6, 0), new THREE.Vector3(0.93, 0.72, 0), new THREE.Vector3(0.84, 0.8, 0)]);
    car.add(new THREE.Mesh(new THREE.TubeGeometry(front, 16, 0.03, 8), paint));
    for (const side of [1, -1] as const) {
      const haloArm = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.84, 0.8, 0),
        new THREE.Vector3(0.5, 0.83, 0.15 * side),
        new THREE.Vector3(0.15, 0.8, 0.23 * side),
        new THREE.Vector3(-0.2, 0.74, 0.19 * side),
      ]);
      car.add(new THREE.Mesh(new THREE.TubeGeometry(haloArm, 28, 0.029, 10), paint));
      // a small fairing where the halo arm lands on the bodywork
      const landing = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), paint);
      landing.scale.set(0.13, 0.07, 0.055);
      landing.position.set(-0.17, 0.74, 0.185 * side);
      car.add(landing);
    }
  }
  // mirrors on short stalks beside the cockpit
  const [mx, my, mz] = spec.details.mirror;
  for (const side of [1, -1] as const) {
    car.add(box(0.1, 0.05, 0.13, m.carbon, mx, my, mz * side));
    car.add(rod(new THREE.Vector3(mx + 0.02, my - 0.1, (mz - 0.06) * side), new THREE.Vector3(mx, my - 0.01, mz * side), 0.012, m.carbon));
  }

  // ---- extras this generation has: shark fin, bargeboards, T-wing, exhaust pipes ----
  for (const p of spec.extras.plates) for (const side of p.mirror ? ([1, -1] as const) : ([1] as const)) car.add(new THREE.Mesh(plateGeometry(p.outline, p.z * side, p.thickness), partMaterial(p.part)));
  for (const w of spec.extras.wings) {
    for (const side of [1, -1] as const) {
      const zs = range(w.from, w.span, 10).map((z) => z * side);
      car.add(new THREE.Mesh(wingGeometry(zs, () => ({ x: w.x, y: w.y, chord: w.chord, angle: w.angle * DEG }), w.camber, 0.04), partMaterial(w.part)));
    }
  }
  for (const r of spec.extras.rods) {
    for (const side of r.mirror ? ([1, -1] as const) : ([1] as const)) {
      car.add(rod(new THREE.Vector3(r.from[0], r.from[1], r.from[2] * side), new THREE.Vector3(r.to[0], r.to[1], r.to[2] * side), r.radius, partMaterial(r.part)));
    }
  }
  for (const b of spec.extras.boxes) {
    for (const side of b.mirror ? ([1, -1] as const) : ([1] as const)) car.add(box(b.size[0], b.size[1], b.size[2], partMaterial(b.part), b.at[0], b.at[1], b.at[2] * side));
  }

  // ---- wheels and suspension ----
  for (const [axle, isFront] of [[spec.wheels.front, true], [spec.wheels.rear, false]] as const) {
    for (const side of [1, -1] as const) {
      const wheel = buildWheel(axle.radius, axle.width, side, m, spec.wheelLook);
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
    disposePictures(pictures);
    car.traverse((object) => {
      if (object instanceof THREE.Mesh) object.geometry.dispose();
    });
    paint.dispose();
    Object.values(m).forEach((material) => material.dispose());
  };
  return car;
}
