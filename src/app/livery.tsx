import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LiveryPreview } from '../components/LiveryPreview';
import { LIVERIES } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { ownsLivery } from '../logic/garage';
import { useGarage } from '../ui/useGarage';

const useStyles = makeStyles((t) => ({
  container: { flex: 1 },
  content: { padding: t.spacing.md, gap: t.spacing.md, paddingBottom: t.spacing.xl },
  missing: { ...t.type.body, color: t.colors.textMuted, textAlign: 'center', padding: t.spacing.lg },
}));

/** One livery in full: the 3D car, its race icon, and the button to buy or equip it. Opened from the Store. */
export default function LiveryScreen() {
  const styles = useStyles();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { profile, equip, buy } = useGarage();
  const livery = LIVERIES.find((l) => l.id === id);

  if (!profile) return <View style={styles.container} />;
  if (!livery) return <Text style={styles.missing}>That livery could not be found.</Text>;

  const owned = ownsLivery(profile, livery);
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <LiveryPreview
          livery={livery}
          number={profile.car.number}
          owned={owned}
          equipped={livery.id === profile.car.liveryId}
          credits={profile.credits}
          onEquip={() => equip(livery)}
          onBuy={() => buy(livery)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
