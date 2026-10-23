import type {
  TimelineBar,
  TimelineLane,
  TimelineSpan,
  TimelineTone,
} from "../types";

/**
 * One stretch of activity: a `burst` stands well above the rest, a
 * `steady` stretch is the activity between bursts. It carries the bars it
 * folds counted by tone, and the lanes active in it in the order they were
 * given.
 */
export type TimelineEpisode = TimelineSpan &
  Record<TimelineTone, number> & {
    kind: "burst" | "steady";
    total: number;
    /** The severest tone it holds. */
    tone: TimelineTone;
    /** Where inside it events fell, each stretch in its severest tone; the rest of it was quiet. */
    stretches: (TimelineSpan & { tone: TimelineTone })[];
    lanes: { id: string; label: string; count: number; tone: TimelineTone }[];
  };

const RANK: Record<TimelineTone, number> = { neutral: 0, warn: 1, danger: 2 };
const severest = (a: TimelineTone, b: TimelineTone) =>
  RANK[b] > RANK[a] ? b : a;
const totalOf = (b: TimelineBar) => b.neutral + b.warn + b.danger;

// A lull shorter than this is a pause inside one episode, not the end of it.
const QUIET_BUCKETS = 2;
const QUIET_SHARE = 1 / 50;
// A bar bursts when it is far above the usual bar and not lost next to the busiest one.
// Severe events weigh more, so a burst of them stands out sooner.
const BURST_OVER_MEDIAN = 4;
const BURST_SHARE = 1 / 20;
const WEIGHT: Record<TimelineTone, number> = { neutral: 1, warn: 2, danger: 4 };
const weightOf = (b: TimelineBar) =>
  b.neutral * WEIGHT.neutral + b.warn * WEIGHT.warn + b.danger * WEIGHT.danger;
// A steady stretch this small is noise between two episodes, not one of its own.
const STEADY_MIN_SHARE = 1 / 50;

type Segment = TimelineSpan & { kind: TimelineEpisode["kind"]; total: number };

/**
 * The few stretches a reader should know about, at most `max`, in order.
 * Bursts are runs of bars far above the usual one; what runs between them
 * is steady, and either is split where the activity goes quiet for long
 * enough to notice at the scale of the whole. Past `max`, the closest
 * neighbours of one kind are joined first. A steady stretch too small to
 * matter is left out, so its events are in no episode.
 */
export function episodesOf(
  bars: TimelineBar[],
  lanes: TimelineLane[] = [],
  max = 6,
): TimelineEpisode[] {
  const sorted = bars
    .filter((b) => totalOf(b) > 0)
    .sort((a, b) => a.start - b.start);
  const first = sorted[0];
  const last = sorted.at(-1);
  if (!first || !last) {
    return [];
  }
  const weights = sorted.map(weightOf).sort((a, b) => a - b);
  const median = weights[Math.floor(weights.length / 2)];
  const threshold = Math.max(
    median * BURST_OVER_MEDIAN,
    weights[weights.length - 1] * BURST_SHARE,
  );
  const bucket = Math.min(...sorted.map((b) => b.end - b.start));
  const quiet = Math.max(
    QUIET_BUCKETS * bucket,
    (last.end - first.start) * QUIET_SHARE,
  );

  const bursts: TimelineSpan[] = [];
  for (const bar of sorted.filter((b) => weightOf(b) >= threshold)) {
    const open = bursts.at(-1);
    if (open && bar.start - open.end < quiet) {
      open.end = Math.max(open.end, bar.end);
    } else {
      bursts.push({ start: bar.start, end: bar.end });
    }
  }
  const burstOf = (bar: TimelineBar) =>
    bursts.find((b) => bar.start >= b.start && bar.start < b.end);

  const segments: Segment[] = [];
  let within: TimelineSpan | undefined;
  for (const bar of sorted) {
    const burst = burstOf(bar);
    const kind = burst ? "burst" : "steady";
    const open = segments.at(-1);
    if (
      open &&
      open.kind === kind &&
      burst === within &&
      bar.start - open.end < quiet
    ) {
      open.end = Math.max(open.end, bar.end);
      open.total += totalOf(bar);
    } else {
      segments.push({
        start: bar.start,
        end: bar.end,
        kind,
        total: totalOf(bar),
      });
    }
    within = burst;
  }

  const all = sorted.reduce((n, b) => n + totalOf(b), 0);
  const kept = segments.filter(
    (s) => s.kind === "burst" || s.total >= all * STEADY_MIN_SHARE,
  );
  while (kept.length > Math.max(1, max)) {
    let join = 0;
    let cost = Infinity;
    for (let i = 0; i < kept.length - 1; i++) {
      const gap = kept[i + 1].start - kept[i].end;
      const c =
        kept[i].kind === kept[i + 1].kind
          ? gap
          : gap + (last.end - first.start);
      if (c < cost) {
        cost = c;
        join = i;
      }
    }
    const [a, b] = kept.splice(join, 2);
    kept.splice(join, 0, {
      start: a.start,
      end: b.end,
      kind: a.kind === "burst" || b.kind === "burst" ? "burst" : "steady",
      total: a.total + b.total,
    });
  }

  return kept.map((segment) =>
    episodeOf(
      segment,
      segment.kind,
      sorted.filter((b) => b.start >= segment.start && b.start < segment.end),
      lanes,
    ),
  );
}

function episodeOf(
  span: TimelineSpan,
  kind: TimelineEpisode["kind"],
  run: TimelineBar[],
  lanes: TimelineLane[],
): TimelineEpisode {
  const counts = { neutral: 0, warn: 0, danger: 0 };
  for (const bar of run) {
    counts.neutral += bar.neutral;
    counts.warn += bar.warn;
    counts.danger += bar.danger;
  }
  const tone: TimelineTone = counts.danger
    ? "danger"
    : counts.warn
      ? "warn"
      : "neutral";
  const active = lanes.flatMap((lane) => {
    const cells = (lane.cells ?? []).filter(
      (c) => c.start < span.end && c.end > span.start,
    );
    if (cells.length === 0) {
      return [];
    }
    return [
      {
        id: lane.id,
        label: lane.label,
        count: cells.reduce((n, c) => n + c.count, 0),
        tone: cells.reduce<TimelineTone>(
          (t, c) => severest(t, c.tone),
          "neutral",
        ),
      },
    ];
  });
  const stretches: TimelineEpisode["stretches"] = [];
  for (const bar of run) {
    const tone: TimelineTone = bar.danger ? "danger" : bar.warn ? "warn" : "neutral";
    const open = stretches.at(-1);
    // Touching bars of one tone are one stretch; any gap, however short, shows.
    if (open && open.tone === tone && bar.start <= open.end) {
      open.end = Math.max(open.end, bar.end);
    } else {
      stretches.push({ start: bar.start, end: bar.end, tone });
    }
  }
  return {
    start: span.start,
    end: span.end,
    kind,
    stretches,
    ...counts,
    total: counts.neutral + counts.warn + counts.danger,
    tone,
    lanes: active,
  };
}
