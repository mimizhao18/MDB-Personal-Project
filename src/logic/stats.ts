import type { Session } from '../models/types';

export interface LifetimeStats {
  races: number;
  laps: number;
  distanceKm: number;
  focusedSeconds: number;
}

export function lifetimeStats(sessions: readonly Session[]): LifetimeStats {
  let laps = 0;
  let distance = 0;
  let focused = 0;
  for (const s of sessions) {
    laps += s.completedLaps;
    distance += s.distanceKm;
    focused += s.focusedSeconds;
  }
  return {
    races: sessions.length,
    laps,
    distanceKm: Math.round(distance * 10) / 10,
    focusedSeconds: focused,
  };
}
