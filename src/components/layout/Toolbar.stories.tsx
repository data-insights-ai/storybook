import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Actions } from "./Actions";
import { Toolbar, ToolbarEnd } from "./Toolbar";
import { Button } from "../actions/Button";
import { Chip } from "../data/marks/Chip";
import { SearchField } from "../forms/text/SearchField";
import { Select } from "../forms/select/Select";
import { TextField } from "../forms/text/TextField";

const meta = {
  title: "Layout/Arrangement/Toolbar",
  component: Toolbar,
  tags: ["layer:pattern", "autodocs"],
  args: { children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Filters lead, controls sit at the trailing edge in `ToolbarEnd`. */
export const Default: Story = {
  render: (args) => (
    <Toolbar {...args}>
      <div style={{ width: 240 }}>
        <SearchField id="toolbar-search" label="Search sources" placeholder="host or hash" dense={true} />
      </div>
      <Chip active={true} removeLabel="Remove the state filter">
        state: running
      </Chip>
      <ToolbarEnd>
        <Button variant="secondary" size="dense">
          Export
        </Button>
      </ToolbarEnd>
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Search sources")).toBeVisible();
  },
};

/** `Actions` is the same idea inside a row: controls, kept together. */
export const InlineActions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Actions>
      <Button variant="primary" size="dense">
        Seal now
      </Button>
      <Button variant="secondary" size="dense">
        Open log
      </Button>
    </Actions>
  ),
};

/**
 * A one-line form. Fields and their action share the control row: the button
 * lines up with the input, not with the label, and an error line under a field
 * does not move it.
 */
export const InlineForm: Story = {
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Toolbar>
        <Select id="toolbar-person" label="Person" mono={false} defaultValue="nora">
          <option value="nora">Nora Feld</option>
          <option value="jonas">Jonas Brandt</option>
        </Select>
        <TextField id="toolbar-note" label="Note" hint="Use 1 to 80 characters." hintTone="error" />
        <Button type="submit">Grant</Button>
      </Toolbar>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Grant" });
    const input = canvas.getByLabelText("Person");
    const gap = Math.abs(button.getBoundingClientRect().bottom - input.getBoundingClientRect().bottom);
    await expect(gap).toBeLessThanOrEqual(2);
  },
};
