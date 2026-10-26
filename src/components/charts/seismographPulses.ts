/** One period of a seismograph: what lies above the line, what lies below, what could not be told apart. */
export type SeismographPoint = { at: string; until?: string; above: number; below: number; unknown?: number };

const DAY = 86_400_000;

/**
 * Where a period ends: its `until`, else the next period's start, else as
 * long as the period before it (a day when it is the only one).
 */
export function bucketEnd(points: SeismographPoint[], index: number): number {
  const point = points[index];
  const at = Date.parse(point.at);
  if (point.until) return Date.parse(point.until);
  const next = points[index + 1];
  if (next) return Date.parse(next.at);
  const previous = points[index - 1];
  return at + (previous ? at - Date.parse(previous.at) : DAY);
}

/** A pulse's shape over its period: quiet at the edges, its full count at the middle. */
const shape = [
  [0, 0],
  [0.32, 0.06],
  [0.5, 1],
  [0.68, 0.06],
  [0.999, 0],
] as const;

export type PulsePoint = { x: number; above: number; below: number; index: number };

/** The traces drawn: each period one pulse up for `above` and one down for `below`. */
export function pulses(points: SeismographPoint[]): PulsePoint[] {
  return points.flatMap((point, index) => {
    const at = Date.parse(point.at);
    const length = bucketEnd(points, index) - at;
    return shape.map(([part, height]) => ({
      x: at + length * part,
      above: point.above * height,
      below: -point.below * height,
      index,
    }));
  });
}

/** The middle of a period, where its pulse peaks. */
export function bucketMiddle(points: SeismographPoint[], index: number): number {
  const at = Date.parse(points[index].at);
  return at + (bucketEnd(points, index) - at) / 2;
}

/**
 * The periods worth a label: the highest `above` counts, at most `count`,
 * at least a quarter of the periods apart so the labels do not collide.
 */
export function peaks(points: SeismographPoint[], count: number): number[] {
  const spacing = Math.max(1, points.length / 4);
  const chosen: number[] = [];
  const order = points.map((_, index) => index).sort((a, b) => points[b].above - points[a].above);
  for (const index of order) {
    if (chosen.length >= count || points[index].above <= 0) break;
    if (chosen.every((other) => Math.abs(other - index) >= spacing)) chosen.push(index);
  }
  return chosen;
}

/** Every how many periods the time axis is labelled, for about one label per 150 px. */
export function tickStride(count: number, width: number): number {
  return Math.max(1, Math.ceil(count / Math.max(2, Math.floor(width / 150))));
}

/** The period a key moves the selection to; -1 is none selected. */
export function stepSelection(index: number, count: number, key: string): number | null {
  if (count === 0) return null;
  const page = Math.max(1, Math.round(count / 10));
  switch (key) {
    case "ArrowRight":
    case "ArrowUp":
      return index < 0 ? 0 : Math.min(count - 1, index + 1);
    case "ArrowLeft":
    case "ArrowDown":
      return index < 0 ? count - 1 : Math.max(0, index - 1);
    case "PageUp":
      return Math.min(count - 1, Math.max(0, index) + page);
    case "PageDown":
      return Math.max(0, (index < 0 ? count - 1 : index) - page);
    case "Home":
      return 0;
    case "End":
      return count - 1;
  }
  return null;
}
