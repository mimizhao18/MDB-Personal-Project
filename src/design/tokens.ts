// The app's design values (no React), so they can be tested. Every screen reads them through useTheme() / makeStyles().
// Look: dark and minimal, fixed F1 red accent, sharp corners, hairline borders, comfortable spacing.

export const colors = {
  background: '#101012',
  surface: '#18181B',
  surfaceRaised: '#202024',
  border: '#2A2A2F',
  text: '#F4F4F5',
  textMuted: '#8F8F98',
  accent: '#E10600',
  accentText: '#FFFFFF',
  positive: '#3DDC84',
  /** The credits coin. */
  gold: '#F2B705',
} as const;

export const theme = {
  colors,
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  /** Sharp corners: nearly square, with just enough rounding to not look harsh. `pill` is for dots and indicators. */
  radius: { sm: 0, md: 2, lg: 2, pill: 999 },
  border: { hairline: 1, selected: 1.5 },
  /** Text styles, ready to spread into a style object. */
  type: {
    title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.3 },
    heading: { fontSize: 17, fontWeight: '700' },
    body: { fontSize: 15 },
    caption: { fontSize: 13 },
    /** Small uppercase labels above sections, like a telemetry screen. */
    label: { fontSize: 12, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase' },
    stat: { fontSize: 22, fontWeight: '700' },
  },
} as const;

export type Theme = typeof theme;
