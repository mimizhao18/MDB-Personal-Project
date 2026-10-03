import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarImage } from '../components/CarIcon';
import { LIVERIES, MAX_CAR_NUMBER, MIN_CAR_NUMBER, getLivery } from '../data/liveries';
import type { Livery } from '../data/liveries';
import { buyLivery, equipLivery, ownsLivery, setCarNumber } from '../logic/garage';
import type { GarageResult } from '../logic/garage';
import type { PlayerProfile } from '../models/types';
import { getProfile, saveProfile } from '../storage/profile';
import { showAlert } from '../ui/alert';
import { colors, spacing } from '../theme';

export default function GarageScreen() {
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
        <View style={styles.preview}>
          <CarImage car={previewCar} size={300} />
          <Text style={styles.liveryName}>{previewed.name}</Text>
          <Text style={styles.credits}>{profile.credits} credits</Text>
          {previewEquipped ? (
            <View style={[styles.action, styles.actionDone]}>
              <Text style={styles.actionText}>Equipped</Text>
            </View>
          ) : previewOwned ? (
            <Pressable style={styles.action} onPress={() => equip(previewed)} accessibilityRole="button">
              <Text style={styles.actionText}>Equip</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.action, !canAfford && styles.actionDisabled]}
              onPress={() => buy(previewed)}
              accessibilityRole="button"
            >
              <Text style={styles.actionText}>
                {canAfford ? `Buy for ${previewed.price} credits` : `${previewed.price} credits (need ${previewed.price - profile.credits} more)`}
              </Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.heading}>Liveries</Text>
        <View style={styles.grid}>
          {LIVERIES.map((livery) => {
            const owned = ownsLivery(profile, livery);
            const equipped = livery.id === profile.car.liveryId;
            const previewing = livery.id === previewed.id;
            return (
              <Pressable
                key={livery.id}
                style={[styles.card, equipped && styles.cardEquipped, previewing && styles.cardPreviewing]}
                onPress={() => setPreviewId(livery.id)}
                accessibilityLabel={`${livery.name} livery, ${equipped ? 'equipped' : owned ? 'owned' : `${livery.price} credits`}. Tap to preview.`}
              >
                <View>
                  <CarImage car={{ liveryId: livery.id, number: profile.car.number }} size={130} detail="simple" showNumber={false} />
                </View>
                <Text style={styles.cardName}>{livery.name}</Text>
                <Text style={[styles.cardStatus, equipped && styles.cardStatusEquipped]}>
                  {equipped ? 'Equipped' : owned ? 'Owned' : `${livery.price} credits`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.heading}>Race number</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, gap: spacing.md },
  preview: { alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md },
  liveryName: { color: colors.text, fontSize: 20, fontWeight: '800' },
  credits: { color: colors.textMuted, fontSize: 16, fontWeight: '600' },
  action: { marginTop: spacing.sm, alignSelf: 'stretch', backgroundColor: colors.accent, borderRadius: 10, paddingVertical: spacing.sm + 2, alignItems: 'center' },
  actionDone: { backgroundColor: colors.surfaceBorder },
  actionDisabled: { backgroundColor: colors.surfaceBorder },
  actionText: { color: colors.accentText, fontSize: 16, fontWeight: '700' },
  heading: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: {
    flexGrow: 1,
    flexBasis: '45%',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.surfaceBorder,
    paddingVertical: spacing.md,
  },
  cardEquipped: { borderColor: colors.accent },
  cardPreviewing: { borderColor: colors.text },
  cardName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  cardStatus: { color: colors.textMuted, fontSize: 13 },
  cardStatusEquipped: { color: colors.accent, fontWeight: '700' },
  numberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  stepper: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  stepperText: { color: colors.text, fontSize: 26, fontWeight: '700' },
  number: { color: colors.text, fontSize: 32, fontWeight: '800', minWidth: 56, textAlign: 'center' },
});
