import { StyleSheet } from 'react-native';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { theme } from './tokens';
import type { Theme } from './tokens';

export function useTheme(): Theme {
  return theme;
}

type Style = ViewStyle | TextStyle | ImageStyle;

/**
 * Styles built from the design values. Declare once at module level, then call the returned hook in a component:
 *   const useStyles = makeStyles((t) => ({ card: { padding: t.spacing.md, borderRadius: t.radius.lg } }));
 *   const styles = useStyles();
 */
export function makeStyles<T extends Record<string, Style>>(factory: (theme: Theme) => T): () => T {
  let styles: T | undefined;
  return function useStyles() {
    styles ??= StyleSheet.create(factory(theme));
    return styles;
  };
}
