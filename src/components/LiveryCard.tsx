import { Pressable, Text, View } from 'react-native';

import { getEra } from '../data/eras';
import type { Livery } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { Credits } from '../ui/Credits';
import { CarImage } from './CarIcon';

const useStyles = makeStyles((t) => ({
  // two columns with a gap between; a lone last card stays on the left instead of stretching
  wrap: { width: '48.5%' },
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.lg,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
    paddingTop: t.spacing.sm,
    paddingBottom: t.spacing.md,
    paddingHorizontal: t.spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  cardPreviewing: { borderColor: t.colors.textMuted },
  cardEquipped: { borderColor: t.colors.accent, borderWidth: t.border.selected },
  iconArea: { alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', height: 86, overflow: 'hidden' },
  name: { ...t.type.heading, fontSize: 15, color: t.colors.text, textAlign: 'center' },
  era: { ...t.type.caption, color: t.colors.textMuted, marginTop: -2 },
  statusRow: { height: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: t.spacing.xs },
  equipped: { ...t.type.label, fontSize: 12, color: t.colors.accent, fontWeight: '700' },
  owned: { ...t.type.label, fontSize: 12, color: t.colors.textMuted },
  price: { ...t.type.caption, fontWeight: '700', color: t.colors.text },
  priceOut: { color: t.colors.textMuted },
}));

/** One livery as a card: its race icon, name, generation, and whether it is equipped, owned, or what it costs. */
export function LiveryCard({
  livery,
  number,
  owned,
  equipped,
  previewing,
  canAfford,
  showEra = false,
  onPress,
}: {
  livery: Livery;
  number: number;
  owned: boolean;
  equipped: boolean;
  previewing: boolean;
  canAfford: boolean;
  /** Show the generation under the name (when the cards are not already grouped by generation). */
  showEra?: boolean;
  onPress: () => void;
}) {
  const styles = useStyles();
  const era = getEra(livery.era);
  return (
    <Pressable
      style={styles.wrap}
      onPress={onPress}
      accessibilityLabel={`${livery.name} ${era.name} livery, ${equipped ? 'equipped' : owned ? 'owned' : `${livery.price} credits`}. Tap to preview.`}
    >
      <View style={[styles.card, previewing && styles.cardPreviewing, equipped && styles.cardEquipped]}>
        <View style={styles.iconArea}>
          <CarImage car={{ liveryId: livery.id, number }} size={170} detail="simple" showNumber={false} />
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {livery.name}
        </Text>
        {showEra && <Text style={styles.era}>{era.name} car</Text>}
        <View style={styles.statusRow}>
          {owned ? (
            <Text style={equipped ? styles.equipped : styles.owned}>{equipped ? 'Equipped' : 'Owned'}</Text>
          ) : (
            <Credits amount={livery.price} size={14} textStyle={[styles.price, !canAfford && styles.priceOut]} />
          )}
        </View>
      </View>
    </Pressable>
  );
}
