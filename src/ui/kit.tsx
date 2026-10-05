import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { makeStyles } from '../design/DesignProvider';

const useStyles = makeStyles((t) => ({
  sectionLabel: { ...t.type.label, color: t.colors.textMuted, marginTop: t.spacing.sm },
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.lg,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
    padding: t.spacing.md,
  },
  cardSelected: { borderColor: t.colors.accent, borderWidth: t.border.selected },
  button: {
    backgroundColor: t.colors.accent,
    borderRadius: t.radius.md,
    paddingVertical: t.spacing.md - 2,
    paddingHorizontal: t.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: { backgroundColor: 'transparent', borderWidth: t.border.hairline, borderColor: t.colors.border },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { color: t.colors.accentText, fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  buttonTextSecondary: { color: t.colors.text },
  statTile: {
    flex: 1,
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.lg,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
    paddingVertical: t.spacing.md,
    paddingHorizontal: t.spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  statValue: { ...t.type.stat, color: t.colors.text },
  statLabel: { ...t.type.caption, color: t.colors.textMuted },
  barTrack: { height: 4, borderRadius: t.radius.sm, backgroundColor: t.colors.border, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: t.colors.accent },
  segmented: {
    flexDirection: 'row',
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.md,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
    padding: 2,
  },
  segment: { flex: 1, paddingVertical: t.spacing.sm, borderRadius: Math.max(0, t.radius.md - 2), alignItems: 'center' },
  segmentActive: { backgroundColor: t.colors.accent },
  segmentCompact: { paddingVertical: 6 },
  segmentText: { color: t.colors.textMuted, fontSize: 14, fontWeight: '700' },
  segmentTextCompact: { fontSize: 12 },
  segmentTextActive: { color: t.colors.accentText },
}));

/** Small uppercase heading above a group of content. */
export function SectionLabel({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function Card({ children, selected, style }: { children: ReactNode; selected?: boolean; style?: StyleProp<ViewStyle> }) {
  const styles = useStyles();
  return <View style={[styles.card, selected && styles.cardSelected, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const styles = useStyles();
  const secondary = variant === 'secondary';
  return (
    <Pressable
      style={[styles.button, secondary && styles.buttonSecondary, disabled && styles.buttonDisabled]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
    >
      <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>{label}</Text>
    </Pressable>
  );
}

export function StatTile({ label, value }: { label: string; value: string }) {
  const styles = useStyles();
  return (
    <View style={styles.statTile}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/** A thin progress bar, `fraction` from 0 to 1. */
export function ProgressBar({ fraction }: { fraction: number }) {
  const styles = useStyles();
  const clamped = Math.max(0, Math.min(1, fraction));
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${clamped * 100}%` }]} />
    </View>
  );
}

/** A row of mutually exclusive choices, one highlighted. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  labelFor,
  compact,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labelFor?: (value: T) => string;
  compact?: boolean;
}) {
  const styles = useStyles();
  return (
    <View style={styles.segmented}>
      {options.map((option) => (
        <Pressable
          key={option}
          style={[styles.segment, compact && styles.segmentCompact, option === value && styles.segmentActive]}
          onPress={() => onChange(option)}
          accessibilityRole="button"
          accessibilityState={{ selected: option === value }}
        >
          <Text style={[styles.segmentText, compact && styles.segmentTextCompact, option === value && styles.segmentTextActive]}>{labelFor ? labelFor(option) : option}</Text>
        </Pressable>
      ))}
    </View>
  );
}
