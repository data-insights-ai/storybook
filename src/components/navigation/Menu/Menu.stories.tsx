import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreVertical } from "lucide-react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { DataTable, TableBody, TableCell, TableRow } from "../../data/table/DataTable";
import { Menu, MenuDivider, MenuGroup, MenuItem } from "./Menu";

/**
 * A row's or a record's actions, kept out of sight until asked for.
 *
 * - **Use it** for the secondary actions of a table row, a record or a
 *   panel, and for switching between a few exclusive choices such as a
 *   workspace (`MenuGroup` with `checked` items).
 * - **Not** for the one primary action (a `Button`), for places to go
 *   (`Sidebar`, `TabNav`), for picking a value in a form (`Select`), or for
 *   searching across the app (`CommandBar`).
 *
 * Anatomy: the trigger (any control, given the wiring), then the plane with
 * `MenuItem`s, optional `MenuGroup`s with a mono caption, and `MenuDivider`s.
 * Variants: `tone="danger"` for a destructive item (last, after a divider),
 * `inferred` for an item a model proposed, `checked` for one choice of a group.
 * Content: an item is a verb and its object ("Export entry"), sentence case,
 * no full stop. Accessibility: `role="menu"` with roving focus — arrows,
 * Home/End, a letter jumps, Escape closes and returns focus to the trigger;
 * Tab leaves. On a touch screen each item is at least 40px tall.
 */
const meta = {
  title: "Navigation/Menu",
  component: Menu,
  tags: ["layer:block", "autodocs"],
  args: {
    open: false,
    label: "Actions for entry 04",
    align: "end",
    onOpenChange: fn(),
    trigger: () => null,
    children: null,
  },
  argTypes: {
    open: { control: "boolean" },
    label: { control: "text" },
    align: { control: "radio", options: ["start", "end"] },
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

/**
 * The trigger owns the state and the menu reports the change back, so
 * this is the story that ends open rather than the one named for it.
 */
export const Opening: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Actions for entry 04" }));
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    await waitFor(() => expect(canvas.getByRole("menu", { name: "Actions for entry 04" })).toBeVisible());
  },
};

/** A model proposed one of these, so it wears the ring. */
export const WithInferredItem: Story = {
  args: { open: true },
};

/** Keyboard entry chooses the correct end, and Escape returns to the trigger. */
export const KeyboardEntry: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Actions for entry 04" });
    trigger.focus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(canvas.getByRole("menuitem", { name: "Revoke source" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();
    await expect(canvas.queryByRole("menu")).toBeNull();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("menuitem", { name: "Open record" })).toHaveFocus();
  },
};

/** Choosing an item closes the menu and hands focus back to the trigger, by pointer or by key. */
export const ChoosingReturnsFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Actions for entry 04" });
    await userEvent.click(trigger);
    await userEvent.click(canvas.getByRole("menuitem", { name: "Copy manifest" }));
    await expect(canvas.queryByRole("menu")).toBeNull();
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("menuitem", { name: "Open record" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.queryByRole("menu")).toBeNull();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const DismissOutside: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Actions for entry 04" }));
    await expect(canvas.getByRole("menuitem", { name: "Open record" })).toHaveFocus();
    await userEvent.click(canvasElement);
    await expect(canvas.queryByRole("menu")).toBeNull();
  },
};

/** Tab leaves the menu and resumes normal page navigation. */
export const TabExit: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Menu
          {...args}
          open={open}
          onOpenChange={setOpen}
          trigger={(props) => <Button {...props}>Entry actions</Button>}
        >
          <MenuItem onSelect={() => setOpen(false)}>Open record</MenuItem>
        </Menu>
        <Button variant="secondary">Next action</Button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Entry actions" }));
    await userEvent.keyboard("{Tab}");
    await expect(canvas.getByRole("button", { name: "Next action" })).toHaveFocus();
    await expect(canvas.queryByRole("menu")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Entry actions" }));
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect(canvas.getByRole("button", { name: "Entry actions" })).toHaveFocus();
    await expect(canvas.queryByRole("menu")).toBeNull();
  },
};

