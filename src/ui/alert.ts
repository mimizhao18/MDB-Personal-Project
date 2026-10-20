import { Alert } from 'react-native';
import type { AlertButton } from 'react-native';

/** What the app's own dialog (see AlertHost) is asked to show. */
export interface AlertRequest {
  title: string;
  message?: string;
  buttons: AlertButton[];
}

type Listener = (request: AlertRequest) => void;
let listener: Listener | null = null;

/** Called by AlertHost: it is the one that draws the dialog. Returns a function that stops listening. */
export function subscribeToAlerts(next: Listener): () => void {
  listener = next;
  return () => {
    if (listener === next) listener = null;
  };
}

/**
 * Shows a message with one or more buttons, in the app's own dialog (the same on a phone and in a web browser).
 * Button styles work like React Native's Alert: "cancel" is the quiet one, "destructive" is drawn as a warning.
 * Falls back to the system alert only if the dialog is not on screen yet.
 */
export function showAlert(title: string, message?: string, buttons?: AlertButton[]): void {
  const list = buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }];
  if (listener) {
    listener({ title, message, buttons: list });
    return;
  }
  Alert.alert(title, message, list);
}
