import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { NO_AWAY, RULES, addAway, advanceProgress, classifyAway, pauseSecondsLeft } from '../logic/distraction';
import type { AwayTotals, Distraction } from '../logic/distraction';
import { lapProgress } from '../logic/lapProgress';
import type { LapProgress } from '../logic/lapProgress';
import type { Track } from '../models/types';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished' | 'ended';

/** What happened when you came back to the race after leaving it. */
export interface RaceWarning {
  kind: Exclude<Distraction, 'none'>;
  awaySeconds: number;
}

export interface SessionTimer {
  status: TimerStatus;
  progress: LapProgress;
  startedAt: Date | null;
  endedAt: Date | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  /** Stop before the planned laps are done. Only allowed while paused. */
  end: () => void;
  reset: () => void;
  /** The flag or crash from your last absence, until it is dismissed. */
  warning: RaceWarning | null;
  dismissWarning: () => void;
  /** True while the safety car is out and the car runs at reduced speed. */
  slowed: boolean;
  /** Seconds of the excused break left while paused, otherwise null. */
  pauseSecondsLeft: number | null;
  /** Time spent away from the race so far, and the flags it earned. */
  away: AwayTotals;
  /** True if the race ended because you were away for too long. */
  crashed: boolean;
}

/**
 * Drives a focus session. Elapsed time comes from the clock (not from counting ticks), so it stays correct
 * if the app is throttled. `timeScale` speeds time up for testing, e.g. 30 makes a 90 s lap take 3 s.
 *
 * Time away from the app never counts: leaving freezes the race, and coming back applies the rules in logic/distraction.ts
 * (yellow flag, safety car, crash). Pausing first excuses a break of up to 5 minutes.
 */
