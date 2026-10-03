import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import type { Track, TrackId } from '../models/types';
import { colors, spacing } from '../theme';
import { TrackView } from './TrackView';

interface Props {
  tracks: readonly Track[];
  selectedId: TrackId;
  onSelect: (id: TrackId) => void;
}

const GAP = spacing.sm + 4;
const CARD_PADDING = spacing.md;

/** Tracks side by side: swipe sideways (or use the arrows) and the track in view is the selected one. */
export function TrackCarousel({ tracks, selectedId, onSelect }: Props) {
  // Start from an estimate of the available width (the app is at most 460 wide on web, minus the screen padding),
  // then use the real measured width once the layout reports it.
  const windowWidth = useWindowDimensions().width;
  const [measured, setMeasured] = useState(0);
  const width = measured > 0 ? measured : Math.max(200, Math.min(windowWidth, 460) - spacing.md * 2);
  const listRef = useRef<FlatList<Track>>(null);

  const interval = width + GAP;
  const selectedIndex = Math.max(0, tracks.findIndex((t) => t.id === selectedId));
  const clampIndex = (i: number) => Math.max(0, Math.min(tracks.length - 1, i));

  const goTo = (i: number) => {
    const target = clampIndex(i);
    onSelect(tracks[target].id);
    listRef.current?.scrollToOffset({ offset: target * interval, animated: true });
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (interval <= 0) return;
    const track = tracks[clampIndex(Math.round(e.nativeEvent.contentOffset.x / interval))];
    if (track.id !== selectedId) onSelect(track.id);
  };

  const previewHeight = Math.round((width - CARD_PADDING * 2) * 0.58);

  return (
    <View style={styles.container}>
      <View onLayout={(e) => setMeasured(Math.round(e.nativeEvent.layout.width))}>
        <FlatList
          ref={listRef}
          data={tracks}
          keyExtractor={(t) => t.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={interval}
          snapToAlignment="start"
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
          renderItem={({ item }) => (
            <View style={[styles.card, { width }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.muted}>{item.country}</Text>
              </View>
              <View style={{ height: previewHeight }}>
                <TrackView track={item} lapFraction={0} showCar={false} fill />
              </View>
              <Text style={styles.muted}>
                {item.lapLengthKm} km per lap · {item.lapTimeSeconds} s per lap · {item.raceLaps} lap race
              </Text>
            </View>
          )}
        />
      </View>

      <View style={styles.controls}>
        <Arrow label="‹" disabled={selectedIndex === 0} onPress={() => goTo(selectedIndex - 1)} accessibilityLabel="Previous track" />
        <View style={styles.dots}>
          {tracks.map((t, i) => (
            <Pressable key={t.id} onPress={() => goTo(i)} hitSlop={8} accessibilityLabel={`Choose ${t.name}`}>
              <View style={[styles.dot, i === selectedIndex && styles.dotActive]} />
            </Pressable>
          ))}
        </View>
        <Arrow label="›" disabled={selectedIndex === tracks.length - 1} onPress={() => goTo(selectedIndex + 1)} accessibilityLabel="Next track" />
      </View>
    </View>
  );
}

function Arrow({ label, disabled, onPress, accessibilityLabel }: { label: string; disabled: boolean; onPress: () => void; accessibilityLabel: string }) {
  return (
    <Pressable
      style={[styles.arrow, disabled && styles.arrowDisabled]}
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.arrowText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.accent,
    padding: CARD_PADDING,
    gap: spacing.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  name: { color: colors.text, fontSize: 18, fontWeight: '700' },
  muted: { color: colors.textMuted, fontSize: 14 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dots: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.surfaceBorder },
  dotActive: { backgroundColor: colors.accent, width: 20 },
  arrow: { width: 44, height: 36, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  arrowDisabled: { opacity: 0.3 },
  arrowText: { color: colors.text, fontSize: 24, fontWeight: '700', lineHeight: 28 },
});
