import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polygon } from 'react-native-svg';

import { makeStyles } from '../design/styles';
import { colors } from '../theme';

// Garage and Store on the left, History and Settings on the right, and Home in the middle, a little more prominent.
const TABS = [
  { label: 'Garage', path: '/garage' },
  { label: 'Store', path: '/store' },
  { label: 'Home', path: '/', home: true },
  { label: 'History', path: '/history' },
  { label: 'Settings', path: '/settings' },
] as const;

/** The screens that belong to the tab bar (and show it when the navigation style is "tabs"). */
export const TAB_PATHS: readonly string[] = TABS.map((t) => t.path);

const TAB_HEIGHT = 56;
/** How far each slanted side of the Home trapezoid leans in at the top, in px. */
const SLANT = 14;

const useStyles = makeStyles((t) => ({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: t.colors.surface,
    borderTopWidth: t.border.hairline,
    borderTopColor: t.colors.border,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  homeTab: { flex: 1.5 },
  indicator: { position: 'absolute', top: -t.border.hairline, left: '30%', right: '30%', height: 2, backgroundColor: t.colors.accent },
  label: { ...t.type.caption, color: t.colors.textMuted, fontWeight: '600', letterSpacing: 0.4 },
  labelActive: { color: t.colors.text },
  homeShape: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  homeLabel: { fontSize: 14, fontWeight: '800', letterSpacing: 0.6, color: t.colors.accentSoftText },
  homeLabelActive: { color: t.colors.accentText },
}));

/** The Home tab's backdrop: a trapezoid that is wider at the bottom, dark red when idle and solid red on Home. */
function HomeShape({ active }: { active: boolean }) {
  const styles = useStyles();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;
  return (
    <View style={styles.homeShape} pointerEvents="none" onLayout={(e) => setSize(e.nativeEvent.layout)}>
      {width > 0 && (
        <Svg width={width} height={height}>
          <Polygon
            points={`${SLANT},0 ${width - SLANT},0 ${width},${height} 0,${height}`}
            fill={active ? colors.accent : colors.accentSoft}
            stroke={colors.accent}
            strokeWidth={active ? 0 : 1}
            strokeOpacity={0.5}
          />
        </Svg>
      )}
    </View>
  );
}

export function TabBar() {
  const styles = useStyles();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const active = pathname === tab.path;
        const home = 'home' in tab;
        return (
          <Pressable
            key={tab.path}
            style={[styles.tab, home && styles.homeTab, { height: TAB_HEIGHT + insets.bottom, paddingBottom: insets.bottom }]}
            onPress={() => {
              if (!active) router.replace(tab.path);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
          >
            {home ? (
              <>
                <HomeShape active={active} />
                <Text style={[styles.homeLabel, active && styles.homeLabelActive]}>{tab.label}</Text>
              </>
            ) : (
              <>
                {active && <View style={styles.indicator} />}
                <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
