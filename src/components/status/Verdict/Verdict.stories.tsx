import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StatusPill } from "../StatusPill";
import { Verdict, VerdictBody, VerdictLine, VerdictStatus } from "./Verdict";

const meta = {
  title: "Status/Verdict",
  component: Verdict,
  tags: ["layer:block", "autodocs"],
  args: { emphasis: false, children: null },
  argTypes: { children: { control: false } },
  render: (args) => (
    <Verdict emphasis={args.emphasis} label={args.label}>
      <VerdictStatus>
        <StatusPill tone="danger">Needs attention</StatusPill>
      </VerdictStatus>
      <VerdictLine>
        Exploited since 20 Oct 2026. Update to 4.2.1; check the version with <code>widgetctl --version</code>.
      </VerdictLine>
      <VerdictBody>
        <p>CISA lists the flaw as exploited: attackers run code on Example Widget gateways without signing in.</p>
      </VerdictBody>
    </Verdict>
  ),
} satisfies Meta<typeof Verdict>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The one thing on the page: the gold edge, the state, the sentence and the summary. */
export const Default: Story = {
  args: { emphasis: true, label: "Verdict" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: "Verdict" })).toHaveClass("di-surface-edge-one");
    const pill = canvas.getByText("Needs attention");
    await expect(pill).toBeVisible();
    const status = canvasElement.querySelector(".di-verdict-status")!;
    await expect(status.getBoundingClientRect().height).toBe(pill.getBoundingClientRect().height);
  },
};

/** For reference: no gold edge, the same order. */
export const Reference: Story = {
  render: (args) => (
    <Verdict emphasis={args.emphasis}>
      <VerdictStatus>
        <StatusPill tone="neutral">Reference</StatusPill>
      </VerdictStatus>
      <VerdictLine>No exploitation reported. Plan the update to 9.18.30.</VerdictLine>
      <VerdictBody>
        <p>A critical flaw in a widely deployed DNS server, with no sign of exploitation so far.</p>
      </VerdictBody>
    </Verdict>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector(".di-verdict")).not.toHaveClass("di-surface-edge-one");
  },
};

/** On a phone the sentence wraps and keeps its order. */
export const Phone: Story = {
  parameters: { viewport: { value: "phone" } },
};
