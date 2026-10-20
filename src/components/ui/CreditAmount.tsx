import { Text, View } from 'react-native';

import { makeStyles } from '../../design/styles';
import { CreditIcon } from '../CreditIcon';

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.xs + 2 },
  amount: { ...t.typography.stat, color: t.colors.text },
  small: { ...t.typography.metaValue },
}));

/** An amount of credits: the coin icon and the number in monospace numerals (read out as "N credits"). `small` matches the 12 px meta text. */
export function CreditAmount({ amount, prefix = '', small }: { amount: number; prefix?: string; small?: boolean }) {
  const styles = useStyles();
  return (
    <View style={styles.row} accessible accessibilityLabel={`${prefix}${amount} credits`}>
      <CreditIcon size={small ? 14 : 20} />
      <Text style={[styles.amount, small && styles.small]}>
        {prefix}
        {amount}
      </Text>
    </View>
  );
}
