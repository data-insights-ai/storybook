import { scaleOf, widthOf, type Scale, type Span } from "./viewport";

/** How wide a long empty stretch is drawn: the break that stands in for it. */
export const BREAK_PX = 32;
/** A stretch shorter than this share of the plot is drawn as it is; from a little more it is a full break. */
const QUIET_SHARE = 0.25;
const FOLDED_SHARE = 0.3;

/**
 * How wide an empty stretch that would take `linear` pixels is drawn: as it is up to the quiet share of the plot,
 * then narrowing quickly into a break, so a stretch folds while the view zooms without a jump.
 */
export function drawnWidth(linear: number, plotPx: number, keepPx = BREAK_PX) {
  const from = plotPx * QUIET_SHARE;
  const to = plotPx * FOLDED_SHARE;
  if (linear <= from) return linear;
  if (linear >= to) return Math.min(linear, keepPx);
  return Math.max(keepPx, from - ((linear - from) / (to - from)) * (from - keepPx));
}

/** An empty stretch drawn shorter than it is: its instants, and the pixels it takes. */
export type AxisBreak = Span & { from: number; to: number };

/** A scale whose long empty stretches are folded into breaks. */
export type BrokenScale = Scale & { breaks: AxisBreak[] };

/**
 * The stretches between activity: everything that is not inside one of `active` and lies between the first and
 * the last of them. Nothing before the first or after the last is a gap, so a view at the edge stays as it is.
 */
export function gapsBetween(active: Span[]): Span[] {
  const sorted = active.filter((s) => s.end >= s.start).sort((a, b) => a.start - b.start);
  const gaps: Span[] = [];
  let reach = sorted[0]?.end ?? 0;
  for (const span of sorted.slice(1)) {
    if (span.start > reach) gaps.push({ start: reach, end: span.start });
    reach = Math.max(reach, span.end);
  }
  return gaps;
}

/**
 * Like `scaleOf`, with the part of each gap in view drawn `drawnWidth` wide; the rest of the view shares what is
 * left at one rate, so bars either side of a break stay comparable.
 */
export function brokenScaleOf(span: Span, px: number, gaps: Span[], keepPx = BREAK_PX): BrokenScale {
  const k = px / Math.max(1, widthOf(span));
  const parts = gaps
    .map((g) => ({ start: Math.max(g.start, span.start), end: Math.min(g.end, span.end) }))
    .map((g) => ({ ...g, linear: (g.end - g.start) * k }))
    .map((g) => ({ ...g, drawn: drawnWidth(g.linear, px, keepPx) }))
    .filter((g) => g.drawn < g.linear - 0.5);
  const foldedMs = parts.reduce((sum, g) => sum + g.end - g.start, 0);
  // A view that is nearly all gap has nothing to make room for.
  if (parts.length === 0 || widthOf(span) - foldedMs < widthOf(span) * 0.05)
    return { ...scaleOf(span, px), breaks: [] };
  // Breaks never take more than half the plot, however many there are.
  const drawnPx = parts.reduce((sum, g) => sum + g.drawn, 0);
  const shrink = Math.min(1, px / 2 / drawnPx);
  const rate = (px - drawnPx * shrink) / (widthOf(span) - foldedMs);

  const knots = [{ ms: span.start, px: 0 }];
  const breaks: AxisBreak[] = [];
  let at = 0;
  for (const g of parts) {
    at += (g.start - knots[knots.length - 1].ms) * rate;
    knots.push({ ms: g.start, px: at });
    breaks.push({ start: g.start, end: g.end, from: at, to: at + g.drawn * shrink });
    at += g.drawn * shrink;
    knots.push({ ms: g.end, px: at });
  }
  knots.push({ ms: span.end, px: at + (span.end - knots[knots.length - 1].ms) * rate });

  const last = knots.length - 1;
  const piece = (pick: (knot: { ms: number; px: number }) => number, value: number) => {
    let i = 0;
    while (i < last - 1 && value > pick(knots[i + 1])) i++;
    return i;
  };
  return {
    breaks,
    x: (ms) => {
      if (ms <= span.start) return (ms - span.start) * rate;
      if (ms >= span.end) return knots[last].px + (ms - span.end) * rate;
      const i = piece((n) => n.ms, ms);
      const [a, b] = [knots[i], knots[i + 1]];
      return a.px + ((ms - a.ms) / Math.max(1, b.ms - a.ms)) * (b.px - a.px);
    },
    at: (x) => {
      if (x <= 0) return span.start + x / rate;
      if (x >= knots[last].px) return span.end + (x - knots[last].px) / rate;
      const i = piece((n) => n.px, x);
      const [a, b] = [knots[i], knots[i + 1]];
      return a.ms + ((x - a.px) / Math.max(1e-9, b.px - a.px)) * (b.ms - a.ms);
    },
  };
}

/** The stretches of `span` drawn at the common rate, between its breaks, each with the pixels it takes. */
export function segmentsOf(span: Span, px: number, breaks: AxisBreak[]): (Span & { px: number })[] {
  const segments: (Span & { px: number })[] = [];
  let start = span.start;
  let from = 0;
  for (const b of breaks) {
    segments.push({ start, end: b.start, px: b.from - from });
    start = b.end;
    from = b.to;
  }
  segments.push({ start, end: span.end, px: px - from });
  return segments.filter((s) => s.end > s.start && s.px > 0);
}

type Counted = Span & { neutral: number; warn: number; danger: number };

/**
 * Where something happened: a bar with events, an event, a marker. The view's `bars` are finer than the
 * overview's, so where they reach they speak for that stretch and the overview's buckets only for the rest.
 */
export function activityOf(bars: Counted[], overviewBars: Counted[], instants: number[]): Span[] {
  const busy = (b: Counted) => b.neutral + b.warn + b.danger > 0;
  const fine = bars.filter(busy);
  const reach = fine.length
    ? { start: Math.min(...fine.map((b) => b.start)), end: Math.max(...fine.map((b) => b.end)) }
    : null;
  const coarse = overviewBars.filter(busy).flatMap((b): Span[] => {
    if (!reach || b.end <= reach.start || b.start >= reach.end) return [b];
    return [
      { start: b.start, end: reach.start },
      { start: reach.end, end: b.end },
    ].filter((s) => s.end > s.start);
  });
  return [...fine, ...coarse, ...instants.map((at) => ({ start: at, end: at }))];
}
