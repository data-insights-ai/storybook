import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserPlus } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { EmptyState, EmptyStateAction, EmptyStateIcon } from "./EmptyState";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["layer:block", "status:deprecated"],
  args: {
    eyebrow: "",
    title: "No invitations yet.",
    body: "Invite colleagues by email. They join with the role you choose.",
    children: null,
  },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: `EmptyState` is `Notice variant="empty"` and draws exactly as it does. Use `Notice`. */
export const FirstUse: Story = {
  render: (args) => (
    <EmptyState {...args}>
      <EmptyStateIcon>
        <UserPlus />
      </EmptyStateIcon>
      <EmptyStateAction>
        <Button>Invite people</Button>
      </EmptyStateAction>
    </EmptyState>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("No invitations yet.");
    await expect(canvas.getByRole("button", { name: "Invite people" })).toBeVisible();
  },
};
