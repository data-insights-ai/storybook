import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { SealValue } from "./Seal";
import { ExplainFooter, ExplainPanel, ExplainRow } from "./ExplainPanel";

const meta = {
  title: "Blocks/Inference/Explain",
  component: ExplainPanel,
  tags: ["autodocs"],
  args: {
    heading: "Why this was proposed",
    children: null,
  },
  argTypes: {
    heading: { control: "text" },
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
      <ExplainFooter>This does not account for sources added in the last hour.</ExplainFooter>
    </ExplainPanel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Why this was proposed")).toBeVisible();
  },
};

/** Nothing ignored: the model used every input it had. */
export const Complete: Story = {
  render: (args) => (
    <ExplainPanel {...args}>
      <ExplainRow label="Matched on">manifest hash</ExplainRow>
      <ExplainRow label="Sources">3 of 3</ExplainRow>
      <ExplainRow label="Confidence">0.99</ExplainRow>
      <ExplainFooter>
        Every available input was used, up to{" "}
        <SealValue stateLabel="Sealed">2026-09-23T09:12:04Z</SealValue>
      </ExplainFooter>
    </ExplainPanel>
  ),
};
