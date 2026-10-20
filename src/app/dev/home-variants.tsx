import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeDataFirst } from '../../components/home/variants/HomeDataFirst';
import { HomeInstrument } from '../../components/home/variants/HomeInstrument';
import { HomeStrip } from '../../components/home/variants/HomeStrip';
import { useHomeData } from '../../components/home/useHomeData';
import { Chip, IconTabBar } from '../../components/ui';
import type { IconTab } from '../../components/ui';
import { makeStyles } from '../../design/styles';

const VARIANTS = [
  { key: 'strip', label: '1 Strip' },
  { key: 'instrument', label: '2 Instrument' },
  { key: 'data', label: '3 Data-first' },
] as const;
type VariantKey = (typeof VARIANTS)[number]['key'];

const TABS: readonly IconTab[] = [
  { key: 'garage', label: 'Garage', icon: 'car-sport-outline', iconActive: 'car-sport' },
  { key: 'store', label: 'Store', icon: 'bag-handle-outline', iconActive: 'bag-handle' },
  { key: 'home', label: 'Home', icon: 'speedometer-outline', iconActive: 'speedometer', emphasized: true },
  { key: 'history', label: 'History', icon: 'time-outline', iconActive: 'time' },
  { key: 'settings', label: 'Settings', icon: 'settings-outline', iconActive: 'settings' },
];

const useStyles = makeStyles((t) => ({
  safe: { flex: 1 },
  toggles: { padding: t.spacing.screen, paddingBottom: t.spacing.sm, gap: t.spacing.sm, borderBottomWidth: t.border.hairline, borderBottomColor: t.colors.border },
  row: { gap: t.spacing.sm, paddingRight: t.spacing.md },
  hint: { ...t.typography.caption, color: t.colors.textMuted },
  body: { flex: 1 },
}));

/** Dev only: the three Home variants side by side in one switchable screen. Delete this and the losing variants once one is chosen. */
export default function HomeVariantsScreen() {
  const styles = useStyles();
  const data = useHomeData();
  const [variant, setVariant] = useState<VariantKey>('strip');
  const [segmented, setSegmented] = useState(false);
  const segments = segmented ? 10 : 1;
  const start = () => router.push('/create-session');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.toggles}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {VARIANTS.map((v) => (
            <Chip key={v.key} label={v.label} selected={variant === v.key} onPress={() => setVariant(v.key)} />
          ))}
        </ScrollView>
        {variant !== 'instrument' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            <Text style={styles.hint}>XP bar</Text>
            <Chip label="Continuous" selected={!segmented} onPress={() => setSegmented(false)} />
            <Chip label="Segmented" selected={segmented} onPress={() => setSegmented(true)} />
          </ScrollView>
        )}
      </View>
      <View style={styles.body}>
        {variant === 'strip' && <HomeStrip data={data} onStart={start} segments={segments} />}
        {variant === 'instrument' && <HomeInstrument data={data} onStart={start} />}
        {variant === 'data' && <HomeDataFirst data={data} onStart={start} segments={segments} />}
      </View>
      <IconTabBar tabs={TABS} activeKey="home" onSelect={() => {}} safeArea={false} />
    </SafeAreaView>
  );
}
