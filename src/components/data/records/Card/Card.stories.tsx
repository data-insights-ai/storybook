import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Card } from "./Card";

const meta = {
  title: "Data/Records/Card",
  component: Card,
  tags: ["layer:block", "autodocs"],
  args: {
    padded: true,
    children: "A surface for content. A border, not a shadow, so the console stays flat.",
  },
  argTypes: {
    children: { control: "text" },
    padded: { control: "boolean" },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Surface: Story = {
  play: async ({ canvasElement }) => {
    const text = within(canvasElement).getByText(/A surface for content/);
    await expect(text).toBeVisible();
    await expect(text).toHaveClass("di-card-pad");
  },
};
