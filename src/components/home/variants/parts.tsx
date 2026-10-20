import { Text, View } from 'react-native';

import { makeStyles } from '../../../design/styles';
import { CreditAmount } from '../../ui';

const useStyles = makeStyles((t) => ({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  level: { flexDirection: 'row', alignItems: 'baseline', gap: t.spacing.sm },
  levelLabel: { ...t.typography.label, color: t.colors.textMuted },
  levelNumber: { ...t.typography.stat, color: t.colors.text },
}));

/** The top line of Home: your level on the left (leave it out if the screen shows it elsewhere) and your credits on the right. */
export function HomeTopBar({ level, credits }: { level?: number; credits: number }) {
  const styles = useStyles();
  return (
    <View style={styles.top}>
      {level !== undefined ? (
        <View style={styles.level} accessible accessibilityLabel={`Level ${level}`}>
          <Text style={styles.levelLabel}>Level</Text>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>
      ) : (
        <View />
      )}
      <CreditAmount amount={credits} />
    </View>
  );
}
