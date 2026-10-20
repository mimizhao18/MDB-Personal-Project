import { router, usePathname } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { PanResponder } from 'react-native';

import { useTheme } from '../design/styles';
import { TAB_PATHS } from './TabBar';
import { getCurrentPath, noteTabChange, setCurrentPath } from './tabTransition';

/**
 * Swipe sideways on a tab screen to go to the next tab: a swipe to the left goes to the tab on the right, and the other way round.
 * Spread the result on the view that wraps the screens. Things that already use a sideways drag (the 3D car, the era chips) keep it.
 */
export function useTabSwipe() {
  const pathname = usePathname();
  const { size } = useTheme();
  // the gesture callbacks are created once, so they read the current screen from here
  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const responder = useMemo(
    () =>
      PanResponder.create({
        // take over only a clearly sideways move that starts on a tab screen
        onMoveShouldSetPanResponder: (_e, g) => TAB_PATHS.includes(getCurrentPath()) && Math.abs(g.dx) > size.swipeStart && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
        onPanResponderRelease: (_e, g) => {
          const from = TAB_PATHS.indexOf(getCurrentPath());
          if (from < 0 || (Math.abs(g.dx) < size.swipe && Math.abs(g.vx) < size.swipeSpeed)) return;
          const to = from + (g.dx < 0 ? 1 : -1);
          if (to < 0 || to >= TAB_PATHS.length) return;
          noteTabChange(from, to);
          router.replace(TAB_PATHS[to]);
        },
      }),
    [size],
  );

  return responder.panHandlers;
}
