import type { PlayerProfile, Session } from '../models/types';
import { applySessionToStreak, dayKey } from '../logic/streak';
import { FREE_COLOR_IDS } from '../data/cosmetics';
import { readJson, writeJson } from './storage';

export const PROFILE_KEY = 'profile.v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  totalXp: 0,
  credits: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDay: null,
  unlockedColors: FREE_COLOR_IDS,
  car: { primaryColor: '#E10600', secondaryColor: '#FFFFFF', number: 1 },
};

function isProfile(v: unknown): v is PlayerProfile {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  const car = p.car as Record<string, unknown> | null | undefined;
  return (
    typeof p.totalXp === 'number' &&
    typeof p.credits === 'number' &&
    typeof p.currentStreak === 'number' &&
    typeof p.longestStreak === 'number' &&
    (p.lastSessionDay === null || typeof p.lastSessionDay === 'string') &&
    typeof car === 'object' &&
    car !== null &&
    typeof car.primaryColor === 'string' &&
    typeof car.secondaryColor === 'string' &&
    typeof car.number === 'number'
  );
}

/** Older saved profiles may lack newer fields; fill those from the defaults so progress is never lost. */
export async function getProfile(): Promise<PlayerProfile> {
  const stored = await readJson<PlayerProfile | null>(PROFILE_KEY, null, (v): v is PlayerProfile => isProfile(v));
  if (stored === null) return DEFAULT_PROFILE;
  const unlocked = Array.isArray(stored.unlockedColors) ? stored.unlockedColors.filter((c) => typeof c === 'string') : [];
  return { ...stored, unlockedColors: Array.from(new Set([...FREE_COLOR_IDS, ...unlocked])) };
}

export async function saveProfile(profile: PlayerProfile): Promise<void> {
  await writeJson(PROFILE_KEY, profile);
}

/** Adds a session's rewards to the profile. Sessions that earned no XP do not count toward the streak. */
export async function applySessionToProfile(session: Session): Promise<PlayerProfile> {
  const profile = await getProfile();
  const streak =
    session.xpEarned > 0
      ? applySessionToStreak(profile, dayKey(new Date(session.endedAt)))
      : {
          currentStreak: profile.currentStreak,
          longestStreak: profile.longestStreak,
          lastSessionDay: profile.lastSessionDay,
        };
  const updated: PlayerProfile = {
    ...profile,
    totalXp: profile.totalXp + session.xpEarned,
    credits: profile.credits + session.creditsEarned,
    ...streak,
  };
  await saveProfile(updated);
  return updated;
}
