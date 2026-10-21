import * as THREE from 'three';

import { spline } from '../../data/cars/spline';
import { frontWingSection, rearWingSection } from '../../data/cars/spec';
import type { AeroMode, CarSpec, ExtraPart, PodShape } from '../../data/cars/spec';
import type { Livery } from '../../data/liveries';
import { applyCarbonWeave, applyLiveryPaint, buildLiveryPictures, buildPlateTexture, disposePictures } from './paint';
import { arm, box, buildWheel, loftGeometry, plateGeometry, range, rod, wingGeometry } from './parts';

// A modern ground-effect-era car (2022, 2026) built from its measurements (src/data/cars): one smooth surface for the
// nose, cockpit, airbox and engine cover; sidepods; a flat floor with an edge wing and a diffuser; a swept front wing;
// a bowl-shaped rear wing; a low halo; and wheels with covers. Which parts exist, and their sizes, come from the spec,
// so the 2022 and 2026 cars share this code and differ only in their measurements and a few features.

const DEG = Math.PI / 180;

/** What a generation's own body builder gets: the car to add parts to, and the materials to make them from. */
export interface BodyContext {
  car: THREE.Group;
  spec: CarSpec;
  livery: Livery;
  /** The body paint (colored by the livery pictures, by position). */
  paint: THREE.Material;
  /** The plain materials: carbon, dark, metal, floor, light, mark and so on. */
  m: Record<string, THREE.Material>;
}

export interface CarOptions {
  /** Cornering (the default, high downforce) or straight (low drag): only cars with active wings change. */
  aero?: AeroMode;
  /** Builds the body (monocoque, sidepods, floor, cockpit) in place of the generic ground-effect body. The wings, wheels and extras are still added from the spec. */
  body?: (context: BodyContext) => void;
}

/** The floor outline on the right side, as [x, half width], front to back. */
export function floorEdge(spec: CarSpec, steps = 44): [number, number][] {
  return Array.from({ length: steps + 1 }, (_, i) => [spline(spec.floor.x, i / steps), spline(spec.floor.hw, i / steps)] as [number, number]);
}

/** The flat floor plank: widest beside the sidepods, tapering to the front and back, inside the wheels. */
export function floorGeometry(spec: CarSpec): THREE.BufferGeometry {
  const right = floorEdge(spec).map(([x, hw]) => new THREE.Vector2(x, hw));
  const left = right.map((p) => new THREE.Vector2(p.x, -p.y)).reverse();
  const geometry = new THREE.ExtrudeGeometry(new THREE.Shape([...right, ...left]), { depth: spec.floor.thickness, bevelEnabled: false });
  geometry.rotateX(-Math.PI / 2); // lie flat: the outline becomes the floor plan, extruded upward
  geometry.translate(0, spec.floor.y, 0);
  return geometry;
}

