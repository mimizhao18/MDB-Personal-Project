import type { PlayerProfile, Session } from '../models/types';
import { applySessionToProfile } from './profile';
import { readJson, writeJson } from './storage';

const SESSIONS_KEY = 'sessions.v1';

function isSession(v: unknown): v is Session {
  if (typeof v !== 'object' || v === null) return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.id === 'string' &&
    typeof s.trackId === 'string' &&
    typeof s.plannedLaps === 'number' &&
    typeof s.focusedSeconds === 'number' &&
    typeof s.completedLaps === 'number' &&
    typeof s.finished === 'boolean' &&
    typeof s.startedAt === 'string' &&
    typeof s.endedAt === 'string' &&
    typeof s.distanceKm === 'number' &&
    typeof s.xpEarned === 'number' &&
    typeof s.creditsEarned === 'number'
  );
}

function isSessionList(v: unknown): v is Session[] {
  return Array.isArray(v) && v.every(isSession);
}

/** All saved sessions, newest first. */
export async function getSessions(): Promise<Session[]> {
  const sessions = await readJson<Session[]>(SESSIONS_KEY, [], isSessionList);
  return [...sessions].sort((a, b) => b.endedAt.localeCompare(a.endedAt));
}

/** Saves a finished session and adds its rewards to the profile. Returns the updated profile. */
export async function recordSession(session: Session): Promise<PlayerProfile> {
  const sessions = await getSessions();
  await writeJson(SESSIONS_KEY, [session, ...sessions]);
  return applySessionToProfile(session);
}
