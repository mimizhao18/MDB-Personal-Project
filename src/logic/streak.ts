/** Local calendar day as YYYY-MM-DD. */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Whole days from day key `a` to day key `b` (positive if b is later). */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000);
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastSessionDay: string | null;
}

/** Streak after a counted session on `today`: same day keeps it, the next day extends it, a gap restarts at 1. */
export function applySessionToStreak(state: StreakState, today: string): StreakState {
  let current: number;
  if (state.lastSessionDay === null) {
    current = 1;
  } else {
    const gap = daysBetween(state.lastSessionDay, today);
    if (gap <= 0) current = Math.max(state.currentStreak, 1);
    else if (gap === 1) current = state.currentStreak + 1;
    else current = 1;
  }
  const lastDay = state.lastSessionDay !== null && daysBetween(state.lastSessionDay, today) < 0 ? state.lastSessionDay : today;
  return {
    currentStreak: current,
    longestStreak: Math.max(state.longestStreak, current),
    lastSessionDay: lastDay,
  };
}

/** The streak to display today: it is broken if the last session was before yesterday. */
export function displayedStreak(state: StreakState, today: string): number {
  if (state.lastSessionDay === null) return 0;
  return daysBetween(state.lastSessionDay, today) <= 1 ? state.currentStreak : 0;
}
