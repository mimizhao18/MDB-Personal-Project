import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, Text } from 'react-native';

import { makeStyles, useTheme } from '../../design/styles';

export type IconName = ComponentProps<typeof Ionicons>['name'];

const useStyles = makeStyles((t) => ({
  base: {
    minHeight: t.size.control,
    borderRadius: t.radius.control,
    paddingHorizontal: t.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.spacing.sm,
    borderWidth: t.border.hairline,
  },
  primary: { backgroundColor: t.colors.accent, borderColor: t.colors.accent },
  secondary: { backgroundColor: 'transparent', borderColor: t.colors.border },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  soft: { backgroundColor: t.colors.accentTint, borderColor: t.colors.accent },
  secondaryPressed: { backgroundColor: t.colors.raised },
  ghostPressed: { backgroundColor: t.colors.surface },
  pressed: { opacity: t.opacity.pressed },
  disabled: { opacity: t.opacity.disabled },
  text: { ...t.typography.button },
  textPrimary: { color: t.colors.accentText },
  textSecondary: { color: t.colors.text },
  textGhost: { color: t.colors.textSecondary },
  textSoft: { color: t.colors.accentOnDark },
}));

/** A 48 px button. `primary` (solid red) is for the one main action on a screen; `soft` is a dark red tint with a thin red outline for a quieter action (Equip); use `secondary` and `ghost` for everything else. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
  icon?: IconName;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const styles = useStyles();
  const t = useTheme();
  const textStyle = { primary: styles.textPrimary, secondary: styles.textSecondary, ghost: styles.textGhost, soft: styles.textSoft }[variant];
  const iconColor = { primary: t.colors.accentText, secondary: t.colors.text, ghost: t.colors.textSecondary, soft: t.colors.accentOnDark }[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && (variant === 'secondary' ? styles.secondaryPressed : variant === 'ghost' ? styles.ghostPressed : styles.pressed),
        disabled && styles.disabled,
      ]}
    >
      {icon ? <Ionicons name={icon} size={t.size.icon - 4} color={iconColor} /> : null}
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </Pressable>
  );
}
