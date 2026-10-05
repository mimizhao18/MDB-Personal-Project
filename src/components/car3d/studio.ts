import * as THREE from 'three';

// Fake studio surroundings used only to give the paint something to reflect: a dark room with a few bright
// soft boxes, like a car photo shoot. Drawn as a small float image and turned into a reflection map.

const W = 256;
const H = 128;

interface Box {
  u: [number, number]; // around the room, 0 to 1
  v: [number, number]; // from the ceiling (0) down to the floor (1)
  color: [number, number, number]; // brightness above 1 is fine
}

const SOFT_BOXES: Box[] = [
  { u: [0.52, 0.7], v: [0.08, 0.34], color: [9, 9, 9.5] }, // big key light, front left
  { u: [0.04, 0.12], v: [0.22, 0.5], color: [4.5, 5, 6] }, // cool strip, behind right
  { u: [0.3, 0.37], v: [0.28, 0.56], color: [3.4, 0.35, 0.28] }, // red accent strip
  { u: [0.82, 0.95], v: [0.12, 0.26], color: [3.5, 3.5, 3.8] }, // top rear fill
];

function studioPixels(): Float32Array {
  const data = new Float32Array(W * H * 4);
  for (let y = 0; y < H; y++) {
    const v = y / (H - 1);
    // dark ceiling, slightly lighter near the horizon, nearly black floor
    const base = v < 0.55 ? 0.05 + 0.1 * smooth(v / 0.55) : 0.15 * (1 - smooth((v - 0.55) / 0.45)) + 0.01;
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1);
      let r = base;
      let g = base;
      let b = base * 1.05;
      for (const box of SOFT_BOXES) {
        if (u >= box.u[0] && u <= box.u[1] && v >= box.v[0] && v <= box.v[1]) {
          // soft edges
          const edge = Math.min(u - box.u[0], box.u[1] - u, v - box.v[0], box.v[1] - v);
          const k = Math.min(1, edge / 0.015);
          r += box.color[0] * k;
          g += box.color[1] * k;
          b += box.color[2] * k;
        }
      }
      const o = (y * W + x) * 4;
      data[o] = r;
      data[o + 1] = g;
      data[o + 2] = b;
      data[o + 3] = 1;
    }
  }
  return data;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** A reflection map for `scene.environment`, or null if this device cannot make one (the car is then lit by lights only). */
export function buildStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture | null {
  try {
    const source = new THREE.DataTexture(studioPixels(), W, H, THREE.RGBAFormat, THREE.FloatType);
    source.mapping = THREE.EquirectangularReflectionMapping;
    source.minFilter = THREE.LinearFilter;
    source.magFilter = THREE.LinearFilter;
    source.generateMipmaps = false;
    source.needsUpdate = true;
    const generator = new THREE.PMREMGenerator(renderer);
    const target = generator.fromEquirectangular(source);
    generator.dispose();
    source.dispose();
    return target.texture;
  } catch {
    return null;
  }
}

/** A soft round gradient (for the floor glow and the contact shadow). `rgb` is 0 to 255; alpha fades from the centre. */
export function radialTexture(rgb: [number, number, number], peakAlpha: number, power = 2): THREE.DataTexture {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot((x / (size - 1)) * 2 - 1, (y / (size - 1)) * 2 - 1);
      const alpha = Math.pow(Math.max(0, 1 - d), power) * peakAlpha;
      const o = (y * size + x) * 4;
      data[o] = rgb[0];
      data[o + 1] = rgb[1];
      data[o + 2] = rgb[2];
      data[o + 3] = Math.round(alpha * 255);
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}
