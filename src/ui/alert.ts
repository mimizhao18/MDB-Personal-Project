import { Alert, Platform } from 'react-native';
import type { AlertButton } from 'react-native';

/**
 * Alert.alert, but it also works in a web browser, where React Native's Alert does nothing.
 * On web, a message with a cancel button and one other button becomes a confirm dialog; anything else is a plain alert.
 */
export function showAlert(title: string, message?: string, buttons?: AlertButton[]): void {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, buttons);
    return;
  }
  const text = message ? `${title}\n\n${message}` : title;
  const action = buttons?.find((b) => b.style !== 'cancel');
  const hasCancel = buttons?.some((b) => b.style === 'cancel') ?? false;
  if (hasCancel && action) {
    if (window.confirm(text)) action.onPress?.();
  } else {
    window.alert(text);
    action?.onPress?.();
  }
}
