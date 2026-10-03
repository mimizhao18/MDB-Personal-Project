import type { Livery } from '../data/liveries';
import type { PlayerProfile } from '../models/types';

export type GarageResult =
  | { ok: true; profile: PlayerProfile }
  | { ok: false; reason: 'not-enough-credits' | 'already-owned' | 'not-owned' | 'invalid-number' };

export function ownsLivery(profile: PlayerProfile, livery: Livery): boolean {
  return livery.price === 0 || profile.unlockedLiveries.includes(livery.id);
}

/** Spends credits to unlock a livery. */
export function buyLivery(profile: PlayerProfile, livery: Livery): GarageResult {
  if (ownsLivery(profile, livery)) return { ok: false, reason: 'already-owned' };
  if (profile.credits < livery.price) return { ok: false, reason: 'not-enough-credits' };
  return {
    ok: true,
    profile: {
      ...profile,
      credits: profile.credits - livery.price,
      unlockedLiveries: [...profile.unlockedLiveries, livery.id],
    },
  };
}

/** Puts an owned livery on the car. */
export function equipLivery(profile: PlayerProfile, livery: Livery): GarageResult {
  if (!ownsLivery(profile, livery)) return { ok: false, reason: 'not-owned' };
  return { ok: true, profile: { ...profile, car: { ...profile.car, liveryId: livery.id } } };
}

export function setCarNumber(profile: PlayerProfile, number: number, min: number, max: number): GarageResult {
  if (!Number.isInteger(number) || number < min || number > max) return { ok: false, reason: 'invalid-number' };
  return { ok: true, profile: { ...profile, car: { ...profile.car, number } } };
}
