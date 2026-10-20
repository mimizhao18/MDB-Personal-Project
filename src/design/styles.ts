import { StyleSheet } from 'react-native';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { theme } from './tokens';
import type { Theme } from './tokens';

export type { Theme };

/** The design values, for code that needs a number or color outside a style sheet (an icon color, an SVG fill). */
export function useTheme(): Theme {
  return theme;
}

type Style = ViewStyle | TextStyle | ImageStyle;

/**
 * Styles built from the design values. Declare once at module level, then call the returned hook in a component:
 *   const useStyles = makeStyles((t) => ({ panel: { padding: t.spacing.md, borderRadius: t.radius.panel } }));
 *   const styles = useStyles();
 * Always take colors, type, spacing, radius and sizes from `t`; never write the numbers or hex codes in a screen.
 */
export function makeStyles<T extends Record<string, Style>>(factory: (theme: Theme) => T): () => T {
  let styles: T | undefined;
  return function useStyles() {
    styles ??= StyleSheet.create(factory(theme));
    return styles;
  };
}
