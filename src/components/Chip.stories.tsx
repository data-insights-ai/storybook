import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Chip } from "./Chip";

const meta = {
  title: "Primitives/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: {
    children: "severity: high",
    active: true,
    removeLabel: "Remove the severity filter",
    onRemove: fn(),
    onClick: fn(),
  },
  argTypes: {
    children: { control: "text" },
    active: { control: "boolean" },
    removeLabel: { control: "text" },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Set: the chip states a value and offers the way back out. */
export const Active: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Remove the severity filter" }));
    await expect(args.onRemove).toHaveBeenCalledOnce();
  },
};

/** Unset: it offers itself, and is a button until it holds a value. */
export const Available: Story = {
  args: { active: false, children: "source" },
  render: ({ children, ...args }) => (
    <Chip {...args}>
      <Plus aria-hidden />
      {children}
    </Chip>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "source" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

/** Set, but not removable: a filter the view itself imposes. */
export const Fixed: Story = {
  args: { onRemove: undefined, children: "workspace: WS-01" },
};

/** A filter row as a toolbar holds it. */
export const Row: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      <Chip {...args} active={true} removeLabel="Remove the severity filter">
        severity: high
      </Chip>
      <Chip {...args} active={true} removeLabel="Remove the window filter">
        window: 24h
      </Chip>
      <Chip {...args} active={false} removeLabel="Add a source filter">
        <Plus aria-hidden />
        source
      </Chip>
      <Chip {...args} active={false} removeLabel="Add an operator filter">
        <Plus aria-hidden />
        operator
      </Chip>
    </div>
  ),
};
