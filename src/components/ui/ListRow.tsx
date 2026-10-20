import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { makeStyles, useTheme } from '../../design/styles';
import type { IconName } from './Button';

const useStyles = makeStyles((t) => ({
  row: {
    minHeight: t.size.row,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    paddingVertical: t.spacing.sm,
    borderBottomWidth: t.border.hairline,
    borderBottomColor: t.colors.border,
  },
  last: { borderBottomWidth: 0 },
  pressed: { opacity: t.opacity.pressed },
  text: { flex: 1, gap: 2 },
  title: { ...t.typography.body, fontFamily: t.typography.heading.fontFamily, color: t.colors.text },
  destructive: { color: t.colors.accentOnDark },
  subtitle: { ...t.typography.caption, color: t.colors.textMuted },
  value: { ...t.typography.statSmall, color: t.colors.textSecondary },
}));

/** One row of a list: optional icon, a title with an optional line under it, an optional value, and a chevron when it opens something. Rows are separated by hairlines; set `last` on the final one. */
export function ListRow({
  title,
  subtitle,
  value,
  icon,
  onPress,
  destructive,
  chevron = true,
  last,
}: {
  title: string;
  subtitle?: string;
  value?: string;
  icon?: IconName;
  onPress?: () => void;
  destructive?: boolean;
  /** Show the arrow at the end of a row that opens something (on by default for rows with onPress). */
  chevron?: boolean;
  last?: boolean;
}) {
  const styles = useStyles();
  const t = useTheme();
  const content = (
    <>
      {icon ? <Ionicons name={icon} size={t.size.icon} color={destructive ? t.colors.accentOnDark : t.colors.textSecondary} /> : null}
      <View style={styles.text}>
        <Text style={[styles.title, destructive && styles.destructive]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {onPress && chevron ? <Ionicons name="chevron-forward" size={t.size.icon - 4} color={t.colors.textMuted} /> : null}
    </>
  );
  if (!onPress) return <View style={[styles.row, last && styles.last]}>{content}</View>;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title} style={({ pressed }) => [styles.row, last && styles.last, pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}
