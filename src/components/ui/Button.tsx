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
  secondaryPressed: { backgroundColor: t.colors.raised },
  ghostPressed: { backgroundColor: t.colors.surface },
  pressed: { opacity: t.opacity.pressed },
  disabled: { opacity: t.opacity.disabled },
  text: { ...t.typography.button },
  textPrimary: { color: t.colors.accentText },
  textSecondary: { color: t.colors.text },
  textGhost: { color: t.colors.textSecondary },
}));

/** A 48 px button. `primary` (red) is for the one main action on a screen; use `secondary` and `ghost` for everything else. */
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
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: IconName;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const styles = useStyles();
  const t = useTheme();
  const textStyle = variant === 'primary' ? styles.textPrimary : variant === 'secondary' ? styles.textSecondary : styles.textGhost;
  const iconColor = variant === 'primary' ? t.colors.accentText : variant === 'secondary' ? t.colors.text : t.colors.textSecondary;
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
        pressed && (variant === 'primary' ? styles.pressed : variant === 'secondary' ? styles.secondaryPressed : styles.ghostPressed),
        disabled && styles.disabled,
      ]}
    >
      {icon ? <Ionicons name={icon} size={t.size.icon - 4} color={iconColor} /> : null}
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </Pressable>
  );
}
