import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Tooltip } from "./Tooltip";

const meta = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: { children: "sealed 09:12:04Z" },
  argTypes: { children: { control: "text" } },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A short label for a control that has none. Never the only place a fact
 * lives: what a tooltip says has to be readable without it too.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("sealed 09:12:04Z")).toBeVisible();
  },
};

export const Shortcut: Story = {
  args: { children: "⌘K" },
};

export const Pair: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 10 }}>
      <Tooltip>sealed 09:12:04Z</Tooltip>
      <Tooltip>⌘K</Tooltip>
    </div>
  ),
};
