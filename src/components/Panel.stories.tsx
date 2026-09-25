import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { Panel, PanelFooter, PanelMeta, PanelNote } from "./Panel";
import { SealValue } from "./Seal";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Blocks/Panel",
  component: Panel,
  tags: ["autodocs"],
  args: {
    index: "01",
    indexSize: "md",
    indexTone: "neutral",
    indexRule: true,
    surface: "sheet",
    title: "Source register",
    padded: true,
    children: "A panel holds one thing the register knows about.",
  },
  argTypes: {
    index: { control: "text" },
    indexSize: { control: "radio", options: ["md", "sm"] },
    indexTone: { control: "radio", options: ["neutral", "danger"] },
    indexRule: { control: "boolean" },
    surface: { control: "radio", options: ["sheet", "grid"] },
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
      A panel holds one thing the register knows about.
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

/** The § mark from the section numbering, in place of an ordinal. */
export const SectionMark: Story = {
  args: { index: "§", title: "Coverage" },
};

/** The cold surface. For a dense field of mono values only. */
export const Grid: Story = {
  args: { surface: "grid", title: "Extract" },
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
  args: { index: undefined, title: "Notes" },
};

/** Header and footer, with the body drawn to the panel's own edge. */
export const WithFooter: Story = {
  args: {
    index: "02",
    title: "Key rotation",
    children: "The signing key for this workspace expires on 2026-09-29.",
  },
  render: (args) => (
    <Panel {...args}>
      <PanelFooter>
        <StatusPill tone="warn">expiring</StatusPill>
        <span style={{ marginLeft: "auto" }}>
          <Button variant="seal" size="dense">
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
