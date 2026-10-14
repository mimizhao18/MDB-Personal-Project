import * as THREE from 'three';

import { spline } from '../../data/cars/spline';

// Building blocks for the car models: lofted bodywork, wing elements, flat plates, rods and wheels.
// The car faces +X, up is +Y and +Z is its right side. Units are metres.

const signedPow = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e);

export interface LoftSpec {
  /** Stations along the car, in one direction (tail to nose or the other way). */
  x: readonly number[];
  /** Centre line across the car at each station (leave out for bodywork on the middle line). */
  zc?: readonly number[];
  /** Half width at each station. */
  hw: readonly number[];
  bottom: readonly number[];
  top: readonly number[];
}

interface LoftOptions {
  rings?: number;
  sides?: number;
  /** 1 is a diamond, 0.7 a rounded box; smaller is boxier. */
  squareness?: number;
  /** -1 builds the mirror image on the left side of the car. */
  side?: 1 | -1;
}

/**
 * A smooth body made by stretching a rounded-box cross-section along the stations. Open at both ends: end stations
 * should be small, or covered by another part.
 */
export function loftGeometry(spec: LoftSpec, { rings = 80, sides = 32, squareness = 0.72, side = 1 }: LoftOptions = {}): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    const x = spline(spec.x, t);
    const zc = spec.zc ? spline(spec.zc, t) : 0;
    const hw = Math.max(0.002, spline(spec.hw, t));
    const yb = spline(spec.bottom, t);
    const yt = Math.max(yb + 0.004, spline(spec.top, t));
    const yc = (yb + yt) / 2;
    const h = (yt - yb) / 2;
    for (let j = 0; j <= sides; j++) {
      const phi = (j / sides) * Math.PI * 2;
      positions.push(x, yc + h * signedPow(Math.cos(phi), squareness), side * (zc + hw * signedPow(Math.sin(phi), squareness)));
    }
  }
  const row = sides + 1;
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < sides; j++) {
      const a = i * row + j;
      const b = a + row;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  // If the surface came out inside-out, flip the triangles. The top of a middle ring should face up.
  const mid = Math.floor(rings / 2) * row;
  if (geometry.getAttribute('normal').getY(mid) < 0) {
    indices.reverse();
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
  }

  // The seam: the first and last vertex of each ring are in the same place, so give them one shared normal.
  const normals = geometry.getAttribute('normal') as THREE.BufferAttribute;
  const n = new THREE.Vector3();
  for (let i = 0; i <= rings; i++) {
    const first = i * row;
    const last = first + sides;
    n.set(normals.getX(first) + normals.getX(last), normals.getY(first) + normals.getY(last), normals.getZ(first) + normals.getZ(last)).normalize();
    normals.setXYZ(first, n.x, n.y, n.z);
    normals.setXYZ(last, n.x, n.y, n.z);
  }
  normals.needsUpdate = true;
  return geometry;
}

/** A closed airfoil outline (leading edge first) in chord units: x from 0 to 1, y up. */
function airfoil(n: number, camber: number, thickness: number): [number, number][] {
  const upper: [number, number][] = [];
  const lower: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const s = (1 - Math.cos((Math.PI * i) / n)) / 2;
    const yc = camber * 4 * s * (1 - s);
    const yt = (thickness * (0.2969 * Math.sqrt(s) - 0.126 * s - 0.3516 * s * s + 0.2843 * s ** 3 - 0.1036 * s ** 4)) / 0.2;
    upper.push([s, yc + yt]);
    lower.push([s, yc - yt]);
  }
  return [...upper, ...lower.reverse().slice(1, -1)];
}

export interface WingSection {
  /** Where the leading edge is: x along the car, y height. */
  x: number;
  y: number;
  chord: number;
  /** Radians; positive lifts the trailing edge (the back) up. */
  angle: number;
}

