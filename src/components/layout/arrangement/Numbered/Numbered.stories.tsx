import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Panel } from "../../page/Panel";
import { Numbered } from "./Numbered";
import { Stack } from "../Stack";

const meta = {
  title: "Layout/Arrangement/Numbered",
  component: Numbered,
  tags: ["layer:pattern", "autodocs"],
  args: { index: "01", variant: "step", children: null },
  argTypes: {
    index: { control: "text" },
    variant: { control: "inline-radio", options: ["step", "row"] },
    children: { control: false },
  },
} satisfies Meta<typeof Numbered>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The index is part of the pattern, not something a screen invents. */
export const Default: Story = {
  render: (args) => (
    <Numbered {...args}>
      <Panel>A numbered block, carrying the register's ordinal.</Panel>
    </Numbered>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("01")).toBeVisible();
  },
};

/** A run of them, which is how a screen is actually built. */
export const Run: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      <Numbered index="01">
        <Panel>The session, and what it is allowed to do.</Panel>
      </Numbered>
      <Numbered index="02">
        <Panel>The channels it reports through.</Panel>
      </Numbered>
      <Numbered index="03">
        <Panel>What it measured while doing so.</Panel>
      </Numbered>
    </Stack>
  ),
};

/** Rows inside a surface: a list of steps, ruled, with no box of their own. */
export const Rows: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Panel title="What the playbook asks for">
      <div>
        <Numbered index="01" variant="row">
          Isolate the file server
        </Numbered>
        <Numbered index="02" variant="row">
          Reset the service account's credentials
        </Numbered>
        <Numbered index="03" variant="row">
          Revoke its sessions and tokens
        </Numbered>
      </div>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll(".di-numbered.is-row");
    await expect(rows).toHaveLength(3);
    await expect(getComputedStyle(rows[1]).borderTopStyle).toBe("solid");
  },
};
