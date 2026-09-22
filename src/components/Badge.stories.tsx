import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "08", tone: "neutral" },
  argTypes: {
    children: { control: "text" },
    tone: { control: "radio", options: ["neutral", "alert", "gold"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Count: Story = {};

export const Alert: Story = {
  args: { tone: "alert", children: "03" },
};

export const Gold: Story = {
  args: { tone: "gold", children: "06" },
};
