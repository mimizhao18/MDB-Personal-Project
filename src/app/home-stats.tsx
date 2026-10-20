import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { makeStyles } from '../design/styles';
import { HomeStatsView } from '../components/home/HomeStatsView';
import type { HomeData } from '../components/home/useHomeData';
import { DEFAULT_HOME_STATS, HOME_STATS, getHomeStats, saveHomeStats } from '../storage/homeStats';
import type { HomeStatsId } from '../storage/homeStats';
import { levelProgress } from '../logic/rewards';
import { DEFAULT_PROFILE } from '../storage/profile';

const useStyles = makeStyles((t) => ({
  container: { flex: 1 },
  content: { padding: t.spacing.md, gap: t.spacing.sm },
  intro: { ...t.type.caption, color: t.colors.textMuted, marginBottom: t.spacing.xs },
  option: {
    gap: t.spacing.md,
    padding: t.spacing.md,
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.lg,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
  },
  optionSelected: { borderColor: t.colors.accent, borderWidth: t.border.selected },
  head: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  text: { flex: 1, gap: 2 },
  name: { ...t.type.heading, color: t.colors.text },
  description: { ...t.type.caption, color: t.colors.textMuted },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: t.colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: t.colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: t.colors.accent },
}));

// example numbers so each style can be previewed before choosing
const SAMPLE: HomeData = {
  profile: DEFAULT_PROFILE,
  stats: { races: 7, laps: 34, distanceKm: 679, focusedSeconds: 11880 },
  level: levelProgress(0),
  streak: 5,
  focusLine: '',
  lastRace: null,
};

/** Settings > Home stats: choose how the stats on Home are shown. Each option previews with example numbers. */
export default function HomeStatsScreen() {
  const styles = useStyles();
  const [selected, setSelected] = useState<HomeStatsId>(DEFAULT_HOME_STATS);

  useEffect(() => {
    getHomeStats().then(setSelected);
  }, []);

  const choose = (id: HomeStatsId) => {
    setSelected(id);
    void saveHomeStats(id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>Pick how your stats look on Home. The numbers below are examples.</Text>
        {HOME_STATS.map((option) => {
          const on = option.id === selected;
          return (
            <Pressable
              key={option.id}
              style={[styles.option, on && styles.optionSelected]}
              onPress={() => choose(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${option.name} stats style. ${option.description}`}
            >
              <View style={styles.head}>
                <View style={styles.text}>
                  <Text style={styles.name}>{option.name}</Text>
                  <Text style={styles.description}>{option.description}</Text>
                </View>
                <View style={[styles.radio, on && styles.radioOn]}>{on && <View style={styles.radioDot} />}</View>
              </View>
              <HomeStatsView data={SAMPLE} style={option.id} />
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
