import type * as THREE from 'three';

import { specFor } from '../../data/cars';
import type { Livery } from '../../data/liveries';
import { buildModernCar } from './modernCar';
import type { CarOptions } from './modernCar';

/**
 * Builds the 3D car for a livery: the model of the generation the livery belongs to (the 2022 and 2026 cars so far;
 * generations not built yet use the 2022 car). Call `disposeCar` when the car is no longer needed.
 */
export function buildCar(livery: Livery, options?: CarOptions): THREE.Group {
  return buildModernCar(specFor(livery.era), livery, options);
}

/** Frees the GPU memory held by a car made with `buildCar`. */
export function disposeCar(car: THREE.Group): void {
  (car.userData.dispose as (() => void) | undefined)?.();
}
