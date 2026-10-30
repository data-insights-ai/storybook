import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { SealValue } from "../../marks/status/SealValue";
import { ExplainFooter, ExplainIgnored, ExplainPanel, ExplainRow } from "./ExplainPanel";

const meta = {
  title: "Inference/ExplainPanel",
  component: ExplainPanel,
  tags: ["layer:block", "autodocs"],
  args: {
    label: "Why this was proposed",
    answer: "Proposed because 1,284 entries are queued behind one paused host.",
    confidenceLabel: "Confidence",
    confidence: "0.88",
    confidenceWord: "high",
    children: null,
  },
  argTypes: {
    label: { control: "text" },
    answer: { control: "text" },
    confidenceLabel: { control: "text" },
    confidence: { control: "text" },
    confidenceWord: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof ExplainPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The answer first, then its confidence, the evidence, what was not considered, and the caveat. */
export const Explain: Story = {
  render: (args) => (
    <ExplainPanel {...args}>
      <ExplainRow label="Matched on">Host, manifest prefix and queue depth</ExplainRow>
      <ExplainRow label="Window" mono>
        2026-09-22 → 2026-09-23
      </ExplainRow>
      <ExplainIgnored summary="Not considered (2)" items={["Entries sealed before 2026-09-01", "Unsealed drafts"]} />
      <ExplainFooter>This does not account for sources added in the last hour.</ExplainFooter>
    </ExplainPanel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: /Why this was proposed/ })).toBeVisible();
    await expect(canvas.queryByText("Unsealed drafts")).not.toBeVisible();
    await userEvent.click(canvas.getByText("Not considered (2)"));
    await expect(canvas.getByText("Unsealed drafts")).toBeVisible();
    await expect(getComputedStyle(canvas.getByText("Unsealed drafts")).textDecorationLine).toBe("none");
    // A date is one token: the range never breaks inside one.
    const window = canvas.getByText("2026-09-22 → 2026-09-23");
    await expect(getComputedStyle(window).wordBreak).toBe("keep-all");
  },
};

/** Nothing ignored: the model used every input it had. */
export const Complete: Story = {
  args: {
    answer: "Proposed because both entries carry the same manifest hash.",
    confidence: "0.99",
    confidenceWord: "very high",
  },
  render: (args) => (
    <ExplainPanel {...args}>
      <ExplainRow label="Matched on">Manifest hash</ExplainRow>
      <ExplainRow label="Sources">3 of 3</ExplainRow>
      <ExplainFooter>
        Every available input was used, up to <SealValue stateLabel="Sealed">2026-09-23T09:12:04Z</SealValue>
      </ExplainFooter>
    </ExplainPanel>
  ),
};

/** Long German labels in a narrow column. */
export const LongLabelsNarrow: Story = {
  args: {
    label: "Warum das vorgeschlagen wurde",
    answer: "Vorgeschlagen, weil 1.284 Einträge hinter einem pausierten Host warten.",
    confidenceLabel: "Zuverlässigkeit",
    confidenceWord: "hoch",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 300 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <ExplainPanel {...args}>
      <ExplainRow label="Übereinstimmung anhand von">Host, Manifest-Präfix und Warteschlangentiefe</ExplainRow>
      <ExplainRow label="Betrachtungszeitraum" mono>
        2026-09-22 → 2026-09-23
      </ExplainRow>
      <ExplainIgnored
        summary="Nicht berücksichtigt (2)"
        items={["Vor dem 2026-09-01 versiegelte Einträge", "Unversiegelte Entwürfe"]}
      />
      <ExplainFooter>Quellen der letzten Stunde sind nicht berücksichtigt.</ExplainFooter>
    </ExplainPanel>
  ),
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector(".di-explain")!;
    await expect(panel.scrollWidth).toBeLessThanOrEqual(panel.clientWidth);
  },
};
