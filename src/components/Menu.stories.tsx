import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreVertical } from "lucide-react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "./Button";
import { Menu, MenuDivider, MenuItem, Tooltip } from "./Menu";

const meta = {
  title: "Blocks/Menu",
  component: Menu,
  tags: ["autodocs"],
  args: {
    open: false,
    label: "Actions for entry 04",
    onOpenChange: fn(),
    trigger: () => null,
    children: null,
  },
  argTypes: {
    open: { control: "boolean" },
    label: { control: "text" },
    trigger: { control: false },
    children: { control: false },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 200 }}>
        <Menu
          {...args}
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            args.onOpenChange(next);
          }}
          trigger={(props) => (
            <Button {...props} variant="secondary" iconOnly={true} aria-label="Actions for entry 04">
              <MoreVertical aria-hidden />
            </Button>
          )}
        >
          <MenuItem onSelect={() => setOpen(false)}>Open record</MenuItem>
          <MenuItem onSelect={() => setOpen(false)}>Copy manifest</MenuItem>
          <MenuItem onSelect={() => setOpen(false)}>Export entry</MenuItem>
          <MenuDivider />
          <MenuItem onSelect={() => setOpen(false)} inferred={true}>
            Merge with 07
          </MenuItem>
          <MenuDivider />
          <MenuItem onSelect={() => setOpen(false)} tone="danger">
            Revoke source
          </MenuItem>
        </Menu>
      </div>
    );
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("menu")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Actions for entry 04" }));
    await waitFor(() =>
      expect(canvas.getByRole("menu", { name: "Actions for entry 04" })).toBeVisible(),
    );
  },
};

/** Open, with the arrow-key movement a menu owes its user. */
export const Open: Story = {
  args: { open: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const items = canvas.getAllByRole("menuitem");
    await expect(items).toHaveLength(5);
    items[0].focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(items[1]).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(items[4]).toHaveFocus();
  },
};

/** A model proposed one of these, so it wears the ring. */
export const WithInferredItem: Story = {
  args: { open: true },
};

/** A short label for a control that has none. Never the only place a fact lives. */
export const Tooltips: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 10 }}>
      <Tooltip>sealed 09:12:04Z</Tooltip>
      <Tooltip>⌘K</Tooltip>
    </div>
  ),
};
