// The logo library: sponsor and team marks as vector shapes, drawn by hand for this project from photos of the cars
// (simplified, not copies of the official artwork files). They are trademarks of their owners, like the team and
// sponsor names the app already uses: they would need clearing before any public release.

import type { Logo } from './types';

export type { Logo, LogoColor, LogoPath, LogoShape, LogoText } from './types';
export { isLogoText } from './types';

/** Every logo, in the order the /dev/logos page shows them. */
export const LOGOS: readonly Logo[] = [];

let byId: Map<string, Logo> | null = null;

/** The logo with this id, or undefined. */
export function getLogo(id: string): Logo | undefined {
  if (!byId) {
    byId = new Map();
    for (const l of LOGOS) {
      if (byId.has(l.id)) throw new Error(`duplicate logo id ${l.id}`);
      byId.set(l.id, l);
    }
  }
  return byId.get(id);
}
