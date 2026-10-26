import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Spinner } from "./Spinner";

const meta = {
  title: "Primitives/Waiting/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  args: { label: "verifying manifest" },
  argTypes: { label: { control: "text" } },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** For a wait too short to count. It still carries a word. */
export const Turning: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("verifying manifest")).toBeVisible();
  },
};

/** Several at once. Each says what it is waiting for, not just that it is. */
export const Several: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Spinner label="verifying manifest" />
      <Spinner label="resolving hosts" />
    </div>
  ),
};
