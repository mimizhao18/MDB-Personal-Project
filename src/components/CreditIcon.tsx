import Svg, { Polygon } from 'react-native-svg';

import { colors } from '../theme';

/**
 * The credits icon: a thin-line octagonal coin with a small diamond in the middle, drawn as outlines only
 * (no solid fill) so it matches the line icons of a game HUD. A placeholder shape; easy to swap later.
 */
export function CreditIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Polygon points="7.5,2 16.5,2 22,7.5 22,16.5 16.5,22 7.5,22 2,16.5 2,7.5" fill="none" stroke={colors.coin} strokeWidth={1.6} strokeLinejoin="round" />
      <Polygon points="12,7.5 16.5,12 12,16.5 7.5,12" fill="none" stroke={colors.coin} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}
