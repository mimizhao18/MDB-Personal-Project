import { Component, useMemo } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { View } from 'react-native';

import { makeStyles } from '../design/styles';
import type { CarSettings } from '../models/types';
import { colors } from '../theme';
import { CarImage } from './CarIcon';

type RenderCar3D = (props: { car: CarSettings; height?: number; background?: string; autoSpin?: boolean }) => ReactElement;

const useStyles = makeStyles(() => ({
  fill: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
}));

let cached: RenderCar3D | null | undefined;

/**
 * Loads the 3D view the first time it is needed (not when the app starts), and gives up quietly if this device cannot
 * run it, so the 2D car is shown instead and the app keeps working.
 */
function load3D(): RenderCar3D | null {
  if (cached !== undefined) return cached;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loaded = require('./car3d/Car3DView') as { renderCar3D?: RenderCar3D };
    cached = loaded.renderCar3D ?? null;
  } catch {
    cached = null;
  }
  return cached;
}

class FallbackOnError extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * The big picture of the player's car, used on Home and in the garage: the 3D car you can spin, or the flat 2D car if
 * 3D is not available on this device. Fills its parent unless a `height` is given.
 */
export function HeroCar({
  car,
  height,
  background = colors.background,
  fallbackSize = 300,
  autoSpin = true,
}: {
  car: CarSettings;
  height?: number;
  background?: string;
  fallbackSize?: number;
  /** Whether the 3D car turns slowly by itself when left alone. */
  autoSpin?: boolean;
}) {
  const styles = useStyles();
  const render3D = useMemo(() => load3D(), []);

  const flat = (
    <View style={[styles.fill, height ? { flex: 0, height } : null]}>
      <CarImage car={car} size={fallbackSize} />
    </View>
  );
  if (!render3D) return flat;
  return <FallbackOnError fallback={flat}>{render3D({ car, height, background, autoSpin })}</FallbackOnError>;
}
