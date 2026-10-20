import { Text, View } from 'react-native';

import { makeStyles } from '../../design/styles';
import { CreditIcon } from '../CreditIcon';

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.xs + 2 },
  amount: { ...t.typography.stat, color: t.colors.text },
  meta: { ...t.typography.metaValue },
  compact: { ...t.typography.statCompact },
}));

const ICON_SIZE = { meta: 14, compact: 18, medium: 20 } as const;

/**
 * An amount of credits: the coin icon and the number in monospace numerals (read out as "N credits").
 * `meta` matches the 12 px text of Home's top bar, `compact` (16 px) is for your balance in a screen's corner, and `medium` (20 px) is for prices.
 */
export function CreditAmount({ amount, prefix = '', size = 'medium' }: { amount: number; prefix?: string; size?: 'meta' | 'compact' | 'medium' }) {
  const styles = useStyles();
  return (
    <View style={styles.row} accessible accessibilityLabel={`${prefix}${amount} credits`}>
      <CreditIcon size={ICON_SIZE[size]} />
      <Text style={[styles.amount, size === 'meta' && styles.meta, size === 'compact' && styles.compact]}>
        {prefix}
        {amount}
      </Text>
    </View>
  );
}
