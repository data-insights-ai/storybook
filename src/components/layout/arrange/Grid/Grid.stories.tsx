import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Fact, FactList } from "../../../records/FactList";
import { Figure } from "../../../figures/Figure";
import { Panel } from "../../page/Panel";
import { Select } from "../../../forms/select/Select";
import { TextField } from "../../../forms/text/TextField";
import { Grid } from "./Grid";

const meta = {
  title: "Layout/Arrange/Grid",
  component: Grid,
  tags: ["layer:pattern", "autodocs"],
  args: { min: "200px", gap: 12, children: null },
  argTypes: {
    min: { control: "text" },
    gap: { control: "radio", options: [12, 16, 24] },
    fill: { control: "boolean" },
    children: { control: false },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Tiles at 12: as many columns as fit, so a wider page gets more of them,
 * not wider tiles. `min` is the smallest a cell may get, not a fixed width.
 */
export const Default: Story = {
  render: (args) => (
    <Grid {...args}>
      <Panel>
        <Figure label="Open cases" value="14" />
      </Panel>
      <Panel>
        <Figure label="Unassigned" value="3" tone="danger" />
      </Panel>
      <Panel>
        <Figure label="Sources reporting" value="12 of 14" />
      </Panel>
      <Panel>
        <Figure label="Signals today" value="1,043" />
      </Panel>
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Open cases")).toBeVisible();
  },
};

/** Panels of an overview at 24, the distance between blocks; fewer fit on a row. */
export const Panels: Story = {
  args: { min: "320px", gap: 24 },
  render: (args) => (
    <Grid {...args}>
      <Panel title="Collection" heading={2}>
        <FactList layout="columns">
          <Fact label="Sources">14</Fact>
          <Fact label="Silent">2</Fact>
        </FactList>
      </Panel>
      <Panel title="Notifications" heading={2}>
        <FactList layout="columns">
          <Fact label="Channels">3</Fact>
          <Fact label="Failing">1</Fact>
        </FactList>
      </Panel>
      <Panel title="Exports" heading={2}>
        <FactList layout="columns">
          <Fact label="Destinations">2</Fact>
          <Fact label="Last delivery">09:12</Fact>
        </FactList>
      </Panel>
    </Grid>
  ),
};

/**
 * `fill`: five trends in three columns end in two wider ones instead of an
 * empty cell, and a wide panel still takes its own row.
 */
export const FillsTheLastRow: Story = {
  args: { min: "240px", gap: 16, fill: true },
  globals: { viewport: { value: "desk", isRotated: false } },
  render: (args) => (
    <div style={{ maxWidth: "800px" }}>
      <Grid {...args}>
        <Panel wide title="Licenses" heading={2}>
          <p>Until May 2027.</p>
        </Panel>
        {["Seats", "Balance", "Members", "AI triage", "Ingested data"].map((title) => (
          <Panel key={title} title={title} heading={2}>
            <p>The last 30 days.</p>
          </Panel>
        ))}
      </Grid>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector<HTMLElement>(".di-grid")!;
    const edge = grid.getBoundingClientRect().right;
    const cells = Array.from(grid.children, (cell) => cell.getBoundingClientRect());
    const rows = new Map<number, DOMRect[]>();
    for (const cell of cells) rows.set(Math.round(cell.top), [...(rows.get(Math.round(cell.top)) ?? []), cell]);
    await expect([...rows.values()].map((row) => row.length)).toEqual([1, 3, 2]);
    for (const row of rows.values())
      await expect(Math.round(Math.max(...row.map((cell) => cell.right)))).toBe(Math.round(edge));
  },
};

/** Short fields side by side at 16, the form's rhythm, inside the panel that holds them; on a phone they stack. */
export const Fields: Story = {
  args: { min: "220px", gap: 16 },
  render: (args) => (
    <Panel title="Rate limit">
      <Grid {...args}>
        <TextField id="grid-rate" type="number" label="Requests per minute" defaultValue="60" />
        <Select id="grid-severity" label="Lowest severity" mono={false} defaultValue="high">
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </Select>
      </Grid>
    </Panel>
  ),
};
