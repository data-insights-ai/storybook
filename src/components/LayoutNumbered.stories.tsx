import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Card } from "./Card";
import { Numbered, Stack } from "./Layout";

const meta = {
  title: "Patterns/Layout/Numbered",
  component: Numbered,
  tags: ["autodocs"],
  args: { index: "01", children: null },
  argTypes: {
    index: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof Numbered>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The index is part of the pattern, not something a screen invents. */
export const Default: Story = {
  render: (args) => (
    <Numbered {...args}>
      <Card>A numbered block, carrying the register's ordinal.</Card>
    </Numbered>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("01")).toBeVisible();
  },
};

/** A run of them, which is how a screen is actually built. */
export const Run: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      <Numbered index="01">
        <Card>The session, and what it is allowed to do.</Card>
      </Numbered>
      <Numbered index="02">
        <Card>The channels it reports through.</Card>
      </Numbered>
      <Numbered index="03">
        <Card>What it measured while doing so.</Card>
      </Numbered>
    </Stack>
  ),
};
