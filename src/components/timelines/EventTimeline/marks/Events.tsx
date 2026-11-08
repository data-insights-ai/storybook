import { memo } from "react";
import type { Scale } from "../../scale";
import { seriesColor, seriesOrder } from "../../series";
import type { TimelineEvent, TimelineSeries } from "../../types";

const DOT = 1.75;
const REACH = 0.5;

/** How far an event's line runs from the axis: one length for every event, since the line marks a kind, not a size. */
export const reachOf = (half: number) => Math.max(3, REACH * half);

const dot = (x: number, y: number) =>
  `M${x - DOT} ${y}a${DOT} ${DOT} 0 1 0 ${2 * DOT} 0a${DOT} ${DOT} 0 1 0 ${-2 * DOT} 0`;

// One event, one line, mirrored like the bars it replaces.
export const Events = memo(function Events({
  events,
  series,
  scale,
  plotPx,
  mid,
  half,
}: {
  events: TimelineEvent[];
  series: TimelineSeries[];
  scale: Scale;
  plotPx: number;
  mid: number;
  half: number;
}) {
  const order = seriesOrder(series);
  const stems = series.map(() => "");
  const tips = series.map(() => "");
  const reach = reachOf(half);
  for (const e of events) {
    const i = order.get(e.series);
    const x = Math.round(scale.x(e.at) * 2) / 2;
    if (i === undefined || x < -DOT || x > plotPx + DOT) {
      continue;
    }
    stems[i] += `M${x} ${mid - reach}V${mid + reach}`;
    tips[i] += dot(x, mid - reach) + dot(x, mid + reach);
  }
  return (
    <g className="di-timeline-events">
      {series.map(({ id }, i) => (
        <g key={id} className="di-timeline-event">
          {stems[i] ? <path d={stems[i]} className="di-timeline-stem" style={{ stroke: seriesColor(i) }} /> : null}
          {tips[i] ? <path d={tips[i]} className="di-timeline-tip" style={{ fill: seriesColor(i) }} /> : null}
        </g>
      ))}
    </g>
  );
});

export function nearestEvent(
  events: TimelineEvent[],
  scale: Scale,
  px: number,
  within: number,
): TimelineEvent | undefined {
  let best: TimelineEvent | undefined;
  let distance = within;
  for (const e of events) {
    const d = Math.abs(scale.x(e.at) - px);
    if (d < distance) {
      best = e;
      distance = d;
    }
  }
  return best;
}
