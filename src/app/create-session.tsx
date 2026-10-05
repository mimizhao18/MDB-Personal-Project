import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Slider } from '../components/Slider';
import { TrackCarousel } from '../components/TrackCarousel';
import { TRACK_LIST } from '../data/tracks';
import { makeStyles } from '../design/styles';
import { clampLaps, lapsFromMinutes, maxMinutes, minutesForLaps } from '../logic/raceLength';
import { distanceKm, lapsToSeconds } from '../logic/rewards';
import { DEFAULT_LAPS, formatDurationWords } from '../logic/sessionOptions';
import type { TrackId } from '../models/types';
import { Button, SectionLabel, Segmented } from '../ui/kit';

type Mode = 'laps' | 'minutes';
const MODES: readonly Mode[] = ['laps', 'minutes'];
const SPEEDS = ['1', '10', '30', '60'] as const;

const useStyles = makeStyles((t) => ({
  safe: { flex: 1 },
  content: { padding: t.spacing.md, gap: t.spacing.md },
  muted: { ...t.type.caption, color: t.colors.textMuted },
  valueBlock: { alignItems: 'center', gap: t.spacing.xs },
  bigValue: { fontSize: 40, fontWeight: '800', color: t.colors.text, letterSpacing: -0.5 },
  fullRace: { ...t.type.label, color: t.colors.accent },
  rangeLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  footer: {
    padding: t.spacing.md,
    gap: t.spacing.sm,
    borderTopWidth: t.border.hairline,
    borderTopColor: t.colors.border,
    backgroundColor: t.colors.background,
  },
  summary: { ...t.type.body, color: t.colors.textMuted, textAlign: 'center' },
}));

export default function CreateSessionScreen() {
  const styles = useStyles();
  const [trackId, setTrackId] = useState<TrackId>(TRACK_LIST[0].id);
  const [mode, setMode] = useState<Mode>('laps');
  const [requestedLaps, setRequestedLaps] = useState<number>(DEFAULT_LAPS);
  const [speed, setSpeed] = useState(1); // development only: speeds the race up for testing

  const track = TRACK_LIST.find((t) => t.id === trackId) ?? TRACK_LIST[0];
  // Laps are always whole, and never more than a full race at this track (matters after switching tracks).
  const laps = clampLaps(track, requestedLaps);
  const seconds = lapsToSeconds(track, laps);
  const km = distanceKm(track, laps);
  const isFullRace = laps === track.raceLaps;

  const start = () => {
    router.push({
      pathname: '/session',
      params: { track: track.id, laps: String(laps), ...(__DEV__ && speed > 1 ? { speed: String(speed) } : {}) },
    });
  };

  const bigValue = mode === 'laps' ? `${laps} ${laps === 1 ? 'lap' : 'laps'}` : formatDurationWords(seconds);
  const subValue =
    mode === 'laps'
      ? `${formatDurationWords(seconds)} · ${km.toFixed(1)} km`
      : `${laps} ${laps === 1 ? 'lap' : 'laps'} · ${km.toFixed(1)} km`;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionLabel>Track</SectionLabel>
        <TrackCarousel tracks={TRACK_LIST} selectedId={trackId} onSelect={setTrackId} />

        <SectionLabel>Race length</SectionLabel>
        <Segmented options={MODES} value={mode} onChange={setMode} labelFor={(m) => (m === 'laps' ? 'Laps' : 'Minutes')} />

        <View style={styles.valueBlock}>
          <Text style={styles.bigValue}>{bigValue}</Text>
          <Text style={styles.muted}>{subValue}</Text>
          {isFullRace && <Text style={styles.fullRace}>Full race distance</Text>}
        </View>

        {mode === 'laps' ? (
          <Slider value={laps} min={1} max={track.raceLaps} onChange={setRequestedLaps} accessibilityLabel="Race length in laps" />
        ) : (
          <Slider
            value={minutesForLaps(track, laps)}
            min={1}
            max={maxMinutes(track)}
            onChange={(minutes) => setRequestedLaps(lapsFromMinutes(track, minutes))}
            accessibilityLabel="Race length in minutes"
          />
        )}
        <View style={styles.rangeLabels}>
          <Text style={styles.muted}>{mode === 'laps' ? '1 lap' : '1 min'}</Text>
          <Text style={styles.muted}>{mode === 'laps' ? `${track.raceLaps} laps` : `${maxMinutes(track)} min`}</Text>
        </View>
        {mode === 'minutes' && <Text style={styles.muted}>Races are whole laps, so the time snaps to the nearest lap.</Text>}

        {__DEV__ && (
          <>
            <SectionLabel>Test speed (development only)</SectionLabel>
            <Segmented options={SPEEDS} value={String(speed) as (typeof SPEEDS)[number]} onChange={(x) => setSpeed(Number(x))} labelFor={(x) => `${x}x`} />
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.summary}>
          {track.name} · {laps} {laps === 1 ? 'lap' : 'laps'} · {formatDurationWords(seconds)}
        </Text>
        <Button label="Start Race" onPress={start} />
      </View>
    </SafeAreaView>
  );
}
