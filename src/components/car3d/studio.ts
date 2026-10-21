import * as THREE from 'three';

// Fake studio surroundings used only to give the paint something to reflect: a dark room with a few bright
// soft boxes and strip lights, like a car photo shoot. Drawn as a small float image and turned into a reflection map.

const W = 512;
const H = 256;

interface Box {
  u: [number, number]; // around the room, 0 to 1
  v: [number, number]; // from the ceiling (0) down to the floor (1)
  color: [number, number, number]; // brightness above 1 is fine
  /** how soft the edges are, as a fraction of the picture */
  soft?: number;
}

// A car photo studio: a big soft box overhead and in front (the key), two long strip lights along the walls at
// bonnet height (they draw the long highlights along the flanks), a cool window behind, and a warm accent.
const SOFT_BOXES: Box[] = [
  { u: [0.4, 0.66], v: [0.04, 0.26], color: [7, 6.8, 6.4], soft: 0.03 }, // key soft box, high in front
  { u: [0.08, 0.36], v: [0.3, 0.37], color: [3.2, 3.3, 3.6], soft: 0.012 }, // strip light, left wall
  { u: [0.66, 0.94], v: [0.31, 0.38], color: [2.6, 2.7, 3.0], soft: 0.012 }, // strip light, right wall
  { u: [0.0, 0.06], v: [0.14, 0.42], color: [2.2, 2.8, 3.8], soft: 0.02 }, // cool window behind the car
  { u: [0.96, 1.0], v: [0.14, 0.42], color: [2.2, 2.8, 3.8], soft: 0.02 }, // (the same window, wrapped round)
  { u: [0.3, 0.37], v: [0.42, 0.52], color: [1.8, 0.5, 0.3], soft: 0.015 }, // warm accent low on the left
];

function studioPixels(): Float32Array {
  const data = new Float32Array(W * H * 4);
  for (let y = 0; y < H; y++) {
    const v = y / (H - 1);
    // a dark grey ceiling brightening toward a pale horizon band, then a nearly black floor
    const base = v < 0.5 ? 0.06 + 0.22 * smooth(v / 0.5) : 0.28 * (1 - smooth(Math.min(1, (v - 0.5) / 0.2))) + 0.015;
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1);
      let r = base;
      let g = base * 1.01;
      let b = base * 1.06;
      for (const box of SOFT_BOXES) {
        const soft = box.soft ?? 0.015;
        const inside = Math.min(u - box.u[0] + soft, box.u[1] - u + soft, v - box.v[0] + soft, box.v[1] - v + soft);
        if (inside <= 0) continue;
        const k = smooth(Math.min(1, inside / (2 * soft)));
        r += box.color[0] * k;
        g += box.color[1] * k;
        b += box.color[2] * k;
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
