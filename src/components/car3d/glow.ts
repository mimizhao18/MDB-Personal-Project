/**
 * The color of the floor glow and rim lights for a livery: the car's main color, so a red car glows red and a blue car
 * glows blue. Very dark paint (like Obsidian) would give a glow too dark to see, so the accent color is used instead.
 */
export function glowHexFor(primary: string, secondary: string): string {
  const n = parseInt(primary.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return brightness < 0.16 ? secondary : primary;
}

/** `#RRGGBB` to [0..255, 0..255, 0..255]. */
export function hexToRgb255(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
