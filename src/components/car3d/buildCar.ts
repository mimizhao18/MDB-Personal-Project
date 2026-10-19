import type * as THREE from 'three';

import { specFor } from '../../data/cars';
import type { Livery } from '../../data/liveries';
import { classicBody, hasClassicBody } from './classicBody';
import { buildModernCar } from './modernCar';
import type { CarOptions } from './modernCar';

/**
 * Builds the 3D car for a livery: the model of the generation the livery belongs to. The 1980s, 2004 and 2014 cars each
 * have their own body construction (classicBody.ts); the 2022 and 2026 cars share the ground-effect body (modernCar.ts).
 * Call `disposeCar` when the car is no longer needed.
 */
export function buildCar(livery: Livery, options?: CarOptions): THREE.Group {
  const spec = specFor(livery.era);
  return buildModernCar(spec, livery, hasClassicBody(spec.id) ? { ...options, body: classicBody } : options);
}

/** Frees the GPU memory held by a car made with `buildCar`. */
export function disposeCar(car: THREE.Group): void {
  (car.userData.dispose as (() => void) | undefined)?.();
}
