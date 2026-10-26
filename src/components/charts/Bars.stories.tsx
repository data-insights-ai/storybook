import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Bars } from "./Bars";

const meta = {
  title: "Primitives/Bars",
  component: Bars,
  tags: ["autodocs"],
  args: {
    values: [34, 41, 38, 52, 47, 63, 58],
    highlight: 6,
    startLabel: "09-17",
    midLabel: "09-20",
    endLabel: "09-23",
  },
  argTypes: {
    startLabel: { control: "text" },
    midLabel: { control: "text" },
    endLabel: { control: "text" },
    highlight: { control: { type: "number", min: 0 } },
    values: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Bars>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Navy for the reading being looked at, warm neutral for the rest. */
export const Week: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("09-23")).toBeVisible();
  },
};

/** The first reading highlighted, for a series read backwards. */
export const HighlightFirst: Story = {
  args: { highlight: 0 },
};

/** A flat series: the shape says nothing changed, and that is the point. */
export const Flat: Story = {
  args: { values: [48, 47, 49, 48, 50, 48, 49], highlight: 6 },
};

/** A longer window, still on one row. */
export const Month: Story = {
  args: {
    values: [22, 31, 28, 35, 44, 39, 47, 52, 48, 56, 61, 58, 66, 72],
    highlight: 13,
    startLabel: "09-10",
    midLabel: "09-17",
    endLabel: "09-23",
  },
};
