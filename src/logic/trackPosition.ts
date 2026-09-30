import type { Track } from '../models/types';

export interface TrackPosition {
  x: number;
  y: number;
  /** Direction of travel in degrees, 0 = pointing right (+x), increasing clockwise on screen. */
  angleDeg: number;
}

type PointList = Track['points'];

// How far either side of the car (in points) the heading is measured over. Wider = smoother turning.
const HEADING_WINDOW = 1.5;

function pointAtIndex(points: PointList, i: number): readonly [number, number] {
  const n = points.length;
  return points[((i % n) + n) % n];
}

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  return (
    0.5 *
    (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t)
  );
}

/** A smooth curve through the points (so position and direction change continuously), at fractional index `f`. */
function sampleCurve(points: PointList, f: number): readonly [number, number] {
  const i = Math.floor(f);
  const t = f - i;
  const p0 = pointAtIndex(points, i - 1);
  const p1 = pointAtIndex(points, i);
  const p2 = pointAtIndex(points, i + 1);
  const p3 = pointAtIndex(points, i + 2);
  return [catmullRom(p0[0], p1[0], p2[0], p3[0], t), catmullRom(p0[1], p1[1], p2[1], p3[1], t)];
}

/** Where the car is for a lap fraction (0 = start/finish line, 1 = back at the line). */
export function positionOnTrack(track: Track, lapFraction: number): TrackPosition {
  const n = track.points.length;
  const wrapped = ((lapFraction % 1) + 1) % 1; // 1 and 0 are the same spot
  const f = wrapped * n;

  const [x, y] = sampleCurve(track.points, f);
  const behind = sampleCurve(track.points, f - HEADING_WINDOW);
  const ahead = sampleCurve(track.points, f + HEADING_WINDOW);
  const angleDeg = (Math.atan2(ahead[1] - behind[1], ahead[0] - behind[0]) * 180) / Math.PI;

  return { x, y, angleDeg };
}
