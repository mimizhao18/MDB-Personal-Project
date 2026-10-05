// Pure design values (no React), so they can be tested. Every screen reads them through useTheme().

export type Corners = 'sharp' | 'subtle' | 'soft';
export type Density = 'compact' | 'comfortable' | 'roomy';
export type HomeLayout = 'hub' | 'cards' | 'dashboard';
export type NavStyle = 'links' | 'tabs';

export interface DesignSettings {
  corners: Corners;
  density: Density;
  homeLayout: HomeLayout;
  nav: NavStyle;
}

/** Defaults: slightly rounded corners (clean, not harsh), comfortable spacing, the original Home, small links. */
export const DEFAULT_DESIGN: DesignSettings = {
  corners: 'subtle',
  density: 'comfortable',
  homeLayout: 'hub',
  nav: 'links',
};

export const DESIGN_OPTIONS = {
  corners: ['sharp', 'subtle', 'soft'] as Corners[],
  density: ['compact', 'comfortable', 'roomy'] as Density[],
  homeLayout: ['hub', 'cards', 'dashboard'] as HomeLayout[],
  nav: ['links', 'tabs'] as NavStyle[],
};

const RADII: Record<Corners, { sm: number; md: number; lg: number }> = {
  sharp: { sm: 0, md: 2, lg: 2 },
  subtle: { sm: 2, md: 4, lg: 6 },
  soft: { sm: 6, md: 10, lg: 14 },
};

const DENSITY_SCALE: Record<Density, number> = { compact: 0.8, comfortable: 1, roomy: 1.25 };

const BASE_SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

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
} as const;

export interface Theme {
  settings: DesignSettings;
  colors: typeof colors;
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  radius: { sm: number; md: number; lg: number; pill: number };
  border: { hairline: number; selected: number };
  /** Text styles, ready to spread into a style object. */
  type: {
    title: { fontSize: number; fontWeight: '800'; letterSpacing: number };
    heading: { fontSize: number; fontWeight: '700' };
    body: { fontSize: number };
    caption: { fontSize: number };
    /** Small uppercase labels above sections, like a telemetry screen. */
    label: { fontSize: number; fontWeight: '600'; letterSpacing: number; textTransform: 'uppercase' };
    stat: { fontSize: number; fontWeight: '700' };
  };
}

export function buildTheme(settings: DesignSettings): Theme {
  const scale = DENSITY_SCALE[settings.density];
  const space = (n: number) => Math.round(n * scale);
  return {
    settings,
    colors,
    spacing: { xs: space(BASE_SPACING.xs), sm: space(BASE_SPACING.sm), md: space(BASE_SPACING.md), lg: space(BASE_SPACING.lg), xl: space(BASE_SPACING.xl) },
    radius: { ...RADII[settings.corners], pill: 999 },
    border: { hairline: 1, selected: 1.5 },
    type: {
      title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.3 },
      heading: { fontSize: 17, fontWeight: '700' },
      body: { fontSize: 15 },
      caption: { fontSize: 13 },
      label: { fontSize: 12, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase' },
      stat: { fontSize: 22, fontWeight: '700' },
    },
  };
}

/** Turns whatever was saved into valid settings; unknown or missing values fall back to the defaults. */
export function normalizeDesign(raw: unknown): DesignSettings {
  const p = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  const pick = <K extends keyof DesignSettings>(key: K): DesignSettings[K] =>
    (DESIGN_OPTIONS[key] as readonly unknown[]).includes(p[key]) ? (p[key] as DesignSettings[K]) : DEFAULT_DESIGN[key];
  return { corners: pick('corners'), density: pick('density'), homeLayout: pick('homeLayout'), nav: pick('nav') };
}
