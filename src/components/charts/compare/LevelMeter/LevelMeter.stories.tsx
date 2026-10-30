import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { LevelMeter, LevelMeterLegend, LevelMeterScale } from "./LevelMeter";

const meta = {
  title: "Charts/Compare/LevelMeter",
  component: LevelMeter,
  tags: ["layer:primitive", "autodocs"],
  args: {
    label: "Level now",
    value: 72,
    max: 100,
    segments: 30,
    bands: { warn: 50, danger: 75 },
    compare: 58,
    compareLabel: "Level 7 days ago",
  },
  argTypes: {
    label: { control: "text" },
    compareLabel: { control: "text" },
    value: { control: { type: "range", min: 0, max: 100 } },
    compare: { control: { type: "range", min: 0, max: 100 } },
    segments: { control: { type: "number", min: 5, max: 60 } },
    bands: { control: "object" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LevelMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The reading, with the same scale at the comparison point beneath it. */
export const WithComparison: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("meter", { name: "Level now" })).toHaveAttribute("aria-valuenow", "72");
    await expect(canvas.getByRole("meter", { name: "Level 7 days ago" })).toHaveAttribute("aria-valuenow", "58");
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
 * track stays, empty, so the rows of a column keep one height — and it is
 * named, because an empty track is not a reading of zero.
 */
export const NothingThen: Story = {
  args: { compare: null, compareLabel: "No level on record 7 days ago" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: "No level on record 7 days ago" })).toBeVisible();
  },
};

/** The comparison point moves; each segment changes colour on the slow duration. */
export const Moving: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const points = [
      { label: "Level 24 h ago", value: 66 },
      { label: "Level 7 days ago", value: 41 },
      { label: "Level 30 days ago", value: 12 },
    ];
    const [at, setAt] = useState(0);
    const point = points[at]!;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <LevelMeter label="Level now" value={72} compare={point.value} compareLabel={point.label} />
        <div>
          <Button variant="secondary" size="sm" onClick={() => setAt((at + 1) % points.length)}>
            Move comparison point
          </Button>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Move comparison point" }));
    await waitFor(() =>
      expect(canvas.getByRole("meter", { name: "Level 7 days ago" })).toHaveAttribute("aria-valuenow", "41"),
    );
  },
};

/**
 * A column of meters reads as one figure: the legend says what the two
 * tracks are, the scale stands above them once, and each row prints its
 * figures beside the bars.
 */
export const Column: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const rows = [
      { id: "R-0412", now: 91, then: 64 },
      { id: "R-0409", now: 63, then: 63 },
      { id: "R-0398", now: 38, then: 51 },
      { id: "R-0377", now: 12, then: null },
    ];
    const grid = {
      display: "grid",
      gridTemplateColumns: "64px minmax(0, 1fr) 32px 32px",
      gap: 12,
      alignItems: "center",
    };
    const mono = {
      fontFamily: "var(--di-font-code)",
      fontSize: "var(--di-font-size-200)",
      textAlign: "right" as const,
    };
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <LevelMeterLegend valueLabel="Now" compareLabel="Level 7 days ago" />
        <div style={grid}>
          <span />
          <LevelMeterScale label="Level, 0 to 100" />
          <span style={mono}>now</span>
          <span style={mono}>-7d</span>
        </div>
        {rows.map((row) => (
          <div key={row.id} style={grid}>
            <span style={{ ...mono, textAlign: "left" }}>{row.id}</span>
            <LevelMeter
              label={`${row.id} now`}
              value={row.now}
              compare={row.then}
              compareLabel={row.then === null ? `${row.id}: no level on record 7 days ago` : `${row.id} 7 days ago`}
            />
            <span style={mono}>{row.now}</span>
            <span style={mono}>{row.then ?? "—"}</span>
          </div>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("meter", { name: /now$/ })).toHaveLength(4);
    await expect(canvas.getByText("Level 7 days ago")).toBeVisible();
  },
};
