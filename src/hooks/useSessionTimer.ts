import { useCallback, useEffect, useRef, useState } from 'react';

import { lapProgress } from '../logic/lapProgress';
import type { LapProgress } from '../logic/lapProgress';
import type { Track } from '../models/types';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished' | 'ended';

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
}

/**
 * Drives a focus session. Elapsed time comes from the clock (not from counting ticks), so it stays correct
 * if the app is throttled or backgrounded. `timeScale` speeds time up for testing, e.g. 30 makes a 90 s lap take 3 s.
 */
export function useSessionTimer(track: Track, plannedLaps: number, timeScale = 1): SessionTimer {
  const plannedSeconds = plannedLaps * track.lapTimeSeconds;
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [endedAt, setEndedAt] = useState<Date | null>(null);

  const bankedMs = useRef(0); // time from earlier running stretches
  const resumedAtMs = useRef<number | null>(null); // wall-clock start of the current stretch

  const readElapsed = useCallback(() => {
    const live = resumedAtMs.current === null ? 0 : (Date.now() - resumedAtMs.current) * timeScale;
    return Math.min((bankedMs.current + live) / 1000, plannedSeconds);
  }, [plannedSeconds, timeScale]);

  const freeze = useCallback(() => {
    const elapsed = readElapsed();
    bankedMs.current = elapsed * 1000;
    resumedAtMs.current = null;
    setElapsedSeconds(elapsed);
    return elapsed;
  }, [readElapsed]);

  const start = useCallback(() => {
    bankedMs.current = 0;
    resumedAtMs.current = Date.now();
    setElapsedSeconds(0);
    setStartedAt(new Date());
    setEndedAt(null);
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    freeze();
    setStatus('paused');
  }, [status, freeze]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    resumedAtMs.current = Date.now();
    setStatus('running');
  }, [status]);

  const end = useCallback(() => {
    if (status !== 'paused') return;
    freeze();
    setEndedAt(new Date());
    setStatus('ended');
  }, [status, freeze]);

  const reset = useCallback(() => {
    bankedMs.current = 0;
    resumedAtMs.current = null;
    setElapsedSeconds(0);
    setStartedAt(null);
    setEndedAt(null);
    setStatus('idle');
  }, []);

  useEffect(() => {
    if (status !== 'running') return;
    // One update per screen frame so the car moves smoothly.
    let frame = requestAnimationFrame(function tick() {
      const elapsed = readElapsed();
      setElapsedSeconds(elapsed);
      if (elapsed >= plannedSeconds) {
        bankedMs.current = plannedSeconds * 1000;
        resumedAtMs.current = null;
        setEndedAt(new Date());
        setStatus('finished');
        return;
      }
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [status, readElapsed, plannedSeconds]);

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
  };
}
