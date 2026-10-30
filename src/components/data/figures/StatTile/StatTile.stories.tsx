import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Sparkline } from "../../../charts/time/Sparkline";
import { StatTile, StatTileDelta } from "./StatTile";

const meta = {
  title: "Data/Figures/StatTile",
  component: StatTile,
  tags: ["layer:block", "autodocs"],
  args: {
    label: "Entries sealed",
    value: "4,182",
    tone: "neutral",
    compact: false,
    ruled: false,
    children: null,
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    tone: { control: "radio", options: ["neutral", "danger"] },
    compact: { control: "boolean" },
    ruled: { control: "boolean" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 260 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StatTile {...args}>
      <StatTileDelta>+112 since 09:00Z</StatTileDelta>
    </StatTile>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("4,182")).toBeVisible();
  },
};

/** The delta names its direction in words, not only in colour. */
export const Falling: Story = {
  args: { label: "Coverage", value: "86.4%" },
  render: (args) => (
    <StatTile {...args}>
      <StatTileDelta tone="warn">down 2.1 points</StatTileDelta>
    </StatTile>
  ),
};

/** A value that crossed a threshold. The whole tile says so. */
export const OverThreshold: Story = {
  args: { tone: "danger", label: "Unsealed entries", value: "1,284" },
  render: (args) => (
    <StatTile {...args}>
      <StatTileDelta tone="danger">up 940 since 08:00Z</StatTileDelta>
    </StatTile>
  ),
};

/**
 * What a figure is read against is not always a word. The slot that
 * holds the delta holds a `Sparkline` just as well — which a `delta`
 * string could not.
 */
export const WithSparkline: Story = {
  name: "With sparkline",
  args: { tone: "danger", label: "Unsealed entries", value: "1,284" },
  render: (args) => (
    <StatTile {...args}>
      <StatTileDelta tone="danger">up 940 since 08:00Z</StatTileDelta>
      <Sparkline
        bars={[
          { percent: 18 },
          { percent: 22 },
          { percent: 20 },
          { percent: 34 },
          { percent: 48 },
          { percent: 74, tone: "danger" },
        ]}
        label="Unsealed entries over the last six hours, rising sharply in the last two."
      />
    </StatTile>
  ),
};

/** Without a delta, where there is no previous reading to compare. */
export const WithoutDelta: Story = {
  args: { label: "Sources on record", value: "24" },
};

/** Closed on the tick scale: this tile reports a measurement. */
export const Ruled: Story = {
  args: { ruled: true },
  render: (args) => (
    <StatTile {...args}>
      <StatTileDelta>+112 since 09:00Z</StatTileDelta>
    </StatTile>
  ),
};

/** One size down, for a row of tiles inside a panel. */
export const Compact: Story = {
  args: { compact: true, label: "Ingest rate", value: "412/s" },
  render: (args) => (
    <StatTile {...args}>
      <StatTileDelta>steady</StatTileDelta>
    </StatTile>
  ),
};

/** A row of them, which is how they are actually read. */
export const Row: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
      <StatTile label="Entries sealed" value="4,182" ruled={true}>
        <StatTileDelta>+112 since 09:00Z</StatTileDelta>
      </StatTile>
      <StatTile label="Coverage" value="86.4%" ruled={true}>
        <StatTileDelta tone="warn">down 2.1 points</StatTileDelta>
      </StatTile>
      <StatTile label="Unsealed" value="1,284" tone="danger" ruled={true}>
        <StatTileDelta tone="danger">up 940</StatTileDelta>
      </StatTile>
      <StatTile label="Sources" value="24" ruled={true} />
    </div>
  ),
};
