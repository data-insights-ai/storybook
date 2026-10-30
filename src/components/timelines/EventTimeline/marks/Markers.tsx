import { placeLabels, textWidth, TICK_FONT, type Side } from "../../scale";
import type { Scale } from "../../scale";
import type { TimelineMarker } from "../../types";

const LABEL_GAP = 10;
/** One row of the band above the bars that holds the flags and their labels, so a label never sits on a bar. */
export const MARK_BAND = 18;
/* A label that collides with another goes to the second row; the band never grows past it. */
const MAX_ROWS = 2;

type Placed = TimelineMarker & { x: number; side?: Side; row: number };

/*
 * Left to right, each label on the first row where it overprints no label
 * already placed there, beside its flag or, at the plot's end, before it.
 */
function place(markers: TimelineMarker[], scale: Scale, plotPx: number): Placed[] {
  const visible: Placed[] = markers
    .map((m) => ({ ...m, x: Math.round(scale.x(m.at)) + 0.5, row: 0 }))
    .filter((m) => m.x >= 0 && m.x <= plotPx);
  let open = visible;
  for (let row = 0; row < MAX_ROWS && open.length; row++) {
    const sides = placeLabels(
      open.map((m) => ({ x: m.x, width: textWidth(m.label, TICK_FONT) + LABEL_GAP })),
      plotPx,
    );
    open.forEach((m, i) => {
      m.side = sides[i];
      m.row = row;
    });
    open = open.filter((m) => !m.side);
  }
  return visible;
}

/**
 * How many rows the band above the bars holds: as many as the labels need
 * when the whole record is in view, where they lie closest together, so the
 * band does not jump while the reader zooms.
 */
export function markerRows(markers: TimelineMarker[], wholeScale: Scale, plotPx: number): number {
  if (!markers.length) return 0;
  return Math.max(1, ...place(markers, wholeScale, plotPx).map((m) => (m.side ? m.row + 1 : 1)));
}

// What people did to the record, on the same clock as what happened in it.
export function Markers({
  markers,
  scale,
  plotPx,
  height,
  rows,
}: {
  markers: TimelineMarker[];
  scale: Scale;
  plotPx: number;
  height: number;
  rows: number;
}) {
  const placed = place(markers, scale, plotPx);
  return (
    <g className="di-timeline-markers">
      {placed.map((m) => (
        <g key={`${m.at}-${m.label}`}>
          <line x1={m.x} x2={m.x} y1={0} y2={height} className="di-timeline-marker" />
          <path d={`M${m.x - 3.5} 0h7l-3.5 5z`} className="di-timeline-marker-flag" />
          {m.side && m.row < rows ? (
            <text
              x={m.side === "right" ? m.x + 6 : m.x - 6}
              y={m.row * MARK_BAND + MARK_BAND / 2 + 1}
              textAnchor={m.side === "right" ? "start" : "end"}
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
