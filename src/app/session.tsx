import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TrackView } from '../components/TrackView';
import { TRACKS, isTrackId } from '../data/tracks';
import { makeStyles } from '../design/DesignProvider';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { formatClock } from '../logic/lapProgress';
import { buildSession } from '../logic/rewards';
import type { CarSettings, Track } from '../models/types';
import { getProfile } from '../storage/profile';
import { recordSession } from '../storage/sessions';
import { showAlert } from '../ui/alert';
import { Button, ProgressBar } from '../ui/kit';

export default function SessionScreen() {
  const styles = useStyles();
  const params = useLocalSearchParams<{ track?: string; laps?: string; speed?: string }>();
  const track = isTrackId(params.track) ? TRACKS[params.track] : undefined;
  const laps = Number(params.laps);
  // Test speed-up, only honoured in development builds.
  const speed = __DEV__ && Number(params.speed) > 1 ? Number(params.speed) : 1;

  if (!track || !Number.isInteger(laps) || laps < 1) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Missing or invalid race settings.</Text>
        <Button label="Back to setup" onPress={() => router.replace('/create-session')} />
      </View>
    );
  }
  return <Race track={track} laps={laps} speed={speed} />;
}

function Race({ track, laps, speed }: { track: Track; laps: number; speed: number }) {
  const styles = useStyles();
  const timer = useSessionTimer(track, laps, speed);
  const { status, progress: p, startedAt, endedAt, start, pause, resume, end } = timer;
  const saved = useRef(false);
  // On short windows (a laptop browser, a small phone) everything is sized down so the buttons stay on screen.
  const windowHeight = useWindowDimensions().height;
  const compact = windowHeight < 720;
  // The track takes whatever height is left after the text and buttons (never less than 100), so nothing is pushed off screen.
  const trackHeight = Math.max(100, windowHeight - (compact ? 385 : 445));
  const [car, setCar] = useState<CarSettings | undefined>(undefined);

  useEffect(() => {
    getProfile().then((profile) => setCar(profile.car));
  }, []);

  useEffect(() => {
    start();
  }, [start]);

  // No leaving mid-race with the Android back button; pause and end the race instead.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => status === 'running' || status === 'paused');
    return () => sub.remove();
  }, [status]);

  // When the race is over, save it once and go to the summary.
  useEffect(() => {
    if ((status !== 'finished' && status !== 'ended') || saved.current) return;
    saved.current = true;
    const session = buildSession({
      id: String(Date.now()),
      track,
      plannedLaps: laps,
      focusedSeconds: p.elapsedSeconds,
      startedAt: startedAt ?? new Date(),
      endedAt: endedAt ?? new Date(),
    });
    if (session.xpEarned === 0) {
      showAlert('Too short to count', 'A race needs at least 1 minute of focus to earn rewards.');
      router.replace('/');
      return;
    }
    recordSession(session).then(
      () => router.replace({ pathname: '/summary', params: { id: session.id } }),
      () => {
        showAlert('Could not save the race', 'Something went wrong saving your race. Please try again.');
        router.replace('/');
      },
    );
  }, [status, track, laps, p.elapsedSeconds, startedAt, endedAt]);

  const confirmEnd = () => {
    showAlert('End race early?', 'You keep the laps and focus time you have done so far.', [
      { text: 'Keep racing', style: 'cancel' },
      { text: 'End race', style: 'destructive', onPress: end },
    ]);
  };

  if (status === 'finished' || status === 'ended') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>{status === 'finished' ? 'Chequered flag!' : 'Race ended'}</Text>
        <Text style={styles.muted}>Saving your race…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, compact && styles.safeCompact]} edges={['bottom']}>
      <View style={styles.top}>
        <Text style={styles.trackName}>{track.name}</Text>
        <Text style={[styles.lap, compact && styles.lapCompact]}>
          Lap {p.currentLap} / {laps}
        </Text>
      </View>

      <View style={{ height: trackHeight }}>
        <TrackView track={track} lapFraction={p.lapFraction} car={car} fill />
      </View>

      <View style={styles.middle}>
        <View style={styles.progress}>
          <ProgressBar fraction={p.totalFraction} />
        </View>
        <Text style={[styles.clock, compact && styles.clockCompact]}>{formatClock(p.remainingSeconds)}</Text>
        <Text style={styles.muted}>{status === 'paused' ? 'Paused' : 'remaining'}</Text>
      </View>

      <View style={styles.buttons}>
        {status === 'running' && <Button label="Pause" onPress={pause} />}
        {status === 'paused' && <Button label="Resume" onPress={resume} />}
        {status === 'paused' && <Button label="End race" onPress={confirmEnd} variant="secondary" />}
      </View>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((t) => ({
  safe: { flex: 1, padding: t.spacing.md, justifyContent: 'space-between' },
  safeCompact: { paddingVertical: t.spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: t.spacing.md, padding: t.spacing.md },
  top: { alignItems: 'center', gap: t.spacing.xs },
  trackName: { ...t.type.label, color: t.colors.textMuted },
  lap: { fontSize: 34, fontWeight: '800', color: t.colors.text, letterSpacing: -0.5 },
  lapCompact: { fontSize: 26 },
  middle: { alignItems: 'center', gap: t.spacing.xs },
  progress: { width: '100%', marginBottom: t.spacing.sm },
  clock: { fontSize: 64, fontWeight: '800', color: t.colors.text, fontVariant: ['tabular-nums'], letterSpacing: -1 },
  clockCompact: { fontSize: 44 },
  buttons: { gap: t.spacing.sm, minHeight: 112 }, // same height with one button or two, so nothing jumps when pausing
  title: { ...t.type.heading, fontSize: 22, color: t.colors.text, textAlign: 'center' },
  muted: { ...t.type.caption, color: t.colors.textMuted },
}));
