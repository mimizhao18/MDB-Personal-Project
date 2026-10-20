import { useEffect, useState } from 'react';
import type { AlertButton } from 'react-native';
import { Modal, Text, View } from 'react-native';

import { BracketFrame, Button } from '../components/ui';
import { makeStyles } from '../design/styles';
import { subscribeToAlerts } from './alert';
import type { AlertRequest } from './alert';

const useStyles = makeStyles((t) => ({
  scrim: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: t.spacing.screen, backgroundColor: t.glass.scrim },
  panel: {
    width: '100%',
    maxWidth: t.size.dialog,
    gap: t.spacing.md,
    padding: t.spacing.lg,
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.control,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
  },
  title: { ...t.typography.heading, color: t.colors.text },
  message: { ...t.typography.body, color: t.colors.textSecondary },
  buttons: { gap: t.spacing.sm, marginTop: t.spacing.sm },
  buttonsRow: { flexDirection: 'row' },
  cell: { flex: 1 },
}));

/** The variant a button is drawn in: the quiet one for "cancel", the warning tint for "destructive", the red one otherwise. */
const variantFor = (b: AlertButton, primaryIndex: number, index: number) => (b.style === 'cancel' ? 'secondary' : b.style === 'destructive' ? 'soft' : index === primaryIndex ? 'primary' : 'secondary');

/**
 * The app's own dialog, shown by showAlert(): a dark panel with corner ticks, a title, an optional message and the buttons.
 * Mount it once at the root of the app.
 */
export function AlertHost() {
  const styles = useStyles();
  const [request, setRequest] = useState<AlertRequest | null>(null);

  useEffect(() => subscribeToAlerts(setRequest), []);

  if (!request) return null;
  const { title, message, buttons } = request;
  const cancel = buttons.find((b) => b.style === 'cancel');
  // the last button that is not "cancel" is the main one
  const primaryIndex = buttons.reduce((found, b, i) => (b.style === 'cancel' ? found : i), -1);
  // the cancel button first, so the main action ends up on the right (or at the bottom)
  const ordered = [...buttons].sort((a, b) => Number(b.style === 'cancel') - Number(a.style === 'cancel'));
  const row = ordered.length <= 2;

  const press = (button: AlertButton) => {
    setRequest(null);
    button.onPress?.();
  };

  return (
    <Modal transparent animationType="fade" visible onRequestClose={() => press(cancel ?? buttons[buttons.length - 1])}>
      <View style={styles.scrim}>
        <BracketFrame style={styles.panel}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={[styles.buttons, row && styles.buttonsRow]}>
            {ordered.map((button, i) => (
              <View key={`${button.text}-${i}`} style={row ? styles.cell : undefined}>
                <Button label={button.text ?? 'OK'} variant={variantFor(button, primaryIndex, buttons.indexOf(button))} onPress={() => press(button)} />
              </View>
            ))}
          </View>
        </BracketFrame>
      </View>
    </Modal>
  );
}
