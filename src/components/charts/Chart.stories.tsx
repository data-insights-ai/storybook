import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Area, Bar, CartesianGrid, Cell, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { Chart, ChartLegend, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./Chart";

/*
 * The stories compose `Chart` directly rather than rendering a prepared
 * chart component. Show code prints the story's source, so a helper would
 * print as one tag and teach nothing about the only thing a caller has to
 * get right: a `ChartConfig` keyed by series, read back as `--color-<key>`.
 *
 * The elaborate brand specimens — the cited mark, the P10/P90 edge labels —
 * live in Foundations/Practice. Those demonstrate the brand. These
 * demonstrate the component.
 */

const series = [
  { period: "Q1", value: 32, estimate: null as number | null },
  { period: "Q2", value: 54, estimate: null },
  { period: "Q3", value: 48, estimate: null },
  { period: "Q4", value: 74, estimate: 74 },
  { period: "Next", value: null, estimate: 88 },
];

const seriesConfig = {
  value: { label: "Recorded", color: "var(--di-chart-series)" },
  estimate: { label: "Estimate", color: "var(--di-chart-series)", dashed: true },
} satisfies ChartConfig;

const bars = [
  { name: "Registry", value: 38, fill: "var(--di-chart-muted)" },
  { name: "Mirror", value: 52, fill: "var(--di-chart-muted-strong)" },
  { name: "Feed", value: 74, fill: "var(--di-chart-highlight)" },
];

const barConfig = {
  value: { label: "Share", color: "var(--di-chart-series)" },
} satisfies ChartConfig;

const coverage = [
  { period: "Q1", recorded: 61, compare: 58 },
  { period: "Q2", recorded: 70, compare: 66 },
  { period: "Q3", recorded: 82, compare: 79 },
  { period: "Q4", recorded: 94, compare: 85 },
];

const coverageConfig = {
  recorded: { label: "Recorded", color: "var(--di-chart-series)" },
  compare: { label: "Comparison", color: "var(--di-chart-compare)" },
} satisfies ChartConfig;

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

const meta = {
  title: "Blocks/Chart",
  component: Chart,
  tags: ["autodocs"],
  args: {
    label: "Recorded entries by quarter",
    config: seriesConfig,
    children: null,
  },
  argTypes: {
    label: { control: "text" },
    config: { control: false },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 560px)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * One navy series. `config` names each key and sets its colour; the chart
 * exposes that colour as `--color-<key>`, which the Recharts mark reads —
 * so light and dark stay in sync without the mark knowing about a theme.
 *
 * The estimate is the same colour, dashed: what was measured and what was
 * projected are one series in two states, not two colours.
 */
export const Series: Story = {
  render: (args) => (
    <Chart {...args}>
      <ComposedChart data={series} margin={{ top: 16, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--di-rule)" strokeDasharray="2 3" />
        <XAxis dataKey="period" tickLine={false} axisLine={false} interval={0} />
        <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip />
        <Line
          dataKey="estimate"
          stroke="var(--color-estimate)"
          strokeWidth={1.6}
          strokeDasharray="4 3"
          strokeLinecap="round"
          dot={false}
        />
        <Line
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={1.6}
          strokeLinecap="round"
          dot={false}
          connectNulls={false}
        />
      </ComposedChart>
    </Chart>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: "Recorded entries by quarter" })).toBeVisible();
    // The series colours ride on the element's style, never a style element,
    // so a strict Content-Security-Policy still shows them.
    const chart = canvas.getByRole("group", { name: "Recorded entries by quarter" });
    await expect(chart.querySelector("style")).toBeNull();
    await expect(chart.style.getPropertyValue("--color-value")).not.toBe("");
  },
};

/**
 * A comparison. Everything is warm neutral except the one bar the eye is
 * meant to land on, which takes `--di-chart-highlight`. Per-bar colour is a
 * `Cell`, so the highlight is data, not a second series.
 */
