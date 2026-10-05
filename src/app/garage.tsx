import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarImage } from '../components/CarIcon';
import { HeroCar } from '../components/HeroCar';
import { LIVERIES, MAX_CAR_NUMBER, MIN_CAR_NUMBER, getLivery } from '../data/liveries';
import type { Livery } from '../data/liveries';
import { makeStyles } from '../design/styles';
import { buyLivery, equipLivery, ownsLivery, setCarNumber } from '../logic/garage';
import type { GarageResult } from '../logic/garage';
import type { PlayerProfile } from '../models/types';
import { getProfile, saveProfile } from '../storage/profile';
import { showAlert } from '../ui/alert';
import { Credits } from '../ui/Credits';
import { Button, Card, SectionLabel } from '../ui/kit';
import { colors } from '../theme';

const useStyles = makeStyles((t) => ({
  container: { flex: 1 },
  content: { padding: t.spacing.md, gap: t.spacing.md },
  preview: { alignItems: 'center', gap: t.spacing.xs },
  previewAction: { alignSelf: 'stretch', marginTop: t.spacing.sm },
  liveryName: { ...t.type.title, fontSize: 22, color: t.colors.text },
  raceCard: { gap: t.spacing.sm },
  raceLabel: { ...t.type.label, color: t.colors.textMuted },
  // a stretch of the race track: light road between dark edges, like the Race screen
  road: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#E6E6E6',
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: '#2B2B2B',
    paddingVertical: t.spacing.sm,
    minHeight: 76,
  },
  raceCar: { alignItems: 'center', gap: 2 },
  raceCaption: { fontSize: 11, color: '#555555' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.sm },
  cardWrap: { flexGrow: 1, flexBasis: '45%' },
  card: { alignItems: 'center', gap: t.spacing.xs, paddingVertical: t.spacing.md },
  cardPreviewing: { borderColor: t.colors.text },
  cardName: { ...t.type.heading, fontSize: 15, color: t.colors.text },
  cardStatus: { ...t.type.caption, color: t.colors.textMuted },
  cardStatusEquipped: { color: t.colors.accent, fontWeight: '700' },
  cardPrice: { ...t.type.caption, fontWeight: '600', color: t.colors.textMuted },
  numberRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.lg },
  stepper: {
    width: 44,
    height: 44,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.surface,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: { color: t.colors.text, fontSize: 24, fontWeight: '700' },
  number: { fontSize: 32, fontWeight: '800', color: t.colors.text, minWidth: 56, textAlign: 'center' },
}));

export default function GarageScreen() {
  const styles = useStyles();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  // The livery shown on the big car. Tapping a card previews it, owned or not; the button below equips or buys it.
  const [previewId, setPreviewId] = useState<string | null>(null);

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

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.preview}>
          <HeroCar car={previewCar} height={260} background={colors.surface} />
          <Text style={styles.liveryName}>{previewed.name}</Text>
          <Credits amount={profile.credits} />
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
          <View style={styles.road}>
            <View style={styles.raceCar}>
              <CarImage car={previewCar} size={30} detail="simple" showNumber={false} />
              <Text style={styles.raceCaption}>Actual size</Text>
            </View>
            <View style={styles.raceCar}>
              <CarImage car={previewCar} size={96} detail="simple" showNumber={false} />
              <Text style={styles.raceCaption}>Zoomed</Text>
            </View>
          </View>
        </Card>

        <SectionLabel>Liveries</SectionLabel>
        <View style={styles.grid}>
          {LIVERIES.map((livery) => {
            const owned = ownsLivery(profile, livery);
            const equipped = livery.id === profile.car.liveryId;
            const previewing = livery.id === previewed.id;
            return (
              <Pressable
                key={livery.id}
                style={styles.cardWrap}
                onPress={() => setPreviewId(livery.id)}
                accessibilityLabel={`${livery.name} livery, ${equipped ? 'equipped' : owned ? 'owned' : `${livery.price} credits`}. Tap to preview.`}
              >
                <Card selected={equipped} style={[styles.card, previewing && !equipped && styles.cardPreviewing]}>
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

        <SectionLabel>Race number</SectionLabel>
        <View style={styles.numberRow}>
          <Pressable style={styles.stepper} onPress={() => changeNumber(-1)} hitSlop={8} accessibilityLabel="Lower race number">
            <Text style={styles.stepperText}>−</Text>
          </Pressable>
          <Text style={styles.number}>{profile.car.number}</Text>
          <Pressable style={styles.stepper} onPress={() => changeNumber(1)} hitSlop={8} accessibilityLabel="Raise race number">
            <Text style={styles.stepperText}>+</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
