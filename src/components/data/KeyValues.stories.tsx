import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { KeyValue, KeyValues } from "./KeyValues";

const meta = {
  title: "Primitives/KeyValues",
  component: KeyValues,
  tags: ["autodocs"],
  args: { children: null },
  argTypes: { children: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof KeyValues>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The terms behind a figure. Both halves are text, so both are props. */
export const Default: Story = {
  render: (args) => (
    <KeyValues {...args}>
      <KeyValue term="Registry" value="1,842" />
      <KeyValue term="Mirror" value="1,109" />
      <KeyValue term="Feed" value="744" />
      <KeyValue term="Archive" value="487" />
    </KeyValues>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Registry")).toBeVisible();
  },
};

/** The terms of one source, which is how a drawer uses it. */
export const Terms: Story = {
  render: (args) => (
    <KeyValues {...args}>
      <KeyValue term="Kind" value="Registry" />
      <KeyValue term="Manifest" value="a4f9c21e" />
      <KeyValue term="Last seen" value="09:12:04Z" />
    </KeyValues>
  ),
};
