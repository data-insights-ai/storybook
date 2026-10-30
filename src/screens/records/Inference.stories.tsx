import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { InferenceScreen } from "./Inference";

const meta = {
  title: "Patterns/Inference",
  tags: ["layer:screen", "!autodocs"],
  component: InferenceScreen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof InferenceScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The claim in place, the question before the action, the reason behind
 * it, and the receipt after, on the product's own shell.
 */
export const AiNative: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Resume feed.example.io?" }),
    ).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Resume" })).toHaveClass(
      "di-btn-primary",
    );
    await waitFor(() => expect(canvas.getByRole("status")).toBeVisible());
    const [card, confirm] = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(".inference-grid > *"),
    );
    await expect(Math.round(card.getBoundingClientRect().top)).toBe(
      Math.round(confirm.getBoundingClientRect().top),
    );
  },
};
