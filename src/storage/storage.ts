import AsyncStorage from '@react-native-async-storage/async-storage';

/** Reads JSON from storage; any missing, unreadable or invalid value falls back to `fallback`. */
export async function readJson<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export async function writeJson(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeKey(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
