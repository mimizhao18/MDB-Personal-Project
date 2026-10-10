import { useRef, useState } from 'react';
import { FlatList, Pressable, Text, useWindowDimensions, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { makeStyles, useTheme } from '../design/styles';
import { formatClock } from '../logic/lapProgress';
import type { Track, TrackId } from '../models/types';
import { Card } from '../ui/kit';
import { Flag } from './Flag';
import { TrackView } from './TrackView';

interface Props {
  tracks: readonly Track[];
  selectedId: TrackId;
  onSelect: (id: TrackId) => void;
}

const FLAG_WIDTH = 46;

const useStyles = makeStyles((t) => ({
  container: { gap: t.spacing.sm },
  card: { gap: t.spacing.md },
  // a red bracket that wraps around the top right corner: a longer line along the top edge and a shorter one down the
  // right edge, like the red bracket on the F1 circuit graphics. They sit on top of the card's own border.
  accentTop: {
    position: 'absolute',
    top: -t.border.hairline,
    right: -t.border.hairline,
    width: 96,
    height: 3,
    backgroundColor: t.colors.accent,
  },
  accentRight: {
    position: 'absolute',
    top: -t.border.hairline,
    right: -t.border.hairline,
    width: 3,
    height: 36,
    backgroundColor: t.colors.accent,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md, marginTop: t.spacing.xs },
  headerText: { flex: 1 },
  name: { fontSize: 28, fontWeight: '800', letterSpacing: -0.4, color: t.colors.text },
  country: { ...t.type.body, color: t.colors.textMuted, marginTop: 1 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm },
  statBlock: {
    flexBasis: '47%',
    flexGrow: 1,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
    borderRadius: t.radius.lg,
    paddingVertical: t.spacing.sm + 2,
    paddingHorizontal: t.spacing.md - 2,
    gap: 2,
  },
  statLabel: { ...t.type.caption, color: t.colors.textMuted },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  statValue: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, color: t.colors.text },
  statUnit: { fontSize: 12, fontWeight: '700', color: t.colors.textMuted, textTransform: 'uppercase' },
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

  const previewHeight = Math.round((width - cardPadding * 2) * 0.52);
  // Room for the name: the card's inner width minus the flag and the gap beside it. Long names are sized down to fit.
  const nameRoom = width - cardPadding * 2 - FLAG_WIDTH - theme.spacing.md;
  const nameSize = (name: string) => Math.max(18, Math.min(28, Math.floor(nameRoom / (name.length * 0.64))));

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
              <View style={[styles.accentTop, { pointerEvents: 'none' }]} />
              <View style={[styles.accentRight, { pointerEvents: 'none' }]} />

              <View style={styles.header}>
                <Flag code={item.countryCode} width={FLAG_WIDTH} />
                <View style={styles.headerText}>
                  <Text style={[styles.name, { fontSize: nameSize(item.name) }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                    {item.name}
                  </Text>
                  <Text style={styles.country}>{item.country}</Text>
                </View>
              </View>

              <View style={{ height: previewHeight }}>
                <TrackView track={item} lapFraction={0} showCar={false} fill />
              </View>

              <View style={styles.stats}>
                <StatBlock label="Circuit length" value={item.lapLengthKm.toFixed(2)} unit="km" />
                <StatBlock label="Race laps" value={String(item.raceLaps)} />
                <StatBlock label="Race distance" value={item.raceDistanceKm.toFixed(2)} unit="km" />
                <StatBlock label="Lap time" value={formatClock(item.lapTimeSeconds)} />
              </View>
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

/** A bordered block with a small label over a big bold number, like the stat panels on the F1 circuit graphics. */
function StatBlock({ label, value, unit }: { label: string; value: string; unit?: string }) {
  const styles = useStyles();
  return (
    <View style={styles.statBlock} accessible accessibilityLabel={`${label}: ${value}${unit ? ` ${unit}` : ''}`}>
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
