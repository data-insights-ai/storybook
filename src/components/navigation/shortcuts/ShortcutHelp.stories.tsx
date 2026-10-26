import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { SearchField } from "../../forms/SearchField";
import { ShortcutHelp } from "./ShortcutHelp";

const meta = {
  title: "Patterns/ShortcutHelp",
  component: ShortcutHelp,
  args: {
    title: "Keyboard shortcuts",
    closeLabel: "Close",
    labels: { search: "Search", create: "Create", edit: "Edit", help: "Show the shortcuts", close: "Close a dialog" },
  },
} satisfies Meta<typeof ShortcutHelp>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `/` focuses the search, `n` presses the marked button, `?` lists both. */
export const OnAPage: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12, maxWidth: 480 }}>
      <SearchField id="sc-search" label="Search sources" placeholder="Search sources" />
      <Button shortcut="n">New source</Button>
      <ShortcutHelp {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.keyboard("/");
    await expect(canvas.getByLabelText("Search sources")).toHaveFocus();
    (document.activeElement as HTMLElement).blur();
    await userEvent.keyboard("?");
    const dialog = await within(document.body).findByRole("dialog");
    await expect(within(dialog).getByText("New source")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
  },
};
