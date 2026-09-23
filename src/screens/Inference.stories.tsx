import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { InferenceScreen } from "./Inference";

const meta = {
  title: "Screens/Inference",
  component: InferenceScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof InferenceScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The whole AI chapter on one screen: the claim in place, the question
 * before the action, the explanation behind it, and the receipt after.
 */
export const AiNative: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Resume feed.example.io?")).toBeVisible();
    await waitFor(() => expect(canvas.getByRole("status")).toBeVisible());
  },
};
