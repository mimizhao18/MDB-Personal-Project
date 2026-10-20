import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { makeStyles } from '../../design/styles';
import { colors } from '../../theme';
import { Credits } from '../../ui/Credits';
import { Button } from '../../ui/kit';
import { HeroCar } from '../HeroCar';
import type { HomeData } from './useHomeData';

const RING = 128;
const STROKE = 6;

const useStyles = makeStyles((t) => ({
  safe: { flex: 1, padding: t.spacing.md, gap: t.spacing.md },
  credits: { position: 'absolute', top: t.spacing.md, right: t.spacing.md },
  top: { alignItems: 'center', gap: t.spacing.sm, paddingTop: t.spacing.sm },
  ringWrap: { width: RING, height: RING, alignItems: 'center', justifyContent: 'center' },
  ringText: { position: 'absolute', alignItems: 'center' },
  ringLabel: { ...t.type.label, fontSize: 11, color: t.colors.textMuted },
  ringLevel: { fontSize: 44, fontWeight: '800', color: t.colors.text, lineHeight: 50 },
  xp: { ...t.type.caption, color: t.colors.textMuted },
  carArea: { flex: 1, marginHorizontal: -t.spacing.md },
  line: { ...t.type.body, color: t.colors.textMuted, textAlign: 'center' },
  lineStrong: { color: t.colors.text, fontWeight: '700' },
}));

/** The level in a progress ring at the top, the car beneath it, and one quiet line of stats. */
export function HomeRing({ data, onStart }: { data: HomeData; onStart: () => void }) {
  const styles = useStyles();
  const { profile, stats, level, streak } = data;
  const r = (RING - STROKE) / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <View style={styles.ringWrap}>
          <Svg width={RING} height={RING}>
            <Circle cx={RING / 2} cy={RING / 2} r={r} stroke={colors.border} strokeWidth={STROKE} fill="none" />
            <Circle
              cx={RING / 2}
              cy={RING / 2}
              r={r}
              stroke={colors.accent}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference * level.fraction} ${circumference}`}
              transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
            />
          </Svg>
          <View style={styles.ringText}>
            <Text style={styles.ringLabel}>Level</Text>
            <Text style={styles.ringLevel}>{level.level}</Text>
          </View>
        </View>
        <Text style={styles.xp}>
          {level.xpIntoLevel} / {level.xpForNextLevel} XP
        </Text>
      </View>
      <View style={styles.credits}>
        <Credits amount={profile.credits} size={18} />
      </View>
      <View style={styles.carArea}>
        <HeroCar car={profile.car} autoSpin={false} />
      </View>
      <Text style={styles.line}>
        <Text style={styles.lineStrong}>{streak}</Text> day streak · <Text style={styles.lineStrong}>{stats.races}</Text> races · <Text style={styles.lineStrong}>{stats.distanceKm.toFixed(0)}</Text> km
      </Text>
      <Button label="Start Race" onPress={onStart} />
    </SafeAreaView>
  );
}
