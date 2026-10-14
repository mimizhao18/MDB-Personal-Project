import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarImage } from '../components/CarIcon';
import { HeroCar } from '../components/HeroCar';
import { ERAS } from '../data/eras';
import { LIVERIES, MAX_CAR_NUMBER, MIN_CAR_NUMBER, getLivery } from '../data/liveries';
import type { Livery } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { buyLivery, equipLivery, ownsLivery, setCarNumber } from '../logic/garage';
import type { GarageResult } from '../logic/garage';
import type { PlayerProfile } from '../models/types';
import { getProfile, saveProfile } from '../storage/profile';
import { showAlert } from '../ui/alert';
import { Credits } from '../ui/Credits';
import { Button, Card, Segmented } from '../ui/kit';
import { colors } from '../theme';

type Tab = 'Owned' | 'Store';
const TABS: readonly Tab[] = ['Owned', 'Store'];

const ROAD_COLOR = '#E6E6E6';
const KERB_COLOR = '#2B2B2B';
// the car icon is drawn on a 68 unit square for a 26 unit wide road (see TrackView)
const ICON_UNITS = 68;
const ROAD_UNITS = 26;
const KERB_UNITS = 2;

/** A car at a given size on a piece of road that is in proportion to it. */
function RaceStage({ car, size, caption }: { car: { liveryId: string; number: number }; size: number; caption: string }) {
  const styles = useStyles();
  const road = Math.round((size * ROAD_UNITS) / ICON_UNITS);
  const kerb = Math.max(1, Math.round((size * KERB_UNITS) / ICON_UNITS));
  return (
    <View style={styles.raceCell}>
      <View style={[styles.raceStage, { height: size }]}>
        <View style={[styles.roadBand, { top: (size - road) / 2 - kerb, height: road + kerb * 2, borderTopWidth: kerb, borderBottomWidth: kerb }]} />
        <CarImage car={car} size={size} detail="simple" showNumber={false} />
      </View>
      <Text style={styles.raceCaption}>{caption}</Text>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: { flex: 1 },
  content: { padding: t.spacing.md, gap: t.spacing.md },
  preview: { alignItems: 'center', gap: t.spacing.xs },
  // fills the card edge to edge (past its padding) so the 3D car's floor glow has room to fade out before the edge
  heroBleed: { alignSelf: 'stretch', marginHorizontal: -t.spacing.md },
  previewHeader: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  previewAction: { alignSelf: 'stretch', marginTop: t.spacing.sm },
  liveryName: { ...t.type.title, fontSize: 22, color: t.colors.text },
  raceCard: { gap: t.spacing.md },
  raceLabel: { ...t.type.label, color: t.colors.textMuted },
  raceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: t.spacing.md },
  raceCell: { flex: 1, alignItems: 'center', gap: t.spacing.sm },
  // a stretch of road behind the car, drawn to the same proportions as on the Race screen
  raceStage: { alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  roadBand: { position: 'absolute', left: 0, right: 0, backgroundColor: ROAD_COLOR, borderColor: KERB_COLOR },
  raceCaption: { ...t.type.caption, color: t.colors.textMuted },
  group: { gap: t.spacing.sm },
  groupHeader: { flexDirection: 'row', alignItems: 'baseline', gap: t.spacing.sm, marginTop: t.spacing.xs },
  groupName: { ...t.type.heading, color: t.colors.text },
  groupYears: { ...t.type.caption, color: t.colors.textMuted },
  empty: { ...t.type.body, color: t.colors.textMuted, textAlign: 'center', paddingVertical: t.spacing.lg },
  nameBlock: { flex: 1, gap: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm },
  cardWrap: { flexGrow: 1, flexBasis: '45%' },
  card: { alignItems: 'center', gap: t.spacing.xs, paddingVertical: t.spacing.md },
  cardPreviewing: { borderColor: t.colors.textMuted },
  cardEquipped: { borderColor: t.colors.text, borderWidth: t.border.selected },
  cardName: { ...t.type.heading, fontSize: 15, color: t.colors.text },
  cardStatus: { ...t.type.caption, color: t.colors.textMuted },
  cardStatusEquipped: { color: t.colors.text, fontWeight: '700' },
  cardPrice: { ...t.type.caption, fontWeight: '600', color: t.colors.textMuted },
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

export default function GarageScreen() {
  const styles = useStyles();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  // The livery shown on the big car. Tapping a card previews it, owned or not; the button below equips or buys it.
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('Owned');

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  if (!profile) return <View style={styles.container} />;

  const apply = async (result: GarageResult) => {
    if (!result.ok) {
      const message =
        result.reason === 'not-enough-credits' ? 'You do not have enough credits yet. Keep racing to earn more!' : 'That change is not possible.';
      showAlert('Cannot do that', message);
      return;
    }
    setProfile(result.profile);
    try {
      await saveProfile(result.profile);
    } catch {
      showAlert('Could not save', 'Your change was not saved. Please try again.');
    }
  };

  const equip = (livery: Livery) => {
    void apply(equipLivery(profile, livery));
  };

  const buy = (livery: Livery) => {
    showAlert(`Buy the ${livery.name} livery?`, `${livery.price} credits. You have ${profile.credits}.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: `Buy for ${livery.price}`,
        onPress: () => {
          const bought = buyLivery(profile, livery);
          if (!bought.ok) {
            void apply(bought);
            return;
          }
          void apply(equipLivery(bought.profile, livery));
        },
      },
    ]);
  };

  const changeNumber = (delta: number) => {
    const next = profile.car.number + delta;
    if (next < MIN_CAR_NUMBER || next > MAX_CAR_NUMBER) return;
    void apply(setCarNumber(profile, next, MIN_CAR_NUMBER, MAX_CAR_NUMBER));
  };

  const previewed = getLivery(previewId ?? profile.car.liveryId);
  const previewOwned = ownsLivery(profile, previewed);
  const previewEquipped = previewed.id === profile.car.liveryId;
  const canAfford = profile.credits >= previewed.price;
  const previewCar = { liveryId: previewed.id, number: profile.car.number };
  // the liveries on show: the ones you own, or the ones for sale, grouped by generation of car
  const groups = ERAS.map((era) => ({
    era,
    liveries: LIVERIES.filter((l) => l.era === era.id && ownsLivery(profile, l) === (tab === 'Owned')),
  })).filter((g) => g.liveries.length > 0);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.preview}>
          <View style={styles.heroBleed}>
            <HeroCar car={previewCar} height={260} background={colors.surface} />
          </View>
          <View style={styles.previewHeader}>
            <View style={styles.nameBlock}>
              <Text style={styles.liveryName}>{previewed.name}</Text>
              <Text style={styles.raceLabel}>{ERAS.find((e) => e.id === previewed.era)?.name} car</Text>
            </View>
            <Credits amount={profile.credits} />
          </View>
          <View style={styles.previewAction}>
            {previewEquipped ? (
              <Button label="Equipped" variant="secondary" disabled onPress={() => {}} />
            ) : previewOwned ? (
              <Button label="Equip" onPress={() => equip(previewed)} />
            ) : (
              <Button
                label={canAfford ? `Buy for ${previewed.price} credits` : `${previewed.price} credits (need ${previewed.price - profile.credits} more)`}
                variant={canAfford ? 'primary' : 'secondary'}
                onPress={() => buy(previewed)}
              />
            )}
          </View>
        </Card>

        <Card style={styles.raceCard}>
          <Text style={styles.raceLabel}>In a race</Text>
          <View style={styles.raceRow}>
            <RaceStage car={previewCar} size={30} caption="Actual size" />
            <RaceStage car={previewCar} size={96} caption="Zoomed" />
          </View>
        </Card>

        <Segmented options={TABS} value={tab} onChange={setTab} />
        {groups.length === 0 ? (
          <Text style={styles.empty}>You own every livery so far. More are on the way.</Text>
        ) : (
          groups.map(({ era, liveries }) => (
            <View key={era.id} style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupName}>{era.name}</Text>
                <Text style={styles.groupYears}>{era.years}</Text>
              </View>
              <View style={styles.grid}>
                {liveries.map((livery) => {
                  const owned = ownsLivery(profile, livery);
                  const equipped = livery.id === profile.car.liveryId;
                  const previewing = livery.id === previewed.id;
                  return (
                    <Pressable
                      key={livery.id}
                      style={styles.cardWrap}
                      onPress={() => setPreviewId(livery.id)}
                      accessibilityLabel={`${livery.name} ${era.name} livery, ${equipped ? 'equipped' : owned ? 'owned' : `${livery.price} credits`}. Tap to preview.`}
                    >
                      <Card style={[styles.card, previewing && styles.cardPreviewing, equipped && styles.cardEquipped]}>
                        <CarImage car={{ liveryId: livery.id, number: profile.car.number }} size={130} detail="simple" showNumber={false} />
                        <Text style={styles.cardName}>{livery.name}</Text>
                        {owned ? (
                          <Text style={[styles.cardStatus, equipped && styles.cardStatusEquipped]}>{equipped ? 'Equipped' : 'Owned'}</Text>
                        ) : (
                          <Credits amount={livery.price} size={14} textStyle={styles.cardPrice} />
                        )}
                      </Card>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))
        )}

        <Card style={styles.numberCard}>
          <Text style={styles.raceLabel}>Race number</Text>
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
