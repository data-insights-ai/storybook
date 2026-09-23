import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";

const meta = {
  title: "Blocks/Card",
  component: Card,
  tags: ["autodocs"],
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

export const Surface: Story = {};
