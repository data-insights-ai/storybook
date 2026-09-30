import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Card } from "./Card";
import { Stack } from "./Layout";

const meta = {
  title: "Patterns/Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  args: { gap: 16, children: null },
  argTypes: {
    gap: { control: "select", options: [8, 12, 16, 24, 32, 48, 64, 96] },
    children: { control: false },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One rhythm down a page. Every screen in the system opens with this. */
export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Card>One block</Card>
      <Card>The next block</Card>
      <Card>And the one after it</Card>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("One block")).toBeVisible();
  },
};

/**
 * `gap` is named by the value it sets, the way the space tokens are:
 * `gap={12}` is 12px. A column of fields wants 12; it was the distance
 * that had no name and got written as a margin on the field instead.
 */
export const Tight: Story = {
  args: { gap: 12 },
  render: (args) => (
    <Stack {...args}>
      <Card>Source</Card>
      <Card>Window</Card>
      <Card>Reviewer</Card>
    </Stack>
  ),
};

/**
 * 64 and 96 are the brand tier. Below 48 the distance separates blocks;
 * above it the distance separates the parts of an argument, which is what
 * a brand page is made of.
 */
export const Brand: Story = {
  args: { gap: 64 },
  render: (args) => (
    <Stack {...args}>
      <Card>The first part of the argument</Card>
      <Card>The second</Card>
    </Stack>
  ),
};
