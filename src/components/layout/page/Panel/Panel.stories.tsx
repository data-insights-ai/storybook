import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { Actions } from "../../arrangement/Actions";
import { Panel, PanelActions, PanelFooter, PanelLead, PanelMeta, PanelNote, PanelStatus } from "./Panel";
import { SealValue } from "../../../marks/status/SealValue";
import { StatusPill } from "../../../marks/status/StatusPill";

const meta = {
  title: "Layout/Page/Panel",
  component: Panel,
  tags: ["layer:block", "autodocs"],
  args: {
    surface: "sheet",
    emphasis: false,
    title: "Graz office",
    padded: true,
    children: "Fourteen sources report here; the last event arrived two minutes ago.",
  },
  argTypes: {
    surface: { control: "radio", options: ["sheet", "inset"] },
    emphasis: { control: "boolean" },
    label: { control: "text" },
    heading: { control: "radio", options: [2, 3] },
    title: { control: "text" },
    padded: { control: "boolean" },
    children: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

/* The inset of the surface, measured: the same above the first line as below the last. */
async function sameInset(canvasElement: HTMLElement) {
  const panel = canvasElement.querySelector<HTMLElement>(".di-panel")!;
  const style = getComputedStyle(panel);
  await expect(style.paddingTop).toBe(style.paddingBottom);
  await expect(style.paddingLeft).toBe(style.paddingTop);
}

/** The default sheet: a title in the display face over its content, the same inset all round. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await sameInset(canvasElement);
    const title = within(canvasElement).getByText("Graz office");
    await expect(getComputedStyle(title).fontFamily).toContain("Space Grotesk");
  },
};

/**
 * The header's trailing line is a slot, so what a panel reports about
 * itself can carry the seal and the mono track. A string could not.
 */
export const WithMeta: Story = {
  args: { children: null },
  render: (args) => (
    <Panel {...args}>
      <PanelMeta>
        <SealValue stateLabel="Sealed">09:12:04Z</SealValue>
      </PanelMeta>
      Fourteen sources report here; the last event arrived two minutes ago.
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("09:12:04Z")).toBeVisible();
  },
};

/** A state sits beside the title it qualifies: a failure says so in words, next to the run that failed. */
export const Status: Story = {
  args: { title: "Ingest run", children: null },
  render: (args) => (
    <Panel {...args}>
      <PanelStatus>
        <StatusPill tone="danger">failed</StatusPill>
      </PanelStatus>
      Connection reset by the upstream host after 2 of 14 batches.
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText("Ingest run").getBoundingClientRect();
    const pill = canvas.getByText("failed").getBoundingClientRect();
    await expect(Math.abs(pill.top + pill.height / 2 - (title.top + title.height / 2))).toBeLessThanOrEqual(3);
    await expect(pill.left - title.right).toBeLessThanOrEqual(12);
  },
};

/** A step below the surface it sits in: a group inside a panel, a quoted extract. */
export const Inset: Story = {
  args: { surface: "inset", title: "Extract" },
  render: (args) => (
    <Panel title="Manifest">
      <Panel {...args}>a4f9c21e · 2026-09-18T09:12:04Z</Panel>
    </Panel>
  ),
};

/**
 * A mono label above the title, and the title as a heading the page outline
 * reads. The label is a kind or a source; the title says what the block shows.
 */
export const Labelled: Story = {
  args: {
    label: "Coverage · last 24 h",
    title: "Two of nine tables are not arriving",
    heading: 2,
    children: "Sign-in logs and audit events stopped at 06:10; the other seven tables are current.",
  },
};

/**
 * The one block that matters in the view carries the gold edge. One per
 * view. `PanelLead` says what it asks for, above the actions, in regular
 * weight: the title is the block's one bold line.
 */
export const Emphasis: Story = {
  args: {
    emphasis: true,
    label: "Verdict",
    title: "Credentials were used to reach the file server",
    heading: 2,
    children: null,
  },
  render: (args) => (
    <Panel {...args}>
      <PanelLead>Isolate the server before the next sync window.</PanelLead>
      <Actions align="start">
        <Button>Isolate the server</Button>
        <Button variant="secondary">Reset the account</Button>
      </Actions>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lead = canvas.getByText("Isolate the server before the next sync window.");
    await expect(lead).toHaveClass("di-panel-lead");
    await expect(Number(getComputedStyle(lead).fontWeight)).toBeLessThan(500);
    await expect(Number(getComputedStyle(canvas.getByRole("heading", { level: 2 })).fontWeight)).toBeGreaterThanOrEqual(
      600,
    );
  },
};

/** A short tile: no title, only what it reports, at the same inset. */
export const Tile: Story = {
  args: {
    title: undefined,
    children: "Four sources ingested since the last seal.",
  },
};

/**
 * The footer is a row inside the surface, 16px under the content and at
 * the same inset as the head: what it reports at its start, the action at
 * its end. The state sits beside the title it qualifies.
 */
export const WithFooter: Story = {
  args: {
    title: "Key rotation",
    children: "The signing key for this workspace expires on 2026-09-29.",
  },
  render: (args) => (
    <Panel {...args}>
      <PanelStatus>
        <StatusPill tone="warn">expiring</StatusPill>
      </PanelStatus>
      <p>{args.children}</p>
      <PanelFooter>Rotated last on 2025-09-29 by Nora Feld</PanelFooter>
      <PanelActions>
        <Button variant="secondary" size="sm">
          Rotate now
        </Button>
      </PanelActions>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    await sameInset(canvasElement);
    const canvas = within(canvasElement);
    const body = canvas.getByText(/expires on/).getBoundingClientRect();
    const footer = canvas.getByText(/Rotated last/).getBoundingClientRect();
    const action = canvas.getByRole("button", { name: "Rotate now" }).getBoundingClientRect();
    const frame = canvasElement.querySelector(".di-panel")!;
    const panel = frame.getBoundingClientRect();
    // The rows are one gap apart: 16px comfortable, 12px compact.
    await expect(footer.top - body.bottom).toBeGreaterThanOrEqual(parseFloat(getComputedStyle(frame).rowGap));
    await expect(Math.round(panel.right - action.right)).toBe(Math.round(footer.left - panel.left));
  },
};

/** With nothing else to say below the content, the action goes to the head's end. */
export const ActionInHead: Story = {
  args: {
    title: "Retention",
    children: "Entries are kept for 400 days, then sealed into the cold archive.",
  },
  render: (args) => (
    <Panel {...args}>
      <PanelActions>
        <Button variant="secondary" size="sm">
          Edit
        </Button>
      </PanelActions>
      {args.children}
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText("Retention").getBoundingClientRect();
    const edit = canvas.getByRole("button", { name: "Edit" }).getBoundingClientRect();
    await expect(edit.bottom).toBeLessThanOrEqual(title.bottom + 6);
  },
};

/** What a panel holds in practice: a measured value under its seal. */
export const WithSealedValue: Story = {
  args: { title: "Manifest" },
  render: (args) => (
    <Panel {...args}>
      <SealValue state="sealed" stateLabel="Sealed">
        a4f9c21e · 2026-09-18T09:12:04Z
      </SealValue>
    </Panel>
  ),
};

/**
 * The quiet line under a panel's content: the caveat, the unit, the
 * thing the numbers above do not say. It is never where a fact lives.
 */
export const WithNote: Story = {
  args: { title: "Coverage" },
  render: (args) => (
    <Panel {...args}>
      <SealValue state="sealed" stateLabel="Sealed">
        86.4%
      </SealValue>
      <PanelNote>Measured against sealed entries only. Unsealed drafts are not counted.</PanelNote>
    </Panel>
  ),
};

/** The slots written in reverse: the panel still places lead first, then the body, the note, and the footer last. */
export const SlotsWrittenReversed: Story = {
  args: { title: "Delivery" },
  render: (args) => (
    <Panel {...args}>
      <PanelActions>
        <Button size="sm">Retry</Button>
      </PanelActions>
      <PanelFooter>3 attempts left</PanelFooter>
      <PanelNote>Retries stop after three attempts.</PanelNote>
      <p>The Sentinel export has failed since 08:40; the other two deliver.</p>
      <PanelLead>Three exports, one failing.</PanelLead>
      <PanelMeta>live</PanelMeta>
      <PanelStatus>
        <StatusPill tone="warn">degraded</StatusPill>
      </PanelStatus>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const order = [
      "Delivery",
      "Three exports, one failing.",
      "The Sentinel export has failed since 08:40; the other two deliver.",
      "Retries stop after three attempts.",
      "3 attempts left",
    ].map((text) => canvas.getByText(text).getBoundingClientRect().top);
    await expect([...order].sort((a, b) => a - b)).toEqual(order);
    const meta = canvas.getByText("live").getBoundingClientRect();
    const title = canvas.getByText("Delivery").getBoundingClientRect();
    await expect(Math.abs(meta.top + meta.height / 2 - (title.top + title.height / 2))).toBeLessThanOrEqual(4);
    const retry = canvas.getByRole("button", { name: "Retry" }).getBoundingClientRect();
    const footer = canvas.getByText("3 attempts left").getBoundingClientRect();
    await expect(Math.abs(retry.top + retry.height / 2 - (footer.top + footer.height / 2))).toBeLessThanOrEqual(2);
  },
};
