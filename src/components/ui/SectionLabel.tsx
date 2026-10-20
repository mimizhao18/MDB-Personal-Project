import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { makeStyles } from '../../design/styles';

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: t.spacing.md },
  label: { ...t.typography.label, color: t.colors.textMuted },
  trailing: { ...t.typography.statSmall, color: t.colors.textMuted },
}));

/** Small uppercase heading above a group of content, with an optional figure on the right (a count, "2 / 42"). */
export function SectionLabel({ children, trailing }: { children: ReactNode; trailing?: string }) {
  const styles = useStyles();
  return (
    <View style={styles.row}>
      <Text style={styles.label} accessibilityRole="header">
        {children}
      </Text>
      {trailing ? <Text style={styles.trailing}>{trailing}</Text> : null}
    </View>
  );
}
