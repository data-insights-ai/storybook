import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Metric, MetricNote } from "./Metric";
import { KeyValue, KeyValues } from "./KeyValues";
import { SealValue } from "./Seal";

const meta = {
  title: "Blocks/Metric",
  component: Metric,
  tags: ["autodocs"],
  args: {
    label: "Entries sealed",
    figure: "4,182",
    children: null,
  },
  argTypes: {
    label: { control: "text" },
    figure: { control: "text" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Metric {...args}>
      <MetricNote>+112 since 09:00Z</MetricNote>
    </Metric>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("4,182")).toBeVisible();
  },
};

/** A percentage, where the note carries the direction in words. */
export const Percentage: Story = {
  args: { label: "Coverage", figure: "86.4%" },
  render: (args) => (
    <Metric {...args}>
      <MetricNote>down 2.1 points since 08:00Z</MetricNote>
    </Metric>
  ),
};

/**
 * The note is a slot, so what qualifies the figure can be sealed. A
 * string could only have said the timestamp, not vouched for it.
 */
export const SealedNote: Story = {
  name: "Sealed note",
  render: (args) => (
    <Metric {...args}>
      <MetricNote>
        <SealValue stateLabel="Sealed">09:12:04Z</SealValue>
      </MetricNote>
    </Metric>
  ),
};

/** With the terms behind the figure listed underneath it. */
export const WithTerms: Story = {
  render: (args) => (
    <Metric {...args}>
      <MetricNote>+112 since 09:00Z</MetricNote>
      <KeyValues>
        <KeyValue term="Registry" value="1,842" />
        <KeyValue term="Mirror" value="1,109" />
        <KeyValue term="Feed" value="744" />
        <KeyValue term="Archive" value="487" />
      </KeyValues>
    </Metric>
  ),
};

/** A row, which is how a set of them is actually read. */
export const Row: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
      <Metric label="Entries sealed" figure="4,182">
        <MetricNote>+112 since 09:00Z</MetricNote>
      </Metric>
      <Metric label="Coverage" figure="86.4%">
        <MetricNote>down 2.1 points</MetricNote>
      </Metric>
      <Metric label="Sources" figure="24">
        <MetricNote>4 paused, 1 failed</MetricNote>
      </Metric>
    </div>
  ),
};
