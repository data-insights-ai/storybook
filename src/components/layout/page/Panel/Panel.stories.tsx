import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { Actions } from "../../arrangement/Actions";
import { Panel, PanelFooter, PanelLead, PanelMeta, PanelNote } from "./Panel";
import { SealValue } from "../../../marks/status/SealValue";
import { StatusPill } from "../../../marks/status/StatusPill";

const meta = {
  title: "Layout/Page/Panel",
  component: Panel,
  tags: ["layer:block", "autodocs"],
  args: {
    index: "01",
    indexSize: "md",
    indexTone: "neutral",
    indexRule: true,
    surface: "sheet",
    emphasis: false,
    title: "Graz office",
    padded: true,
    children: "Fourteen sources report here; the last event arrived two minutes ago.",
  },
  argTypes: {
    index: { control: "text" },
    indexSize: { control: "radio", options: ["md", "sm"] },
    indexTone: { control: "radio", options: ["neutral", "danger"] },
    indexRule: { control: "boolean" },
    surface: { control: "radio", options: ["sheet", "inset"] },
    emphasis: { control: "boolean" },
    label: { control: "text" },
    heading: { control: "radio", options: [2, 3] },
    title: { control: "text" },
    padded: { control: "boolean" },
    children: { control: "text" },
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default sheet, with the index column that names the system. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("01")).toBeVisible();
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

/** A state, rather than a measurement, in the same slot. */
export const MetaStatus: Story = {
  name: "Meta status",
  args: { index: "04", title: "Ingest run", indexTone: "danger", children: null },
  render: (args) => (
    <Panel {...args}>
      <PanelMeta>
        <StatusPill tone="danger">failed</StatusPill>
      </PanelMeta>
      The run stopped after four consecutive rate limits.
    </Panel>
  ),
};

/** A step below the surface it sits in: a group inside a panel, a quoted extract. */
export const Inset: Story = {
  args: { index: undefined, surface: "inset", title: "Extract" },
  render: (args) => (
    <Panel index={undefined} title="Manifest">
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
    index: undefined,
    label: "Coverage · last 24 h",
    title: "Two of nine tables are not arriving",
    heading: 2,
    children: "Sign-in logs and audit events stopped at 06:10; the other seven tables are current.",
  },
};

/**
 * The one block that matters in the view carries the gold edge. One per
 * view. `PanelLead` says what it asks for, above the actions.
 */
export const Emphasis: Story = {
  args: {
    index: undefined,
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
    await expect(canvas.getByText("Isolate the server before the next sync window.")).toHaveClass("di-panel-lead");
  },
};

/** A short tile: no rule, because there is no height for it to run down. */
export const Tile: Story = {
  args: {
    index: "A",
    indexSize: "sm",
    indexRule: false,
    title: undefined,
    children: "Four sources ingested since the last seal.",
  },
};

/** A failure keeps its index, tinted. The row is still a record. */
export const Failed: Story = {
  args: {
    index: "07",
    indexTone: "danger",
    title: "Ingest run",
    children: "Connection reset by the upstream host after 2 of 14 batches.",
  },
};

/** No index at all, for a panel that is not part of a register. */
export const WithoutIndex: Story = {
  args: { index: undefined, title: "Notes", children: "Rotate the collector key before the audit in March." },
};

/** The footer strip under the body: the state and the one action it asks for. */
export const WithFooter: Story = {
  args: {
    index: "02",
    title: "Key rotation",
    children: "The signing key for this workspace expires on 2026-09-29.",
  },
  render: (args) => (
    <Panel {...args}>
      <p>{args.children}</p>
      <PanelFooter>
        <StatusPill tone="warn">expiring</StatusPill>
        <span style={{ marginLeft: "auto" }}>
          <Button variant="secondary" size="dense">
            Rotate now
          </Button>
        </span>
      </PanelFooter>
    </Panel>
  ),
};

/** What a panel holds in practice: a measured value under its seal. */
export const WithSealedValue: Story = {
  args: { index: "03", title: "Manifest" },
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
  args: { index: "04", title: "Coverage" },
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
      <PanelFooter>
        <Button size="dense">Retry</Button>
      </PanelFooter>
      <PanelNote>Retries stop after three attempts.</PanelNote>
      <p>The Sentinel export has failed since 08:40; the other two deliver.</p>
      <PanelLead>Three exports, one failing.</PanelLead>
      <PanelMeta>live</PanelMeta>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const order = [
      "Three exports, one failing.",
      "The Sentinel export has failed since 08:40; the other two deliver.",
      "Retries stop after three attempts.",
      "Retry",
    ].map((text) => canvas.getByText(text).getBoundingClientRect().top);
    await expect([...order].sort((a, b) => a - b)).toEqual(order);
    const meta = canvas.getByText("live").getBoundingClientRect();
    const title = canvas.getByText("Delivery").getBoundingClientRect();
    await expect(Math.abs(meta.top + meta.height / 2 - (title.top + title.height / 2))).toBeLessThanOrEqual(4);
  },
};
