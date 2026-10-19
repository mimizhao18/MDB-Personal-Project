import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { MAX_CAR_NUMBER, MIN_CAR_NUMBER } from '../data/liveries';
import type { Livery } from '../data/liveries';
import { buyLivery, equipLivery, setCarNumber } from '../logic/garage';
import type { GarageResult } from '../logic/garage';
import type { PlayerProfile } from '../models/types';
import { getProfile, saveProfile } from '../storage/profile';
import { showAlert } from './alert';

/**
 * The player's profile for the Garage and Store screens, and the things they can do to it: put a livery on the car,
 * buy one (after asking), and change the race number. The profile is reloaded each time the screen comes into view.
 */
export function useGarage() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      getProfile().then(setProfile);
    }, []),
  );

  const apply = async (result: GarageResult) => {
    if (!result.ok) {
      const message = result.reason === 'not-enough-credits' ? 'You do not have enough credits yet. Keep racing to earn more!' : 'That change is not possible.';
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
    if (profile) void apply(equipLivery(profile, livery));
  };

  const buy = (livery: Livery) => {
    if (!profile) return;
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
    if (!profile) return;
    const next = profile.car.number + delta;
    if (next < MIN_CAR_NUMBER || next > MAX_CAR_NUMBER) return;
    void apply(setCarNumber(profile, next, MIN_CAR_NUMBER, MAX_CAR_NUMBER));
  };

  return { profile, equip, buy, changeNumber };
}
