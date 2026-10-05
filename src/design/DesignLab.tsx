import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Segmented } from '../ui/kit';
import { makeStyles, useDesign } from './DesignProvider';
import { DESIGN_OPTIONS } from './tokens';

const useStyles = makeStyles((t) => ({
  tab: {
    position: 'absolute',
    right: 0,
    top: 150,
    backgroundColor: t.colors.surfaceRaised,
    borderWidth: t.border.hairline,
    borderRightWidth: 0,
    borderColor: t.colors.border,
    borderTopLeftRadius: t.radius.md,
    borderBottomLeftRadius: t.radius.md,
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.sm + 2,
    zIndex: 50,
  },
  tabText: { ...t.type.label, fontSize: 10, color: t.colors.text },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '50%',
    backgroundColor: t.colors.surfaceRaised,
    borderTopWidth: t.border.hairline,
    borderColor: t.colors.border,
    zIndex: 60,
  },
  content: { padding: t.spacing.md, gap: t.spacing.sm + 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...t.type.heading, color: t.colors.text },
  hint: { ...t.type.caption, color: t.colors.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
  rowLabel: { ...t.type.label, fontSize: 11, color: t.colors.textMuted, width: 78 },
  rowControl: { flex: 1 },
  actions: { flexDirection: 'row', gap: t.spacing.md, marginTop: t.spacing.sm },
  action: { ...t.type.body, color: t.colors.accent, fontWeight: '700' },
}));

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/** Development only: a floating panel to try different looks on the live screen. Settings are remembered. */
export function DesignLab() {
  return __DEV__ ? <DesignLabPanel /> : null;
}

function DesignLabPanel() {
  const styles = useStyles();
  const { settings, update, reset } = useDesign();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Pressable style={styles.tab} onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel="Open design lab">
        <Text style={styles.tabText}>Design</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.panel}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Design lab</Text>
          <Pressable onPress={() => setOpen(false)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close design lab">
            <Text style={styles.action}>Close</Text>
          </Pressable>
        </View>
        <Text style={styles.hint}>Applies right away and is remembered. Close this to compare screens.</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Corners</Text>
          <View style={styles.rowControl}>
            <Segmented compact options={DESIGN_OPTIONS.corners} value={settings.corners} onChange={(corners) => update({ corners })} labelFor={capitalize} />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Spacing</Text>
          <View style={styles.rowControl}>
            <Segmented compact options={DESIGN_OPTIONS.density} value={settings.density} onChange={(density) => update({ density })} labelFor={capitalize} />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Home</Text>
          <View style={styles.rowControl}>
            <Segmented compact options={DESIGN_OPTIONS.homeLayout} value={settings.homeLayout} onChange={(homeLayout) => update({ homeLayout })} labelFor={capitalize} />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Navigation</Text>
          <View style={styles.rowControl}>
            <Segmented
              compact
              options={DESIGN_OPTIONS.nav}
              value={settings.nav}
              onChange={(nav) => update({ nav })}
              labelFor={(nav) => (nav === 'tabs' ? 'Tab bar' : 'Links')}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={reset} hitSlop={10} accessibilityRole="button">
            <Text style={styles.action}>Reset to defaults</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
