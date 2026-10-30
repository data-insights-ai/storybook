import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Spinner } from "./Spinner";

const meta = {
  title: "Feedback/Waiting/Spinner",
  component: Spinner,
  tags: ["layer:primitive", "status:deprecated"],
  args: { label: "Verifying the manifest" },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: Spinner is `Loading` (its default `shape="inline"`). Use `Loading`. */
export const Turning: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent("Verifying the manifest"));
  },
};
