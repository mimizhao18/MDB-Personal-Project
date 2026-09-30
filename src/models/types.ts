export type TrackId = 'silverstone';

export interface Track {
  id: TrackId;
  name: string;
  country: string;
  /** Laps in the real Grand Prix. */
  raceLaps: number;
  lapLengthKm: number;
  /** Seconds one lap takes in the app: the lap record rounded to the nearest 10 s. */
  lapTimeSeconds: number;
  viewBox: { width: number; height: number };
  startFinish: { from: Point; to: Point };
  /** SVG path of the centerline. */
  path: string;
  /** Evenly spaced along the lap starting at the start/finish line; point i is i / length of a lap. */
  points: readonly (readonly [number, number])[];
}

export interface Point {
  x: number;
  y: number;
}

export interface Session {
  id: string;
  trackId: TrackId;
  plannedLaps: number;
  focusedSeconds: number;
  /** Whole laps finished (never more than plannedLaps). */
  completedLaps: number;
  /** True if the session ran to the end, false if ended early. */
  finished: boolean;
  /** ISO timestamps. */
  startedAt: string;
  endedAt: string;
  distanceKm: number;
  xpEarned: number;
  creditsEarned: number;
}

export interface CarSettings {
  primaryColor: string;
  secondaryColor: string;
  number: number;
}

export interface PlayerProfile {
  totalXp: number;
  credits: number;
  currentStreak: number;
  longestStreak: number;
  /** Local calendar day (YYYY-MM-DD) of the last session that counted toward the streak. */
  lastSessionDay: string | null;
  car: CarSettings;
}
