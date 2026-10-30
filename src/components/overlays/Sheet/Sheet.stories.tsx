import type { Meta, StoryObj } from "@storybook/react-vite";
import { StrictMode, useEffect, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { TextField } from "../../forms/text/TextField";
import { Fact, FactList } from "../../data/records/FactList";
import { Sheet, SheetFooter } from "./Sheet";

const meta = {
  title: "Overlays/Sheet",
  component: Sheet,
  tags: ["layer:block", "autodocs"],
  args: {
    open: false,
    title: "Jonas Brandt",
    lede: "jonas.brandt@data-insights.ai",
    closeLabel: "Close",
    size: "md",
    onClose: () => {},
    children: null,
  },
  argTypes: {
    size: { control: "radio", options: ["md", "lg", "xl"] },
    children: { control: false },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

function Opener(args: {
  title: string;
  lede?: string;
  index?: string;
  eyebrow?: string;
  closeLabel: string;
  size?: "md" | "lg" | "xl";
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open member
      </Button>
      <Sheet {...args} open={open} onClose={() => setOpen(false)}>
        <FactList layout="columns">
          <Fact label="Role">Administrator</Fact>
          <Fact label="Joined">3 Mar 2026</Fact>
          <Fact label="Last sign-in">Today, 08:47</Fact>
        </FactList>
        <SheetFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Change role
          </Button>
        </SheetFooter>
      </Sheet>
    </>
  );
}

/** Opens from the right edge; focus goes to its title; Escape or the close button returns focus to the opener. */
export const Record: Story = {
  render: (args) => <Opener {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole("button", { name: "Open member" });
    await userEvent.click(opener);
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog");
    await expect(getComputedStyle(canvasElement.ownerDocument.body).overflow).toBe("hidden");
    await waitFor(() => expect(dialog).toBeVisible());
    // With no field to start in, focus goes to the title, not to the close button.
    await waitFor(() => expect(within(dialog).getByRole("heading", { name: "Jonas Brandt" })).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(opener).toHaveFocus());
  },
};

/** Opened from a row: the kind of record and its workspace above the title tie the detail to the row. */
export const FromARow: Story = {
  args: { eyebrow: "Member · WS-01" },
  render: (args) => <Opener {...args} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Open member" }));
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog", { name: "Jonas Brandt" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(within(dialog).queryByText("03")).toBeNull();
    const head = dialog.querySelector(".di-sheet-head")!;
    const footer = dialog.querySelector(".di-sheet-footer")!;
    await expect(getComputedStyle(head).borderBottomWidth).toBe("0px");
    await expect(getComputedStyle(footer).borderTopWidth).toBe("0px");
    await expect(within(dialog).getByText("Member · WS-01")).toBeVisible();
  },
};

// Content that takes focus as it mounts, before the sheet's own effects run.
function FocusOnMount() {
  useEffect(() => document.getElementById("watchlist-name")?.focus(), []);
  return <TextField id="watchlist-name" label="Name" defaultValue="Finance laptops" />;
}

function MountedWhileOpen(args: { title: string; lede?: string; closeLabel: string; shortcut?: string }) {
  const { shortcut, ...sheet } = args;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" shortcut={shortcut} onClick={() => setOpen(true)}>
        Edit watchlist
      </Button>
      {open ? (
        <Sheet {...sheet} open onClose={() => setOpen(false)}>
          <FocusOnMount />
          <SheetFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </SheetFooter>
        </Sheet>
      ) : null}
    </>
  );
}

/** A sheet opened by its page key returns focus to the control the key pressed. */
export const OpenedByShortcut: Story = {
  render: (args) => (
    <StrictMode>
      <MountedWhileOpen {...args} shortcut="n" />
    </StrictMode>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole("button", { name: "Edit watchlist" });
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
    await userEvent.keyboard("n");
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).getByRole("dialog")).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(opener).toHaveFocus());
  },
};

/** A sheet the product removes on close still returns focus to its opener. */
export const RemovedOnClose: Story = {
  render: (args) => (
    <StrictMode>
      <MountedWhileOpen {...args} />
    </StrictMode>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const opener = canvas.getByRole("button", { name: "Edit watchlist" });
    await userEvent.click(opener);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(opener).toHaveFocus());
    await userEvent.click(opener);
    await userEvent.click(await body.findByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(opener).toHaveFocus());
    await userEvent.click(opener);
    await userEvent.click(await body.findByRole("button", { name: "Close" }));
    await waitFor(() => expect(opener).toHaveFocus());
  },
};
