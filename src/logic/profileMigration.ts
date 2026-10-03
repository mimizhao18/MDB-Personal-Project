import type { PlayerProfile } from '../models/types';

export interface LiveryCatalog {
  /** Every livery that exists now. */
  knownIds: readonly string[];
  /** Liveries everyone owns. */
  freeIds: readonly string[];
  defaultId: string;
}

/**
 * Turns whatever was saved into a valid profile, or null if the core fields are unusable.
 * Keeps XP, credits and streak. Older profiles (which had paint colors instead of liveries) get the default livery,
 * and a retired or unknown livery id falls back to the default so the car never fails to draw.
 */
export function normalizeProfile(raw: unknown, catalog: LiveryCatalog, minNumber: number, maxNumber: number): PlayerProfile | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const p = raw as Record<string, unknown>;
  if (
    typeof p.totalXp !== 'number' ||
    typeof p.credits !== 'number' ||
    typeof p.currentStreak !== 'number' ||
    typeof p.longestStreak !== 'number' ||
    !(p.lastSessionDay === null || typeof p.lastSessionDay === 'string')
  ) {
    return null;
  }

  const stored = Array.isArray(p.unlockedLiveries) ? p.unlockedLiveries.filter((id): id is string => typeof id === 'string') : [];
  const unlocked = Array.from(new Set([...catalog.freeIds, ...stored.filter((id) => catalog.knownIds.includes(id))]));

  const car = typeof p.car === 'object' && p.car !== null ? (p.car as Record<string, unknown>) : {};
  const wornId = typeof car.liveryId === 'string' && catalog.knownIds.includes(car.liveryId) ? car.liveryId : catalog.defaultId;
  const number =
    typeof car.number === 'number' && Number.isInteger(car.number) && car.number >= minNumber && car.number <= maxNumber ? car.number : minNumber;

  return {
    totalXp: p.totalXp,
    credits: p.credits,
    currentStreak: p.currentStreak,
    longestStreak: p.longestStreak,
    lastSessionDay: p.lastSessionDay,
    unlockedLiveries: unlocked,
    // Never wear a livery that is not owned.
    car: { liveryId: unlocked.includes(wornId) ? wornId : catalog.defaultId, number },
  };
}
