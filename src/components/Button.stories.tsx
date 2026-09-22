import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Add entry",
    variant: "primary",
    size: "md",
    type: "button",
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    children: { control: "text" },
    variant: {
      control: "radio",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: { control: "radio", options: ["sm", "md"] },
    type: { control: "radio", options: ["button", "submit", "reset"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Add entry" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Filter" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Refresh" },
};

export const Danger: Story = {
  args: { variant: "danger", size: "sm", children: "Remove" },
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

export const Disabled: Story = {
  args: { disabled: true, children: "Unavailable" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Unavailable" });
    await expect(button).toBeDisabled();
  },
};
