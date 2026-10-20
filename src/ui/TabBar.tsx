import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line, Polygon } from 'react-native-svg';

import { Glass } from '../components/ui';
import { makeStyles, useTheme } from '../design/styles';

// Garage and Store on the left, History and Settings on the right, and Home in the middle on a trapezoid.
const TABS = [
  { label: 'Garage', path: '/garage' },
  { label: 'Store', path: '/store' },
  { label: 'Home', path: '/', home: true },
  { label: 'History', path: '/history' },
  { label: 'Settings', path: '/settings' },
] as const;

/** The screens that belong to the tab bar (and show it when the navigation style is "tabs"). */
export const TAB_PATHS: readonly string[] = TABS.map((t) => t.path);

const useStyles = makeStyles((t) => ({
  // a glass strip: the panel's own padding is removed so the tabs fill it
  bar: { flexDirection: 'row', alignItems: 'flex-start', padding: 0 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  homeTab: { flex: 1.3 },
  // the thin accent line over the active tab
  indicator: { position: 'absolute', top: -t.border.hairline, left: t.spacing.md, right: t.spacing.md, height: 2, backgroundColor: t.colors.accent },
  // a little smaller and tighter than the usual label so "SETTINGS" fits with room to spare
  label: { ...t.typography.label, fontSize: 10, letterSpacing: 0.6, color: t.colors.textMuted },
  labelActive: { color: t.colors.accentOnDark },
  homeShape: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  homeLabel: { ...t.typography.label, fontFamily: t.typography.button.fontFamily, fontSize: 12, letterSpacing: 0.6, color: t.colors.accentOnDark },
  homeLabelActive: { color: t.colors.accentText },
}));

/**
 * The Home tab's backdrop: a trapezoid, wider at the bottom, with a thin red line outside each slanted side (the same
 * double outline as the Start Race button). The shape inside is dark red when idle and solid red on Home.
 */
function HomeShape({ active }: { active: boolean }) {
  const styles = useStyles();
  const t = useTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;
  const slant = t.spacing.md;
  const gap = t.spacing.xs;
  const o = t.border.hairline / 2;
  return (
    <View style={styles.homeShape} pointerEvents="none" onLayout={(e) => setSize(e.nativeEvent.layout)}>
      {width > 0 && (
        <Svg width={width} height={height}>
          <Polygon
            points={`${slant + gap},0 ${width - slant - gap},0 ${width - gap},${height} ${gap},${height}`}
            fill={active ? t.colors.accent : t.colors.accentTint}
          />
          <Line x1={slant} y1={0} x2={o} y2={height} stroke={t.colors.accent} strokeOpacity={t.opacity.dimmed} strokeWidth={t.border.hairline} />
          <Line x1={width - slant} y1={0} x2={width - o} y2={height} stroke={t.colors.accent} strokeOpacity={t.opacity.dimmed} strokeWidth={t.border.hairline} />
        </Svg>
      )}
    </View>
  );
}

/** A flat glass tab bar: a lit edge on top, labels only, the active tab in the accent with a thin line above it. */
export function TabBar({ activePath }: { activePath?: string } = {}) {
  const styles = useStyles();
  const t = useTheme();
  const routerPath = usePathname();
  const pathname = activePath ?? routerPath;
  const insets = useSafeAreaInsets();

  return (
    <View accessibilityRole="tablist">
      <Glass corner="flat" style={styles.bar}>
      {TABS.map((tab) => {
        const active = pathname === tab.path;
        const home = 'home' in tab;
        return (
          <Pressable
            key={tab.path}
            style={[styles.tab, home && styles.homeTab, { height: t.size.tabBar + insets.bottom, paddingBottom: insets.bottom }]}
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
      </Glass>
    </View>
  );
}
