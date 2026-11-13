import { memo } from "react";
import type { Scale, Span } from "../../scale";
import { seriesColor } from "../../series";
import type { TimelineCell, TimelineEvent, TimelineLane } from "../../types";

export const LANE_H = 34;
export const TRACK_Y = 18;
export const CELL_H = 10;
const LOW_H = 4;
const MIN_CELL = 2;
const SHADES = 4;

const half = (n: number) => Math.round(n * 2) / 2;

/** A lane's cells of the series in `order`: its own, or one per event once the events are drawn one by one. */
export function cellsOf(
  lane: TimelineLane,
  events: TimelineEvent[] | undefined,
  order: Map<string, number>,
): TimelineCell[] {
  if (!events) {
    return (lane.cells ?? []).filter((c) => order.has(c.series));
  }
  return events.filter((e) => e.lane === lane.id).map((e) => ({ start: e.at, end: e.at, count: 1, series: e.series }));
}

export const countIn = (cells: TimelineCell[], view: Span) =>
  cells.reduce((n, c) => (c.end >= view.start && c.start < view.end ? n + c.count : n), 0);

// A cell keeps its series' colour at full strength and stands taller where the lane was busier.
function lanePaths(cells: TimelineCell[], order: Map<string, number>, scale: Scale, plotPx: number, y: number) {
  const peak = Math.max(1, ...cells.map((c) => c.count));
  const paths = new Map<string, { index: number; shade: number; d: string }>();
  for (const cell of cells) {
    const index = order.get(cell.series);
    const x0 = scale.x(cell.start);
    const x1 = Math.max(x0 + MIN_CELL, scale.x(cell.end));
    if (index === undefined || x1 < 0 || x0 > plotPx) {
      continue;
    }
    const shade = Math.max(1, Math.ceil(Math.sqrt(cell.count / peak) * SHADES));
    const key = `${index}-${shade}`;
    const path = paths.get(key) ?? { index, shade, d: "" };
    paths.set(key, path);
    const w = half(x1 - x0);
    const h = LOW_H + ((CELL_H - LOW_H) * (shade - 1)) / (SHADES - 1);
    path.d += `M${half(x0)} ${y + CELL_H - h}h${w}v${h}h${-w}z`;
  }
  return [...paths.values()].sort((a, b) => a.index - b.index || a.shade - b.shade);
}

// One row per lane in the caller's order, so the order lanes started in reads as a staircase.
// The name and its count sit on a line of their own above the track, written by the caller as HTML so a name can act.
export const Lanes = memo(function Lanes({
  lanes,
  cells,
  order,
  scale,
  plotPx,
  top,
}: {
  lanes: TimelineLane[];
  cells: Map<string, TimelineCell[]>;
  /** Each series id with its place in the declared order. */
  order: Map<string, number>;
  scale: Scale;
  plotPx: number;
  top: number;
}) {
  return (
    <g className="di-timeline-lanes" transform={`translate(0 ${top})`}>
      {lanes.map((lane, i) => {
        const row = i * LANE_H;
        const y = row + TRACK_Y;
        return (
          <g key={lane.id}>
            <rect x={0} y={y} width={plotPx} height={CELL_H} className="di-timeline-lane-track" />
            {lanePaths(cells.get(lane.id) ?? [], order, scale, plotPx, y).map((p) => (
              <path
                key={`${p.index}-${p.shade}`}
                d={p.d}
                className="di-timeline-fill"
                style={{ fill: seriesColor(p.index) }}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
});
