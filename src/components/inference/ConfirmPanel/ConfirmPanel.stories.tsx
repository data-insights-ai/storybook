import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { ConfirmActions, ConfirmPanel } from "./ConfirmPanel";
import { ExplainRow } from "../ExplainPanel";

const meta = {
  title: "Inference/ConfirmPanel",
  component: ConfirmPanel,
  tags: ["layer:block", "autodocs"],
  args: {
    label: "Proposed action",
    question: "Merge entry 07 into entry 03?",
    whyLabel: "why was this proposed?",
    onWhy: fn(),
    heading: 2,
    children: null,
  },
  argTypes: {
    label: { control: "text" },
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
      <ExplainRow label="Scope">2 entries in WS-01</ExplainRow>
      <ExplainRow label="Reversible">Yes, until the next seal</ExplainRow>
      <ConfirmActions>
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button size="sm">Merge</Button>
      </ConfirmActions>
    </ConfirmPanel>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "why was this proposed?" }));
    await expect(args.onWhy).toHaveBeenCalled();
    await expect(
      canvas.getByRole("heading", {
        level: 2,
        name: "Merge entry 07 into entry 03?",
      }),
    ).toBeVisible();
    // One surface: no band of another tone inside it, and the asked-for action is the primary button.
    const panel = canvasElement.querySelector(".di-confirm")!;
    for (const child of panel.querySelectorAll("*")) {
      const bg = getComputedStyle(child).backgroundColor;
      if (child.closest(".di-btn")) continue;
      await expect(bg === "rgba(0, 0, 0, 0)" || bg === "transparent").toBe(true);
    }
    await expect(canvas.getByRole("button", { name: "Merge" })).toHaveClass("di-btn-primary");
    await expect(getComputedStyle(canvas.getByText("Same manifest hash on both entries")).fontFamily).not.toMatch(
      /Mono/,
    );
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
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button variant="danger" size="sm">
          Revoke
        </Button>
      </ConfirmActions>
    </ConfirmPanel>
  ),
};

/** Long German labels in a narrow column: the labels wrap, the actions stack. */
export const LongLabelsNarrow: Story = {
  args: {
    label: "Vorgeschlagene Maßnahme",
    question: "Die Datenquelle feed.example.io wieder aufnehmen?",
    whyLabel: "Warum wurde das vorgeschlagen?",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 300 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <ConfirmPanel {...args}>
      <ExplainRow label="Entscheidungsgrundlage">1.284 Einträge warten hinter einem pausierten Host</ExplainRow>
      <ExplainRow label="Wirkungsbereich">1 Quelle in WS-01</ExplainRow>
      <ExplainRow label="Rückgängig machbar">Ja, die Quelle kann wieder pausiert werden</ExplainRow>
      <ConfirmActions>
        <Button variant="secondary" size="sm">
          Abbrechen
        </Button>
        <Button size="sm">Wieder aufnehmen</Button>
      </ConfirmActions>
    </ConfirmPanel>
  ),
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector(".di-confirm")!;
    await expect(panel.scrollWidth).toBeLessThanOrEqual(panel.clientWidth);
  },
};
