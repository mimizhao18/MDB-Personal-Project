import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { levelProgress } from '../../logic/rewards';
import { formatDurationWords } from '../../logic/sessionOptions';
import { lifetimeStats } from '../../logic/stats';
import type { LifetimeStats } from '../../logic/stats';
import { dayKey, displayedStreak } from '../../logic/streak';
import type { PlayerProfile, Session } from '../../models/types';
import { DEFAULT_PROFILE, getProfile } from '../../storage/profile';
import { getSessions } from '../../storage/sessions';

const EMPTY_STATS: LifetimeStats = { races: 0, laps: 0, distanceKm: 0, focusedSeconds: 0 };

/** Everything a Home layout shows, so each layout only has to arrange it. */
export interface HomeData {
  profile: PlayerProfile;
  stats: LifetimeStats;
  level: ReturnType<typeof levelProgress>;
  streak: number;
  /** "3 h 18 min focused in total", or an invitation to start. */
  focusLine: string;
  /** Your most recent race, if any. */
  lastRace: Session | null;
}

/** Loads the data for Home, again each time Home comes back into view (for example after a race). */
export function useHomeData(): HomeData {
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [stats, setStats] = useState<LifetimeStats>(EMPTY_STATS);
  const [lastRace, setLastRace] = useState<Session | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([getProfile(), getSessions()]).then(([p, sessions]) => {
        if (cancelled) return;
        setProfile(p);
        setStats(lifetimeStats(sessions));
        setLastRace(sessions[0] ?? null);
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
    focusLine: stats.focusedSeconds > 0 ? `${formatDurationWords(stats.focusedSeconds)} focused in total` : 'No races yet. Start your first one!',
    lastRace,
  };
}
