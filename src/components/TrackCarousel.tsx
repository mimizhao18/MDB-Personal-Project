import { useRef, useState } from 'react';
import { FlatList, Pressable, Text, useWindowDimensions, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { makeStyles, useTheme } from '../design/styles';
import type { Track, TrackId } from '../models/types';
import { Card } from '../ui/kit';
import { TrackView } from './TrackView';

interface Props {
  tracks: readonly Track[];
  selectedId: TrackId;
  onSelect: (id: TrackId) => void;
}

const useStyles = makeStyles((t) => ({
  container: { gap: t.spacing.sm },
  card: { gap: t.spacing.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  name: { ...t.type.heading, color: t.colors.text },
  muted: { ...t.type.caption, color: t.colors.textMuted },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dots: { flexDirection: 'row', gap: t.spacing.sm, alignItems: 'center' },
  dot: { width: 14, height: 3, borderRadius: t.radius.sm, backgroundColor: t.colors.border },
  dotActive: { backgroundColor: t.colors.accent, width: 28 },
  arrow: {
    width: 44,
    height: 34,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.surface,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowDisabled: { opacity: 0.3 },
  arrowText: { color: t.colors.text, fontSize: 22, fontWeight: '700', lineHeight: 26 },
}));

/** Tracks side by side: swipe sideways (or use the arrows) and the track in view is the selected one. */
export function TrackCarousel({ tracks, selectedId, onSelect }: Props) {
  const styles = useStyles();
  const theme = useTheme();
  const gap = theme.spacing.sm + 4;
  const cardPadding = theme.spacing.md;

  // Start from an estimate of the available width (the app is at most 460 wide on web, minus the screen padding),
  // then use the real measured width once the layout reports it.
  const windowWidth = useWindowDimensions().width;
  const [measured, setMeasured] = useState(0);
  const width = measured > 0 ? measured : Math.max(200, Math.min(windowWidth, 460) - theme.spacing.md * 2);
  const listRef = useRef<FlatList<Track>>(null);

  const interval = width + gap;
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

  const previewHeight = Math.round((width - cardPadding * 2) * 0.58);

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
          ItemSeparatorComponent={() => <View style={{ width: gap }} />}
          renderItem={({ item }) => (
            <Card style={[styles.card, { width }]}>
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
            </Card>
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
  const styles = useStyles();
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
