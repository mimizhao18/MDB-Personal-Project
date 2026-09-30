import { PROFILE_KEY } from './profile';
import { SESSIONS_KEY } from './sessions';
import { removeKey } from './storage';

/** Deletes every saved race and resets the profile (XP, credits, streak, car). */
export async function resetAllData(): Promise<void> {
  await Promise.all([removeKey(PROFILE_KEY), removeKey(SESSIONS_KEY)]);
}
