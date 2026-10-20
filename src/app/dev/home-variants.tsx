import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeBrackets } from '../../components/home/variants/HomeBrackets';
import { HomeOpen } from '../../components/home/variants/HomeOpen';
import { HomeRail } from '../../components/home/variants/HomeRail';
import { HomeSoft } from '../../components/home/variants/HomeSoft';
import { HomeStrips } from '../../components/home/variants/HomeStrips';
import { useHomeData } from '../../components/home/useHomeData';
import { Chip } from '../../components/ui';
import { makeStyles } from '../../design/styles';
import { TabBar } from '../../ui/TabBar';

const VARIANTS = [
  { key: '1', label: '1 Brackets' },
  { key: '2', label: '2 Rail' },
  { key: '3', label: '3 Soft' },
  { key: '4', label: '4 Open' },
  { key: '5', label: '5 Strips' },
] as const;
type VariantKey = (typeof VARIANTS)[number]['key'];

const useStyles = makeStyles((t) => ({
  safe: { flex: 1 },
  toggles: { padding: t.spacing.sm, borderBottomWidth: t.border.hairline, borderBottomColor: t.colors.border },
  row: { gap: t.spacing.sm },
  body: { flex: 1 },
}));

/** Dev only: five Home layouts in one switchable screen (add ?v=3 to open one directly, &bare=1 to hide the switcher). Delete this and the losing variants once one is chosen. */
export default function HomeVariantsScreen() {
  const styles = useStyles();
  const data = useHomeData();
  const params = useLocalSearchParams<{ v?: string; bare?: string }>();
  const [variant, setVariant] = useState<VariantKey>(VARIANTS.some((v) => v.key === params.v) ? (params.v as VariantKey) : '1');
  const start = () => router.push('/create-session');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {params.bare !== '1' && (
        <View style={styles.toggles}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {VARIANTS.map((v) => (
              <Chip key={v.key} label={v.label} selected={variant === v.key} onPress={() => setVariant(v.key)} />
            ))}
          </ScrollView>
        </View>
      )}
      <View style={styles.body}>
        {variant === '1' && <HomeBrackets data={data} onStart={start} />}
        {variant === '2' && <HomeRail data={data} onStart={start} />}
        {variant === '3' && <HomeSoft data={data} onStart={start} />}
        {variant === '4' && <HomeOpen data={data} onStart={start} />}
        {variant === '5' && <HomeStrips data={data} onStart={start} />}
      </View>
      <TabBar activePath="/" />
    </SafeAreaView>
  );
}
