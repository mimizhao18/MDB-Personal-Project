import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CarImage } from '../components/CarIcon';
import { MAX_CAR_NUMBER, MIN_CAR_NUMBER, PAINT_COLORS } from '../data/cosmetics';
import type { PaintColor } from '../data/cosmetics';
import { buyColor, equipColor, ownsColor, setCarNumber } from '../logic/garage';
import type { GarageResult } from '../logic/garage';
import type { PlayerProfile } from '../models/types';
import { getProfile, saveProfile } from '../storage/profile';
import { showAlert } from '../ui/alert';
import { colors, spacing } from '../theme';

type Part = 'primary' | 'secondary';

export default function GarageScreen() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

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

  const choose = (color: PaintColor, part: Part) => {
    if (ownsColor(profile, color)) {
      void apply(equipColor(profile, color, part));
      return;
    }
    showAlert(`Buy ${color.name}?`, `${color.price} credits. You have ${profile.credits}.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: `Buy for ${color.price}`,
        onPress: () => {
          const bought = buyColor(profile, color);
          if (!bought.ok) {
            void apply(bought);
            return;
          }
          void apply(equipColor(bought.profile, color, part));
        },
      },
    ]);
  };

  const changeNumber = (delta: number) => {
    const next = profile.car.number + delta;
    if (next < MIN_CAR_NUMBER || next > MAX_CAR_NUMBER) return;
    void apply(setCarNumber(profile, next, MIN_CAR_NUMBER, MAX_CAR_NUMBER));
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.preview}>
          <CarImage car={profile.car} size={300} />
          <Text style={styles.credits}>{profile.credits} credits</Text>
        </View>

        <Swatches title="Body color" part="primary" profile={profile} onChoose={choose} />
        <Swatches title="Accent color" part="secondary" profile={profile} onChoose={choose} />

        <Text style={styles.heading}>Race number</Text>
        <View style={styles.numberRow}>
          <Pressable style={styles.stepper} onPress={() => changeNumber(-1)} hitSlop={8}>
            <Text style={styles.stepperText}>−</Text>
          </Pressable>
          <Text style={styles.number}>{profile.car.number}</Text>
          <Pressable style={styles.stepper} onPress={() => changeNumber(1)} hitSlop={8}>
            <Text style={styles.stepperText}>+</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Swatches({
  title,
  part,
  profile,
  onChoose,
}: {
  title: string;
  part: Part;
  profile: PlayerProfile;
  onChoose: (color: PaintColor, part: Part) => void;
}) {
  const equippedHex = part === 'primary' ? profile.car.primaryColor : profile.car.secondaryColor;
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.swatchGrid}>
        {PAINT_COLORS.map((c) => {
          const owned = ownsColor(profile, c);
          const equipped = c.hex.toLowerCase() === equippedHex.toLowerCase();
          return (
            <Pressable key={c.id} style={styles.swatchWrap} onPress={() => onChoose(c, part)}>
              <View style={[styles.swatch, { backgroundColor: c.hex }, equipped && styles.swatchEquipped, !owned && styles.swatchLocked]} />
              <Text style={styles.swatchLabel}>{owned ? (equipped ? 'Equipped' : c.name) : `${c.price} cr`}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, gap: spacing.md },
  preview: { alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md },
  credits: { color: colors.text, fontSize: 18, fontWeight: '700' },
  section: { gap: spacing.sm },
  heading: { color: colors.text, fontSize: 18, fontWeight: '700' },
  swatchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  swatchWrap: { width: 64, alignItems: 'center', gap: spacing.xs },
  swatch: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: colors.surfaceBorder },
  swatchEquipped: { borderColor: colors.text, borderWidth: 3 },
  swatchLocked: { opacity: 0.4 },
  swatchLabel: { color: colors.textMuted, fontSize: 11, textAlign: 'center' },
  numberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  stepper: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  stepperText: { color: colors.text, fontSize: 26, fontWeight: '700' },
  number: { color: colors.text, fontSize: 32, fontWeight: '800', minWidth: 56, textAlign: 'center' },
});
