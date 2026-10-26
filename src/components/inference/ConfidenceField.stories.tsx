import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { ConfidenceField } from "./ConfidenceField";

const meta = {
  title: "Blocks/Inference/Confidence",
  component: ConfidenceField,
  tags: ["autodocs"],
  args: {
    id: "confidence",
    label: "Resolved operator",
    confidence: 0.94,
    confidenceLabel: "0.94 · matched on 3 of 4 inputs",
    level: "high",
    whyLabel: "why?",
    onWhy: fn(),
    children: null,
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    confidence: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
    confidenceLabel: { control: "text" },
    level: { control: "radio", options: ["high", "review"] },
    whyLabel: { control: "text" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConfidenceField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Above the threshold: a rule, and the number in words beside it. */
export const High: Story = {
  render: (args) => <ConfidenceField {...args}>Nora Feld</ConfidenceField>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("meter", { name: /0.94/ })).toBeInTheDocument();
  },
};

/**
 * Below the threshold. Colour never carries this alone — the words say
 * “review before sealing”, so the two tones read the same to anyone who
 * cannot separate the hues.
 */
export const Review: Story = {
  args: {
    id: "confidence-review",
    label: "Resolved host",
    level: "review",
    confidence: 0.42,
    confidenceLabel: "0.42 · below the threshold, review before sealing",
  },
  render: (args) => <ConfidenceField {...args}>mirror.example.net</ConfidenceField>,
};
