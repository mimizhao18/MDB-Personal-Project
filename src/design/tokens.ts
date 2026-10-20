// The app's design values (no React), so they can be tested. Every screen reads them through useTheme() / makeStyles().
// Direction: a "timing screen", refined. Dark and precise, one F1 red accent (primary action, active state, progress),
// 4 px corners, hairline dividers, monospace numerals for every stat, timer, XP and credit amount.
//
// Entries marked "legacy" belong to the previous look. Screens that have not been rebuilt yet still use them,
// and they are deleted in the cleanup stage.

export const colors = {
  // four neutral steps, darkest to lightest
  background: '#101012',
  surface: '#18181B',
  raised: '#202024',
  border: '#2A2A2F',
  // three text levels
  text: '#EDEDF0',
  textSecondary: '#B5B5BD',
  textMuted: '#9A9AA3',
  // the one accent, plus the colors that go on and with it
  accent: '#E10600',
  /** Text and icons placed on the accent (white). */
  accentText: '#FFFFFF',
  /** The accent lightened so that small text and icons on the dark surfaces still pass WCAG AA. */
  accentOnDark: '#FF6B63',
  positive: '#3DDC84',

  /** legacy: the same grey as `raised`. */
  surfaceRaised: '#202024',
  /** legacy: a border that has to be seen (outlined buttons, the selected segment). */
  borderStrong: '#3C3C43',
  /** legacy: a dark red tint for quiet red highlights. */
  accentSoft: '#2A1513',
  /** legacy: the same red as `accentOnDark`. */
  accentSoftText: '#FF6B63',
  /** The credits coin. */
  coin: '#F4F4F5',
} as const;

/** UI font (Inter) and numerals font (JetBrains Mono, whose digits are all the same width). Only weights 400, 500 and 600. */
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
  monoSemibold: 'JetBrainsMono_600SemiBold',
} as const;

export const theme = {
  colors,
  /** An 8 px grid (4 for tight gaps). Screens are padded by `screen`. */
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, screen: 16 },
  radius: {
    /** Buttons, chips, inputs and cards. */
    control: 4,
    /** Large panels, at most. */
    panel: 6,
    /** Dots and tiny badges only. */
    dot: 999,
    /** legacy */
    sm: 0,
    /** legacy */
    md: 2,
    /** legacy */
    lg: 2,
    /** legacy */
    pill: 999,
  },
  border: { hairline: 1, selected: 1.5 },
  /** Fixed sizes: every touch target is at least `touch`, buttons and rows are taller. */
  size: { touch: 44, control: 48, row: 56, tabBar: 56, progress: 4, icon: 22 },
  opacity: { disabled: 0.4, dimmed: 0.5, pressed: 0.85 },
  /** Text styles, ready to spread into a style object. Numbers (stats, timers, XP, credits) use the mono ones. */
  typography: {
    display: { fontFamily: fonts.monoSemibold, fontSize: 56, lineHeight: 60, letterSpacing: -1.5 },
    title: { fontFamily: fonts.semibold, fontSize: 24, lineHeight: 30, letterSpacing: -0.2 },
    heading: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24 },
    body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
    caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
    /** Small uppercase labels, like a telemetry screen. */
    label: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 16, letterSpacing: 1.2, textTransform: 'uppercase' },
    button: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, letterSpacing: 0.2 },
    statLarge: { fontFamily: fonts.monoSemibold, fontSize: 32, lineHeight: 38, letterSpacing: -0.5 },
    stat: { fontFamily: fonts.monoMedium, fontSize: 20, lineHeight: 26 },
    statSmall: { fontFamily: fonts.monoMedium, fontSize: 14, lineHeight: 20 },
  },
  /** legacy: the previous text styles. */
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
