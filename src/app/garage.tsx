import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LiveryCard } from '../components/LiveryCard';
import { LiveryPreview } from '../components/LiveryPreview';
import { ERAS } from '../data/eras';
import type { EraId } from '../data/eras';
import { LIVERIES, getLivery } from '../data/liveries';
import type { Livery } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { ownsLivery } from '../logic/garage';
import { Button, Card, Chips, ProgressBar } from '../ui/kit';
import { useGarage } from '../ui/useGarage';

type EraFilter = 'all' | EraId;

const useStyles = makeStyles((t) => ({
  container: { flex: 1 },
  content: { padding: t.spacing.md, gap: t.spacing.md, paddingBottom: t.spacing.xl },
  collection: { gap: t.spacing.sm },
  collectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  label: { ...t.type.label, color: t.colors.textMuted },
  count: { ...t.type.heading, color: t.colors.text },
  countTotal: { color: t.colors.textMuted, fontWeight: '600' },
  hint: { ...t.type.caption, color: t.colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: t.spacing.sm },
  empty: { alignItems: 'center', gap: t.spacing.md, paddingVertical: t.spacing.lg },
  emptyText: { ...t.type.body, color: t.colors.textMuted, textAlign: 'center' },
  numberCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  numberRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  stepper: {
    width: 40,
    height: 40,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.surface,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: { color: t.colors.text, fontSize: 24, fontWeight: '700' },
  number: { fontSize: 28, fontWeight: '800', color: t.colors.text, minWidth: 48, textAlign: 'center' },
}));

/** Your liveries: what you own, grouped by generation, with the car you are looking at shown big at the top. */
export default function GarageScreen() {
  const styles = useStyles();
  const { profile, equip, buy, changeNumber } = useGarage();
  // The livery shown on the big car. Tapping a card previews it; the button under the car equips it.
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [filter, setFilter] = useState<EraFilter>('all');

  if (!profile) return <View style={styles.container} />;

  const owned = LIVERIES.filter((l) => ownsLivery(profile, l));
  const previewed = getLivery(previewId ?? profile.car.liveryId);
  const countIn = (era: EraId) => `${owned.filter((l) => l.era === era).length}/${LIVERIES.filter((l) => l.era === era).length}`;
  // newest generation first, the equipped livery before everything else
  const eraRank = (l: Livery) => ERAS.findIndex((e) => e.id === l.era);
  const shown = owned
    .filter((l) => filter === 'all' || l.era === filter)
    .sort((a, b) => Number(b.id === profile.car.liveryId) - Number(a.id === profile.car.liveryId) || eraRank(b) - eraRank(a) || a.price - b.price);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
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

        <Card style={styles.collection}>
          <View style={styles.collectionHeader}>
            <Text style={styles.label}>Your collection</Text>
            <Text style={styles.count}>
              {owned.length}
              <Text style={styles.countTotal}> / {LIVERIES.length}</Text>
            </Text>
          </View>
          <ProgressBar fraction={owned.length / LIVERIES.length} />
          <Text style={styles.hint}>Earn credits by racing, then unlock more liveries in the Store.</Text>
        </Card>

        <Chips
          options={['all', ...ERAS.map((e) => e.id)] as readonly EraFilter[]}
          value={filter}
          onChange={setFilter}
          labelFor={(v) => (v === 'all' ? 'All' : ERAS.find((e) => e.id === v)!.name)}
          countFor={(v) => (v === 'all' ? `${owned.length}` : countIn(v))}
        />

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

        <Card style={styles.numberCard}>
          <Text style={styles.label}>Race number</Text>
          <View style={styles.numberRow}>
            <Pressable style={styles.stepper} onPress={() => changeNumber(-1)} hitSlop={8} accessibilityLabel="Lower race number">
              <Text style={styles.stepperText}>−</Text>
            </Pressable>
            <Text style={styles.number}>{profile.car.number}</Text>
            <Pressable style={styles.stepper} onPress={() => changeNumber(1)} hitSlop={8} accessibilityLabel="Raise race number">
              <Text style={styles.stepperText}>+</Text>
            </Pressable>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
