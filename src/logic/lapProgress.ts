import type { Track } from '../models/types';

export interface LapProgress {
  plannedSeconds: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  /** Whole laps finished so far. */
  completedLaps: number;
  /** The lap being driven, starting at 1 (stays at plannedLaps once finished). */
  currentLap: number;
  /** How far through the current lap, 0 to 1. The car's position on the track is points[fraction * length]. */
  lapFraction: number;
  /** How far through the whole session, 0 to 1. */
  totalFraction: number;
  finished: boolean;
}

/** Turns "planned laps + elapsed time" into lap numbers and fractions. */
export function lapProgress(track: Track, plannedLaps: number, elapsedSeconds: number): LapProgress {
  const plannedSeconds = plannedLaps * track.lapTimeSeconds;
  const elapsed = Math.max(0, Math.min(elapsedSeconds, plannedSeconds));
  const finished = elapsed >= plannedSeconds;
  const completedLaps = finished ? plannedLaps : Math.floor(elapsed / track.lapTimeSeconds);
  return {
    plannedSeconds,
    elapsedSeconds: elapsed,
    remainingSeconds: plannedSeconds - elapsed,
    completedLaps,
    currentLap: Math.min(completedLaps + 1, plannedLaps),
    lapFraction: finished ? 1 : (elapsed % track.lapTimeSeconds) / track.lapTimeSeconds,
    totalFraction: plannedSeconds === 0 ? 1 : elapsed / plannedSeconds,
    finished,
  };
}

/** Formats seconds as m:ss, e.g. 90 -> "1:30". */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
