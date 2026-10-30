import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell } from "lucide-react";
import { expect, fn, within } from "storybook/test";
import { CountButton } from "./CountButton";

const meta = {
  title: "Actions/CountButton",
  component: CountButton,
  tags: ["layer:primitive", "status:deprecated"],
  args: {
    label: "Notifications, 128 unread",
    count: 128,
    countLabel: "99+",
    onClick: fn(),
    children: <Bell aria-hidden />,
  },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof CountButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: renders `Button variant="ghost" iconOnly badge`. See Actions/Button "In the app bar". */
export const Many: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Notifications, 128 unread" })).toBeVisible();
  },
};
