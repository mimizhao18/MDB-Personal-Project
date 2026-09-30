import type { PlayerProfile, Session } from '../models/types';
import { applySessionToStreak, dayKey } from '../logic/streak';
import { readJson, writeJson } from './storage';

const PROFILE_KEY = 'profile.v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  totalXp: 0,
  credits: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDay: null,
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

export function getProfile(): Promise<PlayerProfile> {
  return readJson(PROFILE_KEY, DEFAULT_PROFILE, isProfile);
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
