import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { CountButton } from "./CountButton";

const meta = {
  title: "Primitives/CountButton",
  component: CountButton,
  tags: ["autodocs"],
  args: {
    label: "Notifications, 3 unread",
    count: 3,
    countLabel: "3",
    expanded: false,
    onClick: fn(),
    children: <Bell />,
  },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof CountButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unread: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Notifications, 3 unread" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const NothingNew: Story = {
  args: { label: "Notifications", count: 0, countLabel: "0" },
};

export const Many: Story = {
  args: { label: "Notifications, 128 unread", count: 128, countLabel: "99+" },
};
