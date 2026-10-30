import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Console } from "../../.storybook/Console";
import { sampleChrome } from "../../.storybook/chrome.sample";
import { InferenceScreen } from "./Inference";

const meta = {
  title: "Patterns/Inference",
  tags: ["layer:screen"],
  component: InferenceScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <Console title="Inference" crumb={["WS-01", "Record", "Overview"]} active="overview" chrome={sampleChrome}>
        <Story />
      </Console>
    ),
  ],
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
