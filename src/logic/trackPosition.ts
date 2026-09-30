import type { Track } from '../models/types';

export interface TrackPosition {
  x: number;
  y: number;
  /** Direction of travel in degrees, 0 = pointing right (+x), increasing clockwise on screen. */
  angleDeg: number;
}

type PointList = Track['points'];

function pointAtIndex(points: PointList, i: number): readonly [number, number] {
  const n = points.length;
  return points[((i % n) + n) % n];
}

/** Where the car is for a lap fraction (0 = start/finish line, 1 = back at the line). */
export function positionOnTrack(track: Track, lapFraction: number): TrackPosition {
  const pts = track.points;
  const n = pts.length;
  const wrapped = ((lapFraction % 1) + 1) % 1; // 1 and 0 are the same spot
  const f = wrapped * n;
  const i = Math.floor(f);
  const t = f - i;
  const a = pointAtIndex(pts, i);
  const b = pointAtIndex(pts, i + 1);

  // Heading from points a little behind and ahead, so the car turns smoothly instead of snapping between segments.
  const behind = pointAtIndex(pts, i - 2);
  const ahead = pointAtIndex(pts, i + 3);
  const angleDeg = (Math.atan2(ahead[1] - behind[1], ahead[0] - behind[0]) * 180) / Math.PI;

  return {
    x: a[0] + (b[0] - a[0]) * t,
    y: a[1] + (b[1] - a[1]) * t,
    angleDeg,
  };
}
