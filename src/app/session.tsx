import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { glowHexFor } from '../components/car3d/glow';
import { TrackView } from '../components/TrackView';
import { Flag } from '../components/Flag';
import { AmbientGlow, Button, SegmentedProgress } from '../components/ui';
import { getLivery } from '../data/liveries';
import { TRACKS, isTrackId } from '../data/tracks';
import { makeStyles, useTheme } from '../design/styles';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { formatClock } from '../logic/lapProgress';
import { buildSession } from '../logic/rewards';
import type { CarSettings, Track } from '../models/types';
import { getProfile } from '../storage/profile';
import { recordSession } from '../storage/sessions';
import { showAlert } from '../ui/alert';

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
  const t = useTheme();
  const timer = useSessionTimer(track, laps, speed);
  const { status, progress: p, startedAt, endedAt, start, pause, resume, end } = timer;
  const saved = useRef(false);
  // On short windows (a laptop browser, a small phone) everything is sized down so the buttons stay on screen.
  const windowHeight = useWindowDimensions().height;
  const compact = windowHeight < 720;
  // The track takes whatever height is left after the text and buttons (never less than 100), so nothing is pushed off screen.
  const trackHeight = Math.max(100, windowHeight - (compact ? t.size.raceReservedCompact : t.size.raceReserved));
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
        <Text style={styles.title}>{status === 'finished' ? 'Chequered flag' : 'Race ended'}</Text>
        <Text style={styles.muted}>Saving your race…</Text>
      </View>
    );
  }

  const livery = car ? getLivery(car.liveryId) : undefined;
  const paused = status === 'paused';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {livery && <AmbientGlow color={glowHexFor(livery.primary, livery.secondary)} focus={0.3} />}
      <View style={[styles.content, compact && styles.contentCompact]}>
        <View style={styles.top}>
          <View style={styles.place} accessible accessibilityLabel={`${track.name}, ${track.country}`}>
            <Flag code={track.countryCode} width={t.size.flag} />
            <Text style={styles.trackName}>{track.name}</Text>
          </View>
          <View style={styles.lap} accessible accessibilityLabel={`Lap ${p.currentLap} of ${laps}`}>
            <Text style={styles.trackName}>Lap </Text>
            <Text style={styles.lapNumber}>{p.currentLap}</Text>
            <Text style={styles.trackName}> / {laps}</Text>
          </View>
        </View>

        <View style={{ height: trackHeight }}>
          <TrackView track={track} lapFraction={p.lapFraction} car={car} fill />
        </View>

        <View style={styles.middle}>
          <Text style={compact ? styles.clockCompact : styles.clock} numberOfLines={1} adjustsFontSizeToFit accessibilityLabel={`${formatClock(p.remainingSeconds)} remaining`}>
            {formatClock(p.remainingSeconds)}
          </Text>
          <Text style={[styles.status, paused && styles.statusPaused]}>{paused ? 'Paused' : 'Remaining'}</Text>
          <View style={styles.progress}>
            <SegmentedProgress fraction={p.totalFraction} accessibilityLabel="Race progress" />
          </View>
        </View>

        <View style={styles.buttons}>
          {status === 'running' && <Button label="Pause" variant="secondary" onPress={pause} />}
          {paused && <Button label="Resume" variant="soft" onPress={resume} />}
          {paused && <Button label="End race" variant="ghost" onPress={confirmEnd} />}
        </View>
      </View>
    </SafeAreaView>
  );
}

const useStyles = makeStyles((t) => ({
  safe: { flex: 1 },
  content: { flex: 1, padding: t.spacing.screen, justifyContent: 'space-between' },
  contentCompact: { paddingVertical: t.spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: t.spacing.md, padding: t.spacing.screen },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  place: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
  trackName: { ...t.typography.metaLabel, color: t.colors.textMuted },
  lap: { flexDirection: 'row', alignItems: 'baseline' },
  lapNumber: { ...t.typography.metaValue, color: t.colors.text },
  middle: { alignItems: 'center', gap: t.spacing.xs },
  clock: { ...t.typography.timer, color: t.colors.text, alignSelf: 'stretch', textAlign: 'center' },
  clockCompact: { ...t.typography.display, color: t.colors.text, alignSelf: 'stretch', textAlign: 'center' },
  status: { ...t.typography.metaLabel, color: t.colors.textMuted },
  statusPaused: { color: t.colors.accentOnDark },
  progress: { alignSelf: 'stretch', marginTop: t.spacing.sm },
  // room for two buttons, so nothing jumps when pausing
  buttons: { gap: t.spacing.sm, marginTop: t.spacing.lg, minHeight: t.size.control * 2 + t.spacing.sm },
  title: { ...t.typography.title, color: t.colors.text, textAlign: 'center' },
  muted: { ...t.typography.caption, color: t.colors.textMuted },
}));
