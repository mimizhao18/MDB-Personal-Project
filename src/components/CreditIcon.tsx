import Svg, { Polygon } from 'react-native-svg';

import { colors } from '../theme';

const COIN_DARK = '#9A6B00';

/**
 * The credits icon: a gold octagonal coin with an inner rim and a diamond in the middle.
 * A placeholder shape (angular, to match the sharp-cornered UI); easy to swap later.
 */
export function CreditIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Polygon points="7,1 17,1 23,7 23,17 17,23 7,23 1,17 1,7" fill={colors.gold} />
      <Polygon points="8,4.5 16,4.5 19.5,8 19.5,16 16,19.5 8,19.5 4.5,16 4.5,8" fill="none" stroke={COIN_DARK} strokeWidth={1.4} />
      <Polygon points="12,7.5 16.5,12 12,16.5 7.5,12" fill={COIN_DARK} />
    </Svg>
  );
}
