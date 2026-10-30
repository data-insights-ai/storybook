import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Panel, PanelFooter } from "../../layout/page/Panel";
import { LevelMeter, LevelMeterLegend, LevelMeterScale } from "./LevelMeter";

const stack = { display: "flex", flexDirection: "column", gap: "var(--di-gap-12)" } as const;
const grid = {
  display: "grid",
  gridTemplateColumns: "max-content minmax(0, 1fr) max-content max-content",
  gap: "var(--di-gap-8) var(--di-gap-12)",
  alignItems: "center",
} as const;
const num = {
  fontFamily: "var(--di-font-code)",
  fontSize: "var(--di-font-size-200)",
  fontVariantNumeric: "tabular-nums",
  textAlign: "right",
  color: "var(--di-text-muted)",
} as const;

const meta = {
  title: "Status/LevelMeter",
  component: LevelMeter,
  tags: ["layer:primitive", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** one measured value on a fixed scale, read as a length: a host's load, a quota, a share of a whole, a model's confidence.",
          "**When to use:** a value a reader compares against the ends of its scale, beside the figure that states it. **When not to:** a value over time is a `TrendChart`; a wait with a count is `Progress`; a severity is `SeverityMark`; a ranked breakdown with a total is `Distribution` (which draws its rows with this meter).",
          "**Anatomy:** the track and its fill; optionally a comparison track beneath; above a column of meters, one `LevelMeterLegend` and one `LevelMeterScale`.",
          '**Variants:** `segments` (a count, default 30) draws a counted scale of square segments; `segments="continuous"` draws one thin bar, for a list row or the rule under a field. `bands` colour the segments by the zone they start in; `tone` colours the whole fill when the reading is itself a state. `compare` adds the same scale at another point, in cornflower; `null` there means nothing was on record.',
          '**Content:** the caller prints the figure beside the meter; colour is never the only channel. `label` names the reading ("R-0412 load now"), `valueText` says it when a number alone is not enough ("7 of 10 seats").',
          '**Accessibility:** `role="meter"` with `aria-valuenow`, `-min`, `-max` and the optional `aria-valuetext`; an empty comparison track is an image named by `compareLabel`.',
        ].join("\n\n"),
      },
    },
  },
  args: {
    label: "Load now",
    value: 72,
    max: 100,
    segments: 30,
    bands: { warn: 50, danger: 75 },
    compare: 58,
    compareLabel: "Load 7 days ago",
  },
  argTypes: {
    label: { control: "text" },
    compareLabel: { control: "text" },
    value: { control: { type: "range", min: 0, max: 100 } },
    compare: { control: { type: "range", min: 0, max: 100 } },
    bands: { control: "object" },
  },
  render: (args) => (
    <div style={{ ...stack, gap: "var(--di-gap-6)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--di-gap-12)" }}>
        <span>Load on R-0412</span>
        <span style={num}>
          {args.value} now{typeof args.compare === "number" ? ` · ${args.compare} seven days ago` : ""}
        </span>
      </div>
      <LevelMeter {...args} />
    </div>
  ),
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "var(--di-measure-form)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LevelMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A quota in its panel: the figure in words, the meter as its second
 * channel. `valueText` says it the way the panel does.
 */
export const Quota: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Panel title="Seats" heading={2}>
      <div style={stack}>
        <p style={{ margin: 0 }}>7 of 10 seats in use</p>
        <LevelMeter label="Seats in use" value={7} max={10} valueText="7 of 10 seats" segments={10} />
      </div>
      <PanelFooter>
        <Button variant="secondary" size="sm">
          Manage seats
        </Button>
      </PanelFooter>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole("meter", { name: "Seats in use" });
    await expect(meter).toHaveAttribute("aria-valuetext", "7 of 10 seats");
  },
};

/** The reading, with the same scale at the comparison point beneath it. */
export const WithComparison: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("meter", { name: "Load now" })).toHaveAttribute("aria-valuenow", "72");
    await expect(canvas.getByRole("meter", { name: "Load 7 days ago" })).toHaveAttribute("aria-valuenow", "58");
  },
};

/** A reading in the lowest band never leaves the series colour. */
export const Low: Story = {
  args: { value: 18, compare: 24 },
};

/** A reading that reaches the danger band ends in it. */
export const Critical: Story = {
  args: { value: 94, compare: 61 },
};

/** No comparison track at all: the meter is a single reading. */
export const Alone: Story = {
  args: { compare: undefined, compareLabel: "" },
};

/**
 * `null`: there is a comparison point, and nothing was on record at it. The
 * track stays, empty, so the rows of a column keep one height, and it is
 * named, because an empty track is not a reading of zero.
 */
