/** A stretch of time in epoch milliseconds; `end` is exclusive. */
export type Span = { start: number; end: number };

// Narrower than two seconds, even a burst of hundreds has nothing more to show.
export const MIN_SPAN = 2_000;

export const widthOf = (span: Span) => span.end - span.start;

/** Everything from the first event to the last, with a margin so neither sits on the frame. */
export function boundsAround(first: number, last: number): Span {
  const pad = Math.max((last - first) * 0.02, 30_000);
  return { start: first - pad, end: last + pad };
}

// At an edge the view moves back inside instead of being squeezed.
export function clampSpan(span: Span, bounds: Span): Span {
  const width = Math.min(Math.max(widthOf(span), MIN_SPAN), widthOf(bounds));
  const start = Math.min(Math.max(span.start, bounds.start), bounds.end - width);
  return { start, end: start + width };
}

// The instant under the pointer stays under the pointer.
export function zoomAround(span: Span, at: number, factor: number, bounds: Span): Span {
  const width = Math.min(Math.max(widthOf(span) * factor, MIN_SPAN), widthOf(bounds));
  const start = at - ((at - span.start) / widthOf(span)) * width;
  return clampSpan({ start, end: start + width }, bounds);
}

export const panBy = (span: Span, ms: number, bounds: Span) =>
  clampSpan({ start: span.start + ms, end: span.end + ms }, bounds);

export const covers = (span: Span, bounds: Span) => widthOf(span) >= widthOf(bounds) * 0.995;

export const sameSpan = (a: Span, b: Span) =>
  Math.abs(a.start - b.start) < 1 && Math.abs(a.end - b.end) < 1;

export type Scale = { x: (ms: number) => number; at: (px: number) => number };

export function scaleOf(span: Span, px: number): Scale {
  const k = px / Math.max(1, widthOf(span));
  return { x: (ms) => (ms - span.start) * k, at: (x) => span.start + x / k };
}
