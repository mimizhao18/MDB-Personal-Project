import { Platform, Pressable, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { makeStyles, useTheme } from '../design/styles';

const useStyles = makeStyles((t) => ({
  button: {
    minHeight: t.size.touch - t.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    paddingHorizontal: t.spacing.sm + t.spacing.xs,
    borderRadius: t.radius.control,
    borderWidth: t.border.hairline,
    borderColor: t.glass.divider,
    // in a web browser the header has no side padding of its own
    marginLeft: Platform.OS === 'web' ? t.spacing.screen : 0,
  },
  pressed: { backgroundColor: t.colors.raised },
  label: { ...t.typography.metaLabel, color: t.colors.textSecondary },
}));

/** The header's back button: a thin outlined rectangle with a chevron and "Back", in place of the system's round one. */
export function BackButton({ onPress }: { onPress: () => void }) {
  const styles = useStyles();
  const { colors, size, border, spacing } = useTheme();
  const height = size.chevron;
  const width = height * 0.6;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: spacing.xs, bottom: spacing.xs, left: spacing.sm, right: spacing.sm }}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Svg width={width} height={height} viewBox="0 0 6 10">
        <Path d="M5 1 L1 5 L5 9" stroke={colors.textSecondary} strokeWidth={border.selected} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
      <Text style={styles.label}>Back</Text>
    </Pressable>
  );
}
