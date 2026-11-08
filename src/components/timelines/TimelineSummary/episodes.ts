import { totalOf } from "../series";
import type { TimelineBar, TimelineLane, TimelineSpan } from "../types";

/**
 * One stretch of activity: a `burst` stands well above the rest, a
 * `steady` stretch is the activity between bursts. It carries the bars it
 * folds counted by series id, and the lanes active in it in the order they
 * were given.
 */
export type TimelineEpisode = TimelineSpan & {
  kind: "burst" | "steady";
  counts: Record<string, number>;
  total: number;
  /** Where inside it events of each series fell, one stretch per run of touching bars; the rest of it was quiet. */
  stretches: (TimelineSpan & { series: string })[];
  lanes: { id: string; label: string; count: number }[];
};

// A lull shorter than this is a pause inside one episode, not the end of it.
const QUIET_BUCKETS = 2;
const QUIET_SHARE = 1 / 50;
// A bar bursts when it is far above the usual bar and not lost next to the busiest one.
const BURST_OVER_MEDIAN = 4;
const BURST_SHARE = 1 / 20;
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
export function episodesOf(bars: TimelineBar[], lanes: TimelineLane[] = [], max = 6): TimelineEpisode[] {
  const sorted = bars.filter((b) => totalOf(b) > 0).sort((a, b) => a.start - b.start);
  const first = sorted[0];
  const last = sorted.at(-1);
  if (!first || !last) {
    return [];
  }
  const totals = sorted.map(totalOf).sort((a, b) => a - b);
  const median = totals[Math.floor(totals.length / 2)];
  const threshold = Math.max(median * BURST_OVER_MEDIAN, totals[totals.length - 1] * BURST_SHARE);
  const bucket = Math.min(...sorted.map((b) => b.end - b.start));
  const quiet = Math.max(QUIET_BUCKETS * bucket, (last.end - first.start) * QUIET_SHARE);

  const bursts: TimelineSpan[] = [];
  for (const bar of sorted.filter((b) => totalOf(b) >= threshold)) {
    const open = bursts.at(-1);
    if (open && bar.start - open.end < quiet) {
      open.end = Math.max(open.end, bar.end);
    } else {
      bursts.push({ start: bar.start, end: bar.end });
    }
  }
  const burstOf = (bar: TimelineBar) => bursts.find((b) => bar.start >= b.start && bar.start < b.end);

  const segments: Segment[] = [];
  let within: TimelineSpan | undefined;
  for (const bar of sorted) {
    const burst = burstOf(bar);
    const kind = burst ? "burst" : "steady";
    const open = segments.at(-1);
    if (open && open.kind === kind && burst === within && bar.start - open.end < quiet) {
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
  const kept = segments.filter((s) => s.kind === "burst" || s.total >= all * STEADY_MIN_SHARE);
  while (kept.length > Math.max(1, max)) {
    let join = 0;
    let cost = Infinity;
    for (let i = 0; i < kept.length - 1; i++) {
      const gap = kept[i + 1].start - kept[i].end;
      const c = kept[i].kind === kept[i + 1].kind ? gap : gap + (last.end - first.start);
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

/**
 * The same episodes, counted again from other bars of the same record,
 * such as only the events of one series. Their spans, kinds and order stay, so an
 * episode keeps its number whichever set is shown; one the bars do not
 * reach keeps its place with nothing in it.
 */
export function episodesIn(
  episodes: TimelineEpisode[],
  bars: TimelineBar[],
  lanes: TimelineLane[] = [],
): TimelineEpisode[] {
  const sorted = bars.filter((b) => totalOf(b) > 0).sort((a, b) => a.start - b.start);
  return episodes.map((episode) =>
    episodeOf(
      episode,
      episode.kind,
      sorted.filter((b) => b.start >= episode.start && b.start < episode.end),
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
  const counts: Record<string, number> = {};
  const open = new Map<string, TimelineSpan & { series: string }>();
  const stretches: TimelineEpisode["stretches"] = [];
  for (const bar of run) {
    for (const [series, count] of Object.entries(bar.counts)) {
      if (count <= 0) {
        continue;
      }
      counts[series] = (counts[series] ?? 0) + count;
      const stretch = open.get(series);
      // Touching bars of one series are one stretch; any gap, however short, shows.
      if (stretch && bar.start <= stretch.end) {
        stretch.end = Math.max(stretch.end, bar.end);
      } else {
        const next = { start: bar.start, end: bar.end, series };
        open.set(series, next);
        stretches.push(next);
      }
    }
  }
  const active = lanes.flatMap((lane) => {
    const cells = (lane.cells ?? []).filter((c) => c.start < span.end && c.end > span.start);
    return cells.length === 0
      ? []
      : [{ id: lane.id, label: lane.label, count: cells.reduce((n, c) => n + c.count, 0) }];
  });
  return {
    start: span.start,
    end: span.end,
    kind,
    counts,
    total: totalOf({ counts }),
    stretches,
    lanes: active,
  };
}