/** Choice state belongs to the caller, while groups name each choice set. */
export const GroupedChoices: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState("operations");
    return (
      <div style={{ paddingBottom: 240 }}>
        <Menu
          {...args}
          open={open}
          onOpenChange={setOpen}
          label="Choose workspace"
          align="start"
          trigger={(props) => <Button {...props}>Workspace</Button>}
        >
          <MenuGroup label="Example studio">
            <MenuItem checked={view === "operations"} disabled={false} onSelect={() => setView("operations")}>
              Operations
            </MenuItem>
            <MenuItem checked={view === "archive"} disabled={true} onSelect={() => args.onOpenChange(true)}>
              Archive unavailable
            </MenuItem>
            <MenuItem checked={view === "research"} disabled={false} onSelect={() => setView("research")}>
              Research
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuItem onSelect={() => setOpen(false)}>Manage workspaces</MenuItem>
        </Menu>
      </div>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Workspace" }));
    const group = within(canvas.getByRole("group", { name: "Example studio" }));
    const first = group.getByRole("menuitemradio", { name: "Operations" });
    const second = group.getByRole("menuitemradio", { name: "Research" });
    await expect(first).toHaveFocus();
    await expect(first).toHaveAttribute("aria-checked", "true");
    const unavailable = group.getByRole("menuitemradio", { name: "Archive unavailable" });
    await expect(unavailable).toBeDisabled();
    await userEvent.click(unavailable);
    await expect(args.onOpenChange).not.toHaveBeenCalled();
    first.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(second).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(second).toHaveAttribute("aria-checked", "true");
    await expect(first).toHaveAttribute("aria-checked", "false");
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("menuitem", { name: "Manage workspaces" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect(first).toHaveFocus();
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};

function RowMenu() {
  const [open, setOpen] = useState(false);
  return (
    <DataTable caption="One row" indexed={false}>
      <TableBody>
        <TableRow>
          <TableCell>Splunk forwarder</TableCell>
          <TableCell align="end">
            <Menu
              open={open}
              onOpenChange={setOpen}
              label="Actions for Splunk forwarder"
              trigger={(props) => (
                <Button variant="ghost" iconOnly aria-label="Actions" {...props}>
                  <MoreVertical />
                </Button>
              )}
            >
              <MenuItem onSelect={() => setOpen(false)}>Replace</MenuItem>
              <MenuItem onSelect={() => setOpen(false)}>Rename</MenuItem>
              <MenuItem tone="danger" onSelect={() => setOpen(false)}>
                Revoke
              </MenuItem>
            </Menu>
          </TableCell>
        </TableRow>
      </TableBody>
    </DataTable>
  );
}

/** A row's menu escapes the table's frame, which clips everything else. */
export const InATable: StoryObj = {
  render: () => <RowMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Actions" }));
    const menu = await canvas.findByRole("menu", { name: "Actions for Splunk forwarder" });
    await expect(getComputedStyle(menu).position).toBe("fixed");
    const frame = canvasElement.querySelector(".di-table-wrap")!.getBoundingClientRect();
    await expect(menu.getBoundingClientRect().bottom).toBeGreaterThan(frame.bottom);
  },
};

/** German labels run longest: an item wraps between words inside the plane, which never runs off a phone. */
export const LongGermanLabels: Story = {
  args: { open: true, label: "Aktionen für Eintrag 04" },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 280 }}>
        <Menu
          {...args}
          open={open}
          onOpenChange={setOpen}
          trigger={(props) => (
            <Button {...props} variant="secondary" iconOnly={true} aria-label="Aktionen für Eintrag 04">
              <MoreVertical aria-hidden />
            </Button>
          )}
        >
          <MenuGroup label="Datenquelle">
            <MenuItem onSelect={() => setOpen(false)}>Zu den Einstellungen der Datenquelle wechseln</MenuItem>
            <MenuItem onSelect={() => setOpen(false)}>Manifest in die Zwischenablage kopieren</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuItem tone="danger" onSelect={() => setOpen(false)}>
            Datenquelle widerrufen und alle Sitzungen beenden
          </MenuItem>
        </Menu>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const menu = within(canvasElement).getByRole("menu");
    const box = menu.getBoundingClientRect();
    await expect(box.left).toBeGreaterThanOrEqual(0);
    await expect(box.right).toBeLessThanOrEqual(document.documentElement.clientWidth);
    for (const item of within(menu).getAllByRole("menuitem")) {
      await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth);
    }
  },
};
