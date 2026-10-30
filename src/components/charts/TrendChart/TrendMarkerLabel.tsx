import { useChartWidth, usePlotArea, useXAxisScale } from "recharts";

/* The band above the plot that holds one row of marker labels, a second row's step, and a label's baseline in it. */
export const MARKER_BAND = 20;
export const MARKER_ROW = 16;
const BASELINE_ABOVE_PLOT = 7;
const LABEL_GAP = 8;
/* The narrowest plot the chart is drawn at (a phone): rows reserved for it hold at every wider width. */
const NARROWEST_PLOT = 280;

/*
 * The width of a label in the chart's small mono type, as the chart sets
 * it: the axis keeps room for half its last label, a marker label keeps
 * inside the chart.
 */
let measure: CanvasRenderingContext2D | null | undefined;
export function labelWidth(text: string): number {
  if (typeof document === "undefined") return text.length * 7;
  measure ??= document.createElement("canvas").getContext("2d");
  const root = getComputedStyle(document.documentElement);
  const size = parseFloat(root.getPropertyValue("--di-font-size-200")) * parseFloat(root.fontSize) || 11;
  if (!measure) return text.length * size * 0.6;
  measure.font = `${size}px ${root.getPropertyValue("--di-font-code") || "monospace"}`;
  return measure.measureText(text).width;
}

type Placed = { x: number; row: number };

/**
 * Each label centred on its rule, moved inward at the chart's edges, and
 * put on the first row where it keeps a gap to the label before it: two
 * markers on nearby days stagger instead of overlapping.
 */
export function placeLabels(labels: { x: number; text: string }[], width: number): Placed[] {
  const order = labels.map((label, i) => ({ ...label, i })).sort((a, b) => a.x - b.x);
  const rowEnds: number[] = [];
  const placed: Placed[] = new Array(labels.length);
  for (const label of order) {
    const half = labelWidth(label.text) / 2;
    const x = Math.min(Math.max(label.x, half), Math.max(half, width - half));
    let row = rowEnds.findIndex((end) => end + LABEL_GAP <= x - half);
    if (row === -1) row = rowEnds.length;
    rowEnds[row] = x + half;
    placed[label.i] = { x, row };
  }
  return placed;
}

/**
 * How many label rows the band above the plot reserves: the rows the
 * labels need on the narrowest plot, where they lie closest together.
 * Positions follow the data index, as the category axis lays them out.
 */
export function markerRows(labels: { index: number; text: string }[], count: number): number {
  if (!labels.length) return 0;
  const step = NARROWEST_PLOT / Math.max(1, count);
  const placed = placeLabels(
    labels.map(({ index, text }) => ({ x: (index + 0.5) * step, text })),
    NARROWEST_PLOT,
  );
  return Math.max(...placed.map((p) => p.row)) + 1;
}

/**
 * The markers' labels in the band above the plot. They are drawn
 * together, so each knows where the others sit; a label never covers a
 * bar or a line and is never cut off.
 */
export function TrendMarkerLabels({
  markers,
  rows,
}: {
  markers: { at: string; label: string; fill: string }[];
  rows: number;
}) {
  const width = useChartWidth() ?? 0;
  const plot = usePlotArea();
  const scale = useXAxisScale();
  if (!plot || !scale) return null;
  const positions = markers.map((m) => ({ x: Number(scale(m.at) ?? NaN), text: m.label }));
  if (positions.some((p) => Number.isNaN(p.x))) return null;
  const placed = placeLabels(positions, width);
  return (
    <g className="di-trend-markers">
      {markers.map((m, i) => (
        <text
          key={`${m.at}-${m.label}`}
          x={placed[i].x}
          y={plot.y - BASELINE_ABOVE_PLOT - Math.min(placed[i].row, rows - 1) * MARKER_ROW}
          textAnchor="middle"
          fill={m.fill}
          className="di-trend-marker"
        >
          {m.label}
        </text>
      ))}
    </g>
  );
}
