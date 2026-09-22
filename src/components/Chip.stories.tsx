import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Chip } from "./Chip";

const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: {
    children: "Status: All (6)",
    removeLabel: "Remove status filter",
  },
  argTypes: {
    children: { control: "text" },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Label: Story = {};

export const Removable: Story = {
  args: { onRemove: fn() },
};
