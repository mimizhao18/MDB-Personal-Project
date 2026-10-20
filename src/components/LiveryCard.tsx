import { Pressable, Text, View } from 'react-native';

import { getEra } from '../data/eras';
import type { Livery } from '../data/liveries';
import { makeStyles, useTheme } from '../design/styles';
import { CarImage } from './CarIcon';
import { CreditAmount } from './ui';

const useStyles = makeStyles((t) => ({
  // two columns with a gap between; a lone last card stays on the left instead of stretching
  wrap: { width: '48.5%', flexDirection: 'column' },
  card: {
    flex: 1,
    borderRadius: t.radius.control,
    borderWidth: t.border.hairline,
    borderColor: t.glass.divider,
    backgroundColor: 'transparent',
    paddingTop: t.spacing.xs,
    paddingBottom: t.spacing.sm,
    paddingHorizontal: t.spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  cardPreviewing: { borderColor: t.colors.textSecondary },
  cardEquipped: { borderColor: t.colors.accent },
  // a livery you cannot afford yet is dimmed
  cardDimmed: { opacity: t.opacity.unaffordable },
  iconArea: { alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', height: t.size.cardCar, overflow: 'hidden' },
  name: { ...t.typography.body, fontFamily: t.typography.heading.fontFamily, color: t.colors.text, textAlign: 'center' },
  era: { ...t.typography.caption, color: t.colors.textMuted },
  statusRow: { minHeight: t.size.icon, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  equipped: { ...t.typography.metaLabel, color: t.colors.accentOnDark },
}));

/** One livery as a card: its race icon, name and generation, and either "Equipped" or, if you do not own it, its price. Owned liveries need no label. */
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
  const t = useTheme();
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
          <CarImage car={{ liveryId: livery.id, number }} size={t.size.cardCarWide} detail="simple" showNumber={false} />
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {livery.name}
        </Text>
        {showEra && <Text style={styles.era}>{era.name} car</Text>}
        {(equipped || !owned) && (
          <View style={styles.statusRow}>{equipped ? <Text style={styles.equipped}>Equipped</Text> : <CreditAmount amount={livery.price} />}</View>
        )}
      </View>
    </Pressable>
  );
}
