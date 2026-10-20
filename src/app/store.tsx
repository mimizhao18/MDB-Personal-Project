import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LiveryCard } from '../components/LiveryCard';
import { ERAS } from '../data/eras';
import { LIVERIES } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { ownsLivery } from '../logic/garage';
import { Credits } from '../ui/Credits';
import { Button } from '../ui/kit';
import { useGarage } from '../ui/useGarage';

const useStyles = makeStyles((t) => ({
  container: { flex: 1 },
  content: { padding: t.spacing.md, gap: t.spacing.lg, paddingBottom: t.spacing.xl },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { ...t.type.caption, color: t.colors.textMuted },
  group: { gap: t.spacing.sm },
  groupHeader: { flexDirection: 'row', alignItems: 'baseline', gap: t.spacing.sm },
  groupName: { ...t.type.heading, color: t.colors.text },
  groupYears: { ...t.type.caption, color: t.colors.textMuted, flexShrink: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: t.spacing.sm },
  empty: { alignItems: 'center', gap: t.spacing.md, paddingVertical: t.spacing.xl },
  emptyText: { ...t.type.body, color: t.colors.textMuted, textAlign: 'center' },
}));

/** The Store: every livery you do not own yet, by generation. Tap one to see it in full and buy it. */
export default function StoreScreen() {
  const styles = useStyles();
  const { profile } = useGarage();

  if (!profile) return <View style={styles.container} />;

  const forSale = LIVERIES.filter((l) => !ownsLivery(profile, l));
  const groups = ERAS.map((era) => ({ era, liveries: forSale.filter((l) => l.era === era.id) })).filter((g) => g.liveries.length > 0);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.top}>
          <Text style={styles.count}>{forSale.length === 0 ? 'Nothing left to buy' : `${forSale.length} liveries for sale`}</Text>
          <Credits amount={profile.credits} />
        </View>

        {forSale.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>You own every livery so far. More are on the way.</Text>
            <Button label="Back to the Garage" variant="secondary" onPress={() => router.replace('/garage')} />
          </View>
        ) : (
          groups.map(({ era, liveries }) => (
            <View key={era.id} style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{era.name}</Text>
                <Text style={styles.groupYears} numberOfLines={1}>
                  {era.years}
                </Text>
              </View>
              <View style={styles.grid}>
                {liveries.map((livery) => (
                  <LiveryCard
                    key={livery.id}
                    livery={livery}
                    number={profile.car.number}
                    owned={false}
                    equipped={false}
                    previewing={false}
                    canAfford={livery.price <= profile.credits}
                    onPress={() => router.push({ pathname: '/livery', params: { id: livery.id } })}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
