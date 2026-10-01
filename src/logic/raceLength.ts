import type { Track } from '../models/types';

/** Laps for a chosen number of minutes, snapped to a whole lap (at least 1, at most a full race). */
export function lapsFromMinutes(track: Track, minutes: number): number {
  const laps = Math.round((minutes * 60) / track.lapTimeSeconds);
  return clampLaps(track, laps);
}

/** The whole minute closest to the time `laps` takes, used to place the minutes slider. */
export function minutesForLaps(track: Track, laps: number): number {
  return Math.round((laps * track.lapTimeSeconds) / 60);
}

/** The longest race on the minutes slider: a full race distance, in whole minutes. */
export function maxMinutes(track: Track): number {
  return minutesForLaps(track, track.raceLaps);
}

export function clampLaps(track: Track, laps: number): number {
  return Math.max(1, Math.min(Math.round(laps), track.raceLaps));
}
