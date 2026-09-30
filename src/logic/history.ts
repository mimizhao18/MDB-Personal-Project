import type { Session } from '../models/types';
import { dayKey } from './streak';

export interface DayActivity {
  /** Local calendar day, YYYY-MM-DD. */
  day: string;
  /** 0 = Sunday ... 6 = Saturday. */
  weekday: number;
  races: number;
  focusedSeconds: number;
}

/** The last `count` days ending on `today` (oldest first), with what was focused on each. */
export function recentDays(sessions: readonly Session[], today: Date, count: number): DayActivity[] {
  const days: DayActivity[] = [];
  for (let k = count - 1; k >= 0; k--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - k);
    days.push({ day: dayKey(d), weekday: d.getDay(), races: 0, focusedSeconds: 0 });
  }
  const byDay = new Map(days.map((d) => [d.day, d]));
  for (const s of sessions) {
    const entry = byDay.get(dayKey(new Date(s.endedAt)));
    if (entry) {
      entry.races += 1;
      entry.focusedSeconds += s.focusedSeconds;
    }
  }
  return days;
}
