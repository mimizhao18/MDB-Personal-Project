import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { glowHexFor } from '../components/car3d/glow';
import { LiveryCard } from '../components/LiveryCard';
import { LiveryPreview } from '../components/LiveryPreview';
import { AmbientGlow, Button, Chip, Divider, SectionLabel, SegmentedProgress } from '../components/ui';
import { ERAS } from '../data/eras';
import type { EraId } from '../data/eras';
import { LIVERIES, getLivery } from '../data/liveries';
import type { Livery } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { ownsLivery } from '../logic/garage';
import { useGarage } from '../ui/useGarage';

type EraFilter = 'all' | EraId;

const useStyles = makeStyles((t) => ({
  container: { flex: 1 },
  content: { padding: t.spacing.screen, gap: t.spacing.md, paddingBottom: t.spacing.xl },
  collection: { gap: t.spacing.sm },
  chips: { gap: t.spacing.sm, paddingRight: t.spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: t.spacing.sm },
  empty: { alignItems: 'center', gap: t.spacing.md, paddingVertical: t.spacing.lg },
  emptyText: { ...t.typography.body, color: t.colors.textMuted, textAlign: 'center' },
  numberRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  stepper: { width: t.size.touch, height: t.size.touch, borderRadius: t.radius.control, borderWidth: t.border.hairline, borderColor: t.glass.divider, alignItems: 'center', justifyContent: 'center' },
  stepperText: { ...t.typography.stat, color: t.colors.text },
  number: { ...t.typography.statLarge, color: t.colors.text, minWidth: t.size.control, textAlign: 'center' },
}));

/** Your liveries: the car you are looking at big at the top, then what you own, grouped newest generation first. */
export default function GarageScreen() {
  const styles = useStyles();
  const { profile, equip, buy, changeNumber } = useGarage();
  // The livery shown on the big car. Tapping a card previews it; the button under the car equips it.
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [filter, setFilter] = useState<EraFilter>('all');

  if (!profile) return <View style={styles.container} />;

  const owned = LIVERIES.filter((l) => ownsLivery(profile, l));
  const previewed = getLivery(previewId ?? profile.car.liveryId);
  const chipEras = ERAS.filter((e) => owned.some((l) => l.era === e.id)).map((e) => e.id);
  // newest generation first, the equipped livery before everything else
  const eraRank = (l: Livery) => ERAS.findIndex((e) => e.id === l.era);
  const shown = owned
    .filter((l) => filter === 'all' || l.era === filter)
    .sort((a, b) => Number(b.id === profile.car.liveryId) - Number(a.id === profile.car.liveryId) || eraRank(b) - eraRank(a) || a.price - b.price);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <AmbientGlow color={glowHexFor(previewed.primary, previewed.secondary)} focus={0.4} />
      <ScrollView contentContainerStyle={styles.content}>
        <LiveryPreview
          livery={previewed}
          number={profile.car.number}
          owned={ownsLivery(profile, previewed)}
          equipped={previewed.id === profile.car.liveryId}
          credits={profile.credits}
          onEquip={() => equip(previewed)}
          onBuy={() => buy(previewed)}
        />

        <View style={styles.collection}>
          <SectionLabel trailing={`${owned.length} / ${LIVERIES.length}`}>Your collection</SectionLabel>
          <SegmentedProgress fraction={owned.length / LIVERIES.length} accessibilityLabel="Liveries collected" />
        </View>

        {chipEras.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {(['all', ...chipEras] as readonly EraFilter[]).map((option) => (
              <Chip key={option} label={option === 'all' ? 'All' : ERAS.find((e) => e.id === option)!.name} selected={filter === option} onPress={() => setFilter(option)} />
            ))}
          </ScrollView>
        )}

        {shown.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>You do not own any liveries from this generation yet.</Text>
            <Button label="Open the Store" variant="secondary" onPress={() => router.replace('/store')} />
          </View>
        ) : (
          <View style={styles.grid}>
            {shown.map((livery) => (
              <LiveryCard
                key={livery.id}
                livery={livery}
                number={profile.car.number}
                owned
                equipped={livery.id === profile.car.liveryId}
                previewing={livery.id === previewed.id}
                canAfford
                showEra
                onPress={() => setPreviewId(livery.id)}
              />
            ))}
          </View>
        )}

        <Divider />
        <View style={styles.numberRow}>
          <SectionLabel>Race number</SectionLabel>
          <View style={styles.stepperRow}>
            <Pressable style={styles.stepper} onPress={() => changeNumber(-1)} accessibilityRole="button" accessibilityLabel="Lower race number">
              <Text style={styles.stepperText}>−</Text>
            </Pressable>
            <Text style={styles.number}>{profile.car.number}</Text>
            <Pressable style={styles.stepper} onPress={() => changeNumber(1)} accessibilityRole="button" accessibilityLabel="Raise race number">
              <Text style={styles.stepperText}>+</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
