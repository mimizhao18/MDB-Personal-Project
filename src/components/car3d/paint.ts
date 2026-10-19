import * as THREE from 'three';

import { specFor } from '../../data/cars';
import { PAINT_BOX, frontWingSection, rearWingSection } from '../../data/cars/spec';
import type { Outline } from '../../data/cars/spec';
import type { Livery, LiveryLayer, LiveryText } from '../../data/liveries';
import { GLYPH_HEIGHT, GLYPH_WIDTH, glyphRows } from './font';

// A livery is a pair of flat pictures: one of the car seen from above, one seen from the side. The paint material looks
// each surface point up in them by its position on the car (top picture for surfaces facing up, side picture for the
// rest), so one set of flat shapes colors the whole body no matter how it is curved.

const { xMin, xMax, zHalf, yMax } = PAINT_BOX;
const TOP_W = 1536;
const TOP_H = 576;
const SIDE_W = 1536;
const SIDE_H = 336;
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

type ToPixel = (a: number, b: number) => [number, number];

/** The flat shapes of the wing elements seen from above, in their paint colors, so the wings are painted (and can carry lettering) too. */
function wingLayers(livery: Livery): LiveryLayer[] {
  const spec = specFor(livery.era);
  const layers: LiveryLayer[] = [];
  const fw = spec.frontWing;
  for (const e of fw.elements) {
    const color = e.flap ? livery.parts.flap : livery.parts.wing;
    const z0 = Math.max(e.from, 0.12); // leave the middle to the nose, which runs into the wing
    const zs = Array.from({ length: 24 }, (_, i) => z0 + ((fw.span - 0.01 - z0) * i) / 23);
    for (const side of [1, -1]) {
      const le = zs.map((z) => [frontWingSection(spec, e, z).x, z * side] as const);
      const te = zs.map((z) => {
        const sec = frontWingSection(spec, e, z);
        return [sec.x - sec.chord, z * side] as const;
      });
      layers.push({ color, points: [...le, ...te.reverse()] });
    }
  }
  const rw = spec.rearWing;
  for (const e of rw.elements) {
    const color = e.flap ? livery.parts.flap : livery.parts.wing;
    const half = rw.span - 0.01;
    const zs = Array.from({ length: 30 }, (_, i) => -half + (2 * half * i) / 29);
    const le = zs.map((z) => [rearWingSection(spec, e, z).x, z] as const);
    const te = zs.map((z) => {
      const sec = rearWingSection(spec, e, z);
      return [sec.x - sec.chord, z] as const;
    });
    layers.push({ color, points: [...le, ...te.reverse()] });
  }
  return layers;
}

/** A flat picture: the base color with the livery's shapes filled in (no lettering yet). */
function paintShapes(width: number, height: number, base: Rgb, layers: readonly LiveryLayer[], toPixel: ToPixel): Uint8Array {
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
  return data;
}

/**
 * Letters one piece of text onto a picture. `view` says which way is up for the letters: in the top picture the car's
 * right side is down; in the side picture up is up. `mirror` draws it back to front, for the picture seen from the
 * other side of the car, so the letters read the right way round from both sides.
 */
function drawText(data: Uint8Array, width: number, height: number, toPixel: ToPixel, t: LiveryText, mirror: boolean): void {
  const text = t.text;
  const p = t.height / GLYPH_HEIGHT; // the size of one font pixel, in metres
  const advance = (GLYPH_WIDTH + 1) * p + (t.spacing ?? 0);
  const length = text.length * advance - p;
  const start = t.align === 'center' ? t.x - length / 2 : t.align === 'right' ? t.x - length : t.x;
  const rgb = hexToRgb(t.color);
  if (t.view === 'top' && t.orient && t.orient !== 'along') {
    // across the wing: the letters advance along z, with their tops toward the front (read from the rear) or the rear
    const fromRear = t.orient === 'across-rear';
    const zStart = fromRear ? t.y - length / 2 : t.y + length / 2;
    for (let i = 0; i < text.length; i++) {
      const rows = glyphRows(text[i]);
      for (let r = 0; r < GLYPH_HEIGHT; r++) {
        for (let c = 0; c < GLYPH_WIDTH; c++) {
          if (!((rows[r] >> (GLYPH_WIDTH - 1 - c)) & 1)) continue;
          const off = i * advance + c * p;
          const z0 = fromRear ? zStart + off : zStart - off - p;
          const x0 = fromRear ? t.x + t.height / 2 - (r + 1) * p : t.x - t.height / 2 + r * p;
          fillPolygon(data, width, height, [toPixel(x0, z0), toPixel(x0 + p, z0), toPixel(x0 + p, z0 + p), toPixel(x0, z0 + p)], rgb);
        }
      }
    }
    return;
  }
  for (let i = 0; i < text.length; i++) {
    const slot = mirror ? text.length - 1 - i : i;
    const rows = glyphRows(text[i]);
    for (let r = 0; r < GLYPH_HEIGHT; r++) {
      for (let c = 0; c < GLYPH_WIDTH; c++) {
        const col = mirror ? GLYPH_WIDTH - 1 - c : c;
        if (!((rows[r] >> (GLYPH_WIDTH - 1 - col)) & 1)) continue;
        const x0 = start + slot * advance + c * p;
        // top view: the glyph's top row is toward -z; side view: toward +y
        const lo = t.view === 'top' ? t.y - t.height / 2 + r * p : t.y + t.height / 2 - (r + 1) * p;
        fillPolygon(data, width, height, [toPixel(x0, lo), toPixel(x0 + p, lo), toPixel(x0 + p, lo + p), toPixel(x0, lo + p)], rgb);
      }
    }
  }
}

