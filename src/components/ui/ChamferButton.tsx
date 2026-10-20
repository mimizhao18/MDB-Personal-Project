import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import { chamferPoints } from '../../design/shapes';
import { makeStyles, useTheme } from '../../design/styles';

const useStyles = makeStyles((t) => ({
  outer: { minHeight: t.size.primary, padding: t.spacing.xs, alignItems: 'center', justifyContent: 'center' },
  layer: { position: 'absolute', top: 0, left: 0 },
  pressed: { opacity: t.opacity.pressed },
  disabled: { opacity: t.opacity.disabled },
  text: { ...t.typography.button, fontSize: 16, color: t.colors.accentText, textTransform: 'uppercase', letterSpacing: 1.5 },
}));

/**
 * The main button on a screen, in the angular style: a solid red shape with two cut corners, and a thin outer frame
 * around it (like the Start button in a game lobby).
 */
export function ChamferButton({ label, onPress, disabled, accessibilityLabel }: { label: string; onPress: () => void; disabled?: boolean; accessibilityLabel?: string }) {
  const styles = useStyles();
  const t = useTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;
  const gap = t.spacing.xs;
  const inset = t.border.hairline / 2;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onLayout={(e) => setSize(e.nativeEvent.layout)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [styles.outer, pressed && styles.pressed, disabled && styles.disabled]}
    >
      {width > 0 && (
        <Svg width={width} height={height} style={styles.layer} pointerEvents="none">
          <Polygon
            points={chamferPoints(inset, inset, width - t.border.hairline, height - t.border.hairline, t.size.chamfer + gap)}
            fill="none"
            stroke={t.colors.accent}
            strokeOpacity={t.opacity.dimmed}
            strokeWidth={t.border.hairline}
          />
          <Polygon points={chamferPoints(gap, gap, width - gap * 2, height - gap * 2, t.size.chamfer)} fill={t.colors.accent} />
        </Svg>
      )}
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}
