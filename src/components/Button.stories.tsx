import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check, Plus, Trash2 } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Add entry",
    variant: "primary",
    size: "md",
    type: "button",
    iconOnly: false,
    loading: false,
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    children: { control: "text" },
    variant: {
      control: "radio",
      options: ["primary", "secondary", "ghost", "danger", "seal", "ai"],
    },
    size: { control: "radio", options: ["dense", "md", "comfort"] },
    type: { control: "radio", options: ["button", "submit", "reset"] },
    iconOnly: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Navy fill. The one control on the sheet that commits. */
export const Primary: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Add entry" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Filter" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Refresh" },
};

/** Reads as an ordinary control until hover. A red fill invites the press. */
export const Danger: Story = {
  args: { variant: "danger", children: "Revoke key" },
};

/** Seals a record. The only gold control in daylight. */
export const Seal: Story = {
  args: { variant: "seal", children: "Seal entry" },
};

/** Acts on a model's proposal, so it carries the ring's edge. */
export const Inferred: Story = {
  args: { variant: "ai", children: "Accept suggestion" },
};

export const Dense: Story = {
  args: { size: "dense", variant: "secondary", children: "Export" },
};

export const Comfort: Story = {
  args: { size: "comfort", children: "Sign in" },
};

export const WithIcon: Story = {
  args: { children: "Add entry" },
  render: ({ children, ...args }) => (
    <Button {...args}>
      <Plus aria-hidden />
      {children}
    </Button>
  ),
};

/** Icon only, so the name has to be spelled out for a screen reader. */
export const IconOnly: Story = {
  args: { iconOnly: true, variant: "secondary", children: "" },
  render: (args) => (
    <Button {...args} aria-label="Remove entry">
      <Trash2 aria-hidden />
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Remove entry" })).toBeVisible();
  },
};

/** Busy and unpressable. `aria-busy` says so without a second label. */
export const Loading: Story = {
  args: { loading: true, children: "Sealing" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Sealing" });
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");
  },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Unavailable" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Unavailable" })).toBeDisabled();
  },
};

/** Every variant at once, for a pass over the whole set. */
export const AllVariants: Story = {
  args: { children: "" },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Button variant="primary">
        <Check aria-hidden />
        Commit
      </Button>
      <Button variant="secondary">Filter</Button>
      <Button variant="ghost">Refresh</Button>
      <Button variant="danger">Revoke key</Button>
      <Button variant="seal">Seal entry</Button>
      <Button variant="ai">Accept suggestion</Button>
      <Button variant="primary" loading={true}>
        Sealing
      </Button>
      <Button variant="secondary" disabled={true}>
        Unavailable
      </Button>
    </div>
  ),
};

/** After dark the fill turns gold: navy has nothing left to act against. */
export const NightSheet: Story = {
  args: { children: "" },
  globals: { theme: "dark" },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Button variant="primary">
        <Check aria-hidden />
        Commit
      </Button>
      <Button variant="secondary">Filter</Button>
      <Button variant="ghost">Refresh</Button>
      <Button variant="danger">Revoke key</Button>
      <Button variant="seal">Seal entry</Button>
      <Button variant="ai">Accept suggestion</Button>
      <Button variant="secondary" disabled={true}>
        Unavailable
      </Button>
    </div>
  ),
};
