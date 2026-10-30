import { placeLabels, textWidth, TICK_FONT } from "../../scale";
import type { Scale } from "../../scale";
import type { TimelineMarker } from "../../types";

const LABEL_GAP = 10;
/** The band above the bars that holds the flags and their labels, so a label never sits on a bar. */
export const MARK_BAND = 18;

// What people did to the record, on the same clock as what happened in it.
export function Markers({
  markers,
  scale,
  plotPx,
  height,
}: {
  markers: TimelineMarker[];
  scale: Scale;
  plotPx: number;
  height: number;
}) {
  const visible = markers
    .map((m) => ({ ...m, x: Math.round(scale.x(m.at)) + 0.5 }))
    .filter((m) => m.x >= 0 && m.x <= plotPx);
  const sides = placeLabels(
    visible.map((m) => ({ x: m.x, width: textWidth(m.label, TICK_FONT) + LABEL_GAP })),
    plotPx,
  );
  return (
    <g className="di-timeline-markers">
      {visible.map((m, i) => (
        <g key={`${m.at}-${m.label}`}>
          <line x1={m.x} x2={m.x} y1={0} y2={height} className="di-timeline-marker" />
          <path d={`M${m.x - 3.5} 0h7l-3.5 5z`} className="di-timeline-marker-flag" />
          {sides[i] ? (
            <text
              x={sides[i] === "right" ? m.x + 6 : m.x - 6}
              y={MARK_BAND / 2 + 1}
              textAnchor={sides[i] === "right" ? "start" : "end"}
              className="di-timeline-marker-label"
            >
              {m.label}
            </text>
          ) : null}
        </g>
      ))}
    </g>
  );
}
