import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { makeStyles, useTheme } from '../../design/styles';
import type { IconName } from './Button';

export interface IconTab {
  key: string;
  label: string;
  /** Outline icon, shown when the tab is not active. */
  icon: IconName;
  /** Filled icon, shown when the tab is active. */
  iconActive: IconName;
  /** A slightly larger icon (the Home tab). */
  emphasized?: boolean;
}

const useStyles = makeStyles((t) => ({
  bar: { flexDirection: 'row', backgroundColor: t.colors.background, borderTopWidth: t.border.hairline, borderTopColor: t.colors.border },
  tab: { flex: 1, minHeight: t.size.tabBar, alignItems: 'center', justifyContent: 'center', gap: 0 },
  // every icon sits in a box as tall as the emphasized one, so all the labels line up
  iconBox: { height: t.size.icon + t.spacing.sm, alignItems: 'center', justifyContent: 'center' },
  indicator: { position: 'absolute', top: -t.border.hairline, left: t.spacing.md, right: t.spacing.md, height: 2, backgroundColor: t.colors.accent },
  label: { ...t.typography.label, fontSize: 10, letterSpacing: 0.6, color: t.colors.textMuted },
  labelActive: { color: t.colors.accentOnDark },
}));

/** A flat, rectangular tab bar: icon over label, a hairline on top, and the active tab in the accent with a thin line above it. */
export function IconTabBar({
  tabs,
  activeKey,
  onSelect,
  safeArea = true,
}: {
  tabs: readonly IconTab[];
  activeKey: string;
  onSelect: (key: string) => void;
  /** Add the bottom safe-area inset (the home indicator). Turn off when the bar is shown inside a page. */
  safeArea?: boolean;
}) {
  const styles = useStyles();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: safeArea ? insets.bottom : 0 }]} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => {
              if (!active) onSelect(tab.key);
            }}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
          >
            {active && <View style={styles.indicator} />}
            <View style={styles.iconBox}>
              <Ionicons
                name={active ? tab.iconActive : tab.icon}
                size={tab.emphasized ? t.size.icon + t.spacing.sm : t.size.icon}
                color={active ? t.colors.accentOnDark : t.colors.textMuted}
              />
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
