import { Text, View } from 'react-native';

import { getEra } from '../data/eras';
import type { Livery } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { Credits } from '../ui/Credits';
import { Button, Card } from '../ui/kit';
import { colors } from '../theme';
import { CarImage } from './CarIcon';
import { HeroCar } from './HeroCar';

const useStyles = makeStyles((t) => ({
  stack: { gap: t.spacing.md },
  // fills the card edge to edge (past its padding) so the 3D car's floor glow has room to fade out before the edge
  heroBleed: { alignSelf: 'stretch', marginHorizontal: -t.spacing.md, marginTop: -t.spacing.xs },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: t.spacing.md },
  titleBlock: { flex: 1, gap: 2 },
  name: { ...t.type.title, fontSize: 22, color: t.colors.text },
  meta: { ...t.type.caption, color: t.colors.textMuted },
  action: { marginTop: t.spacing.md },
  iconCard: { alignItems: 'center', gap: t.spacing.sm },
  label: { ...t.type.label, color: t.colors.textMuted, alignSelf: 'flex-start' },
  // the race icon on a plain dark panel: the same car you see from above on the track, at a size you can inspect
  iconPanel: { alignSelf: 'stretch', alignItems: 'center', paddingVertical: t.spacing.sm, backgroundColor: t.colors.surfaceRaised, borderRadius: t.radius.md },
  caption: { ...t.type.caption, color: t.colors.textMuted, textAlign: 'center' },
}));

/**
 * The livery being looked at: the 3D car you can spin with its name and the equip/buy button, and below it the 2D race
 * icon at a decent size. Used by both the Garage and the Store.
 */
export function LiveryPreview({
  livery,
  number,
  owned,
  equipped,
  credits,
  onEquip,
  onBuy,
}: {
  livery: Livery;
  number: number;
  owned: boolean;
  equipped: boolean;
  credits: number;
  onEquip: () => void;
  onBuy: () => void;
}) {
  const styles = useStyles();
  const era = getEra(livery.era);
  const canAfford = credits >= livery.price;
  const car = { liveryId: livery.id, number };
  return (
    <View style={styles.stack}>
      <Card>
        <View style={styles.heroBleed}>
          <HeroCar car={car} height={220} background={colors.surface} />
        </View>
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text style={styles.name}>{livery.name}</Text>
            <Text style={styles.meta} numberOfLines={1}>
              {era.name} car · {livery.team}
            </Text>
          </View>
          <Credits amount={credits} />
        </View>
        <View style={styles.action}>
          {equipped ? (
            <Button label="✓  Equipped" variant="secondary" disabled onPress={() => {}} accessibilityLabel="Equipped" />
          ) : owned ? (
            <Button label="Equip" onPress={onEquip} />
          ) : (
            <Button
              label={canAfford ? `Buy for ${livery.price} credits` : `${livery.price} credits (need ${livery.price - credits} more)`}
              variant={canAfford ? 'primary' : 'secondary'}
              onPress={onBuy}
            />
          )}
        </View>
      </Card>

      <Card style={styles.iconCard}>
        <Text style={styles.label}>Race icon</Text>
        <View style={styles.iconPanel}>
          <CarImage car={car} size={300} detail="full" showNumber />
        </View>
        <Text style={styles.caption}>How this car looks from above on the track</Text>
      </Card>
    </View>
  );
}
