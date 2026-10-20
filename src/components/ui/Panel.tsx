import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { makeStyles } from '../../design/styles';

const useStyles = makeStyles((t) => ({
  panel: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.control,
    borderWidth: t.border.hairline,
    borderColor: t.colors.border,
    padding: t.spacing.md,
  },
  raised: { backgroundColor: t.colors.raised },
  selected: { borderColor: t.colors.accent },
  large: { borderRadius: t.radius.panel },
  flush: { padding: 0, overflow: 'hidden' },
  divider: { height: t.border.hairline, backgroundColor: t.colors.border },
}));

/** A quiet surface with a hairline border. Use one panel per idea; separate things inside it with `Divider`, not more panels. */
export function Panel({
  children,
  raised,
  selected,
  large,
  flush,
  style,
}: {
  children: ReactNode;
  /** One step lighter than the default surface. */
  raised?: boolean;
  /** Outlined in the accent (the chosen option in a list of options). */
  selected?: boolean;
  /** The larger corner radius (6 px), for big panels. */
  large?: boolean;
  /** No padding: content runs to the edges (lists of rows, images). */
  flush?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useStyles();
  return <View style={[styles.panel, raised && styles.raised, selected && styles.selected, large && styles.large, flush && styles.flush, style]}>{children}</View>;
}

/** A 1 px line between two pieces of content. */
export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  const styles = useStyles();
  return <View style={[styles.divider, style]} />;
}
