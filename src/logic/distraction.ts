// The rules for leaving the app in the middle of a race. Pure functions, so they can be tested (npm run check).
// Time spent away never counts as focus time. How long you were away decides the consequence:
//   5 s to 30 s    yellow flag     a warning when you come back
//   30 s to 3 min  safety car      the car runs at half speed for the next minute
//   3 min or more  crash           the race ends with a DNF
// Pausing first excuses a break of up to 5 minutes. After that, time away counts as a distraction again.

export const RULES = {
  yellowAfterSeconds: 5,
  safetyCarAfterSeconds: 30,
  crashAfterSeconds: 180,
  pauseLimitSeconds: 300,
  /** How long the safety car period lasts, in seconds of racing after you come back. */
  safetyCarSeconds: 60,
  /** How fast the car (and the clock) moves during the safety car period, compared with normal. */
  safetyCarSpeed: 0.5,
} as const;

export type Distraction = 'none' | 'yellow' | 'safety-car' | 'crash';

/** What leaving the race for `awaySeconds` costs you. */
export function classifyAway(awaySeconds: number): Distraction {
  if (awaySeconds >= RULES.crashAfterSeconds) return 'crash';
  if (awaySeconds >= RULES.safetyCarAfterSeconds) return 'safety-car';
  if (awaySeconds >= RULES.yellowAfterSeconds) return 'yellow';
  return 'none';
}

/**
 * How much race progress `liveMs` of racing earns. The first `slowRemainingMs` of it is under the safety car (slower),
 * the rest is at full speed. Also returns how much of the safety car period is left.
 */
export function advanceProgress(liveMs: number, slowRemainingMs: number): { gainedMs: number; slowRemainingMs: number } {
  const live = Math.max(0, liveMs);
  const slow = Math.min(live, Math.max(0, slowRemainingMs));
  return { gainedMs: slow * RULES.safetyCarSpeed + (live - slow), slowRemainingMs: Math.max(0, slowRemainingMs) - slow };
}

/** How many seconds of an excused break are left, given how long the race has been paused. */
export function pauseSecondsLeft(pausedForMs: number): number {
  return Math.max(0, RULES.pauseLimitSeconds - pausedForMs / 1000);
}

/** The totals of a race's distractions, saved with the race. */
export interface AwayTotals {
  seconds: number;
  yellowFlags: number;
  safetyCars: number;
}

export const NO_AWAY: AwayTotals = { seconds: 0, yellowFlags: 0, safetyCars: 0 };

/** Adds one absence to the totals. */
export function addAway(totals: AwayTotals, awaySeconds: number): AwayTotals {
  const kind = classifyAway(awaySeconds);
  return {
    seconds: totals.seconds + awaySeconds,
    yellowFlags: totals.yellowFlags + (kind === 'yellow' ? 1 : 0),
    safetyCars: totals.safetyCars + (kind === 'safety-car' ? 1 : 0),
  };
}
