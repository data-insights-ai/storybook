import { useChartWidth } from "recharts";

/* The band above the plot that holds the marker labels, and the label's baseline in it. */
export const MARKER_BAND = 20;
const BASELINE_ABOVE_PLOT = 7;

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

/**
 * A marker's label in the band above the plot, centred on its rule and
 * moved inward at the chart's edges, so it never covers a bar or a line
 * and is never cut off. Recharts passes the rule's `viewBox`.
 */
export function TrendMarkerLabel({
  value,
  fill,
  viewBox,
}: {
  value: string;
  fill: string;
  viewBox?: { x?: number; y?: number };
}) {
  const width = useChartWidth() ?? 0;
  if (viewBox?.x === undefined || viewBox.y === undefined) return null;
  const half = labelWidth(value) / 2;
  const x = Math.min(Math.max(viewBox.x, half), Math.max(half, width - half));
  return (
    <text x={x} y={viewBox.y - BASELINE_ABOVE_PLOT} textAnchor="middle" fill={fill} className="di-trend-marker">
      {value}
    </text>
  );
}
