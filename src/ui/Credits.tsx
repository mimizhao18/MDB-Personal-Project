import { Text, View } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

import { CreditIcon } from '../components/CreditIcon';
import { makeStyles } from '../design/styles';

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.xs + 2 },
  amount: { ...t.type.heading, color: t.colors.text },
}));

/** An amount of credits shown as the coin icon followed by the number (read out as "N credits"). */
export function Credits({ amount, size = 18, textStyle, prefix = '' }: { amount: number; size?: number; textStyle?: StyleProp<TextStyle>; prefix?: string }) {
  const styles = useStyles();
  return (
    <View style={styles.row} accessible accessibilityLabel={`${prefix}${amount} credits`}>
      <CreditIcon size={size} />
      <Text style={[styles.amount, textStyle]}>
        {prefix}
        {amount}
      </Text>
    </View>
  );
}
