import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { makeStyles } from '../../design/styles';
import { Credits } from '../../ui/Credits';
import { Button, ProgressBar } from '../../ui/kit';
import { HeroCar } from '../HeroCar';
import type { HomeData } from './useHomeData';

const useStyles = makeStyles((t) => ({
  safe: { flex: 1, padding: t.spacing.md, gap: t.spacing.md },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  label: { ...t.type.label, color: t.colors.textMuted },
  huge: { fontSize: 76, fontWeight: '900', letterSpacing: -2, color: t.colors.text, lineHeight: 80 },
  bar: { width: 160, marginTop: t.spacing.sm, gap: t.spacing.xs },
  xp: { ...t.type.caption, color: t.colors.textMuted },
  carArea: { flex: 1, marginHorizontal: -t.spacing.md },
  stats: { flexDirection: 'row', gap: t.spacing.xl },
  stat: { gap: 2 },
  statValue: { fontSize: 22, fontWeight: '700', color: t.colors.text },
  statLabel: { ...t.type.caption, color: t.colors.textMuted },
}));

/** A huge level number and the car, with the stats as plain text: the most minimal layout. */
export function HomePoster({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const { profile, stats, level, streak } = data;
  const figures = [
    { label: 'Day streak', value: String(streak) },
    { label: 'Races', value: String(stats.races) },
    { label: 'Km', value: stats.distanceKm.toFixed(0) },
  ];
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <View>
          <Text style={styles.label}>Level</Text>
          <Text style={styles.huge}>{level.level}</Text>
          <View style={styles.bar}>
            <ProgressBar fraction={level.fraction} />
            <Text style={styles.xp}>
              {level.xpIntoLevel} / {level.xpForNextLevel} XP
            </Text>
          </View>
        </View>
        <Credits amount={profile.credits} size={18} />
      </View>
      <View style={styles.carArea}>
        <HeroCar car={profile.car} autoSpin={false} />
      </View>
      <View style={styles.stats}>
        {figures.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
      <Button label="Start Race" onPress={onStart} />
    </SafeAreaView>
  );
}
