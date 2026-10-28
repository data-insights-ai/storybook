import { memo } from "react";
import type { Scale, Span } from "../scale/viewport";
import type { TimelineCell, TimelineEvent, TimelineLane, TimelineTone } from "../types";

export const LANE_H = 34;
const LABEL_Y = 8;
const TRACK_Y = 18;
const CELL_H = 10;
const MIN_CELL = 2;
const SHADES = 4;
const TONES: TimelineTone[] = ["neutral", "warn", "danger"];

const half = (n: number) => Math.round(n * 2) / 2;

/** A lane's cells: its own, or one per event once the events are drawn one by one. */
export function cellsOf(lane: TimelineLane, events: TimelineEvent[] | undefined): TimelineCell[] {
  if (!events) {
    return lane.cells ?? [];
  }
  return events
    .filter((e) => e.lane === lane.id)
    .map((e) => ({ start: e.at, end: e.at, count: 1, tone: e.tone }));
}

export const countIn = (cells: TimelineCell[], view: Span) =>
  cells.reduce((n, c) => (c.end >= view.start && c.start < view.end ? n + c.count : n), 0);

// A cell takes the tone of its severest event and is darker where the lane was busier.
function lanePaths(cells: TimelineCell[], scale: Scale, plotPx: number, y: number) {
  const peak = Math.max(1, ...cells.map((c) => c.count));
  const paths = new Map<string, { tone: TimelineTone; shade: number; d: string }>();
  for (const cell of cells) {
    const x0 = scale.x(cell.start);
    const x1 = Math.max(x0 + MIN_CELL, scale.x(cell.end));
    if (x1 < 0 || x0 > plotPx) {
      continue;
    }
    const shade = Math.max(1, Math.ceil(Math.sqrt(cell.count / peak) * SHADES));
    const key = `${cell.tone}-${shade}`;
    const path = paths.get(key) ?? { tone: cell.tone, shade, d: "" };
    paths.set(key, path);
    const w = half(x1 - x0);
    path.d += `M${half(x0)} ${y}h${w}v${CELL_H}h${-w}z`;
  }
  return [...paths.values()].sort(
    (a, b) => TONES.indexOf(a.tone) - TONES.indexOf(b.tone) || a.shade - b.shade,
  );
}

// One row per lane in the caller's order, so the order lanes started in reads as a staircase.
// The name and its count sit on a line of their own, so no bar runs under the words.
export const Lanes = memo(function Lanes({
  lanes,
  cells,
  counts,
  scale,
  plotPx,
  top,
}: {
  lanes: TimelineLane[];
  cells: Map<string, TimelineCell[]>;
  counts: Map<string, string>;
  scale: Scale;
  plotPx: number;
  top: number;
}) {
  return (
    <g className="di-timeline-lanes" transform={`translate(0 ${top})`}>
      {lanes.map((lane, i) => {
        const row = i * LANE_H;
        const y = row + TRACK_Y;
        const count = counts.get(lane.id);
        return (
          <g key={lane.id}>
            <rect x={0} y={y} width={plotPx} height={CELL_H} className="di-timeline-lane-track" />
            {lanePaths(cells.get(lane.id) ?? [], scale, plotPx, y).map((p) => (
              <path
                key={`${p.tone}-${p.shade}`}
                d={p.d}
                className={`di-timeline-fill is-${p.tone}`}
                fillOpacity={0.25 + (0.75 * p.shade) / SHADES}
              />
            ))}
            <text
              x={0}
              y={row + LABEL_Y}
              className={count ? "di-timeline-lane-label" : "di-timeline-lane-label is-quiet"}
            >
              {lane.label}
              {count ? (
                <tspan dx={8} className="di-timeline-lane-count">
                  {count}
                </tspan>
              ) : null}
            </text>
          </g>
        );
      })}
    </g>
  );
});
