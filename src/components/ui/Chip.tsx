import { Pressable, Text } from 'react-native';

import { makeStyles } from '../../design/styles';

const useStyles = makeStyles((t) => ({
  chip: {
    minHeight: t.size.touch - t.spacing.sm,
    paddingHorizontal: t.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.xs + 2,
    borderRadius: t.radius.control,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
  },
  active: { backgroundColor: t.colors.raised, borderColor: t.colors.accent },
  label: { ...t.typography.caption, fontFamily: t.typography.button.fontFamily, color: t.colors.textSecondary },
  labelActive: { color: t.colors.text },
  count: { ...t.typography.statSmall, color: t.colors.textMuted },
}));

/** A small filter option. Selected = lighter fill and an accent outline. The hit area is padded up to 44 px. */
export function Chip({ label, selected, count, onPress }: { label: string; selected?: boolean; count?: string | number; onPress: () => void }) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4, left: 2, right: 2 }}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={count !== undefined ? `${label}, ${count}` : label}
      style={[styles.chip, selected && styles.active]}
    >
      <Text style={[styles.label, selected && styles.labelActive]}>{label}</Text>
      {count !== undefined ? <Text style={styles.count}>{count}</Text> : null}
    </Pressable>
  );
}