export const NothingThen: Story = {
  args: { compare: null, compareLabel: "No load on record 7 days ago" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: "No load on record 7 days ago" })).toBeVisible();
  },
};

/**
 * Continuous: one thin bar, for a row of a list or the rule under a field.
 * `tone` colours the whole fill when the reading is a state; the words
 * beside it say which.
 */
export const Continuous: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={stack}>
      {[
        { label: "Matched on 3 of 4 inputs", value: 94, tone: "neutral" as const },
        { label: "Matched on 1 of 4 inputs, to review", value: 41, tone: "warn" as const },
      ].map((row) => (
        <div key={row.label} style={{ ...stack, gap: "var(--di-gap-4)" }}>
          <span>{row.label}</span>
          <LevelMeter label={row.label} value={row.value} segments="continuous" tone={row.tone} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const fills = canvasElement.querySelectorAll(".di-level-fill");
    await expect(fills).toHaveLength(2);
    await expect(fills[1]).toHaveClass("is-warn");
    const track = fills[0]!.parentElement!.getBoundingClientRect();
    await expect(Math.round(fills[0]!.getBoundingClientRect().width)).toBe(Math.round(track.width * 0.94));
  },
};

/** The comparison point moves; the segments change at once, as a chart updates without drawing in. */
export const Moving: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const points = [
      { label: "Load 24 h ago", value: 66 },
      { label: "Load 7 days ago", value: 41 },
      { label: "Load 30 days ago", value: 12 },
    ];
    const [at, setAt] = useState(0);
    const point = points[at]!;
    return (
      <div style={stack}>
        <LevelMeter label="Load now" value={72} compare={point.value} compareLabel={point.label} />
        <div>
          <Button variant="secondary" size="sm" onClick={() => setAt((at + 1) % points.length)}>
            Compare with an earlier point
          </Button>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Compare with an earlier point" }));
    await waitFor(() =>
      expect(canvas.getByRole("meter", { name: "Load 7 days ago" })).toHaveAttribute("aria-valuenow", "41"),
    );
    // A pointer click leaves no ring; the test's synthetic click would, so the story ends without focus.
    (document.activeElement as HTMLElement | null)?.blur();
  },
};

const rows = [
  { id: "R-0412", now: 91, then: 64 },
  { id: "R-0409", now: 63, then: 63 },
  { id: "R-0398", now: 38, then: 51 },
  { id: "R-0377", now: 12, then: null },
];

function Column({ title, valueLabel, compareLabel, scaleLabel, missing, now, then }: Record<string, string>) {
  return (
    <Panel title={title} heading={2}>
      <div style={stack}>
        <LevelMeterLegend valueLabel={valueLabel!} compareLabel={compareLabel} />
        <div style={grid}>
          <span />
          <LevelMeterScale label={scaleLabel!} />
          <span style={num}>{now}</span>
          <span style={num}>{then}</span>
          {rows.map((row) => (
            <div key={row.id} style={{ display: "contents" }}>
              <span style={{ ...num, textAlign: "left", color: "var(--di-text)" }}>{row.id}</span>
              <LevelMeter
                label={`${row.id} ${valueLabel}`}
                value={row.now}
                compare={row.then}
                compareLabel={row.then === null ? `${row.id}: ${missing}` : `${row.id} ${compareLabel}`}
              />
              <span style={num}>{row.now}</span>
              <span style={num}>{row.then ?? "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/**
 * A column of meters reads as one figure: the legend says what the two
 * tracks are, the scale stands above them once, and each row prints its
 * figures beside the bars.
 */
export const ColumnOfMeters: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Column
      title="Load by host"
      valueLabel="now"
      compareLabel="7 days ago"
      scaleLabel="Load, 0 to 100"
      missing="no load on record 7 days ago"
      now="now"
      then="-7d"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("meter", { name: /now$/ })).toHaveLength(4);
    await expect(canvas.getByText("7 days ago")).toBeVisible();
  },
};

/** The same column with German words: the legend wraps between its keys, never inside one. */
export const German: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Column
      title="Auslastung je Host"
      valueLabel="aktuelle Auslastung"
      compareLabel="Auslastung vor sieben Tagen"
      scaleLabel="Auslastung, 0 bis 100"
      missing="vor sieben Tagen keine Auslastung erfasst"
      now="jetzt"
      then="−7 T"
    />
  ),
  play: async ({ canvasElement }) => {
    const keys = [...canvasElement.querySelectorAll(".di-level-key")];
    for (const key of keys) {
      const lines = Math.round(key.getBoundingClientRect().height / parseFloat(getComputedStyle(key).lineHeight));
      await expect(lines).toBeLessThanOrEqual(2);
    }
  },
};
