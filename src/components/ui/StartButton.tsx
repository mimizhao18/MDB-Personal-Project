import { Pressable, Text, View } from 'react-native';

import { makeStyles } from '../../design/styles';

const useStyles = makeStyles((t) => ({
  frame: { padding: t.spacing.xs - 1, borderRadius: t.radius.control / 2, borderWidth: t.border.hairline, borderColor: t.colors.accent },
  frameFaint: { borderColor: 'transparent' },
  button: { minHeight: t.size.primary, borderRadius: t.radius.control / 4, backgroundColor: t.colors.accent, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: t.opacity.pressed },
  disabled: { opacity: t.opacity.disabled },
  text: { ...t.typography.button, fontSize: 16, color: t.colors.accentText, textTransform: 'uppercase', letterSpacing: 1.5 },
}));

/**
 * The main button on a screen: a solid red rectangle with almost square corners (1 px). `frame` adds a thin outer
 * outline around it, like the double border of a game lobby's Start button.
 */
export function StartButton({ label, onPress, frame, disabled, accessibilityLabel }: { label: string; onPress: () => void; frame?: boolean; disabled?: boolean; accessibilityLabel?: string }) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [frame ? styles.frame : undefined, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <View style={styles.button}>
        <Text style={styles.text}>{label}</Text>
      </View>
    </Pressable>
  );
}
