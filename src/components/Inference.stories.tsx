import type { Meta, StoryObj } from "@storybook/react-vite";
import { Globe, ShieldCheck, Timer } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./Button";
import {
  ConfidenceField,
  ConfirmPanel,
  ExplainPanel,
  ExplainRow,
  PrivacyBadge,
} from "./Inference";

const meta = {
  title: "Blocks/Inference",
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
export const ExplainComplete: Story = {
  args: { footer: "Every available input was used." },
  render: (args) => (
    <ExplainPanel {...args}>
      <ExplainRow label="Matched on">manifest hash</ExplainRow>
      <ExplainRow label="Sources">3 of 3</ExplainRow>
      <ExplainRow label="Confidence">0.99</ExplainRow>
    </ExplainPanel>
  ),
};

/**
 * Ask, then act, then record. Nothing runs before an operator agrees,
 * and the question states the scope and whether it can be reversed.
 */
export const Confirm: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ConfirmPanel
      eyebrow="Proposed action"
      question="Merge entry 07 into entry 03?"
      whyLabel="why was this proposed?"
      onWhy={fn()}
      actions={
        <>
          <Button variant="secondary" size="dense">
            Cancel
          </Button>
          <Button variant="ai" size="dense">
            Merge
          </Button>
        </>
      }
    >
      <ExplainRow label="Basis">Same manifest hash on both entries</ExplainRow>
      <ExplainRow label="Scope">2 entries · WS-01</ExplainRow>
      <ExplainRow label="Reversible">Yes, until the next seal</ExplainRow>
    </ConfirmPanel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "why was this proposed?" }));
    await expect(canvas.getByText("Merge entry 07 into entry 03?")).toBeVisible();
  },
};

/** An irreversible proposal states that first, not in a tooltip. */
export const ConfirmIrreversible: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ConfirmPanel
      eyebrow="Proposed action"
      question="Revoke four stale sources?"
      whyLabel="why was this proposed?"
      onWhy={fn()}
      actions={
        <>
          <Button variant="secondary" size="dense">
            Cancel
          </Button>
          <Button variant="danger" size="dense">
            Revoke
          </Button>
        </>
      }
    >
      <ExplainRow label="Basis">No entry from these hosts since 2026-08-12</ExplainRow>
      <ExplainRow label="Scope">4 sources · 0 sealed entries affected</ExplainRow>
      <ExplainRow label="Reversible">No</ExplainRow>
    </ConfirmPanel>
  ),
};

/** A field that states its own confidence, as a rule and as a number. */
export const Confidence: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 360 }}>
      <ConfidenceField
        id="c-high"
        label="Resolved operator"
        confidence={0.94}
        confidenceLabel="0.94 · matched on 3 of 4 inputs"
        whyLabel="why?"
        onWhy={fn()}
      >
        Nora Feld
      </ConfidenceField>
      <ConfidenceField
        id="c-review"
        label="Resolved host"
        tone="review"
        confidence={0.42}
        confidenceLabel="0.42 · below the threshold, review before sealing"
        whyLabel="why?"
        onWhy={fn()}
      >
        mirror.example.net
      </ConfidenceField>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("meter", { name: /0.94/ })).toBeInTheDocument();
  },
};

/** Where a query goes and how long it is kept. Both, or neither. */
export const Privacy: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <PrivacyBadge tone="local" icon={<ShieldCheck aria-hidden />}>
        local processing
      </PrivacyBadge>
      <PrivacyBadge tone="external" icon={<Globe aria-hidden />}>
        model · eu-central
      </PrivacyBadge>
      <PrivacyBadge tone="retention" icon={<Timer aria-hidden />}>
        retained 30 days
      </PrivacyBadge>
    </div>
  ),
};
