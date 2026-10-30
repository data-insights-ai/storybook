import type { Bar } from "../types";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const STEPS = [
  100,
  250,
  500,
  SECOND,
  2 * SECOND,
  5 * SECOND,
  10 * SECOND,
  15 * SECOND,
  30 * SECOND,
  MINUTE,
  2 * MINUTE,
  5 * MINUTE,
  10 * MINUTE,
  15 * MINUTE,
  30 * MINUTE,
  HOUR,
  2 * HOUR,
  3 * HOUR,
  6 * HOUR,
  12 * HOUR,
  DAY,
];

// A bar is three pixels: two of ink and one of air.
export const BAR_PX = 3;

// Past about one event per pixel, lines merge into a block that says less than a bar does.
const READABLE_PER_BAR = 4;

/** The bucket width, on a round step, that gives each bar about three pixels. */
export function bucketFor(spanMs: number, plotPx: number): number {
  const wanted = spanMs / Math.max(1, plotPx / BAR_PX);
  return STEPS.find((step) => step >= wanted) ?? Math.ceil(wanted / DAY) * DAY;
}

/** Whether the events behind these bars are far enough apart to be drawn one by one. */
export const eventsReadable = (bars: Bar[]) => bars.every((b) => b.neutral + b.warn + b.danger <= READABLE_PER_BAR);
