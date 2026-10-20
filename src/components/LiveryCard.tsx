import { Pressable, Text, View } from 'react-native';

import { getEra } from '../data/eras';
import type { Livery } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { CarImage } from './CarIcon';
import { CreditAmount } from './ui';

const useStyles = makeStyles((t) => ({
  // two columns with a gap between; a lone last card stays on the left instead of stretching
  wrap: { width: '48.5%' },
  card: {
    borderRadius: t.radius.control,
    borderWidth: t.border.hairline,
    borderColor: t.glass.divider,
    paddingTop: t.spacing.sm,
    paddingBottom: t.spacing.md,
    paddingHorizontal: t.spacing.sm,
    alignItems: 'center',
    gap: t.spacing.xs,
  },
  cardPreviewing: { borderColor: t.colors.textSecondary },
  cardEquipped: { borderColor: t.colors.accent },
  // a livery you cannot afford yet is dimmed
  cardDimmed: { opacity: t.opacity.dimmed },
  iconArea: { alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', height: 86, overflow: 'hidden' },
  name: { ...t.typography.body, fontFamily: t.typography.heading.fontFamily, color: t.colors.text, textAlign: 'center' },
  era: { ...t.typography.caption, color: t.colors.textMuted },
  statusRow: { minHeight: t.size.icon, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: t.spacing.xs },
  equipped: { ...t.typography.metaLabel, color: t.colors.accentOnDark },
  owned: { ...t.typography.metaLabel, color: t.colors.textMuted },
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
      accessibilityRole="button"
      accessibilityLabel={`${livery.name} ${era.name} livery, ${equipped ? 'equipped' : owned ? 'owned' : `${livery.price} credits`}. Tap to preview.`}
    >
      <View style={[styles.card, previewing && styles.cardPreviewing, equipped && styles.cardEquipped, !owned && !canAfford && styles.cardDimmed]}>
        <View style={styles.iconArea}>
          <CarImage car={{ liveryId: livery.id, number }} size={170} detail="simple" showNumber={false} />
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {livery.name}
        </Text>
        {showEra && <Text style={styles.era}>{era.name} car</Text>}
        <View style={styles.statusRow}>
          {owned ? <Text style={equipped ? styles.equipped : styles.owned}>{equipped ? 'Equipped' : 'Owned'}</Text> : <CreditAmount amount={livery.price} />}
        </View>
      </View>
    </Pressable>
  );
}
