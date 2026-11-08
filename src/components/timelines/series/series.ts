import type { TimelineBar, TimelineSeries } from "../types";

/** The categorical steps the tokens hold, so the most series one timeline draws. */
export const SERIES_STEPS = 6;

/** The categorical step of the series at `index` in the declared order. */
export const seriesColor = (index: number) => `var(--di-chart-category-${index + 1})`;

/**
 * The series a timeline draws: the declared ones up to the palette's size.
 * Past it a development build warns, and the rest are left out like an
 * undeclared series rather than drawn in a colour another one already has.
 */
export function drawnSeries(series: TimelineSeries[], component: string): TimelineSeries[] {
  if (series.length <= SERIES_STEPS) {
    return series;
  }
  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    console.warn(
      `${component}: ${series.length} series declared, ${SERIES_STEPS} have a colour; fold the rest into one before passing them.`,
    );
  }
  return series.slice(0, SERIES_STEPS);
}

/** Each series id with its position in the declared order. */
export const seriesOrder = (series: TimelineSeries[]) => new Map(series.map((s, i) => [s.id, i]));

/** Every event a bar counts, whichever series it is in. */
export const totalOf = (bar: Pick<TimelineBar, "counts">) => Object.values(bar.counts).reduce((n, c) => n + c, 0);

/** The same counts with only the series in `order`, so what is not drawn does not count toward a height either. */
export function declaredCounts(counts: Record<string, number>, order: Map<string, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(counts).filter(([id]) => order.has(id)));
}

/** The bars with only the series in `order` counted. */
export const declaredBars = (bars: TimelineBar[], order: Map<string, number>): TimelineBar[] =>
  bars.map((bar) => ({ ...bar, counts: declaredCounts(bar.counts, order) }));
