import { useRef, useState } from 'react';
import { FlatList, Pressable, Text, useWindowDimensions, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { makeStyles, useTheme } from '../design/styles';
import { formatClock } from '../logic/lapProgress';
import type { Track, TrackId } from '../models/types';
import { Flag } from './Flag';
import { TrackView } from './TrackView';
import { BracketFrame } from './ui';

interface Props {
  tracks: readonly Track[];
  selectedId: TrackId;
  onSelect: (id: TrackId) => void;
}

const useStyles = makeStyles((t) => ({
  container: { gap: t.spacing.sm },
  card: { gap: t.spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  headerText: { flex: 1, gap: t.spacing.xxs },
  name: { ...t.typography.title, color: t.colors.text },
  country: { ...t.typography.caption, color: t.colors.textMuted },
  // the four numbers in one row, split by hairlines
  stats: { flexDirection: 'row', borderTopWidth: t.border.hairline, borderTopColor: t.glass.divider, paddingTop: t.spacing.md },
  statBlock: { flex: 1, gap: t.spacing.xxs, paddingHorizontal: t.spacing.sm, borderLeftWidth: t.border.hairline, borderLeftColor: t.glass.divider },
  statBlockFirst: { borderLeftWidth: 0, paddingLeft: 0 },
  statLabel: { ...t.typography.microLabel, color: t.colors.textMuted },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: t.spacing.xxs },
  statValue: { ...t.typography.statSmall, color: t.colors.text },
  statUnit: { ...t.typography.micro, color: t.colors.textMuted },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dots: { flexDirection: 'row', gap: t.spacing.sm, alignItems: 'center' },
  dot: { width: t.spacing.md - 2, height: t.size.progress, backgroundColor: t.colors.border },
  dotActive: { backgroundColor: t.colors.accent, width: t.spacing.lg },
  arrow: { width: t.size.touch, height: t.size.touch, alignItems: 'center', justifyContent: 'center' },
  arrowDisabled: { opacity: t.opacity.disabled },
  arrowText: { ...t.typography.title, color: t.colors.textSecondary },
}));

/** Tracks side by side: swipe sideways (or use the arrows) and the track in view is the selected one. */
export function TrackCarousel({ tracks, selectedId, onSelect }: Props) {
  const styles = useStyles();
  const theme = useTheme();
  const gap = theme.spacing.md;
  const cardPadding = theme.spacing.md;

  // Start from an estimate of the available width (the app is at most 460 wide on web, minus the screen padding),
  // then use the real measured width once the layout reports it.
  const windowWidth = useWindowDimensions().width;
  const [measured, setMeasured] = useState(0);
  const width = measured > 0 ? measured : Math.max(200, Math.min(windowWidth, 460) - theme.spacing.screen * 2);
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

  const previewHeight = Math.round((width - cardPadding * 2) * 0.42);

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
            <BracketFrame style={[styles.card, { width }]}>
              <View style={styles.header}>
                <Flag code={item.countryCode} width={theme.size.flag + theme.spacing.sm} />
                <View style={styles.headerText}>
                  <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                    {item.name}
                  </Text>
                  <Text style={styles.country}>{item.country}</Text>
                </View>
              </View>

              <View style={{ height: previewHeight }}>
                <TrackView track={item} lapFraction={0} showCar={false} fill />
              </View>

              <View style={styles.stats}>
                <StatBlock first label="Length" value={item.lapLengthKm.toFixed(2)} unit="km" />
                <StatBlock label="Laps" value={String(item.raceLaps)} />
                <StatBlock label="Distance" value={item.raceDistanceKm.toFixed(0)} unit="km" />
                <StatBlock label="Lap time" value={formatClock(item.lapTimeSeconds)} />
              </View>
            </BracketFrame>
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

/** A small label over a number (with its unit), one of the four figures in a track card. */
function StatBlock({ label, value, unit, first }: { label: string; value: string; unit?: string; first?: boolean }) {
  const styles = useStyles();
  return (
    <View style={[styles.statBlock, first && styles.statBlockFirst]} accessible accessibilityLabel={`${label}: ${value}${unit ? ` ${unit}` : ''}`}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>
        {unit ? <Text style={styles.statUnit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

function Arrow({ label, disabled, onPress, accessibilityLabel }: { label: string; disabled: boolean; onPress: () => void; accessibilityLabel: string }) {
  const styles = useStyles();
  return (
    <Pressable style={[styles.arrow, disabled && styles.arrowDisabled]} onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      <Text style={styles.arrowText}>{label}</Text>
    </Pressable>
  );
}