/** The curled-up edge along the side of the floor (the "edge wing"), for one side. */
export function floorEdgeWingGeometry(spec: CarSpec, side: 1 | -1): THREE.BufferGeometry {
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
export const diffuserY = (spec: CarSpec, s: number) => spec.floor.y + spec.floor.thickness + spec.diffuser.rise * Math.pow(s, 1.7);

/** The diffuser: the floor sweeping up and back into the air between the rear wheels. */
export function diffuserGeometry(spec: CarSpec): THREE.BufferGeometry {
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
export function diffuserStrake(spec: CarSpec, z: number): THREE.BufferGeometry {
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
export function lightness(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

/** Where the side of the spine is at height `y` and distance `x` along the car (to sit small details on its surface). */
export function spineSurfaceZ(spec: CarSpec, x: number, y: number): number {
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
export function flankLine(sp: PodShape, y: number, side: 1 | -1): THREE.BufferGeometry {
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
    metalness: matte ? 0.05 : 0.12,
    roughness: matte ? 0.6 : 0.3,
    clearcoat: matte ? 0.15 : 1,
    clearcoatRoughness: matte ? 0.5 : 0.07,
  });
  applyLiveryPaint(paint, pictures);

  // the wings take their color and lettering from the livery pictures too (double sided, with carbon weave when dark)
  const wingPaint = (carbon: boolean) => {
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: carbon ? 0.52 : matte ? 0.55 : 0.32,
      clearcoat: carbon ? 0.3 : matte ? 0.1 : 0.9,
      clearcoatRoughness: carbon ? 0.4 : matte ? 0.5 : 0.12,
      side: THREE.DoubleSide,
    });
    applyLiveryPaint(material, pictures, carbon, true);
    return material;
  };
  const wingMaterials = { wing: wingPaint(lightness(livery.parts.wing) < 0.12), flap: wingPaint(lightness(livery.parts.flap) < 0.12) };
  // the front wing has its own colors when the livery gives them (frontParts), so its own weave flags too
  const frontColors = livery.frontParts ?? livery.parts;
  const frontWingMaterials = { wing: wingPaint(lightness(frontColors.wing) < 0.12), flap: wingPaint(lightness(frontColors.flap) < 0.12) };

  // painted parts: a solid color under a clearcoat (matte teams get a dull coat)
  const solid = (hex: string) =>
    new THREE.MeshPhysicalMaterial({
      color: hex,
      metalness: 0.1,
      roughness: matte ? 0.55 : 0.32,
      clearcoat: matte ? 0.1 : 0.9,
      clearcoatRoughness: matte ? 0.5 : 0.12,
      side: THREE.DoubleSide,
    });
  // bare carbon fibre: nearly black, with a satin sheen and the weave laid over it
  const carbon = () => new THREE.MeshPhysicalMaterial({ color: 0x111114, metalness: 0.1, roughness: 0.52, clearcoat: 0.3, clearcoatRoughness: 0.4, envMapIntensity: 0.55, side: THREE.DoubleSide });
  const isCarbon = (hex: string) => lightness(hex) < 0.12;
  const m = {
    wing: solid(livery.parts.wing),
    flap: solid(livery.parts.flap),
    endplate: solid(livery.parts.endplate),
    frontEndplate: solid((livery.frontParts ?? livery.parts).endplate),
    floor: isCarbon(livery.parts.floor) ? carbon() : solid(livery.parts.floor),
    /** the halo: painted when the livery gives it a color, bare carbon otherwise */
    halo: livery.parts.halo ? solid(livery.parts.halo) : carbon(),
    carbon: carbon(),
    cover: new THREE.MeshPhysicalMaterial({ color: 0x0b0b0e, metalness: 0.2, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1 }),
    rubber: new THREE.MeshPhysicalMaterial({ color: 0x141416, metalness: 0, roughness: 0.78, sheen: 0.4, sheenRoughness: 0.9, sheenColor: 0x2a2a2e }),
    metal: new THREE.MeshStandardMaterial({ color: 0x9a9da3, metalness: 0.9, roughness: 0.35 }),
    band: new THREE.MeshStandardMaterial({ color: 0xf5d90a, metalness: 0, roughness: 0.6 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x050507, metalness: 0.1, roughness: 0.8 }),
    light: new THREE.MeshStandardMaterial({ color: 0xff2a2a, emissive: 0xff0000, emissiveIntensity: 1.2 }),
    rim: new THREE.MeshStandardMaterial({ color: spec.wheelLook.rimColor, metalness: 0.9, roughness: 0.35 }),
    mark: new THREE.MeshStandardMaterial({ color: 0xe6e6e6, metalness: 0, roughness: 0.7 }),
    helmet: new THREE.MeshPhysicalMaterial({ color: livery.helmet ?? '#E6E6E6', metalness: 0.05, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 }),
  };
  const partMaterial = (part: ExtraPart): THREE.Material => (part === 'paint' ? paint : m[part]);

  // carbon-fibre weave on every bare carbon part
  applyCarbonWeave(m.carbon);
  if (isCarbon(livery.parts.floor)) applyCarbonWeave(m.floor);
  if (!livery.parts.halo) applyCarbonWeave(m.halo);
  for (const key of ['wing', 'flap', 'endplate'] as const) if (isCarbon(livery.parts[key])) applyCarbonWeave(m[key]);

  // Every mesh goes into a named group (body, sidepods, floor, frontWing, rearWing, cockpit, halo, wheels, extras),
  // so a part can be found, hidden or recolored by name; the materials are kept on the car too.
  const part = (name: string): THREE.Group => {
    let group = car.getObjectByName(name) as THREE.Group | undefined;
    if (!group) {
      group = new THREE.Group();
      group.name = name;
      car.add(group);
    }
    return group;
  };
  car.userData.materials = m;

  // end plates: plain, or with their lettering when the livery has some
  const plateTextures: THREE.Texture[] = [];
  const plateMaterial = (kind: 'front' | 'rear', outline: typeof spec.frontWing.endplate, side: 1 | -1): THREE.Material => {
    const texts = livery.plateTexts?.[kind] ?? [];
    const decals = livery.plateDecals?.[kind] ?? [];
    if (texts.length === 0 && decals.length === 0) return kind === 'front' ? m.frontEndplate : m.endplate;
    const texture = buildPlateTexture(outline, (kind === 'front' ? livery.frontParts ?? livery.parts : livery.parts).endplate, texts, side < 0, decals);
    plateTextures.push(texture);
    return new THREE.MeshPhysicalMaterial({ map: texture, metalness: 0.1, roughness: matte ? 0.55 : 0.32, clearcoat: matte ? 0.1 : 0.9, clearcoatRoughness: matte ? 0.5 : 0.12, side: THREE.DoubleSide });
  };

  if (options.body) {
    options.body({ car, spec, livery, paint, m });
    // a generation's own body builder adds its meshes straight to the car: gather them into the body group
    for (const child of [...car.children]) if (child instanceof THREE.Mesh) part('body').add(child);
  } else {
  // ---- bodywork: nose, cockpit, airbox and engine cover are one smooth surface ----
  part('body').add(new THREE.Mesh(loftGeometry(spec.spine, { rings: 110, sides: 36, squareness: 0.76 }), paint));
  // the shoulder that fills in the space between the airbox and the sidepods
  part('body').add(new THREE.Mesh(loftGeometry(spec.shoulder, { rings: 60, sides: 32 }), paint));

  // the airbox: a tall rounded block standing on the engine cover with a steep front face
  part('body').add(new THREE.Mesh(loftGeometry(spec.airbox, { rings: 50, sides: 28 }), paint));
  // the intake gap: a dark slot between the cockpit and the front of the airbox, which is lifted clear of the body there
  const [slotX, slotY] = spec.details.intake;
  part('body').add(box(0.14, 0.07, spec.airbox.hw[1] * 1.7, m.dark, slotX, slotY, 0));

  // the camera pod on top: a short stalk, a boxy housing leaning forward a little, and a lens
  if (spec.details.cameraPod) {
  const [podX, podY] = spec.details.cameraPod;
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.05, 12), m.carbon);
  stalk.position.set(podX, podY + 0.02, 0);
  part('body').add(stalk);
  const housing = box(0.11, 0.085, 0.085, m.carbon, podX + 0.01, podY + 0.085, 0);
  housing.rotation.z = 0.08;
  part('body').add(housing);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.02, 14), m.metal);
  lens.rotation.z = Math.PI / 2;
  lens.position.set(podX + 0.07, podY + 0.085, 0);
  part('body').add(lens);
  }

  // the cockpit opening, with a dark seat showing in it (no driver)
  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 12), m.dark);
  const ck = spec.details.cockpit;
  cockpit.scale.set(ck.rx, 0.045, ck.rz);
  cockpit.position.set(ck.x, ck.y, 0);
  part('cockpit').add(cockpit);
  // the steering wheel and the dark seat back, so the cockpit is not an empty hole
  const wheelRim = box(0.03, 0.09, 0.2, m.dark, ck.x + ck.rx * 0.55, ck.y + 0.07, 0);
  wheelRim.rotation.z = -0.5;
  part('cockpit').add(wheelRim);
  part('cockpit').add(box(0.05, 0.12, ck.rz * 1.5, m.dark, ck.x - ck.rx * 0.65, ck.y + 0.08, 0));
  // the driver's helmet, in the livery's helmet color, sitting low so the halo passes over it
  const helmetMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), m.helmet);
  helmetMesh.scale.set(0.12, 0.105, 0.105);
  helmetMesh.position.set(ck.x - 0.12, ck.y + 0.06, 0);
  part('cockpit').add(helmetMesh);
  const visorMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), m.dark);
  visorMesh.scale.set(0.06, 0.04, 0.085);
  visorMesh.position.set(ck.x - 0.06, ck.y + 0.07, 0);
  part('cockpit').add(visorMesh);
  // the raised rim around the cockpit opening, in body paint
  const rimPoints = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    return new THREE.Vector3(ck.x + ck.rimRx * Math.cos(a), ck.y + 0.01, ck.rimRz * Math.sin(a));
  });
  part('cockpit').add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPoints, true), 56, 0.022, 8, true), paint));

  // cooling slats on the sides of the engine cover
  for (const side of [1, -1] as const) {
    for (const y of spec.details.slats.ys) {
      const slat = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), m.dark);
      slat.scale.set(0.11, 0.009, 0.014);
      slat.position.set(spec.details.slats.x, y, (spineSurfaceZ(spec, spec.details.slats.x, y) + 0.002) * side);
      part('body').add(slat);
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
    part('sidepods').add(new THREE.Mesh(loftGeometry(podSpec, { rings: 70, sides: 28, squareness: 0.5, side }), paint));
    if (livery.sidepod === 'scoop') {
      // the bathtub: a raised outer wall along the top of the pod, so the top reads as a scooped channel
      const wall = {
        x: sp.x.slice(1, 6),
        zc: sp.zOut.slice(1, 6).map((z) => z - 0.05),
        hw: [0.05, 0.055, 0.055, 0.05, 0.04],
        bottom: sp.top.slice(1, 6).map((t) => t - 0.06),
        top: sp.top.slice(1, 6).map((t, i) => t + [0.08, 0.09, 0.08, 0.06, 0.03][i]),
      };
      part('sidepods').add(new THREE.Mesh(loftGeometry(wall, { rings: 40, sides: 16, squareness: 0.6, side }), paint));
    }
    const inlet = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), m.dark);
    inlet.scale.set(0.07, (sp.top[0] - sp.bottom[0]) * 0.3, (sp.zOut[0] - sp.zIn[0]) * 0.46);
    inlet.position.set(sp.x[0] - 0.02, (sp.top[0] + sp.bottom[0]) / 2, ((sp.zOut[0] + sp.zIn[0]) / 2) * side);
    part('sidepods').add(inlet);
    // thin vertical fences ahead of the sidepod, behind the front wheel
    for (const z of spec.fences) {
      const f = spec.wheels.front.x - 0.5; // the fences stand just behind the front wheel
      part('floor').add(new THREE.Mesh(plateGeometry([[f, 0.07], [f - 0.06, 0.19], [f - 0.22, 0.24], [f - 0.36, 0.2], [f - 0.38, 0.07]], z * side, 0.008), m.carbon));
    }
  }

  // ---- floor, edge wing, diffuser and rear end ----
  part('floor').add(new THREE.Mesh(floorGeometry(spec), m.floor));
  part('floor').add(new THREE.Mesh(diffuserGeometry(spec), m.floor));
  for (const side of [1, -1] as const) {
    part('floor').add(new THREE.Mesh(floorEdgeWingGeometry(spec, side), m.floor));
    for (const z of spec.diffuser.strakes) part('floor').add(new THREE.Mesh(diffuserStrake(spec, z * side), m.carbon));
  }
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.14, 16), m.carbon);
  exhaust.rotation.z = Math.PI / 2;
  exhaust.position.set(spec.details.exhaust[0], spec.details.exhaust[1], 0);
  part('floor').add(exhaust);
  }

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
          e.flap ? 0.03 : 0.045,
        );
        part('frontWing').add(new THREE.Mesh(geometry, e.flap ? frontWingMaterials.flap : frontWingMaterials.wing));
      }
    }
    if (fw.vanes) {
      // a row of small vortex vanes standing on the top flap
      const top = fw.elements[fw.elements.length - 1];
      for (const z of [0.3, 0.42, 0.54, 0.66, 0.78, 0.88]) {
        const s = frontWingSection(spec, top, z, aero);
        const y = s.y + 0.35 * s.chord * Math.sin(s.angleDeg * DEG) + top.camber * s.chord + 0.008;
        part('frontWing').add(box(0.04, 0.028, 0.005, m.carbon, s.x - s.chord * 0.35, y + 0.012, z * side));
      }
    }
    part('frontWing').add(new THREE.Mesh(plateGeometry(fw.endplate, fw.span * side, 0.014), plateMaterial('front', fw.endplate, side)));
    if (fw.footplate) part('frontWing').add(box(fw.footplate.length, 0.012, 0.08, m.endplate, fw.footplate.x, 0.055, (fw.span + 0.035) * side));
    if (fw.pylons) {
      // the raised nose is held clear of the wing on two pylons
      const noseX = spec.spine.x[0] - 0.2;
      part('frontWing').add(rod(new THREE.Vector3(noseX, spec.spine.bottom[0] + 0.01, 0.04 * side), new THREE.Vector3(noseX + 0.12, 0.095, 0.07 * side), 0.016, m.carbon));
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
      part('rearWing').add(new THREE.Mesh(geometry, e.flap ? wingMaterials.flap : wingMaterials.wing));
    }
    for (const b of rw.beam) {
      part('rearWing').add(new THREE.Mesh(wingGeometry(range(0, b.span, 12).map((z) => z * side), () => ({ x: b.x, y: b.y, chord: b.chord, angle: b.angle * DEG }), b.camber, 0.04), m.carbon));
    }
    part('rearWing').add(new THREE.Mesh(plateGeometry(rw.endplate, rw.span * side, 0.014), plateMaterial('rear', rw.endplate, side)));
    for (const s of rw.supports) {
      if (s.mirror || side === 1) part('rearWing').add(new THREE.Mesh(plateGeometry(s.outline, s.z * (s.mirror ? side : 1), s.thickness), m.carbon));
    }
  }
  for (const b of rw.boxes) part('rearWing').add(box(b.size[0], b.size[1], b.size[2], b.part === 'light' ? m.light : m.carbon, b.at[0], b.at[1], b.at[2]));

  // ---- halo: a short pillar up from the nose cowl, then two arms running almost straight back over the driver
  // to land on the airbox hump behind the cockpit (cars from 2018 on) ----
  if (spec.halo && !options.body) {
    const ck = spec.details.cockpit;
    const top = ck.y + 0.26; // the hoop runs about a helmet's height above the cockpit rim
    const front = new THREE.CatmullRomCurve3([new THREE.Vector3(ck.x + ck.rx + 0.1, ck.y - 0.02, 0), new THREE.Vector3(ck.x + ck.rx + 0.04, top - 0.1, 0), new THREE.Vector3(ck.x + ck.rx - 0.06, top, 0)]);
    part('halo').add(new THREE.Mesh(new THREE.TubeGeometry(front, 16, 0.032, 10), m.halo));
    for (const side of [1, -1] as const) {
      const haloArm = new THREE.CatmullRomCurve3([
        new THREE.Vector3(ck.x + ck.rx - 0.06, top, 0),
        new THREE.Vector3(ck.x + 0.05, top + 0.02, 0.2 * side),
        new THREE.Vector3(ck.x - 0.35, top - 0.01, 0.28 * side),
        new THREE.Vector3(ck.x - 0.62, top - 0.08, 0.24 * side),
        new THREE.Vector3(ck.x - 0.72, top - 0.14, 0.2 * side),
      ]);
      part('halo').add(new THREE.Mesh(new THREE.TubeGeometry(haloArm, 36, 0.03, 10), m.halo));
      // a small fairing where the halo arm lands on the bodywork
      const landing = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), m.halo);
      landing.scale.set(0.12, 0.06, 0.05);
      landing.position.set(ck.x - 0.7, top - 0.14, 0.195 * side);
      part('halo').add(landing);
    }
  }
  // mirrors on short stalks beside the cockpit
  const [mx, my, mz] = spec.details.mirror;
  for (const side of [1, -1] as const) {
    part('cockpit').add(box(0.1, 0.05, 0.13, m.carbon, mx, my, mz * side));
    part('cockpit').add(rod(new THREE.Vector3(mx + 0.02, my - 0.1, (mz - 0.06) * side), new THREE.Vector3(mx, my - 0.01, mz * side), 0.012, m.carbon));
  }

  // ---- extras this generation has: shark fin, bargeboards, T-wing, exhaust pipes ----
  for (const p of spec.extras.plates) for (const side of p.mirror ? ([1, -1] as const) : ([1] as const)) part('extras').add(new THREE.Mesh(plateGeometry(p.outline, p.z * side, p.thickness), partMaterial(p.part)));
  for (const w of spec.extras.wings) {
    for (const side of [1, -1] as const) {
      const zs = range(w.from, w.span, 10).map((z) => z * side);
      part('extras').add(new THREE.Mesh(wingGeometry(zs, () => ({ x: w.x, y: w.y, chord: w.chord, angle: w.angle * DEG }), w.camber, 0.04), partMaterial(w.part)));
    }
  }
  for (const r of spec.extras.rods) {
    for (const side of r.mirror ? ([1, -1] as const) : ([1] as const)) {
      part('extras').add(rod(new THREE.Vector3(r.from[0], r.from[1], r.from[2] * side), new THREE.Vector3(r.to[0], r.to[1], r.to[2] * side), r.radius, partMaterial(r.part)));
    }
  }
  for (const b of spec.extras.boxes) {
    for (const side of b.mirror ? ([1, -1] as const) : ([1] as const)) part('extras').add(box(b.size[0], b.size[1], b.size[2], partMaterial(b.part), b.at[0], b.at[1], b.at[2] * side));
  }

  // ---- wheels and suspension ----
  for (const [axle, isFront] of [[spec.wheels.front, true], [spec.wheels.rear, false]] as const) {
    for (const side of [1, -1] as const) {
      const wheel = buildWheel(axle.radius, axle.width, side, m, spec.wheelLook);
      wheel.position.set(axle.x, axle.radius, axle.z * side);
      part('wheels').add(wheel);

      const hubZ = (axle.z - axle.width / 2 - 0.07) * side;
      const root = isFront ? 0.12 : 0.1;
      const lower = isFront ? 0.15 : 0.17;
      const upper = isFront ? 0.33 : 0.38;
      const chord = isFront ? 0.055 : 0.045;
      for (const dx of [-0.22, 0.22]) {
        part('wheels').add(arm(new THREE.Vector3(axle.x + dx, lower, root * side), new THREE.Vector3(axle.x, axle.radius - 0.1, hubZ), chord, 0.014, m.carbon));
        part('wheels').add(arm(new THREE.Vector3(axle.x + dx, upper, root * side), new THREE.Vector3(axle.x, axle.radius + 0.1, hubZ), chord, 0.014, m.carbon));
      }
      // push rod from the top of the wheel upright up and in, and a track rod
      part('wheels').add(rod(new THREE.Vector3(axle.x, axle.radius + 0.12, hubZ), new THREE.Vector3(axle.x + (isFront ? -0.1 : 0.1), upper + 0.1, (root + 0.02) * side), 0.013, m.carbon));
      part('wheels').add(rod(new THREE.Vector3(axle.x + (isFront ? -0.12 : 0.12), 0.27, root * side), new THREE.Vector3(axle.x - 0.04, axle.radius + 0.02, hubZ), 0.011, m.carbon));
    }
  }

  car.userData.dispose = () => {
    disposePictures(pictures);
    car.traverse((object) => {
      if (object instanceof THREE.Mesh) object.geometry.dispose();
    });
    paint.dispose();
    wingMaterials.wing.dispose();
    wingMaterials.flap.dispose();
    frontWingMaterials.wing.dispose();
    frontWingMaterials.flap.dispose();
    plateTextures.forEach((t) => t.dispose());
    Object.values(m).forEach((material) => material.dispose());
  };
  return car;
}
