import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

import { readJson, writeJson } from '../storage/storage';
import { DEFAULT_DESIGN, buildTheme, normalizeDesign } from './tokens';
import type { DesignSettings, Theme } from './tokens';

const DESIGN_KEY = 'design.v1';

interface DesignContextValue {
  theme: Theme;
  settings: DesignSettings;
  update: (patch: Partial<DesignSettings>) => void;
  reset: () => void;
}

const DesignContext = createContext<DesignContextValue>({
  theme: buildTheme(DEFAULT_DESIGN),
  settings: DEFAULT_DESIGN,
  update: () => {},
  reset: () => {},
});

/** Holds the current design settings (corner style, spacing, layouts) and remembers them between launches. */
export function DesignProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DesignSettings>(DEFAULT_DESIGN);

  useEffect(() => {
    let cancelled = false;
    readJson<unknown>(DESIGN_KEY, null, (v): v is unknown => true).then((raw) => {
      if (!cancelled) setSettings(normalizeDesign(raw));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback((next: DesignSettings) => {
    setSettings(next);
    writeJson(DESIGN_KEY, next).catch(() => {}); // not being able to remember a design choice is not worth an error
  }, []);

  const update = useCallback((patch: Partial<DesignSettings>) => save({ ...settings, ...patch }), [settings, save]);
  const reset = useCallback(() => save(DEFAULT_DESIGN), [save]);

  const value = useMemo(() => ({ theme: buildTheme(settings), settings, update, reset }), [settings, update, reset]);
  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(DesignContext).theme;
}

export function useDesign(): Omit<DesignContextValue, 'theme'> {
  const { settings, update, reset } = useContext(DesignContext);
  return { settings, update, reset };
}

type Style = ViewStyle | TextStyle | ImageStyle;

/**
 * Styles that depend on the design settings. Declare once at module level, then call the returned hook in a component:
 *   const useStyles = makeStyles((t) => ({ card: { padding: t.spacing.md, borderRadius: t.radius.lg } }));
 *   const styles = useStyles();
 */
export function makeStyles<T extends Record<string, Style>>(factory: (theme: Theme) => T): () => T {
  return function useStyles() {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
