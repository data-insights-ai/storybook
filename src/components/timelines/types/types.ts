/** A stretch of time in epoch milliseconds; `end` is exclusive. */
export type Span = { start: number; end: number };

/** A stretch of time in epoch milliseconds; `end` is exclusive. */
export type TimelineSpan = Span;

/**
 * One kind of event the timeline tells apart: a kind, not a rank, so the
 * colours imply no severity. A timeline declares its series in order; that
 * order stacks the bars and lists the key, and series `i` is drawn in
 * `--di-chart-category-(i + 1)`. Six steps exist: fold a seventh and
 * further kinds into one before passing them.
 */
export type TimelineSeries = { id: string; label: string };

/** How many events of each series, by its id, fell into one bucket. */
export type TimelineBar = Span & { counts: Record<string, number> };

/** One event, drawn on its own once the view is close enough; `lane` names the lane it is also marked in. */
export type TimelineEvent = {
  id: string;
  at: number;
  series: string;
  lane?: string;
};

/** A lane's activity in one bucket, drawn in the series the caller names for it. */
export type TimelineCell = Span & { count: number; series: string };

/** One row under the bars. Without `cells` it is filled from the events of its id. */
export type TimelineLane = { id: string; label: string; cells?: TimelineCell[] };

/** Something that happened to the record rather than in it: opened, assigned, closed. */
export type TimelineMarker = { at: number; label: string };

/**
 * A value over time drawn as a step line above the bars, on the same clock:
 * it holds from one point until the next. `warn` and `danger` shade the
 * bands above them; `compare` is the value it is measured against.
 */
export type TimelineScore = {
  label: string;
  points: { at: number; value: number }[];
  max: number;
  warn?: number;
  danger?: number;
  compare?: { at: number; value: number; label: string };
};

/**
 * One way to move the view: the keys or gestures, each shown as a key cap,
 * and what they do. `keys` are alternatives — any one of them works.
 * `pointer` shows it only to a mouse (`fine`) or only to touch (`coarse`),
 * so a phone does not list a scroll wheel.
 */
export type TimelineInstruction = { keys: string[]; label: string; pointer?: "fine" | "coarse" };

/** What sits under the pointer, for the caller's readout. */
export type TimelineTarget = { at: number; score?: number } & (
  { kind: "bar"; bar: TimelineBar } | { kind: "event"; event: TimelineEvent } | { kind: "gap" }
);
