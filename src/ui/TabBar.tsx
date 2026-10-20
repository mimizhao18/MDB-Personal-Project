import { router, usePathname } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { makeStyles } from '../design/styles';

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

const useStyles = makeStyles((t) => ({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.colors.surface,
    borderTopWidth: t.border.hairline,
    borderTopColor: t.colors.border,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 56, gap: 6 },
  indicator: { position: 'absolute', top: -t.border.hairline, left: '30%', right: '30%', height: 2, backgroundColor: t.colors.accent },
  label: { ...t.type.caption, color: t.colors.textMuted, fontWeight: '600', letterSpacing: 0.4 },
  labelActive: { color: t.colors.text },
  // the Home tab is a small pill: dark red with red text when you are elsewhere, solid red with white text when you are on Home
  homePill: { paddingHorizontal: t.spacing.md + 2, height: 34, borderRadius: t.radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.accentSoft },
  homePillActive: { backgroundColor: t.colors.accent },
  homeLabel: { fontSize: 14, fontWeight: '700', letterSpacing: 0.3, color: t.colors.accentSoftText },
  homeLabelActive: { color: t.colors.accentText },
}));

export function TabBar() {
  const styles = useStyles();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {TABS.map((tab) => {
        const active = pathname === tab.path;
        const home = 'home' in tab;
        return (
          <Pressable
            key={tab.path}
            style={styles.tab}
            onPress={() => {
              if (!active) router.replace(tab.path);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
          >
            {home ? (
              <View style={[styles.homePill, active && styles.homePillActive]}>
                <Text style={[styles.homeLabel, active && styles.homeLabelActive]}>{tab.label}</Text>
              </View>
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
