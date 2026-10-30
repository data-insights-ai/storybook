import { textWidth } from "../../scale";
import { TICK_FONT, type Tick } from "../../scale";
import type { Scale } from "../../scale";

export const AXIS_H = 22;

// Gridlines run up through everything above; a label that would hang off the edge is left out.
export function TimeAxis({
  ticks,
  label,
  scale,
  plotPx,
  top,
}: {
  ticks: Tick[];
  label: (tick: Tick) => string;
  scale: Scale;
  plotPx: number;
  top: number;
}) {
  return (
    <g className="di-timeline-axis">
      {ticks.map((tick) => {
        const x = Math.round(scale.x(tick.at)) + 0.5;
        const text = label(tick);
        const w = textWidth(text, TICK_FONT) / 2;
        return (
          <g key={tick.at} className={tick.kind === "day" ? "is-day" : undefined}>
            <line x1={x} x2={x} y1={0} y2={top} className="di-timeline-grid" />
            <line x1={x} x2={x} y1={top} y2={top + 4} className="di-timeline-tick" />
            {x - w >= 0 && x + w <= plotPx ? (
              <text x={x} y={top + 15} className="di-timeline-tick-label">
                {text}
              </text>
            ) : null}
          </g>
        );
      })}
      <line x1={0} x2={plotPx} y1={top + 0.5} y2={top + 0.5} className="di-timeline-baseline" />
    </g>
  );
}
