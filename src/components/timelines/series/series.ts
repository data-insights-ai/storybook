import type { TimelineBar, TimelineSeries } from "../types";

const STEPS = 6;

/** The categorical step of the series at `index` in the declared order; past the sixth they share the last. */
export const seriesColor = (index: number) => `var(--di-chart-category-${Math.min(index, STEPS - 1) + 1})`;

/** Each series id with its position in the declared order. */
export const seriesOrder = (series: TimelineSeries[]) => new Map(series.map((s, i) => [s.id, i]));

/** Every event a bar counts, whichever series it is in. */
export const totalOf = (bar: Pick<TimelineBar, "counts">) => Object.values(bar.counts).reduce((n, c) => n + c, 0);
