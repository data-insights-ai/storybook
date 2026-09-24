import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Metric } from "./Metric";
import { KeyValue, KeyValues } from "./KeyValues";

const meta = {
  title: "Blocks/Metric",
  component: Metric,
  tags: ["autodocs"],
  args: {
    label: "Entries sealed",
    figure: "4,182",
    note: "+112 since 09:00Z",
  },
  argTypes: {
    label: { control: "text" },
    figure: { control: "text" },
    note: { control: "text" },
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("4,182")).toBeVisible();
  },
};

/** A percentage, where the note carries the direction in words. */
export const Percentage: Story = {
  args: { label: "Coverage", figure: "86.4%", note: "down 2.1 points since 08:00Z" },
};

/** With the terms behind the figure listed underneath it. */
export const WithTerms: Story = {
  render: (args) => (
    <Metric {...args}>
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
      <Metric label="Entries sealed" figure="4,182" note="+112 since 09:00Z" />
      <Metric label="Coverage" figure="86.4%" note="down 2.1 points" />
      <Metric label="Sources" figure="24" note="4 paused, 1 failed" />
    </div>
  ),
};
