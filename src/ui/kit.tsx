import { Children } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { makeStyles } from '../design/styles';

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
    minHeight: 48,
    paddingHorizontal: t.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: { backgroundColor: 'transparent', borderWidth: t.border.hairline, borderColor: t.colors.borderStrong },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { color: t.colors.accentText, fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  buttonTextSecondary: { color: t.colors.text },
  strip: {
    flexDirection: 'row',
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.lg,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
    paddingVertical: t.spacing.md,
  },
  stripItem: { flex: 1, alignItems: 'center', gap: 2, paddingHorizontal: t.spacing.sm },
  stripItemDivided: { borderLeftWidth: t.border.hairline, borderLeftColor: t.colors.border },
  statValue: { fontSize: 20, fontWeight: '700', color: t.colors.text },
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
  segment: { flex: 1, minHeight: 40, justifyContent: 'center', borderWidth: t.border.hairline, borderColor: 'transparent', borderRadius: Math.max(0, t.radius.md - 2), alignItems: 'center' },
  segmentActive: { backgroundColor: t.colors.surfaceRaised, borderWidth: t.border.hairline, borderColor: t.colors.borderStrong },
  segmentText: { color: t.colors.textMuted, fontSize: 14, fontWeight: '700' },
  segmentTextActive: { color: t.colors.text },
  chipRow: { flexDirection: 'row', gap: t.spacing.sm, paddingRight: t.spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.xs + 2,
    height: 36,
    paddingHorizontal: t.spacing.md - 2,
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.md,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
  },
  chipActive: { backgroundColor: t.colors.surfaceRaised, borderColor: t.colors.borderStrong },
  chipText: { color: t.colors.textMuted, fontSize: 14, fontWeight: '700' },
  chipTextActive: { color: t.colors.text },
  chipCount: { color: t.colors.textMuted, fontSize: 12, fontWeight: '600' },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  sortLabel: { ...t.type.caption, color: t.colors.textMuted },
  sortOption: { paddingVertical: t.spacing.sm, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  sortOptionActive: { borderBottomColor: t.colors.text },
  sortText: { fontSize: 14, fontWeight: '600', color: t.colors.textMuted },
  sortTextActive: { color: t.colors.text },
  group: { backgroundColor: t.colors.surface, borderRadius: t.radius.lg, borderWidth: t.border.hairline, borderColor: t.colors.border, overflow: 'hidden' },
  divider: { height: t.border.hairline, backgroundColor: t.colors.border, marginLeft: t.spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md, minHeight: 56, paddingVertical: t.spacing.sm + 2, paddingHorizontal: t.spacing.md },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 16, fontWeight: '600', color: t.colors.text },
  rowTitleDestructive: { color: '#FF6B63' },
  rowSubtitle: { ...t.type.caption, color: t.colors.textMuted },
  rowChevron: { fontSize: 22, color: t.colors.textMuted },
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

/** Several figures in one panel, each a number over a small label, split by hairlines. */
export function StatStrip({ items }: { items: readonly { label: string; value: string }[] }) {
  const styles = useStyles();
  return (
    <View style={styles.strip}>
      {items.map((item, i) => (
        <View key={item.label} style={[styles.stripItem, i > 0 && styles.stripItemDivided]} accessible accessibilityLabel={`${item.label}: ${item.value}`}>
          <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
            {item.value}
          </Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>
      ))}
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
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labelFor?: (value: T) => string;
}) {
  const styles = useStyles();
  return (
    <View style={styles.segmented}>
      {options.map((option) => (
        <Pressable
          key={option}
          style={[styles.segment, option === value && styles.segmentActive]}
          onPress={() => onChange(option)}
          accessibilityRole="button"
          accessibilityState={{ selected: option === value }}
        >
          <Text style={[styles.segmentText, option === value && styles.segmentTextActive]}>{labelFor ? labelFor(option) : option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

/** A row of filter chips that scrolls sideways, one selected, each with an optional count. */
export function Chips<T extends string>({
  options,
  value,
  onChange,
  labelFor,
  countFor,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labelFor?: (value: T) => string;
  countFor?: (value: T) => string | undefined;
}) {
  const styles = useStyles();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
      {options.map((option) => {
        const active = option === value;
        const count = countFor?.(option);
        return (
          <Pressable
            key={option}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{labelFor ? labelFor(option) : option}</Text>
            {count !== undefined && <Text style={styles.chipCount}>{count}</Text>}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** Rows stacked in one rounded panel with a hairline between them (like a settings list). */
export function ListGroup({ children }: { children: ReactNode }) {
  const styles = useStyles();
  const rows = Children.toArray(children);
  return (
    <View style={styles.group}>
      {rows.map((row, i) => (
        <View key={i}>
          {i > 0 && <View style={styles.divider} />}
          {row}
        </View>
      ))}
    </View>
  );
}

/** One row of a ListGroup: a title, an optional line of explanation underneath, and a chevron when it opens something. */
export function ListRow({
  title,
  subtitle,
  onPress,
  destructive,
  chevron,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
  chevron?: boolean;
}) {
  const styles = useStyles();
  return (
    <Pressable style={styles.row} onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, destructive && styles.rowTitleDestructive]}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {chevron && <Text style={styles.rowChevron}>›</Text>}
    </Pressable>
  );
}

/** A "Sort" row of plain text choices, the selected one underlined: lighter than a segmented control. */
export function SortRow<T extends string>({ label = 'Sort', options, value, onChange, labelFor }: { label?: string; options: readonly T[]; value: T; onChange: (value: T) => void; labelFor?: (value: T) => string }) {
  const styles = useStyles();
  return (
    <View style={styles.sortRow}>
      <Text style={styles.sortLabel}>{label}</Text>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable key={option} style={[styles.sortOption, active && styles.sortOptionActive]} onPress={() => onChange(option)} accessibilityRole="button" accessibilityState={{ selected: active }}>
            <Text style={[styles.sortText, active && styles.sortTextActive]}>{labelFor ? labelFor(option) : option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
