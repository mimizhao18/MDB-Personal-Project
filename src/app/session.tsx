import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TrackView } from '../components/TrackView';
import { TRACKS } from '../data/tracks';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { formatClock } from '../logic/lapProgress';
import { buildSession } from '../logic/rewards';
import type { Track } from '../models/types';
import { recordSession } from '../storage/sessions';
import { colors, spacing } from '../theme';

export default function SessionScreen() {
  const params = useLocalSearchParams<{ track?: string; laps?: string; speed?: string }>();
  const track = params.track === 'silverstone' ? TRACKS.silverstone : undefined;
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
  const timer = useSessionTimer(track, laps, speed);
  const { status, progress: p, startedAt, endedAt, start, pause, resume, end } = timer;
  const saved = useRef(false);

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
      Alert.alert('Too short to count', 'A race needs at least 1 minute of focus to earn rewards.');
      router.replace('/');
      return;
    }
    recordSession(session).then(
      () => router.replace({ pathname: '/summary', params: { id: session.id } }),
      () => {
        Alert.alert('Could not save the race', 'Something went wrong saving your race. Please try again.');
        router.replace('/');
      },
    );
  }, [status, track, laps, p.elapsedSeconds, startedAt, endedAt]);

  const confirmEnd = () => {
    Alert.alert('End race early?', 'You keep the laps and focus time you have done so far.', [
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
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.top}>
        <Text style={styles.trackName}>{track.name}</Text>
        <Text style={styles.lap}>
          Lap {p.currentLap} / {laps}
        </Text>
      </View>

      <TrackView track={track} lapFraction={p.lapFraction} />

      <View style={styles.middle}>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${p.totalFraction * 100}%` }]} />
        </View>
        <Text style={styles.clock}>{formatClock(p.remainingSeconds)}</Text>
        <Text style={styles.muted}>{status === 'paused' ? 'Paused' : 'remaining'}</Text>
      </View>

      <View style={styles.buttons}>
        {status === 'running' && <Button label="Pause" onPress={pause} />}
        {status === 'paused' && <Button label="Resume" onPress={resume} />}
        {status === 'paused' && <Button label="End race" onPress={confirmEnd} secondary />}
      </View>
    </SafeAreaView>
  );
}

function Button({ label, onPress, secondary }: { label: string; onPress: () => void; secondary?: boolean }) {
  return (
    <Pressable style={[styles.button, secondary && styles.buttonSecondary]} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: spacing.md, justifyContent: 'space-between' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md },
  top: { alignItems: 'center', gap: spacing.xs },
  trackName: { color: colors.textMuted, fontSize: 16 },
  lap: { color: colors.text, fontSize: 36, fontWeight: '800' },
  middle: { alignItems: 'center', gap: spacing.xs },
  barTrack: { width: '100%', height: 8, borderRadius: 4, backgroundColor: colors.surface, overflow: 'hidden', marginBottom: spacing.md },
  barFill: { height: '100%', backgroundColor: colors.accent },
  clock: { color: colors.text, fontSize: 64, fontWeight: '800', fontVariant: ['tabular-nums'] },
  buttons: { gap: spacing.sm, minHeight: 112 },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: spacing.sm, textAlign: 'center' },
  detail: { color: colors.text, fontSize: 18 },
  muted: { color: colors.textMuted, fontSize: 14 },
  button: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, alignItems: 'center' },
  buttonSecondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.surfaceBorder },
  buttonText: { color: colors.accentText, fontSize: 18, fontWeight: '700' },
});
