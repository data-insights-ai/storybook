import { textWidth } from "../../scale";
import { TICK_FONT, type AxisBreak, type Tick } from "../../scale";
import type { Scale } from "../../scale";

export const AXIS_H = 22;
const SLASH = 4;

// Gridlines run up through everything above; a label that would hang off the edge or into a break is left out.
export function TimeAxis({
  ticks,
  label,
  scale,
  plotPx,
  top,
  breaks,
}: {
  ticks: Tick[];
  label: (tick: Tick) => string;
  scale: Scale;
  plotPx: number;
  top: number;
  breaks: AxisBreak[];
}) {
  return (
    <g className="di-timeline-axis">
      {ticks.map((tick) => {
        const x = Math.round(scale.x(tick.at)) + 0.5;
        const text = label(tick);
        const w = textWidth(text, TICK_FONT) / 2;
        const clear = x - w >= 0 && x + w <= plotPx && !breaks.some((b) => x + w > b.from && x - w < b.to);
        return (
          <g key={tick.at} className={tick.kind === "day" ? "is-day" : undefined}>
            <line x1={x} x2={x} y1={0} y2={top} className="di-timeline-grid" />
            <line x1={x} x2={x} y1={top} y2={top + 4} className="di-timeline-tick" />
            {clear ? (
              <text x={x} y={top + 15} className="di-timeline-tick-label">
                {text}
              </text>
            ) : null}
          </g>
        );
      })}
      <AxisLine y={top + 0.5} plotPx={plotPx} breaks={breaks} className="di-timeline-baseline" />
    </g>
  );
}

/**
 * A horizontal rule across the plot, cut where the axis breaks: the two slashes in the cut say that time was
 * left out there, so a long quiet stretch takes a few pixels instead of most of the plot.
 */
export function AxisLine({
  y,
  plotPx,
  breaks,
  className,
}: {
  y: number;
  plotPx: number;
  breaks: AxisBreak[];
  className: string;
}) {
  if (breaks.length === 0) return <line x1={0} x2={plotPx} y1={y} y2={y} className={className} />;
  let from = 0;
  let rule = "";
  let slashes = "";
  for (const b of breaks) {
    const mid = (b.from + b.to) / 2;
    rule += `M${from} ${y}H${mid - SLASH}`;
    slashes += `M${mid - SLASH - 2} ${y + SLASH}l4 ${-2 * SLASH}M${mid + SLASH - 2} ${y + SLASH}l4 ${-2 * SLASH}`;
    from = mid + SLASH;
  }
  rule += `M${from} ${y}H${plotPx}`;
  return (
    <g className="di-timeline-break">
      <path d={rule} className={className} />
      <path d={slashes} className="di-timeline-break-mark" />
    </g>
  );
}
