import * as THREE from 'three';

import type { Livery } from '../../data/liveries';

// A smooth, stylized single-seater built from code (no model file). The car faces +X, up is +Y, and +Z is its right side.
// Units are roughly metres: about 4.7 long and 2.2 wide. The body is one lofted surface whose texture coordinates run
// along the length (u: 0 tail to 1 nose) and around the cross-section (v: 0 top centre, 0.25 right side, 0.5 underside),
// so a livery pattern is just a picture drawn in (u, v).

// ---------- small helpers ----------

/** Smooth interpolation through `values`, with `t` from 0 to 1 across them. */
function spline(values: readonly number[], t: number): number {
  const n = values.length - 1;
  const x = Math.min(Math.max(t, 0), 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  const f = x - i;
  const p0 = values[Math.max(i - 1, 0)];
  const p1 = values[i];
  const p2 = values[i + 1];
  const p3 = values[Math.min(i + 2, n)];
  return 0.5 * (2 * p1 + (-p0 + p2) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (-p0 + 3 * p1 - 3 * p2 + p3) * f * f * f);
}

const signedPow = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e);

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

/** 1 inside |d| < half, fading to 0 over `soft`; used to draw soft-edged stripes. */
const band = (d: number, half: number, soft = 0.004) => 1 - smoothstep(half - soft, half + soft, Math.abs(d));

// ---------- the body: stations along the car (x, half width, bottom, top) ----------

const STATIONS = {
  x: [-2.15, -1.9, -1.5, -0.9, -0.2, 0.4, 0.9, 1.5, 2.1, 2.38],
  w: [0.12, 0.3, 0.52, 0.62, 0.58, 0.44, 0.3, 0.2, 0.12, 0.03],
  bottom: [0.28, 0.2, 0.15, 0.12, 0.12, 0.13, 0.14, 0.16, 0.2, 0.27],
  top: [0.52, 0.62, 0.82, 0.86, 0.8, 0.68, 0.55, 0.46, 0.4, 0.33],
};

const BODY_RINGS = 96;
const BODY_SIDES = 40;
const SQUARENESS = 2 / 2.8; // exponent of the rounded-box cross-section

