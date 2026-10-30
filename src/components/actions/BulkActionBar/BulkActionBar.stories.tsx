import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "../Button";
import { BulkActionBar } from "./BulkActionBar";

const meta = {
  title: "Actions/BulkActionBar",
  component: BulkActionBar,
  tags: ["layer:block", "status:deprecated"],
  args: {
    label: "Actions on the selected members",
    selectedLabel: "2 selected",
    selectAllLabel: "Select all 140 matching",
    clearLabel: "Clear",
    onSelectAll: fn(),
    onClear: fn(),
    sticky: false,
    children: null,
  },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof BulkActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: renders `Toolbar frame="bar"` with `ToolbarStatus`, `ToolbarSelection` and `ToolbarEnd`; a labelled group, no longer an ARIA toolbar. */
export const Selected: Story = {
  render: (args) => (
    <BulkActionBar {...args}>
      <Button variant="danger" size="sm">
        Remove from workspace
      </Button>
    </BulkActionBar>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: /selected members/ })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Clear" }));
    await expect(args.onClear).toHaveBeenCalled();
    (document.activeElement as HTMLElement | null)?.blur();
  },
};
