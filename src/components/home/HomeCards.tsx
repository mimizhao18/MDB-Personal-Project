import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getEra } from '../../data/eras';
import { getLivery } from '../../data/liveries';
import { TRACKS } from '../../data/tracks';
import { makeStyles } from '../../design/styles';
import { formatDurationWords } from '../../logic/sessionOptions';
import { colors } from '../../theme';
import { Credits } from '../../ui/Credits';
import { Button, Card, ProgressBar } from '../../ui/kit';
import { HeroCar } from '../HeroCar';
import type { HomeData } from './useHomeData';

const useStyles = makeStyles((t) => ({
  safe: { flex: 1 },
  content: { padding: t.spacing.md, gap: t.spacing.md },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { ...t.type.title, fontSize: 22, color: t.colors.text },
  heroBleed: { marginHorizontal: -t.spacing.md, marginTop: -t.spacing.xs },
  heroFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  carName: { ...t.type.heading, color: t.colors.text },
  carMeta: { ...t.type.caption, color: t.colors.textMuted },
  link: { ...t.type.caption, fontWeight: '700', color: t.colors.textMuted },
  row: { flexDirection: 'row', gap: t.spacing.sm },
  half: { flex: 1, gap: t.spacing.sm },
  gap: { gap: t.spacing.sm },
  label: { ...t.type.label, color: t.colors.textMuted },
  big: { fontSize: 30, fontWeight: '800', color: t.colors.text },
  small: { ...t.type.caption, color: t.colors.textMuted },
  lastTitle: { ...t.type.heading, fontSize: 16, color: t.colors.text },
  lastRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xp: { fontSize: 15, fontWeight: '700', color: t.colors.text },
}));

/** Everything in its own card: the car, the level, the streak and the last race. */
export function HomeCards({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const { profile, level, streak, lastRace } = data;
  const livery = getLivery(profile.car.liveryId);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.top}>
          <Text style={styles.greeting}>Ready to race?</Text>
          <Credits amount={profile.credits} size={18} />
        </View>

        <Card>
          <View style={styles.heroBleed}>
            <HeroCar car={profile.car} height={210} background={colors.surface} autoSpin={false} />
          </View>
          <View style={styles.heroFooter}>
            <View>
              <Text style={styles.carName}>{livery.name}</Text>
              <Text style={styles.carMeta}>{getEra(livery.era).name} car</Text>
            </View>
            <Pressable onPress={() => router.replace('/garage')} hitSlop={10} accessibilityRole="button" accessibilityLabel="Open the garage">
              <Text style={styles.link}>Garage ›</Text>
            </Pressable>
          </View>
        </Card>

        <View style={styles.row}>
          <Card style={styles.half}>
            <Text style={styles.label}>Level</Text>
            <Text style={styles.big}>{level.level}</Text>
            <ProgressBar fraction={level.fraction} />
            <Text style={styles.small}>
              {level.xpIntoLevel} / {level.xpForNextLevel} XP
            </Text>
          </Card>
          <Card style={styles.half}>
            <Text style={styles.label}>Streak</Text>
            <Text style={styles.big}>{streak}</Text>
            <Text style={styles.small}>{streak === 1 ? 'day in a row' : 'days in a row'}</Text>
          </Card>
        </View>

        {lastRace && (
          <Card style={styles.gap}>
            <Text style={styles.label}>Last race</Text>
            <View style={styles.lastRow}>
              <View>
                <Text style={styles.lastTitle}>{TRACKS[lastRace.trackId]?.name ?? 'Race'}</Text>
                <Text style={styles.small}>
                  {lastRace.completedLaps} laps · {formatDurationWords(lastRace.focusedSeconds)}
                </Text>
              </View>
              <Text style={styles.xp}>+{lastRace.xpEarned} XP</Text>
            </View>
          </Card>
        )}

        <Button label="Start Race" onPress={onStart} />
      </ScrollView>
    </SafeAreaView>
  );
}
