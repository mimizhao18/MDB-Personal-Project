import { useRef, useState } from 'react';
import { GestureResponderEvent, View } from 'react-native';

import { makeStyles } from '../design/DesignProvider';

interface Props {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  accessibilityLabel?: string;
}

const THUMB_W = 16;
const THUMB_H = 30;
const TRACK_HEIGHT = 4;

const useStyles = makeStyles((t) => ({
  touchArea: { height: 48, justifyContent: 'center', marginHorizontal: THUMB_W / 2 },
  bar: { height: TRACK_HEIGHT, borderRadius: t.radius.sm, backgroundColor: t.colors.border, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: t.colors.accent },
  thumb: {
    position: 'absolute',
    width: THUMB_W,
    height: THUMB_H,
    borderRadius: t.radius.sm + 1,
    backgroundColor: t.colors.text,
    borderWidth: t.border.hairline,
    borderColor: t.colors.accent,
  },
}));

/** A simple horizontal slider that snaps to `step`. Touch or drag anywhere along the bar. */
export function Slider({ value, min, max, step = 1, onChange, accessibilityLabel }: Props) {
  const styles = useStyles();
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
  const thumbLeft = fraction * width - THUMB_W / 2;

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
