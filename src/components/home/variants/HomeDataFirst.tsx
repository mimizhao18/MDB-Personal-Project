import { Text, View } from 'react-native';

import { TRACKS } from '../../../data/tracks';
import { makeStyles } from '../../../design/styles';
import { formatDurationWords } from '../../../logic/sessionOptions';
import { HeroCar } from '../../HeroCar';
import { Button, SectionLabel, SegmentedProgress } from '../../ui';
import type { HomeData } from '../useHomeData';
import { HomeTopBar } from './parts';

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, padding: t.spacing.screen, gap: t.spacing.md },
  car: { height: t.size.heroCompact, marginHorizontal: -t.spacing.screen },
  next: { gap: t.spacing.sm },
  nextRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  nextValue: { flexDirection: 'row', alignItems: 'baseline', gap: t.spacing.sm },
  display: { ...t.typography.display, color: t.colors.text },
  unit: { ...t.typography.caption, color: t.colors.textMuted },
  range: { ...t.typography.statSmall, color: t.colors.textMuted },
  data: { gap: t.spacing.xs },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingVertical: t.spacing.sm, borderBottomWidth: t.border.hairline, borderBottomColor: t.colors.border },
  dataLabel: { ...t.typography.caption, color: t.colors.textMuted },
  dataValue: { ...t.typography.statSmall, color: t.colors.text },
  dataValueAccent: { color: t.colors.accentOnDark },
  spacer: { flex: 1 },
}));

function DataRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const styles = useStyles();
  return (
    <View style={styles.dataRow} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={[styles.dataValue, accent && styles.dataValueAccent]}>{value}</Text>
    </View>
  );
}

/** Variant 3, Data-first: a smaller car, a big "XP to next level" readout, and the last race and streak as timing-screen data rows. */
export function HomeDataFirst({ data, onStart, segments }: { data: HomeData; onStart: () => void; segments: number }) {
  const styles = useStyles();
  const { profile, level, streak, lastRace, stats } = data;
  const toGo = level.xpForNextLevel - level.xpIntoLevel;
  return (
    <View style={styles.screen}>
      <HomeTopBar level={level.level} credits={profile.credits} />
      <View style={styles.car}>
        <HeroCar car={profile.car} autoSpin={false} />
      </View>
      <View style={styles.next}>
        <View style={styles.nextRow}>
          <SectionLabel>{`Next level ${level.level + 1}`}</SectionLabel>
          <Text style={styles.range}>
            {level.xpIntoLevel} / {level.xpForNextLevel}
          </Text>
        </View>
        <View style={styles.nextValue} accessible accessibilityLabel={`${toGo} XP to level ${level.level + 1}`}>
          <Text style={styles.display}>{toGo}</Text>
          <Text style={styles.unit}>XP to go</Text>
        </View>
        <SegmentedProgress fraction={level.fraction} segments={segments} accessibilityLabel="XP to the next level" />
      </View>
      <View style={styles.data}>
        <SectionLabel>{lastRace ? 'Last race' : 'Lifetime'}</SectionLabel>
        {lastRace ? (
          <>
            <DataRow label="Track" value={TRACKS[lastRace.trackId]?.name ?? 'Race'} />
            <DataRow label="Laps · time" value={`${lastRace.completedLaps} · ${formatDurationWords(lastRace.focusedSeconds)}`} />
            <DataRow label="XP earned" value={`+${lastRace.xpEarned}`} accent />
          </>
        ) : (
          <DataRow label="Races" value={String(stats.races)} />
        )}
        <DataRow label="Streak" value={`${streak} ${streak === 1 ? 'day' : 'days'}`} />
      </View>
      <View style={styles.spacer} />
      <Button label="Start Race" onPress={onStart} />
    </View>
  );
}
