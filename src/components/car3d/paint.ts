import * as THREE from 'three';

import { PAINT_BOX } from '../../data/cars/spec';
import type { Livery, LiveryLayer } from '../../data/liveries';

// A livery is a pair of flat pictures: one of the car seen from above, one seen from the side. The paint material looks
// each surface point up in them by its position on the car (top picture for surfaces facing up, side picture for the
// rest), so one set of flat shapes colors the whole body no matter how it is curved.

const { xMin, xMax, zHalf, yMax } = PAINT_BOX;
const TOP_W = 1024;
const TOP_H = 384;
const SIDE_W = 1024;
const SIDE_H = 224;
const SUBSAMPLES = 4;

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Fills a polygon (in pixel coordinates) with a color, with soft edges from a few samples per pixel row. */
function fillPolygon(data: Uint8Array, width: number, height: number, points: readonly (readonly [number, number])[], rgb: Rgb): void {
  if (points.length < 3) return;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [, y] of points) {
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const first = Math.max(0, Math.floor(minY));
  const last = Math.min(height - 1, Math.ceil(maxY));
  const coverage = new Float32Array(width);

  for (let py = first; py <= last; py++) {
    coverage.fill(0);
    let touched = false;
    for (let k = 0; k < SUBSAMPLES; k++) {
      const sy = py + (k + 0.5) / SUBSAMPLES;
      const crossings: number[] = [];
      for (let i = 0; i < points.length; i++) {
        const [x0, y0] = points[i];
        const [x1, y1] = points[(i + 1) % points.length];
        if ((y0 <= sy && y1 > sy) || (y1 <= sy && y0 > sy)) crossings.push(x0 + ((sy - y0) / (y1 - y0)) * (x1 - x0));
      }
      crossings.sort((a, b) => a - b);
      for (let c = 0; c + 1 < crossings.length; c += 2) {
        const xa = Math.max(0, crossings[c]);
        const xb = Math.min(width, crossings[c + 1]);
        if (xb <= xa) continue;
        touched = true;
        for (let px = Math.floor(xa); px < Math.ceil(xb); px++) {
          coverage[px] += (Math.min(px + 1, xb) - Math.max(px, xa)) / SUBSAMPLES;
        }
      }
    }
    if (!touched) continue;
    for (let px = 0; px < width; px++) {
      const a = Math.min(1, coverage[px]);
      if (a <= 0) continue;
      const o = (py * width + px) * 4;
      data[o] += (rgb[0] - data[o]) * a;
      data[o + 1] += (rgb[1] - data[o + 1]) * a;
      data[o + 2] += (rgb[2] - data[o + 2]) * a;
    }
  }
}

function paintPicture(width: number, height: number, base: Rgb, layers: readonly LiveryLayer[], toPixel: (a: number, b: number) => [number, number]): THREE.DataTexture {
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    data[i * 4] = base[0];
    data[i * 4 + 1] = base[1];
    data[i * 4 + 2] = base[2];
    data[i * 4 + 3] = 255;
  }
  for (const layer of layers) {
    fillPolygon(data, width, height, layer.points.map(([a, b]) => toPixel(a, b)), hexToRgb(layer.color));
  }
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

export interface LiveryPictures {
  top: THREE.DataTexture;
  side: THREE.DataTexture;
}

/** Draws the livery's top and side pictures. Free them with `.dispose()` when the car is no longer needed. */
export function buildLiveryPictures(livery: Livery): LiveryPictures {
  const base = hexToRgb(livery.primary);
  const top = paintPicture(TOP_W, TOP_H, base, livery.top, (x, z) => [((x - xMin) / (xMax - xMin)) * TOP_W, ((z + zHalf) / (2 * zHalf)) * TOP_H]);
  const side = paintPicture(SIDE_W, SIDE_H, base, livery.side, (x, y) => [((x - xMin) / (xMax - xMin)) * SIDE_W, (y / yMax) * SIDE_H]);
  return { top, side };
}

/**
 * Makes `material` take its color from the livery pictures by position on the car. The mesh must have its vertices in
 * the car's own coordinates (no position or rotation of its own).
 */
export function applyLiveryPaint(material: THREE.MeshPhysicalMaterial, pictures: LiveryPictures): void {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uPaintTop = { value: pictures.top };
    shader.uniforms.uPaintSide = { value: pictures.side };
    shader.uniforms.uPaintBox = { value: new THREE.Vector4(xMin, xMax - xMin, zHalf, yMax) };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vPaintPos;\nvarying vec3 vPaintNormal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPaintPos = position;\nvPaintNormal = normal;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vPaintPos;\nvarying vec3 vPaintNormal;\nuniform sampler2D uPaintTop;\nuniform sampler2D uPaintSide;\nuniform vec4 uPaintBox;',
      )
      .replace(
        '#include <map_fragment>',
        `float paintTopWeight = smoothstep(0.5, 0.85, abs(normalize(vPaintNormal).y));
vec2 paintUvTop = vec2((vPaintPos.x - uPaintBox.x) / uPaintBox.y, (vPaintPos.z + uPaintBox.z) / (2.0 * uPaintBox.z));
vec2 paintUvSide = vec2((vPaintPos.x - uPaintBox.x) / uPaintBox.y, vPaintPos.y / uPaintBox.w);
diffuseColor.rgb *= mix(texture2D(uPaintSide, paintUvSide).rgb, texture2D(uPaintTop, paintUvTop).rgb, paintTopWeight);`,
      );
  };
  material.customProgramCacheKey = () => 'livery-paint-v1';
}

/**
 * Gives a dark material a carbon-fibre weave: a fine diagonal checker laid on by position, which fades out when it
 * would be smaller than a pixel (so it does not shimmer from far away). The mesh must have its vertices in car
 * coordinates, like the livery paint.
 */
export function applyCarbonWeave(material: THREE.MeshStandardMaterial): void {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWeavePos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWeavePos = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWeavePos;')
      .replace(
        '#include <map_fragment>',
        `vec2 weaveG = vec2(vWeavePos.x + vWeavePos.z, vWeavePos.x - vWeavePos.z + vWeavePos.y) * 28.0;
float weaveCell = mod(floor(weaveG.x) + floor(weaveG.y), 2.0);
float weaveFade = 1.0 - smoothstep(0.3, 0.7, fwidth(weaveG.x) + fwidth(weaveG.y));
diffuseColor.rgb *= 1.0 - 0.32 * weaveCell * weaveFade;`,
      );
  };
  material.customProgramCacheKey = () => 'carbon-weave-v1';
}
