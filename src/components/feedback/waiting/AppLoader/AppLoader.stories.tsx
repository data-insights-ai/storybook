import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { AppLoader } from "./AppLoader";

const meta = {
  title: "Feedback/Waiting/AppLoader",
  component: AppLoader,
  tags: ["layer:primitive", "status:deprecated"],
  parameters: { layout: "fullscreen" },
  args: { label: "Loading" },
} satisfies Meta<typeof AppLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: AppLoader is `Loading shape="app"`. Use `Loading`. */
export const Starting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent("Loading"));
  },
};
