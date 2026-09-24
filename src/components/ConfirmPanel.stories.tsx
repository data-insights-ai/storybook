import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./Button";
import { ConfirmActions, ConfirmPanel } from "./ConfirmPanel";
import { ExplainRow } from "./ExplainPanel";

const meta = {
  title: "Blocks/Inference/Confirm",
  component: ConfirmPanel,
  tags: ["autodocs"],
  args: {
    eyebrow: "Proposed action",
    question: "Merge entry 07 into entry 03?",
    whyLabel: "why was this proposed?",
    onWhy: fn(),
    children: null,
  },
  argTypes: {
    eyebrow: { control: "text" },
    question: { control: "text" },
    whyLabel: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof ConfirmPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Ask, then act, then record. Nothing runs before an operator agrees,
 * and the question states the scope and whether it can be reversed.
 */
export const Reversible: Story = {
  render: (args) => (
    <ConfirmPanel {...args}>
      <ExplainRow label="Basis">Same manifest hash on both entries</ExplainRow>
      <ExplainRow label="Scope">2 entries · WS-01</ExplainRow>
      <ExplainRow label="Reversible">Yes, until the next seal</ExplainRow>
      <ConfirmActions>
        <Button variant="secondary" size="dense">
          Cancel
        </Button>
        <Button variant="ai" size="dense">
          Merge
        </Button>
      </ConfirmActions>
    </ConfirmPanel>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "why was this proposed?" }));
    await expect(args.onWhy).toHaveBeenCalled();
    await expect(canvas.getByText("Merge entry 07 into entry 03?")).toBeVisible();
  },
};

/** An irreversible proposal states that first, not in a tooltip. */
export const Irreversible: Story = {
  args: { question: "Revoke four stale sources?" },
  render: (args) => (
    <ConfirmPanel {...args}>
      <ExplainRow label="Basis">No entry from these hosts since 2026-08-12</ExplainRow>
      <ExplainRow label="Scope">4 sources · 0 sealed entries affected</ExplainRow>
      <ExplainRow label="Reversible">No</ExplainRow>
      <ConfirmActions>
        <Button variant="secondary" size="dense">
          Cancel
        </Button>
        <Button variant="danger" size="dense">
          Revoke
        </Button>
      </ConfirmActions>
    </ConfirmPanel>
  ),
};
