import type { PaintColor } from '../data/cosmetics';
import type { PlayerProfile } from '../models/types';

export type GarageResult =
  | { ok: true; profile: PlayerProfile }
  | { ok: false; reason: 'not-enough-credits' | 'already-owned' | 'not-owned' | 'invalid-number' };

export function ownsColor(profile: PlayerProfile, color: PaintColor): boolean {
  return color.price === 0 || profile.unlockedColors.includes(color.id);
}

/** Spends credits to unlock a color. */
export function buyColor(profile: PlayerProfile, color: PaintColor): GarageResult {
  if (ownsColor(profile, color)) return { ok: false, reason: 'already-owned' };
  if (profile.credits < color.price) return { ok: false, reason: 'not-enough-credits' };
  return {
    ok: true,
    profile: {
      ...profile,
      credits: profile.credits - color.price,
      unlockedColors: [...profile.unlockedColors, color.id],
    },
  };
}

/** Puts an owned color on the car body or accent. */
export function equipColor(profile: PlayerProfile, color: PaintColor, part: 'primary' | 'secondary'): GarageResult {
  if (!ownsColor(profile, color)) return { ok: false, reason: 'not-owned' };
  const car = part === 'primary' ? { ...profile.car, primaryColor: color.hex } : { ...profile.car, secondaryColor: color.hex };
  return { ok: true, profile: { ...profile, car } };
}

export function setCarNumber(profile: PlayerProfile, number: number, min: number, max: number): GarageResult {
  if (!Number.isInteger(number) || number < min || number > max) return { ok: false, reason: 'invalid-number' };
  return { ok: true, profile: { ...profile, car: { ...profile.car, number } } };
}
