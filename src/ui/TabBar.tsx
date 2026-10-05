import { router, usePathname } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { makeStyles } from '../design/DesignProvider';

const TABS = [
  { label: 'Home', path: '/' },
  { label: 'Garage', path: '/garage' },
  { label: 'History', path: '/history' },
  { label: 'Settings', path: '/settings' },
] as const;

/** The screens that belong to the tab bar (and show it when the navigation style is "tabs"). */
export const TAB_PATHS: readonly string[] = TABS.map((t) => t.path);

const useStyles = makeStyles((t) => ({
  bar: {
    flexDirection: 'row',
    backgroundColor: t.colors.surface,
    borderTopWidth: t.border.hairline,
    borderTopColor: t.colors.border,
  },
  tab: { flex: 1, alignItems: 'center', paddingTop: t.spacing.sm + 2, paddingBottom: t.spacing.sm + 2, gap: 6 },
  indicator: { position: 'absolute', top: -t.border.hairline, left: '25%', right: '25%', height: 2, backgroundColor: t.colors.accent },
  label: { ...t.type.caption, color: t.colors.textMuted, fontWeight: '600', letterSpacing: 0.4 },
  labelActive: { color: t.colors.text },
}));

export function TabBar() {
  const styles = useStyles();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {TABS.map((tab) => {
        const active = pathname === tab.path;
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
            {active && <View style={styles.indicator} />}
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
