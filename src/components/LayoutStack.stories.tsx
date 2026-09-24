import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Card } from "./Card";
import { Stack } from "./Layout";

const meta = {
  title: "Patterns/Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  args: { children: null },
  argTypes: { children: { control: false } },
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
