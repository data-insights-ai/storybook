import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Kbd } from "./Seal";

const meta = {
  title: "Primitives/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  args: { children: "⌘K" },
  argTypes: { children: { control: "text" } },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A shortcut in the mono track: a machine wrote it, so it reads as one. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("⌘K")).toBeVisible();
  },
};

/** In prose, which is the only place a shortcut is worth printing. */
export const InProse: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      Open the command bar
      <Kbd>⌘K</Kbd>
    </span>
  ),
};
