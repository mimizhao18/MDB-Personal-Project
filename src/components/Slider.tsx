import { useRef, useState } from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';

import { colors } from '../theme';

interface Props {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  accessibilityLabel?: string;
}

const THUMB = 28;
const TRACK_HEIGHT = 6;

/** A simple horizontal slider that snaps to `step`. Touch or drag anywhere along the bar. */
export function Slider({ value, min, max, step = 1, onChange, accessibilityLabel }: Props) {
  const [width, setWidth] = useState(0);
  const barRef = useRef<View>(null);

  const valueAt = (pageX: number, barLeft: number) => {
    if (width <= 0) return min;
    const fraction = Math.max(0, Math.min(1, (pageX - barLeft) / width));
    const stepped = Math.round((min + fraction * (max - min)) / step) * step;
    return Math.max(min, Math.min(max, stepped));
  };

  // The bar's position on screen is measured on every touch, so it stays right if the page has scrolled.
  const handleTouch = (e: GestureResponderEvent) => {
    const pageX = e.nativeEvent.pageX;
    barRef.current?.measureInWindow((x) => onChange(valueAt(pageX, x)));
  };

  const fraction = max === min ? 0 : (value - min) / (max - min);
  const thumbLeft = fraction * width - THUMB / 2;

  return (
    <View
      style={styles.touchArea}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false} // keep the drag even if the page tries to scroll
      onResponderGrant={handleTouch}
      onResponderMove={handleTouch}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        const delta = e.nativeEvent.actionName === 'increment' ? step : -step;
        onChange(Math.max(min, Math.min(max, value + delta)));
      }}
    >
      <View ref={barRef} style={styles.bar} onLayout={(e) => setWidth(e.nativeEvent.layout.width)} pointerEvents="none">
        <View style={[styles.fill, { width: `${fraction * 100}%` }]} />
      </View>
      <View style={[styles.thumb, { left: thumbLeft }]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  touchArea: { height: 48, justifyContent: 'center', marginHorizontal: THUMB / 2 },
  bar: { height: TRACK_HEIGHT, borderRadius: TRACK_HEIGHT / 2, backgroundColor: colors.surfaceBorder, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.accent },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: colors.text,
    borderWidth: 3,
    borderColor: colors.accent,
  },
});
