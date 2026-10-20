import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { levelProgress } from '../../logic/rewards';
import { lifetimeStats } from '../../logic/stats';
import type { LifetimeStats } from '../../logic/stats';
import { dayKey, displayedStreak } from '../../logic/streak';
import type { PlayerProfile } from '../../models/types';
import { DEFAULT_PROFILE, getProfile } from '../../storage/profile';
import { getSessions } from '../../storage/sessions';

const EMPTY_STATS: LifetimeStats = { races: 0, laps: 0, distanceKm: 0, focusedSeconds: 0 };

/** Everything the Home screen shows. */
export interface HomeData {
  profile: PlayerProfile;
  stats: LifetimeStats;
  level: ReturnType<typeof levelProgress>;
  streak: number;
}

/** Loads the data for Home, again each time Home comes back into view (for example after a race). */
export function useHomeData(): HomeData {
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [stats, setStats] = useState<LifetimeStats>(EMPTY_STATS);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([getProfile(), getSessions()]).then(([p, sessions]) => {
        if (cancelled) return;
        setProfile(p);
        setStats(lifetimeStats(sessions));
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  return {
    profile,
    stats,
    level: levelProgress(profile.totalXp),
    streak: displayedStreak(profile, dayKey(new Date())),
  };
}
