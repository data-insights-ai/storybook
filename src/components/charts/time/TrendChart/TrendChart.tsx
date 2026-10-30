import { Area, Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts";
import { Chart, ChartLegend, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../../Chart";
import "./TrendChart.css";

export type TrendTone = "series" | "compare" | "highlight" | "muted" | "warn" | "danger";

export type TrendSeries = {
  key: string;
  label: string;
  /** `line` for a level over time, `area` for an amount, `bar` for a count per period. */
  kind?: "line" | "area" | "bar";
  tone?: TrendTone;
  /** A projection or an estimate: the same colour as what was measured, dashed. */
  dashed?: boolean;
  /** Bars with the same stack sit on top of each other. */
  stack?: string;
};

/** A day that matters on the time axis: a license that ends, a renewal. */
export type TrendMarker = { at: string; label: string; tone?: "neutral" | "warn" | "danger" };

const toneColor: Record<TrendTone, string> = {
  series: "var(--di-chart-series)",
  compare: "var(--di-chart-compare)",
  highlight: "var(--di-chart-highlight)",
  muted: "var(--di-chart-muted-strong)",
  warn: "var(--di-chart-warn)",
  danger: "var(--di-chart-danger)",
};

const markerColor = { neutral: "var(--di-text-muted)", warn: "var(--di-chart-warn)", danger: "var(--di-chart-danger)" };
// The rule takes the chart colour; its label is text and takes the status ink, which reads at 4.5:1.
const markerInk = { neutral: "var(--di-text-muted)", warn: "var(--di-status-warn-fg)", danger: "var(--di-status-danger-fg)" };

/**
 * Values over time, from one datum per period: `{ at: "2026-10-01", seats: 4 }`.
 * The product owns the numbers and their words; the chart owns the marks,
 * colours and axes, so the same kind of figure looks the same in every
 * product. A value that is `null` leaves a gap, which is not zero: a forecast
 * series is `null` until today and the measured one `null` after it.
 *
 * `markers` draw a labelled vertical rule on a day, for an expiry or a renewal.
 * `label` names the chart for a screen reader; the page states the key figure
 * in words beside it.
 */
export function TrendChart({
  label,
  data,
  series,
  xKey = "at",
  formatX = String,
  formatValue = (v) => String(v),
  markers = [],
  height = "md",
  legend = series.length > 1,
  yDomain,
}: {
  label: string;
  data: Record<string, string | number | null>[];
  series: TrendSeries[];
  xKey?: string;
  /** The axis and tooltip label of a period, such as a short date. */
  formatX?: (value: string) => string;
  formatValue?: (value: number, key: string) => string;
  markers?: TrendMarker[];
  height?: "sm" | "md" | "lg";
  legend?: boolean;
  yDomain?: [number | "auto", number | "auto"];
}) {
  const config: ChartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: toneColor[s.tone ?? "series"], dashed: s.dashed }]),
  );
  const tick = (v: unknown) => formatX(String(v));
  return (
    <Chart label={label} config={config} className={`di-trend di-trend-${height}`}>
      {/* The right margin holds half of the last tick's label, which is centred on the plot's edge. */}
      <ComposedChart data={data} margin={{ top: 16, right: 24, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--di-rule)" strokeDasharray="2 3" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickFormatter={tick} minTickGap={24} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          domain={yDomain ?? [0, "auto"]}
          tickFormatter={(v: number) => formatValue(v, "")}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent formatValue={formatValue} formatLabel={tick} />} />
        {legend ? <ChartLegend /> : null}
        {series.map((s) => {
          const color = `var(--color-${s.key})`;
          const dash = s.dashed ? "4 3" : undefined;
          if (s.kind === "bar") {
            return <Bar key={s.key} dataKey={s.key} stackId={s.stack} fill={color} radius={s.stack ? 0 : [2, 2, 0, 0]} maxBarSize={18} />;
          }
          if (s.kind === "area") {
            return (
              <Area
                key={s.key}
                dataKey={s.key}
                stroke={color}
                strokeWidth={1.6}
                strokeDasharray={dash}
                fill={color}
                fillOpacity={s.dashed ? 0.04 : 0.1}
                dot={false}
                connectNulls={false}
                isAnimationActive={false}
              />
            );
          }
          return (
            <Line
              key={s.key}
              dataKey={s.key}
              stroke={color}
              strokeWidth={1.6}
              strokeDasharray={dash}
              strokeLinecap="round"
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          );
        })}
        {markers.map((m) => (
          <ReferenceLine
            key={`${m.at}-${m.label}`}
            x={m.at}
            stroke={markerColor[m.tone ?? "neutral"]}
            strokeDasharray="3 3"
            label={{ value: m.label, position: "insideTopRight", fill: markerInk[m.tone ?? "neutral"], fontSize: 11 }}
          />
        ))}
      </ComposedChart>
    </Chart>
  );
}
