import { Pressable, Text, View } from 'react-native';

import { makeStyles } from '../../design/styles';

const useStyles = makeStyles((t) => ({
  row: { flexDirection: 'row', borderWidth: t.border.hairline, borderColor: t.colors.border, borderRadius: t.radius.control, overflow: 'hidden' },
  segment: { flex: 1, minHeight: t.size.touch, alignItems: 'center', justifyContent: 'center' },
  divided: { borderLeftWidth: t.border.hairline, borderLeftColor: t.colors.border },
  active: { backgroundColor: t.colors.raised },
  underline: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, backgroundColor: t.colors.accent },
  label: { ...t.typography.button, color: t.colors.textMuted },
  labelActive: { color: t.colors.text },
}));

/** A row of mutually exclusive choices: the chosen one is lighter and has a thin red line under it. */
export function SegmentedControl<T extends string>({
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
    <View style={styles.row} accessibilityRole="radiogroup">
      {options.map((option, i) => {
        const selected = option === value;
        const label = labelFor ? labelFor(option) : option;
        return (
          <Pressable
            key={option}
            style={[styles.segment, i > 0 && styles.divided, selected && styles.active]}
            onPress={() => onChange(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={label}
          >
            <Text style={[styles.label, selected && styles.labelActive]}>{label}</Text>
            {selected && <View style={styles.underline} />}
          </Pressable>
        );
      })}
    </View>
  );
}