/** One wing element: an airfoil stretched across `zs`, with the position and size of each slice given by `section`. */
export function wingGeometry(zs: readonly number[], section: (z: number) => WingSection, camber: number, thickness: number): THREE.BufferGeometry {
  const profile = airfoil(10, camber, thickness);
  const positions: number[] = [];
  const indices: number[] = [];
  for (const z of zs) {
    const s = section(z);
    const cos = Math.cos(s.angle);
    const sin = Math.sin(s.angle);
    for (const [px, py] of profile) {
      const lx = px * s.chord;
      const ly = py * s.chord;
      positions.push(s.x - lx * cos + ly * sin, s.y + lx * sin + ly * cos, z);
    }
  }
  const ring = profile.length;
  for (let k = 0; k < zs.length - 1; k++) {
    for (let i = 0; i < ring; i++) {
      const a = k * ring + i;
      const b = k * ring + ((i + 1) % ring);
      indices.push(a, b, a + ring, b, b + ring, a + ring);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** `count` evenly spaced values from `from` to `to`. */
export function range(from: number, to: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => from + ((to - from) * i) / (count - 1));
}

/** A flat plate with the given side-view outline (x, y points), standing across the car at `z`. */
export function plateGeometry(points: readonly (readonly [number, number])[], z: number, thickness: number): THREE.BufferGeometry {
  const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  geometry.translate(0, 0, z - thickness / 2);
  return geometry;
}

export function box(w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number, rotZ = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.rotation.z = rotZ;
  return m;
}

/** A thin rod between two points (suspension arms, pylons). */
export function rod(from: THREE.Vector3, to: THREE.Vector3, radius: number, material: THREE.Material): THREE.Mesh {
  const length = from.distanceTo(to);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 8), material);
  m.position.copy(from).add(to).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
  return m;
}

/** A flat, streamlined suspension arm between two points: `chord` wide (front to back), `thickness` thin. */
export function arm(from: THREE.Vector3, to: THREE.Vector3, chord: number, thickness: number, material: THREE.Material): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(chord, thickness, from.distanceTo(to)), material);
  m.position.copy(from).add(to).multiplyScalar(0.5);
  m.lookAt(to);
  return m;
}

/** A rounded tire profile spun around the wheel axis. */
function tireGeometry(radius: number, width: number): THREE.BufferGeometry {
  const r = radius;
  const hw = width / 2;
  const round = Math.min(0.07, hw * 0.4);
  const profile: THREE.Vector2[] = [
    new THREE.Vector2(r * 0.6, -hw),
    new THREE.Vector2(r - round, -hw),
    new THREE.Vector2(r - round * 0.3, -hw + round * 0.3),
    new THREE.Vector2(r, -hw + round),
    new THREE.Vector2(r, hw - round),
    new THREE.Vector2(r - round * 0.3, hw - round * 0.3),
    new THREE.Vector2(r - round, hw),
    new THREE.Vector2(r * 0.6, hw),
  ];
  return new THREE.LatheGeometry(profile, 56);
}

export interface WheelMaterials {
  rubber: THREE.Material;
  carbon: THREE.Material;
  metal: THREE.Material;
  band: THREE.Material;
}

/** A tire with a flat wheel cover, a tire-compound band, and the brake duct behind it. `side` is which side of the car. */
export function buildWheel(radius: number, width: number, side: 1 | -1, m: WheelMaterials): THREE.Group {
  const wheel = new THREE.Group();
  const tire = new THREE.Mesh(tireGeometry(radius, width), m.rubber);
  tire.rotation.x = Math.PI / 2;
  wheel.add(tire);

  const face = side * (width / 2);
  const cover = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, 0.014, 48), m.carbon);
  cover.rotation.x = Math.PI / 2;
  cover.position.z = face - side * 0.004;
  wheel.add(cover);

  const lip = new THREE.Mesh(new THREE.RingGeometry(radius * 0.58, radius * 0.63, 56), m.metal);
  lip.position.z = face + side * 0.004;
  if (side < 0) lip.rotation.y = Math.PI;
  wheel.add(lip);

  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 16), m.metal);
  nut.rotation.x = Math.PI / 2;
  nut.position.z = face + side * 0.006;
  wheel.add(nut);

  // a colored ring around the wheel nut
  const hubRing = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.078, 32), m.band);
  hubRing.position.z = face + side * 0.005;
  if (side < 0) hubRing.rotation.y = Math.PI;
  wheel.add(hubRing);

  // the tire-compound band on the sidewall
  const band = new THREE.Mesh(new THREE.RingGeometry(radius * 0.74, radius * 0.81, 64), m.band);
  band.position.z = face + side * 0.002;
  if (side < 0) band.rotation.y = Math.PI;
  wheel.add(band);

  // brake duct fairing on the inside of the wheel
  const duct = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.46, radius * 0.46, 0.11, 24), m.carbon);
  duct.rotation.x = Math.PI / 2;
  duct.position.z = -face - side * 0.05;
  wheel.add(duct);
  return wheel;
}