/** The body, wrapping a livery pattern texture through its UVs. */
function buildBodyGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= BODY_RINGS; i++) {
    const t = i / BODY_RINGS;
    const x = spline(STATIONS.x, t);
    const w = spline(STATIONS.w, t);
    const yb = spline(STATIONS.bottom, t);
    const yt = spline(STATIONS.top, t);
    const yc = (yb + yt) / 2;
    const h = (yt - yb) / 2;
    for (let j = 0; j <= BODY_SIDES; j++) {
      const phi = (j / BODY_SIDES) * Math.PI * 2;
      positions.push(x, yc + h * signedPow(Math.cos(phi), SQUARENESS), w * signedPow(Math.sin(phi), SQUARENESS));
      uvs.push(t, j / BODY_SIDES);
    }
  }
  const row = BODY_SIDES + 1;
  for (let i = 0; i < BODY_RINGS; i++) {
    for (let j = 0; j < BODY_SIDES; j++) {
      const a = i * row + j;
      const b = a + row;
      indices.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  // If the surface came out inside-out (normals pointing in), flip the triangles.
  const mid = Math.floor(BODY_RINGS / 2) * row; // top centre of a middle ring
  if (geometry.getAttribute('normal').getY(mid) < 0) {
    indices.reverse();
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
  }

  // The seam (first and last vertex of each ring are in the same place): share one normal so there is no visible line.
  const normals = geometry.getAttribute('normal') as THREE.BufferAttribute;
  const n = new THREE.Vector3();
  for (let i = 0; i <= BODY_RINGS; i++) {
    const first = i * row;
    const last = first + BODY_SIDES;
    n.set(normals.getX(first) + normals.getX(last), normals.getY(first) + normals.getY(last), normals.getZ(first) + normals.getZ(last)).normalize();
    normals.setXYZ(first, n.x, n.y, n.z);
    normals.setXYZ(last, n.x, n.y, n.z);
  }
  normals.needsUpdate = true;
  return geometry;
}

// ---------- livery pattern texture ----------

const TEXTURE_W = 512;
const TEXTURE_H = 256;

/** Draws the livery (body color, plus its stripe, split or chevron pattern in the accent color) as a pixel texture. */
function buildPatternTexture(livery: Livery): THREE.DataTexture {
  const body = hexToRgb(livery.primary);
  const accent = hexToRgb(livery.secondary);
  const data = new Uint8Array(TEXTURE_W * TEXTURE_H * 4);

  for (let py = 0; py < TEXTURE_H; py++) {
    const v = py / (TEXTURE_H - 1);
    const fromTop = Math.min(v, 1 - v); // 0 at the top centre of the car, 0.5 at the underside
    for (let px = 0; px < TEXTURE_W; px++) {
      const u = px / (TEXTURE_W - 1);
      let k = 0; // 0 = body color, 1 = accent color
      switch (livery.pattern) {
        case 'stripe':
          k = band(fromTop, 0.05) * smoothstep(0.02, 0.05, u) * (1 - smoothstep(0.96, 0.99, u));
          break;
        case 'split': {
          // the nose section in the accent color, cut on a V so it follows the shape
          const edge = 0.66 + 0.14 * Math.min(fromTop * 2, 1);
          k = smoothstep(edge - 0.004, edge + 0.004, u);
          break;
        }
        case 'chevron': {
          // two V marks pointing at the nose, sweeping back along the sides
          const onUpperHalf = 1 - smoothstep(0.32, 0.36, fromTop);
          const c1 = band(u - (0.4 - 0.55 * fromTop), 0.024);
          const c2 = band(u - (0.31 - 0.55 * fromTop), 0.024);
          k = Math.max(c1, c2) * onUpperHalf;
          break;
        }
      }
      const o = (py * TEXTURE_W + px) * 4;
      data[o] = Math.round(body[0] + (accent[0] - body[0]) * k);
      data[o + 1] = Math.round(body[1] + (accent[1] - body[1]) * k);
      data[o + 2] = Math.round(body[2] + (accent[2] - body[2]) * k);
      data[o + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, TEXTURE_W, TEXTURE_H, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

// ---------- parts ----------

function box(w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number, rotZ = 0): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.rotation.z = rotZ;
  return mesh;
}

/** A thin rod between two points (suspension arms, wing pillars). */
function rod(from: THREE.Vector3, to: THREE.Vector3, radius: number, material: THREE.Material): THREE.Mesh {
  const length = from.distanceTo(to);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 8), material);
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
  return mesh;
}

/** A rounded tire profile spun around the wheel axis. */
function tireGeometry(radius: number, width: number): THREE.BufferGeometry {
  const r = radius;
  const hw = width / 2;
  const round = Math.min(0.09, hw * 0.45);
  const profile: THREE.Vector2[] = [
    new THREE.Vector2(r * 0.62, -hw),
    new THREE.Vector2(r - round, -hw),
    new THREE.Vector2(r - round * 0.3, -hw + round * 0.3),
    new THREE.Vector2(r, -hw + round),
    new THREE.Vector2(r, hw - round),
    new THREE.Vector2(r - round * 0.3, hw - round * 0.3),
    new THREE.Vector2(r - round, hw),
    new THREE.Vector2(r * 0.62, hw),
  ];
  return new THREE.LatheGeometry(profile, 48);
}

interface Materials {
  paint: THREE.MeshPhysicalMaterial;
  accent: THREE.MeshPhysicalMaterial;
  trim: THREE.MeshPhysicalMaterial; // darker shade of the body color, for end plates
  carbon: THREE.MeshStandardMaterial;
  rubber: THREE.MeshStandardMaterial;
  metal: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
}

function buildWheel(radius: number, width: number, side: 1 | -1, m: Materials): THREE.Group {
  const wheel = new THREE.Group();
  const tire = new THREE.Mesh(tireGeometry(radius, width), m.rubber);
  tire.rotation.x = Math.PI / 2;
  wheel.add(tire);

  const rim = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.64, radius * 0.64, width * 0.96, 40), m.metal);
  rim.rotation.x = Math.PI / 2;
  wheel.add(rim);

  // the tire compound band on the outer sidewall, in the livery's accent color
  const ringOuter = new THREE.Mesh(new THREE.RingGeometry(radius * 0.8, radius * 0.855, 64), m.accent);
  ringOuter.position.z = side * (width / 2 + 0.002);
  if (side < 0) ringOuter.rotation.y = Math.PI;
  wheel.add(ringOuter);

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.2, radius * 0.2, width * 1.04, 24), m.carbon);
  hub.rotation.x = Math.PI / 2;
  wheel.add(hub);
  return wheel;
}

