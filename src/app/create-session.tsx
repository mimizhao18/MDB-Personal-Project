import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Slider } from '../components/Slider';
import { TrackView } from '../components/TrackView';
import { TRACK_LIST } from '../data/tracks';
import { clampLaps, lapsFromMinutes, maxMinutes, minutesForLaps } from '../logic/raceLength';
import { distanceKm, lapsToSeconds } from '../logic/rewards';
import { DEFAULT_LAPS, formatDurationWords } from '../logic/sessionOptions';
import type { TrackId } from '../models/types';
import { colors, spacing } from '../theme';

type Mode = 'laps' | 'minutes';

export default function CreateSessionScreen() {
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
        <Text style={styles.heading}>Track</Text>
        <View style={styles.chips}>
          {TRACK_LIST.map((t) => (
            <Pressable key={t.id} style={[styles.chip, t.id === trackId && styles.selected]} onPress={() => setTrackId(t.id)}>
              <Text style={styles.chipText}>{t.name}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.trackCard}>
          <View style={styles.trackHeader}>
            <Text style={styles.trackName}>{track.name}</Text>
            <Text style={styles.muted}>{track.country}</Text>
          </View>
          <TrackView track={track} lapFraction={0} showCar={false} />
          <Text style={styles.muted}>
            {track.lapLengthKm} km per lap · {track.lapTimeSeconds} s per lap · {track.raceLaps} lap race
          </Text>
        </View>

        <Text style={styles.heading}>Race length</Text>
        <View style={styles.modeToggle}>
          {(['laps', 'minutes'] as const).map((m) => (
            <Pressable key={m} style={[styles.modeButton, mode === m && styles.modeButtonActive]} onPress={() => setMode(m)}>
              <Text style={[styles.modeText, mode === m && styles.modeTextActive]}>{m === 'laps' ? 'Laps' : 'Minutes'}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.valueBlock}>
          <Text style={styles.bigValue}>{bigValue}</Text>
          <Text style={styles.muted}>{subValue}</Text>
          {isFullRace && <Text style={styles.fullRace}>Full race distance</Text>}
        </View>

        {mode === 'laps' ? (
          <Slider
            value={laps}
            min={1}
            max={track.raceLaps}
            onChange={setRequestedLaps}
            accessibilityLabel="Race length in laps"
          />
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
          <Text style={styles.muted}>
            {mode === 'laps' ? `${track.raceLaps} laps` : `${maxMinutes(track)} min`}
          </Text>
        </View>
        {mode === 'minutes' && <Text style={styles.muted}>Races are whole laps, so the time snaps to the nearest lap.</Text>}

        {__DEV__ && (
          <>
            <Text style={styles.heading}>Test speed (development only)</Text>
            <View style={styles.chips}>
              {[1, 10, 30, 60].map((x) => (
                <Pressable key={x} style={[styles.chip, x === speed && styles.selected]} onPress={() => setSpeed(x)}>
                  <Text style={styles.chipText}>{x}x</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.summary}>
          {track.name} · {laps} {laps === 1 ? 'lap' : 'laps'} · {formatDurationWords(seconds)}
        </Text>
        <Pressable style={styles.startButton} onPress={start}>
          <Text style={styles.startText}>Start Race</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.md, gap: spacing.md },
  heading: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: spacing.sm },
  muted: { color: colors.textMuted, fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.surfaceBorder,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  chipText: { color: colors.text, fontSize: 15, fontWeight: '700' },
  selected: { borderColor: colors.accent },
  trackCard: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, gap: spacing.sm },
  trackHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  trackName: { color: colors.text, fontSize: 18, fontWeight: '700' },
  modeToggle: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 10, padding: 4 },
  modeButton: { flex: 1, paddingVertical: spacing.sm, borderRadius: 8, alignItems: 'center' },
  modeButtonActive: { backgroundColor: colors.accent },
  modeText: { color: colors.textMuted, fontSize: 16, fontWeight: '700' },
  modeTextActive: { color: colors.accentText },
  valueBlock: { alignItems: 'center', gap: spacing.xs },
  bigValue: { color: colors.text, fontSize: 40, fontWeight: '800' },
  fullRace: { color: colors.accent, fontSize: 14, fontWeight: '700' },
  rangeLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  footer: {
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    backgroundColor: colors.background,
  },
  summary: { color: colors.text, fontSize: 16, textAlign: 'center' },
  startButton: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: spacing.md, alignItems: 'center' },
  startText: { color: colors.accentText, fontSize: 18, fontWeight: '700' },
});
