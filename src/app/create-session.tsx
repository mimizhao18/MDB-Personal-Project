import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TrackView } from '../components/TrackView';
import { TRACK_LIST } from '../data/tracks';
import { distanceKm, lapsToSeconds } from '../logic/rewards';
import { DEFAULT_LAPS, LAP_OPTIONS, formatDurationWords } from '../logic/sessionOptions';
import type { TrackId } from '../models/types';
import { colors, spacing } from '../theme';

export default function CreateSessionScreen() {
  const [trackId, setTrackId] = useState<TrackId>(TRACK_LIST[0].id);
  const [laps, setLaps] = useState<number>(DEFAULT_LAPS);
  const [speed, setSpeed] = useState(1); // development only: speeds the race up for testing

  const track = TRACK_LIST.find((t) => t.id === trackId) ?? TRACK_LIST[0];
  const seconds = lapsToSeconds(track, laps);

  const start = () => {
    router.push({
      pathname: '/session',
      params: { track: track.id, laps: String(laps), ...(__DEV__ && speed > 1 ? { speed: String(speed) } : {}) },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Track</Text>
        {TRACK_LIST.map((t) => {
          const selected = t.id === trackId;
          return (
            <Pressable
              key={t.id}
              style={[styles.trackCard, selected && styles.selected]}
              onPress={() => setTrackId(t.id)}
            >
              <View style={styles.trackHeader}>
                <Text style={styles.trackName}>{t.name}</Text>
                <Text style={styles.muted}>{t.country}</Text>
              </View>
              <TrackView track={t} lapFraction={0} />
              <Text style={styles.muted}>
                {t.lapLengthKm} km per lap · {t.raceLaps} lap race
              </Text>
            </Pressable>
          );
        })}
        <Text style={styles.muted}>More tracks coming soon.</Text>

        <Text style={styles.heading}>Race length</Text>
        <View style={styles.chips}>
          {LAP_OPTIONS.map((n) => {
            const selected = n === laps;
            return (
              <Pressable key={n} style={[styles.chip, selected && styles.selected]} onPress={() => setLaps(n)}>
                <Text style={styles.chipLaps}>{n} laps</Text>
                <Text style={styles.muted}>{n === track.raceLaps ? 'Full race' : formatDurationWords(lapsToSeconds(track, n))}</Text>
              </Pressable>
            );
          })}
        </View>

        {__DEV__ && (
          <>
            <Text style={styles.heading}>Test speed (development only)</Text>
            <View style={styles.chips}>
              {[1, 10, 30, 60].map((x) => (
                <Pressable key={x} style={[styles.chip, x === speed && styles.selected]} onPress={() => setSpeed(x)}>
                  <Text style={styles.chipLaps}>{x}x</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.summary}>
          {laps} laps · {formatDurationWords(seconds)} · {distanceKm(track, laps).toFixed(1)} km
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
  trackCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.surfaceBorder,
    padding: spacing.md,
    gap: spacing.sm,
  },
  selected: { borderColor: colors.accent },
  trackHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  trackName: { color: colors.text, fontSize: 18, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    width: '31%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.surfaceBorder,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  chipLaps: { color: colors.text, fontSize: 16, fontWeight: '700' },
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
