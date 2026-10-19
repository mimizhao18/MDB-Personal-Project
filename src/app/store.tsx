import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LiveryCard } from '../components/LiveryCard';
import { ERAS } from '../data/eras';
import type { EraId } from '../data/eras';
import { LIVERIES } from '../data/liveries';
import type { Livery } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { ownsLivery } from '../logic/garage';
import { Credits } from '../ui/Credits';
import { Button, Card, Chips, SortRow } from '../ui/kit';
import { useGarage } from '../ui/useGarage';

type Filter = 'all' | 'affordable' | EraId;
type Sort = 'era' | 'low' | 'high';
const SORTS: readonly Sort[] = ['era', 'low', 'high'];
const SORT_LABELS: Record<Sort, string> = { era: 'Generation', low: 'Price ↑', high: 'Price ↓' };

const useStyles = makeStyles((t) => ({
  container: { flex: 1 },
  content: { padding: t.spacing.md, gap: t.spacing.md, paddingBottom: t.spacing.xl },
  balance: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  balanceText: { gap: 2 },
  label: { ...t.type.label, color: t.colors.textMuted },
  balanceAmount: { ...t.type.title, color: t.colors.text },
  stat: { ...t.type.caption, color: t.colors.textMuted, textAlign: 'right' },
  group: { gap: t.spacing.sm },
  groupHeader: { flexDirection: 'row', alignItems: 'baseline', gap: t.spacing.sm },
  groupName: { ...t.type.heading, color: t.colors.text },
  groupYears: { ...t.type.caption, color: t.colors.textMuted, flexShrink: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: t.spacing.sm },
  empty: { alignItems: 'center', gap: t.spacing.md, paddingVertical: t.spacing.lg },
  emptyText: { ...t.type.body, color: t.colors.textMuted, textAlign: 'center' },
}));

/** The Store: every livery you do not own yet, to look at on the 3D car and buy with credits. */
export default function StoreScreen() {
  const styles = useStyles();
  const { profile } = useGarage();
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('era');

  if (!profile) return <View style={styles.container} />;

  const forSale = LIVERIES.filter((l) => !ownsLivery(profile, l));
  const affordable = (l: Livery) => l.price <= profile.credits;
  const shown = forSale
    .filter((l) => (filter === 'all' ? true : filter === 'affordable' ? affordable(l) : l.era === filter))
    .sort((a, b) => (sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0));
  const groups = sort === 'era' ? ERAS.map((era) => ({ era, liveries: shown.filter((l) => l.era === era.id) })).filter((g) => g.liveries.length > 0) : [{ era: null, liveries: shown }];

  const filterOptions: readonly Filter[] = ['all', 'affordable', ...ERAS.filter((e) => forSale.some((l) => l.era === e.id)).map((e) => e.id)];
  const countFor = (v: Filter) =>
    String(v === 'all' ? forSale.length : v === 'affordable' ? forSale.filter(affordable).length : forSale.filter((l) => l.era === v).length);
  const labelFor = (v: Filter) => (v === 'all' ? 'All' : v === 'affordable' ? 'Affordable' : ERAS.find((e) => e.id === v)!.name);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.balance}>
          <View style={styles.balanceText}>
            <Text style={styles.label}>Your credits</Text>
            <Credits amount={profile.credits} size={22} textStyle={styles.balanceAmount} />
          </View>
          <Text style={styles.stat}>
            {LIVERIES.length - forSale.length} of {LIVERIES.length} liveries owned
          </Text>
        </Card>

        {forSale.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>You own every livery so far. More are on the way.</Text>
            <Button label="Back to the Garage" variant="secondary" onPress={() => router.replace('/garage')} />
          </View>
        ) : (
          <>
            <Chips options={filterOptions} value={filter} onChange={setFilter} labelFor={labelFor} countFor={countFor} />
            <SortRow options={SORTS} value={sort} onChange={setSort} labelFor={(s) => SORT_LABELS[s]} />

            {shown.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>{filter === 'affordable' ? 'Nothing you can afford yet. Keep racing to earn more credits!' : 'Nothing for sale here.'}</Text>
              </View>
            ) : (
              groups.map(({ era, liveries }) => (
                <View key={era?.id ?? 'flat'} style={styles.group}>
                  {era && (
                    <View style={styles.groupHeader}>
                      <Text style={styles.groupName}>{era.name}</Text>
                      <Text style={styles.groupYears} numberOfLines={1}>
                        {era.years}
                      </Text>
                    </View>
                  )}
                  <View style={styles.grid}>
                    {liveries.map((livery) => (
                      <LiveryCard
                        key={livery.id}
                        livery={livery}
                        number={profile.car.number}
                        owned={false}
                        equipped={false}
                        previewing={false}
                        canAfford={affordable(livery)}
                        showEra={era === null}
                        onPress={() => router.push({ pathname: '/livery', params: { id: livery.id } })}
                      />
                    ))}
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
