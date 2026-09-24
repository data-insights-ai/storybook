import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Card } from "./Card";
import { Grid } from "./Layout";

const meta = {
  title: "Patterns/Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  args: { min: "180px", children: null },
  argTypes: {
    min: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * It wraps. A column never forces the story canvas wider than the
 * preview, so `min` is the smallest a cell may get, not a fixed width.
 */
export const Default: Story = {
  render: (args) => (
    <Grid {...args}>
      <Card>One</Card>
      <Card>Two</Card>
      <Card>Three</Card>
      <Card>Four</Card>
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("One")).toBeVisible();
  },
};

/** Wider cells, so fewer of them fit on one row. */
export const Wide: Story = {
  args: { min: "300px" },
  render: (args) => (
    <Grid {...args}>
      <Card>One</Card>
      <Card>Two</Card>
      <Card>Three</Card>
    </Grid>
  ),
};