export function useSessionTimer(track: Track, plannedLaps: number, timeScale = 1): SessionTimer {
  const plannedSeconds = plannedLaps * track.lapTimeSeconds;
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [endedAt, setEndedAt] = useState<Date | null>(null);
  const [warning, setWarning] = useState<RaceWarning | null>(null);
  const [slowed, setSlowed] = useState(false);
  const [pauseLeft, setPauseLeft] = useState<number | null>(null);
  const [away, setAway] = useState<AwayTotals>(NO_AWAY);
  const [crashed, setCrashed] = useState(false);

  const statusRef = useRef<TimerStatus>('idle'); // the same as `status`, for callbacks that outlive a render
  const bankedMs = useRef(0); // progress from earlier running stretches
  const resumedAtMs = useRef<number | null>(null); // wall-clock start of the current stretch
  const slowRemainingMs = useRef(0); // safety car time left, as of the start of the current stretch
  const pausedAtMs = useRef<number | null>(null);
  const leftAtMs = useRef<number | null>(null); // when you left the app, if you are away

  const changeStatus = useCallback((next: TimerStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const readElapsed = useCallback(() => {
    const live = resumedAtMs.current === null ? 0 : Date.now() - resumedAtMs.current;
    const { gainedMs } = advanceProgress(live, slowRemainingMs.current);
    return Math.min((bankedMs.current + gainedMs * timeScale) / 1000, plannedSeconds);
  }, [plannedSeconds, timeScale]);

  /** Bank the progress made so far and stop the clock. */
  const freeze = useCallback(() => {
    const live = resumedAtMs.current === null ? 0 : Date.now() - resumedAtMs.current;
    const { gainedMs, slowRemainingMs: left } = advanceProgress(live, slowRemainingMs.current);
    const banked = Math.min(bankedMs.current + gainedMs * timeScale, plannedSeconds * 1000);
    bankedMs.current = banked;
    slowRemainingMs.current = left;
    resumedAtMs.current = null;
    setElapsedSeconds(banked / 1000);
    return banked / 1000;
  }, [plannedSeconds, timeScale]);

  const start = useCallback(() => {
    bankedMs.current = 0;
    resumedAtMs.current = Date.now();
    slowRemainingMs.current = 0;
    pausedAtMs.current = null;
    leftAtMs.current = null;
    setElapsedSeconds(0);
    setStartedAt(new Date());
    setEndedAt(null);
    setWarning(null);
    setSlowed(false);
    setPauseLeft(null);
    setAway(NO_AWAY);
    setCrashed(false);
    changeStatus('running');
  }, [changeStatus]);

  const pause = useCallback(() => {
    if (statusRef.current !== 'running') return;
    freeze();
    pausedAtMs.current = Date.now();
    setPauseLeft(RULES.pauseLimitSeconds);
    changeStatus('paused');
  }, [freeze, changeStatus]);

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return;
    resumedAtMs.current = Date.now();
    pausedAtMs.current = null;
    setPauseLeft(null);
    changeStatus('running');
  }, [changeStatus]);

  const end = useCallback(() => {
    if (statusRef.current !== 'paused') return;
    freeze();
    setEndedAt(new Date());
    setPauseLeft(null);
    changeStatus('ended');
  }, [freeze, changeStatus]);

  const reset = useCallback(() => {
    bankedMs.current = 0;
    resumedAtMs.current = null;
    slowRemainingMs.current = 0;
    pausedAtMs.current = null;
    leftAtMs.current = null;
    setElapsedSeconds(0);
    setStartedAt(null);
    setEndedAt(null);
    setWarning(null);
    setSlowed(false);
    setPauseLeft(null);
    setAway(NO_AWAY);
    setCrashed(false);
    changeStatus('idle');
  }, [changeStatus]);

  const dismissWarning = useCallback(() => setWarning(null), []);

  // Leaving the app freezes the race; coming back applies the rules.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (next) => {
      if (next !== 'active') {
        if (statusRef.current === 'running' && leftAtMs.current === null) {
          freeze();
          leftAtMs.current = Date.now();
        }
        return;
      }

      const now = Date.now();
      // An excused break: nothing happens while it lasts. When it has run out, the time since then counts as away.
      if (statusRef.current === 'paused' && pausedAtMs.current !== null) {
        const pausedFor = now - pausedAtMs.current;
        if (pauseSecondsLeft(pausedFor) > 0) return;
        leftAtMs.current = pausedAtMs.current + RULES.pauseLimitSeconds * 1000;
        pausedAtMs.current = null;
        setPauseLeft(null);
        changeStatus('running');
      }
      if (statusRef.current !== 'running' || leftAtMs.current === null) return;

      const leftAt = leftAtMs.current;
      leftAtMs.current = null;
      const awaySeconds = (now - leftAt) / 1000;
      const kind = classifyAway(awaySeconds);
      setAway((totals) => addAway(totals, awaySeconds));

      if (kind === 'crash') {
        // the race ended when the limit was reached, not when you came back
        setEndedAt(new Date(leftAt + RULES.crashAfterSeconds * 1000));
        setCrashed(true);
        setWarning({ kind, awaySeconds });
        changeStatus('ended');
        return;
      }
      if (kind === 'safety-car') {
        slowRemainingMs.current = RULES.safetyCarSeconds * 1000;
        setSlowed(true);
      }
      if (kind !== 'none') setWarning({ kind, awaySeconds });
      resumedAtMs.current = now;
    });
    return () => subscription.remove();
  }, [freeze, changeStatus]);

  // An excused break lasts at most 5 minutes; then the race starts again by itself.
  useEffect(() => {
    if (status !== 'paused') return;
    const timer = setInterval(() => {
      if (pausedAtMs.current === null) return;
      const left = pauseSecondsLeft(Date.now() - pausedAtMs.current);
      setPauseLeft(left);
      if (left <= 0) resume();
    }, 250);
    return () => clearInterval(timer);
  }, [status, resume]);

  useEffect(() => {
    if (status !== 'running') return;
    // One update per screen frame so the car moves smoothly.
    let frame = requestAnimationFrame(function tick() {
      const elapsed = readElapsed();
      setElapsedSeconds(elapsed);
      const live = resumedAtMs.current === null ? 0 : Date.now() - resumedAtMs.current;
      setSlowed(slowRemainingMs.current - live > 0);
      if (elapsed >= plannedSeconds) {
        bankedMs.current = plannedSeconds * 1000;
        resumedAtMs.current = null;
        setEndedAt(new Date());
        changeStatus('finished');
        return;
      }
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [status, readElapsed, plannedSeconds, changeStatus]);

  return {
    status,
    progress: lapProgress(track, plannedLaps, elapsedSeconds),
    startedAt,
    endedAt,
    start,
    pause,
    resume,
    end,
    reset,
    warning,
    dismissWarning,
    slowed,
    pauseSecondsLeft: pauseLeft,
    away,
    crashed,
  };
}
