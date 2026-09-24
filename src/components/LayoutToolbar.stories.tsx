import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Actions, Toolbar, ToolbarEnd } from "./Layout";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { SearchField } from "./SearchField";

const meta = {
  title: "Patterns/Layout/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
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
