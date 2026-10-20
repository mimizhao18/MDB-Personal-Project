/**
 * SVG points for a rectangle with two opposite corners cut at 45 degrees (top-left and bottom-right), the angular
 * "cut corner" used by panels and the main button. `c` is how far each cut reaches along the edges.
 */
export function chamferPoints(x: number, y: number, w: number, h: number, c: number): string {
  return [
    [x + c, y],
    [x + w, y],
    [x + w, y + h - c],
    [x + w - c, y + h],
    [x, y + h],
    [x, y + c],
  ]
    .map(([px, py]) => `${px},${py}`)
    .join(' ');
}
