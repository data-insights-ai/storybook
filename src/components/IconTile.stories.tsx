import type { Meta, StoryObj } from "@storybook/react-vite";
import { Boxes, CheckCircle2, Server } from "lucide-react";
import { expect, within } from "storybook/test";
import { Icon } from "./Icon";
import { IconTile } from "./IconTile";

const meta = {
  title: "Primitives/IconTile",
  component: IconTile,
  tags: ["autodocs"],
  args: {
    tone: "neutral",
    children: null,
  },
  argTypes: {
    tone: { control: "radio", options: ["neutral", "inverse", "ok"] },
    children: { control: false },
  },
} satisfies Meta<typeof IconTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  render: (args) => (
    <IconTile {...args}>
      <Icon size={16} label="Sources">
        <Boxes aria-hidden />
      </Icon>
    </IconTile>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: "Sources" })).toBeVisible();
  },
};

/** Navy fill, for the one tile a view is actually about. */
export const Inverse: Story = {
  args: { tone: "inverse" },
  render: (args) => (
    <IconTile {...args}>
      <Icon size={16} label="Registry">
        <Server aria-hidden />
      </Icon>
    </IconTile>
  ),
};

export const Ok: Story = {
  args: { tone: "ok" },
  render: (args) => (
    <IconTile {...args}>
      <Icon size={16} label="Verified">
        <CheckCircle2 aria-hidden />
      </Icon>
    </IconTile>
  ),
};

export const AllTones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 10 }}>
      <IconTile tone="neutral">
        <Icon size={16} label="Sources">
          <Boxes aria-hidden />
        </Icon>
      </IconTile>
      <IconTile tone="inverse">
        <Icon size={16} label="Registry">
          <Server aria-hidden />
        </Icon>
      </IconTile>
      <IconTile tone="ok">
        <Icon size={16} label="Verified">
          <CheckCircle2 aria-hidden />
        </Icon>
      </IconTile>
    </div>
  ),
};
