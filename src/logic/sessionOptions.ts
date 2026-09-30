/** Session lengths offered on the Create Session screen, in whole laps. The last one is a full Silverstone race. */
export const LAP_OPTIONS = [5, 10, 20, 30, 40, 52] as const;

export const DEFAULT_LAPS = 10;

/** "15 min", "7 min 30 s", "1 h 18 min". */
export function formatDurationWords(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return m > 0 ? `${h} h ${m} min` : `${h} h`;
  if (m > 0) return sec > 0 ? `${m} min ${sec} s` : `${m} min`;
  return `${sec} s`;
}
