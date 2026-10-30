import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { Select } from "../../../forms/select/Select";
import { ListToolbar, ListToolbarEnd, ListToolbarNote } from "./ListToolbar";

const meta = {
  title: "Data/Table/ListToolbar",
  component: ListToolbar,
  tags: ["layer:block", "status:deprecated"],
  args: { label: "Filter members", sticky: false, children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof ListToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: renders `Toolbar role="search" sticky="top"`; `ListToolbarEnd` is `ToolbarEnd`, `ListToolbarNote` is `ToolbarNote`. */
export const Members: Story = {
  render: (args) => (
    <ListToolbar {...args}>
      <ListToolbarEnd>
        <Button variant="secondary">Export CSV</Button>
      </ListToolbarEnd>
      <Select id="lt-role" label="Role" hideLabel mono={false} defaultValue="">
        <option value="">All roles</option>
        <option value="owner">Owners</option>
      </Select>
      <ListToolbarNote>People with a seat in this workspace.</ListToolbarNote>
    </ListToolbar>
  ),
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole("search", { name: "Filter members" });
    await expect(bar.querySelector(".di-toolbar-end")!.nextElementSibling).toHaveClass("di-toolbar-note");
  },
};