/** Builds the whole car in the given livery. Call `disposeCar` when it is no longer needed. */
export function buildCar(livery: Livery): THREE.Group {
  const car = new THREE.Group();
  const texture = buildPatternTexture(livery);
  const bodyColor = new THREE.Color(livery.primary);

  const m: Materials = {
    paint: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: texture, metalness: 0.25, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08 }),
    accent: new THREE.MeshPhysicalMaterial({ color: livery.secondary, metalness: 0.2, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.15 }),
    trim: new THREE.MeshPhysicalMaterial({ color: bodyColor.clone().multiplyScalar(0.45), metalness: 0.3, roughness: 0.4, clearcoat: 0.6 }),
    carbon: new THREE.MeshStandardMaterial({ color: 0x131316, metalness: 0.45, roughness: 0.5 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x0f0f11, metalness: 0, roughness: 0.92 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x8c9096, metalness: 0.9, roughness: 0.38 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x07070b, metalness: 0, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02 }),
  };

  // body
  car.add(new THREE.Mesh(buildBodyGeometry(), m.paint));

  // floor
  car.add(box(4.0, 0.03, 1.45, m.carbon, -0.05, 0.08, 0));
  car.add(box(0.7, 0.02, 1.25, m.carbon, -1.95, 0.17, 0, -0.32)); // rear diffuser

  // cockpit: opening, helmet, halo
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), m.glass);
  canopy.scale.set(0.46, 0.13, 0.27);
  canopy.position.set(0.12, 0.73, 0);
  car.add(canopy);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 16), m.accent);
  helmet.position.set(0.02, 0.84, 0);
  car.add(helmet);
  for (const side of [1, -1]) {
    const halo = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.28, 0.74, 0.27 * side),
      new THREE.Vector3(-0.12, 1.0, 0.23 * side),
      new THREE.Vector3(0.3, 1.04, 0.15 * side),
      new THREE.Vector3(0.62, 0.78, 0.02 * side),
    ]);
    car.add(new THREE.Mesh(new THREE.TubeGeometry(halo, 24, 0.028, 8), m.carbon));
  }

  // airbox and sidepod inlets
  const airbox = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), m.carbon);
  airbox.scale.set(0.2, 0.13, 0.13);
  airbox.position.set(-0.62, 0.9, 0);
  car.add(airbox);
  for (const side of [1, -1]) {
    const inlet = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), m.carbon);
    inlet.scale.set(0.2, 0.1, 0.05);
    inlet.position.set(-0.1, 0.5, 0.57 * side);
    car.add(inlet);
  }
  const exhaust = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), m.carbon);
  exhaust.position.set(-2.12, 0.4, 0);
  car.add(exhaust);

  // front wing: main plane, two flaps, end plates, nose pylons
  car.add(box(0.36, 0.025, 1.9, m.paint, 2.25, 0.11, 0));
  car.add(box(0.26, 0.022, 1.8, m.trim, 2.13, 0.17, 0, 0.18));
  car.add(box(0.2, 0.02, 1.7, m.accent, 2.03, 0.23, 0, 0.3));
  for (const side of [1, -1]) {
    car.add(box(0.7, 0.3, 0.03, m.trim, 2.15, 0.2, 0.97 * side));
    car.add(box(0.5, 0.05, 0.04, m.carbon, 2.1, 0.2, 0.12 * side));
  }

  // rear wing: pillar, main plane, flap, end plates, beam wing
  car.add(box(0.07, 0.45, 0.09, m.carbon, -2.0, 0.78, 0));
  car.add(box(0.42, 0.03, 1.28, m.paint, -2.28, 1.02, 0, -0.12));
  car.add(box(0.3, 0.025, 1.28, m.accent, -2.36, 1.14, 0, -0.3));
  car.add(box(0.3, 0.02, 0.9, m.trim, -2.15, 0.5, 0));
  for (const side of [1, -1]) car.add(box(0.7, 0.55, 0.03, m.trim, -2.3, 0.98, 0.65 * side));

  // wheels and suspension
  const frontX = 1.55;
  const rearX = -1.45;
  const wheels: { x: number; radius: number; width: number; z: number }[] = [
    { x: frontX, radius: 0.34, width: 0.34, z: 0.82 },
    { x: rearX, radius: 0.37, width: 0.42, z: 0.88 },
  ];
  for (const { x, radius, width, z } of wheels) {
    for (const side of [1, -1] as const) {
      const wheel = buildWheel(radius, width, side, m);
      wheel.position.set(x, radius, z * side);
      car.add(wheel);
      const hub = new THREE.Vector3(x, radius, (z - width / 2) * side);
      car.add(rod(new THREE.Vector3(x - 0.2, 0.3, 0.2 * side), hub, 0.016, m.carbon));
      car.add(rod(new THREE.Vector3(x + 0.2, 0.34, 0.2 * side), hub, 0.016, m.carbon));
    }
  }

  car.userData.dispose = () => {
    texture.dispose();
    car.traverse((object) => {
      if (object instanceof THREE.Mesh) object.geometry.dispose();
    });
    Object.values(m).forEach((material) => material.dispose());
  };
  return car;
}

/** Frees the GPU memory held by a car made with `buildCar`. */
export function disposeCar(car: THREE.Group): void {
  (car.userData.dispose as (() => void) | undefined)?.();
}
