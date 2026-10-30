import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Actions } from "../Actions";
import { Toolbar, ToolbarEnd } from "./Toolbar";
import { Button } from "../../../actions/Button";
import { Chip } from "../../../marks/Chip";
import { SearchField } from "../../../forms/text/SearchField";
import { Select } from "../../../forms/select/Select";
import { TextField } from "../../../forms/text/TextField";

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
  globals: { viewport: { value: "desk", isRotated: false } },
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Toolbar>
        <Select id="toolbar-person" label="Person" mono={false} defaultValue="nora">
          <option value="nora">Nora Feld</option>
          <option value="jonas">Jonas Brandt</option>
        </Select>
        <TextField id="toolbar-note" label="Note" defaultValue="Covers the night shift until Friday, when the rota changes back to the usual handover" hint="Use 1 to 80 characters." hintTone="error" />
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

/**
 * A one-line add form (`fillFirst`): the first field takes the free width,
 * the select fits its options, the button sits on the control row. When the
 * toolbar itself is narrower than 600px, in a sheet or on a phone, it stacks.
 */
export const AddForm: Story = {
  name: "Add form",
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <Toolbar fillFirst>
        <TextField id="tb-domain" label="Domain" mono placeholder="northwind.example" hint="Verified by a DNS record." />
        <Select id="tb-mode" label="Sign-in" mono={false} defaultValue="required">
          <option value="required">Required</option>
          <option value="optional">Optional</option>
        </Select>
        <Button type="submit">Add domain</Button>
      </Toolbar>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Domain").getBoundingClientRect();
    const select = canvas.getByLabelText("Sign-in").getBoundingClientRect();
    const button = canvas.getByRole("button", { name: "Add domain" }).getBoundingClientRect();
    if (canvasElement.getBoundingClientRect().width >= 640) {
      await expect(Math.abs(input.top + input.height / 2 - (button.top + button.height / 2))).toBeLessThan(2);
      await expect(input.width).toBeGreaterThan(select.width * 2);
    } else {
      await expect(button.top).toBeGreaterThan(input.bottom);
    }
  },
};

/** `ToolbarEnd` sits at the far end even when it is written first. */
export const EndWrittenFirst: Story = {
  render: () => (
    <Toolbar>
      <ToolbarEnd>
        <Button variant="secondary" size="dense">
          Export
        </Button>
      </ToolbarEnd>
      <SearchField id="toolbar-first-search" label="Search sources" placeholder="host or hash" dense={true} />
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector(".di-toolbar")!.getBoundingClientRect();
    const end = canvasElement.querySelector(".di-toolbar-end")!.getBoundingClientRect();
    await expect(Math.abs(end.right - bar.right)).toBeLessThanOrEqual(1);
    await expect(canvasElement.querySelector(".di-toolbar")!.lastElementChild).toHaveClass("di-toolbar-end");
  },
};
