import type * as THREE from 'three';

import type { Livery } from '../../data/liveries';
import { buildGen2022 } from './gen2022';

/**
 * Builds the 3D car for a livery: the model of the generation the livery belongs to. Only the 2022 car exists so far,
 * so it is also the fallback. Call `disposeCar` when the car is no longer needed.
 */
export function buildCar(livery: Livery): THREE.Group {
  switch (livery.era) {
    case 'gen2022':
    default:
      return buildGen2022(livery);
  }
}

/** Frees the GPU memory held by a car made with `buildCar`. */
export function disposeCar(car: THREE.Group): void {
  (car.userData.dispose as (() => void) | undefined)?.();
}