export const Compare: Story = {
  args: { label: "Share of entries by source kind", config: barConfig },
  render: (args) => (
    <Chart {...args}>
      <ComposedChart data={bars} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={64} interval={0} />
        <ChartTooltip />
        <Bar dataKey="value" barSize={14} radius={0}>
          {bars.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </ComposedChart>
    </Chart>
  ),
};

/**
 * Two series, and the second one is a comparison: navy is what was
 * recorded, cornflower is what it is measured against. This is the one
 * place cornflower may share a view with poppy — at most one accent per
 * page, and the two meet only in a chart. A second *ordinary* series is
 * still warm neutral; cornflower names the comparison, not "series two".
 */
export const AgainstComparison: Story = {
  args: { label: "Coverage by quarter, recorded against comparison", config: coverageConfig },
  render: (args) => (
    <Chart {...args}>
      <ComposedChart data={coverage} margin={{ top: 16, right: 12, bottom: 0, left: 0 }} barGap={2}>
        <CartesianGrid vertical={false} stroke="var(--di-rule)" strokeDasharray="2 3" />
        <XAxis dataKey="period" tickLine={false} axisLine={false} interval={0} />
        <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip />
        <ChartLegend />
        <Bar dataKey="recorded" fill="var(--color-recorded)" radius={0} />
        <Bar dataKey="compare" fill="var(--color-compare)" radius={0} />
      </ComposedChart>
    </Chart>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Recorded")).toBeVisible();
    await expect(canvas.getByText("Comparison")).toBeVisible();
  },
};

/**
 * Confidence is drawn, not claimed. The band is two stacked areas — a
 * transparent floor and the span above it — and the median is a solid
 * line. The floor is `legendType="none"` so it never names itself.
 */
export const Range: Story = {
  args: { label: "Coverage range with a median", config: rangeConfig },
  render: (args) => (
    <Chart {...args}>
      <ComposedChart data={range} margin={{ top: 16, right: 8, bottom: 0, left: 8 }}>
        <XAxis dataKey="month" tickLine={false} axisLine={false} interval={0} />
        <YAxis hide domain={[0, 100]} />
        <ChartTooltip />
        <Area
          dataKey="low"
          stackId="band"
          stroke="none"
          fill="transparent"
          legendType="none"
          tooltipType="none"
          activeDot={false}
        />
        <Area dataKey="span" stackId="band" stroke="none" fill="var(--color-span)" activeDot={false} />
        <Line
          dataKey="median"
          stroke="var(--color-median)"
          strokeWidth={1.6}
          strokeLinecap="round"
          dot={false}
          activeDot={false}
        />
      </ComposedChart>
    </Chart>
  ),
};

/**
 * `ChartLegend` reads the same `config` the marks do, so a label and its
 * swatch cannot drift from the series they describe. A series marked
 * `dashed` keeps the dash in the legend.
 */
export const Legend: Story = {
  render: (args) => (
    <Chart {...args}>
      <ComposedChart data={series} margin={{ top: 16, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--di-rule)" strokeDasharray="2 3" />
        <XAxis dataKey="period" tickLine={false} axisLine={false} interval={0} />
        <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip />
        <ChartLegend />
        <Line
          dataKey="estimate"
          stroke="var(--color-estimate)"
          strokeWidth={1.6}
          strokeDasharray="4 3"
          strokeLinecap="round"
          dot={false}
        />
        <Line
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={1.6}
          strokeLinecap="round"
          dot={false}
          connectNulls={false}
        />
      </ComposedChart>
    </Chart>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Recorded")).toBeVisible();
    await expect(canvas.getByText("Estimate")).toBeVisible();
  },
};

const runs = [
  { day: "Mon", low: 4, high: 1, total: 5, note: "" },
  { day: "Tue", low: 2, high: 6, total: 8, note: "Rotated keys · 14:20" },
  { day: "Wed", low: 3, high: 0, total: 3, note: "" },
];

const runConfig = {
  low: { label: "Low", color: "var(--di-chart-series)" },
  high: { label: "High", color: "var(--di-chart-danger)" },
} satisfies ChartConfig;

/**
 * `ChartTooltipContent details` adds lines under the series, read off the
 * hovered datum: here a total and an event. They are ruled off and carry
 * no swatch, so they never pass for a series.
 */
export const TooltipDetails: Story = {
  args: { label: "Runs per day, with what happened", config: runConfig },
  render: (args) => (
    <Chart {...args}>
      <ComposedChart data={runs} margin={{ top: 16, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--di-rule)" strokeDasharray="2 3" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} interval={0} />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <ChartTooltip
          defaultIndex={1}
          content={
            <ChartTooltipContent
              details={(datum) => [
                { label: "Total", value: String(datum.total) },
                ...(datum.note ? [{ label: "Event", value: String(datum.note) }] : []),
              ]}
            />
          }
        />
        <Bar dataKey="low" stackId="runs" fill="var(--color-low)" stroke="var(--di-bg-surface)" />
        <Bar dataKey="high" stackId="runs" fill="var(--color-high)" stroke="var(--di-bg-surface)" />
      </ComposedChart>
    </Chart>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText("Rotated keys · 14:20")).toBeVisible());
    await expect(canvas.getByText("Total")).toBeVisible();
  },
};