function toTexture(data: Uint8Array, width: number, height: number): THREE.DataTexture {
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
  /** The picture for the right side of the car, and the same for the left with its lettering turned round. */
  side: THREE.DataTexture;
  sideLeft: THREE.DataTexture;
}

/** Draws the livery's pictures. Free them with `disposePictures` when the car is no longer needed. */
export function buildLiveryPictures(livery: Livery): LiveryPictures {
  const base = hexToRgb(livery.primary);
  const topPixel: ToPixel = (x, z) => [((x - xMin) / (xMax - xMin)) * TOP_W, ((z + zHalf) / (2 * zHalf)) * TOP_H];
  const sidePixel: ToPixel = (x, y) => [((x - xMin) / (xMax - xMin)) * SIDE_W, (y / yMax) * SIDE_H];
  const topData = paintShapes(TOP_W, TOP_H, base, [...livery.top, ...wingLayers(livery), ...(livery.wingTop ?? [])], topPixel);
  const sideData = paintShapes(SIDE_W, SIDE_H, base, livery.side, sidePixel);
  const sideLeftData = sideData.slice();
  for (const t of livery.texts ?? []) {
    if (t.view === 'top') drawText(topData, TOP_W, TOP_H, topPixel, t, false);
    else {
      drawText(sideData, SIDE_W, SIDE_H, sidePixel, t, false);
      drawText(sideLeftData, SIDE_W, SIDE_H, sidePixel, t, true);
    }
  }
  return { top: toTexture(topData, TOP_W, TOP_H), side: toTexture(sideData, SIDE_W, SIDE_H), sideLeft: toTexture(sideLeftData, SIDE_W, SIDE_H) };
}

/** A picture for a wing end plate: its color with its lettering, sized to the plate outline and mapped by position. */
export function buildPlateTexture(outline: Outline, base: string, texts: readonly LiveryText[], mirror: boolean): THREE.DataTexture {
  const xs = outline.map(([x]) => x);
  const ys = outline.map(([, y]) => y);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  const w = Math.max(...xs) - x0;
  const h = Math.max(...ys) - y0;
  const PPM = 420; // pixels per metre
  const width = Math.max(8, Math.ceil(w * PPM));
  const height = Math.max(8, Math.ceil(h * PPM));
  const toPixel: ToPixel = (x, y) => [(x - x0) * PPM, (y - y0) * PPM];
  const data = paintShapes(width, height, hexToRgb(base), [], toPixel);
  for (const t of texts) drawText(data, width, height, toPixel, { ...t, view: 'side' }, mirror);
  const texture = toTexture(data, width, height);
  // the end plate faces are mapped by their own x and y in metres, so scale and shift to the picture
  texture.repeat.set(1 / w, 1 / h);
  texture.offset.set(-x0 / w, -y0 / h);
  return texture;
}

export function disposePictures(pictures: LiveryPictures): void {
  pictures.top.dispose();
  pictures.side.dispose();
  pictures.sideLeft.dispose();
}

/**
 * Makes `material` take its color from the livery pictures by position on the car. The mesh must have its vertices in
 * the car's own coordinates (no position or rotation of its own).
 */
export function applyLiveryPaint(material: THREE.MeshPhysicalMaterial, pictures: LiveryPictures, weave = false): void {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uPaintTop = { value: pictures.top };
    shader.uniforms.uPaintSide = { value: pictures.side };
    shader.uniforms.uPaintSideLeft = { value: pictures.sideLeft };
    shader.uniforms.uPaintBox = { value: new THREE.Vector4(xMin, xMax - xMin, zHalf, yMax) };
    shader.uniforms.uPaintWeave = { value: weave ? 1 : 0 };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vPaintPos;\nvarying vec3 vPaintNormal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPaintPos = position;\nvPaintNormal = normal;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vPaintPos;\nvarying vec3 vPaintNormal;\nuniform sampler2D uPaintTop;\nuniform sampler2D uPaintSide;\nuniform sampler2D uPaintSideLeft;\nuniform vec4 uPaintBox;\nuniform float uPaintWeave;',
      )
      .replace(
        '#include <map_fragment>',
        `float paintTopWeight = smoothstep(0.5, 0.85, abs(normalize(vPaintNormal).y));
vec2 paintUvTop = vec2((vPaintPos.x - uPaintBox.x) / uPaintBox.y, (vPaintPos.z + uPaintBox.z) / (2.0 * uPaintBox.z));
vec2 paintUvSide = vec2((vPaintPos.x - uPaintBox.x) / uPaintBox.y, vPaintPos.y / uPaintBox.w);
vec3 paintSide = vPaintPos.z >= 0.0 ? texture2D(uPaintSide, paintUvSide).rgb : texture2D(uPaintSideLeft, paintUvSide).rgb;
diffuseColor.rgb *= mix(paintSide, texture2D(uPaintTop, paintUvTop).rgb, paintTopWeight);
vec2 paintWeaveG = vec2(vPaintPos.x + vPaintPos.z, vPaintPos.x - vPaintPos.z + vPaintPos.y) * 28.0;
float paintWeaveCell = mod(floor(paintWeaveG.x) + floor(paintWeaveG.y), 2.0);
float paintWeaveFade = 1.0 - smoothstep(0.3, 0.7, fwidth(paintWeaveG.x) + fwidth(paintWeaveG.y));
diffuseColor.rgb *= 1.0 - 0.32 * uPaintWeave * paintWeaveCell * paintWeaveFade;`,
      );
  };
  material.customProgramCacheKey = () => 'livery-paint-v3';
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
