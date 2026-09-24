import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ExplainPanel, ExplainRow } from "./ExplainPanel";

const meta = {
  title: "Blocks/Inference/Explain",
  component: ExplainPanel,
  tags: ["autodocs"],
  args: {
    heading: "Why this was proposed",
    footer: "This does not account for sources added in the last hour.",
    children: null,
  },
  argTypes: {
    heading: { control: "text" },
    footer: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof ExplainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Parameters, not prose — including the inputs the model did not use. */
export const Explain: Story = {
  render: (args) => (
    <ExplainPanel {...args}>
      <ExplainRow label="Matched on">host, manifest prefix, operator</ExplainRow>
      <ExplainRow label="Window">2026-09-22 → 2026-09-23</ExplainRow>
      <ExplainRow label="Confidence">0.94</ExplainRow>
      <ExplainRow label="Ignored" ignored={true}>
        entries sealed before 2026-09-01
      </ExplainRow>
      <ExplainRow label="Ignored" ignored={true}>
        unsealed drafts
      </ExplainRow>
    </ExplainPanel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Why this was proposed")).toBeVisible();
  },
};

/** Nothing ignored: the model used every input it had. */
export const Complete: Story = {
  args: { footer: "Every available input was used." },
  render: (args) => (
    <ExplainPanel {...args}>
      <ExplainRow label="Matched on">manifest hash</ExplainRow>
      <ExplainRow label="Sources">3 of 3</ExplainRow>
      <ExplainRow label="Confidence">0.99</ExplainRow>
    </ExplainPanel>
  ),
};
