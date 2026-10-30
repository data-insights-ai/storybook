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
