import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StatTile } from "./StatTile";

const meta = {
  title: "Blocks/StatTile",
  component: StatTile,
  tags: ["autodocs"],
  args: {
    index: "01",
    label: "Entries sealed",
    value: "4,182",
    delta: "+112 since 09:00Z",
    deltaTone: "ok",
    tone: "default",
    compact: false,
    ruled: false,
  },
  argTypes: {
    index: { control: "text" },
    label: { control: "text" },
    value: { control: "text" },
    delta: { control: "text" },
    deltaTone: { control: "radio", options: ["ok", "warn", "danger"] },
    tone: { control: "radio", options: ["default", "danger"] },
    compact: { control: "boolean" },
    ruled: { control: "boolean" },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("4,182")).toBeVisible();
  },
};

/** The delta names its direction in words, not only in colour. */
export const Falling: Story = {
  args: { index: "02", label: "Coverage", value: "86.4%", delta: "down 2.1 points", deltaTone: "warn" },
};

/** A value that crossed a threshold. The whole tile says so. */
export const OverThreshold: Story = {
  args: {
    index: "03",
    tone: "danger",
    label: "Unsealed entries",
    value: "1,284",
    delta: "up 940 since 08:00Z",
    deltaTone: "danger",
  },
};

/** Without a delta, where there is no previous reading to compare. */
export const WithoutDelta: Story = {
  args: { index: "04", label: "Sources on record", value: "24", delta: "" },
};

/** Closed on the tick scale: this tile reports a measurement. */
export const Ruled: Story = {
  args: { ruled: true },
};

/** One size down, for a row of tiles inside a panel. */
export const Compact: Story = {
  args: { compact: true, index: "A", label: "Ingest rate", value: "412/s", delta: "steady" },
};

/** A row of them, which is how they are actually read. */
export const Row: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
      <StatTile index="01" label="Entries sealed" value="4,182" delta="+112 since 09:00Z" ruled={true} />
      <StatTile index="02" label="Coverage" value="86.4%" delta="down 2.1 points" deltaTone="warn" ruled={true} />
      <StatTile index="03" label="Unsealed" value="1,284" delta="up 940" deltaTone="danger" tone="danger" ruled={true} />
      <StatTile index="04" label="Sources" value="24" delta="" ruled={true} />
    </div>
  ),
};
