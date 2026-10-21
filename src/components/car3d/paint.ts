import * as THREE from 'three';

import { PAINT_BOX } from '../../data/cars/spec';
import type { Outline } from '../../data/cars/spec';
import type { Livery, LiveryDecal, LiveryText } from '../../data/liveryTypes';
import type { LiveryPixels } from './liveryRaster';
import { paintLivery, paintPlate } from './liveryRaster';

// A livery is a pair of flat pictures: one of the car seen from above, one seen from the side. The paint material looks
// each surface point up in them by its position on the car (top picture for surfaces facing up, side picture for the
// rest), so one set of flat shapes colors the whole body no matter how it is curved. The pictures are painted on the
// CPU by liveryRaster.ts; this file makes them into textures and patches the materials' shaders.

const { xMin, xMax, zHalf, yMax } = PAINT_BOX;

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

// The painted pixels of the last few liveries, so going back and forth between cars (Garage, Store) does not paint
// them again. The pixels are kept, not the textures: a texture is freed with its car, the pixels are only read.
const CACHE_SIZE = 3;
const cache = new Map<Livery, LiveryPixels>();

/** The livery's pixels, painted or from the cache. */
export function liveryPixels(livery: Livery): LiveryPixels {
  const hit = cache.get(livery);
  if (hit) {
    cache.delete(livery);
    cache.set(livery, hit);
    return hit;
  }
  const pixels = paintLivery(livery);
  cache.set(livery, pixels);
  while (cache.size > CACHE_SIZE) cache.delete(cache.keys().next().value as Livery);
  return pixels;
}

/** Draws the livery's pictures. Free them with `disposePictures` when the car is no longer needed. */
export function buildLiveryPictures(livery: Livery): LiveryPictures {
  const { top, side, sideLeft } = liveryPixels(livery);
  return { top: toTexture(top.data, top.width, top.height), side: toTexture(side.data, side.width, side.height), sideLeft: toTexture(sideLeft.data, sideLeft.width, sideLeft.height) };
}

/** A picture for a wing end plate: its color with its logos and lettering, sized to the plate outline and mapped by position. */
export function buildPlateTexture(outline: Outline, base: string, texts: readonly LiveryText[], mirror: boolean, decals: readonly LiveryDecal[] = []): THREE.DataTexture {
  const pic = paintPlate(outline, base, texts, decals, mirror);
  const texture = toTexture(pic.data, pic.width, pic.height);
  // the end plate faces are mapped by their own x and y in metres, so scale and shift to the picture
  texture.repeat.set(1 / pic.w, 1 / pic.h);
  texture.offset.set(-pic.x0 / pic.w, -pic.y0 / pic.h);
  return texture;
}

export function disposePictures(pictures: LiveryPictures): void {
  pictures.top.dispose();
  pictures.side.dispose();
  pictures.sideLeft.dispose();
}

/**
 * Makes `material` take its color from the livery pictures by position on the car. The mesh must have its vertices in
 * the car's own coordinates (no position or rotation of its own). `topOnly` uses the top picture everywhere: for the
 * wings, whose steep flap faces would otherwise pick up the side picture (the nose's colors, at the same height).
 */
export function applyLiveryPaint(material: THREE.MeshPhysicalMaterial, pictures: LiveryPictures, weave = false, topOnly = false): void {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uPaintTop = { value: pictures.top };
    shader.uniforms.uPaintSide = { value: pictures.side };
    shader.uniforms.uPaintSideLeft = { value: pictures.sideLeft };
    shader.uniforms.uPaintBox = { value: new THREE.Vector4(xMin, xMax - xMin, zHalf, yMax) };
    shader.uniforms.uPaintWeave = { value: weave ? 1 : 0 };
    shader.uniforms.uPaintTopOnly = { value: topOnly ? 1 : 0 };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vPaintPos;\nvarying vec3 vPaintNormal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPaintPos = position;\nvPaintNormal = normal;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vPaintPos;\nvarying vec3 vPaintNormal;\nuniform sampler2D uPaintTop;\nuniform sampler2D uPaintSide;\nuniform sampler2D uPaintSideLeft;\nuniform vec4 uPaintBox;\nuniform float uPaintWeave;\nuniform float uPaintTopOnly;',
      )
      .replace(
        '#include <map_fragment>',
        `float paintTopWeight = max(uPaintTopOnly, smoothstep(0.5, 0.85, abs(normalize(vPaintNormal).y)));
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
  material.customProgramCacheKey = () => 'livery-paint-v4';
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
