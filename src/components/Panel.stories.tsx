import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { Panel } from "./Panel";
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
    tone: "sheet",
    title: "Source register",
    meta: "updated 09:12Z",
    padded: true,
    children: "A panel holds one thing the register knows about.",
  },
  argTypes: {
    index: { control: "text" },
    indexSize: { control: "radio", options: ["md", "sm"] },
    indexTone: { control: "radio", options: ["neutral", "danger"] },
    indexRule: { control: "boolean" },
    tone: { control: "radio", options: ["sheet", "grid"] },
    title: { control: "text" },
    meta: { control: "text" },
    padded: { control: "boolean" },
    children: { control: "text" },
    footer: { control: false },
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

/** The § mark from the section numbering, in place of an ordinal. */
export const SectionMark: Story = {
  args: { index: "§", title: "Coverage", meta: "§ 04" },
};

/** The cold surface. For a dense field of mono values only. */
export const Grid: Story = {
  args: { tone: "grid", title: "Extract", meta: "412 rows" },
};

/** A short tile: no rule, because there is no height for it to run down. */
export const Tile: Story = {
  args: {
    index: "A",
    indexSize: "sm",
    indexRule: false,
    title: undefined,
    meta: undefined,
    children: "Four sources ingested since the last seal.",
  },
};

/** A failure keeps its index, tinted. The row is still a record. */
export const Failed: Story = {
  args: {
    index: "07",
    indexTone: "danger",
    title: "Ingest run",
    meta: "failed 08:44Z",
    children: "Connection reset by the upstream host after 2 of 14 batches.",
  },
};

/** No index at all, for a panel that is not part of a register. */
export const WithoutIndex: Story = {
  args: { index: undefined, title: "Notes", meta: undefined },
};

/** Header and footer, with the body drawn to the panel's own edge. */
export const WithFooter: Story = {
  args: {
    index: "02",
    title: "Key rotation",
    meta: "due in 6 days",
    children: "The signing key for this workspace expires on 2026-09-29.",
  },
  render: (args) => (
    <Panel
      {...args}
      footer={
        <>
          <StatusPill tone="warn">expiring</StatusPill>
          <span style={{ marginLeft: "auto" }}>
            <Button variant="seal" size="dense">
              Rotate now
            </Button>
          </span>
        </>
      }
    />
  ),
};

/** What a panel holds in practice: a measured value under its seal. */
export const WithSealedValue: Story = {
  args: { index: "03", title: "Manifest", meta: "sealed" },
  render: (args) => (
    <Panel {...args}>
      <SealValue state="sealed" stateLabel="Sealed">
        a4f9c21e · 2026-09-18T09:12:04Z
      </SealValue>
    </Panel>
  ),
};
