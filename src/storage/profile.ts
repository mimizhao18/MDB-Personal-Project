import { DEFAULT_LIVERY_ID, FREE_LIVERY_IDS, LIVERIES, MAX_CAR_NUMBER, MIN_CAR_NUMBER } from '../data/liveries';
import { normalizeProfile } from '../logic/profileMigration';
import { applySessionToStreak, dayKey } from '../logic/streak';
import type { PlayerProfile, Session } from '../models/types';
import { readJson, writeJson } from './storage';

export const PROFILE_KEY = 'profile.v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  totalXp: 0,
  credits: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDay: null,
  unlockedLiveries: FREE_LIVERY_IDS,
  car: { liveryId: DEFAULT_LIVERY_ID, number: MIN_CAR_NUMBER },
};

const CATALOG = { knownIds: LIVERIES.map((l) => l.id), freeIds: FREE_LIVERY_IDS, defaultId: DEFAULT_LIVERY_ID };

/** Reads the saved profile. Older saves are upgraded on the way in, so XP, credits and streak are never lost. */
export async function getProfile(): Promise<PlayerProfile> {
  const raw = await readJson<unknown>(PROFILE_KEY, null, (v): v is unknown => true);
  return normalizeProfile(raw, CATALOG, MIN_CAR_NUMBER, MAX_CAR_NUMBER) ?? DEFAULT_PROFILE;
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
