import { TRACKS } from '../data/tracks';
import { buildDemoData } from '../logic/demo';
import { PROFILE_KEY } from './profile';
import { SESSIONS_KEY } from './sessions';
import { writeJson } from './storage';

/** Replaces all saved data with example races and a profile, for demonstrating the app. */
export async function loadDemoData(): Promise<void> {
  const { sessions, profile } = buildDemoData(new Date(), TRACKS);
  // Newest first, the same order the app keeps them in.
  const newestFirst = [...sessions].sort((a, b) => b.endedAt.localeCompare(a.endedAt));
  await Promise.all([writeJson(SESSIONS_KEY, newestFirst), writeJson(PROFILE_KEY, profile)]);
}
