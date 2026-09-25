import { Area, Bar, CartesianGrid, Cell, ComposedChart, Line, XAxis, YAxis, type ActiveDotProps, type DotItemDotProps } from "recharts";
import { Chart, ChartLegend, ChartTooltip, type ChartConfig } from "../../components/Chart";

const series = [
  { period: "Q1", value: 32, estimate: null as number | null },
  { period: "Q2", value: 54, estimate: null },
  { period: "Q3", value: 48, estimate: null },
  { period: "Q4", value: 74, estimate: 74, cited: true, cite: "74% cited" },
  { period: "Next", value: null, estimate: 88 },
];

const draw = { animationDuration: 180, animationEasing: "ease-out" as const };

const seriesConfig = {
  value: { label: "Recorded", color: "var(--di-chart-series)" },
  estimate: { label: "Estimate", color: "var(--di-chart-series)", dashed: true },
} satisfies ChartConfig;

function at(props: { cx?: number | string; cy?: number | string }) {
  const cx = Number(props.cx);
  const cy = Number(props.cy);
  return Number.isFinite(cx) && Number.isFinite(cy) ? { cx, cy } : null;
}

function CitedMark(props: DotItemDotProps) {
  const point = at(props);
  const payload = props.payload as { cited?: boolean; cite?: string } | undefined;
  if (!point || !payload?.cited) return <g />;
  return (
    <g>
      <line x1={point.cx} y1={point.cy} x2={point.cx} y2={point.cy - 14} stroke="var(--di-chart-accent)" />
      <circle cx={point.cx} cy={point.cy} r={4} fill="var(--di-chart-accent)" />
      {payload.cite ? (
        <text
          x={point.cx + 8}
          y={point.cy - 18}
          fill="var(--di-text)"
          fontFamily="var(--di-font-ui)"
          fontSize={12}
          fontWeight={700}
        >
          {payload.cite}
        </text>
      ) : null}
    </g>
  );
}

function SeriesActive(props: ActiveDotProps) {
  const point = at(props);
  if (!point) return <g />;
  const cited = Boolean((props.payload as { cited?: boolean } | undefined)?.cited);
  return <circle cx={point.cx} cy={point.cy} r={4} fill={cited ? "var(--di-chart-accent)" : "var(--di-chart-series)"} />;
}

export function SeriesChart({ legend = false }: { legend?: boolean }) {
  return (
    <Chart label="Recorded series with one cited value and a dashed estimate" config={seriesConfig}>
      <ComposedChart data={series} margin={{ top: 36, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--di-rule)" strokeDasharray="2 3" />
        <XAxis dataKey="period" tickLine={false} axisLine={false} interval={0} padding={{ left: 12, right: 20 }} />
        <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip />
        {legend ? <ChartLegend /> : null}
        <Line
          dataKey="estimate"
          stroke="var(--color-estimate)"
          strokeWidth={1.6}
          strokeDasharray="4 3"
          strokeLinecap="round"
          dot={false}
          activeDot={false}
          legendType="line"
          {...draw}
        />
        <Line
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={1.6}
          strokeLinecap="round"
          dot={CitedMark}
          activeDot={SeriesActive}
          connectNulls={false}
          {...draw}
        />
      </ComposedChart>
    </Chart>
  );
}

const bars = [
  { name: "LLM-A", value: 38, fill: "var(--di-chart-muted)" },
  { name: "LLM-B", value: 52, fill: "var(--di-chart-muted-strong)" },
  { name: "Ours", value: 74, fill: "var(--di-chart-accent)" },
];

const barConfig = {
  value: { label: "Share", color: "var(--di-chart-series)" },
} satisfies ChartConfig;

function shareLabel(props: {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: number | string;
  index?: number;
  viewBox?: { x?: number; y?: number; width?: number; height?: number };
}) {
  const box = props.viewBox ?? props;
  const x = Number(box.x);
  const y = Number(box.y);
  const width = Number(box.width);
  const height = Number(box.height);
  if (![x, y, width, height].every(Number.isFinite)) return <g />;
  return (
    <text
      x={x + width + 8}
      y={y + height / 2}
      dominantBaseline="central"
      fill="var(--di-text)"
      fontFamily="var(--di-font-code)"
      fontSize={11}
      fontWeight={props.index === bars.length - 1 ? 500 : 400}
    >
      {props.value}%
    </text>
  );
}

export function CompareChart() {
  return (
    <Chart label="Comparison. One gold bar, the rest grey" config={barConfig}>
      <ComposedChart data={bars} layout="vertical" margin={{ top: 8, right: 36, bottom: 8, left: 0 }}>
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={52} interval={0} />
        <ChartTooltip />
        <Bar dataKey="value" barSize={14} radius={0} label={(props) => shareLabel(props as Parameters<typeof shareLabel>[0])} {...draw}>
          {bars.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </ComposedChart>
    </Chart>
  );
}

const range = [
  { month: "Jan", low: 28, high: 58, median: 42 },
  { month: "Apr", low: 36, high: 72, median: 54 },
  { month: "Jul", low: 32, high: 68, median: 48 },
  { month: "Oct", low: 44, high: 82, median: 62 },
].map((row) => ({ ...row, span: row.high - row.low }));

const rangeConfig = {
  span: { label: "Range", color: "var(--di-chart-band)" },
  median: { label: "Median", color: "var(--di-chart-series)" },
} satisfies ChartConfig;

function edgeLabel(name: string, dy: number) {
  return (props: { x?: number | string; y?: number | string; index?: number }) => {
    if (props.index !== range.length - 1) return <g />;
    const x = Number(props.x);
    const y = Number(props.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return <g />;
    return (
      <text
        x={x}
        y={y + dy}
        textAnchor="end"
        fill="var(--di-seal-ink)"
        fontFamily="var(--di-font-code)"
        fontSize={11}
        letterSpacing="0.08em"
      >
        {name}
      </text>
    );
  };
}

export function RangeChart() {
  return (
    <Chart label="Confidence band with a solid median" config={rangeConfig}>
      <ComposedChart data={range} margin={{ top: 16, right: 8, bottom: 0, left: 8 }}>
        <XAxis dataKey="month" tickLine={false} axisLine={false} interval={0} padding={{ left: 16, right: 28 }} />
        <YAxis hide domain={[0, 100]} />
        <ChartTooltip />
        <Area dataKey="low" stackId="band" stroke="none" fill="transparent" legendType="none" tooltipType="none" activeDot={false} {...draw} />
        <Area dataKey="span" stackId="band" stroke="none" fill="var(--color-span)" activeDot={false} {...draw} />
        <Line dataKey="high" stroke="none" dot={false} legendType="none" tooltipType="none" isAnimationActive={false} label={(props) => edgeLabel("P90", -4)(props as Parameters<ReturnType<typeof edgeLabel>>[0])} />
        <Line dataKey="low" stroke="none" dot={false} legendType="none" tooltipType="none" isAnimationActive={false} label={(props) => edgeLabel("P10", 14)(props as Parameters<ReturnType<typeof edgeLabel>>[0])} />
        <Line dataKey="median" stroke="var(--color-median)" strokeWidth={1.6} strokeLinecap="round" dot={false} activeDot={false} {...draw} />
      </ComposedChart>
    </Chart>
  );
}
