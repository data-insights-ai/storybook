import type { Meta, StoryObj } from "@storybook/react-vite";
import { StrictMode, useEffect, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Fact, FactList } from "../../records/FactList";
import { CellStack, DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../tables/DataTable";
import { ChoiceGroup } from "../../forms/choice/ChoiceGroup";
import { Radio } from "../../forms/choice/Radio";
import { TextField } from "../../forms/text/TextField";
import { Page } from "../../layout/page/Page";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { TextLink } from "../../text/TextLink";
import { Dialog, DialogFooter } from "./Dialog";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  subcomponents: { DialogFooter },
  tags: ["layer:block", "autodocs"],
  parameters: {
    // `showModal()` makes the rest of the document inert; inline on the Docs page that would be the prose.
    docs: { story: { inline: false, height: "520px" } },
  },
  args: {
    open: false,
    title: "Jonas Brandt",
    lede: "jonas.brandt@data-insights.ai",
    eyebrow: "Member · WS-01",
    closeLabel: "Close",
    placement: "side",
    size: "md",
    onClose: () => {},
    children: null,
  },
  argTypes: {
    placement: { control: "radio", options: ["side", "center", "bottom"] },
    size: { control: "radio", options: ["sm", "md", "lg", "xl"] },
    eyebrowTone: { control: "radio", options: ["quiet", "danger"] },
    children: { control: false },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;
type Args = Parameters<typeof Dialog>[0];

function Member(args: Args) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open member
      </Button>
      <Dialog {...args} open={open} onClose={() => setOpen(false)}>
        <FactList layout="columns">
          <Fact label="Role">Administrator</Fact>
          <Fact label="Joined">3 Mar 2026</Fact>
          <Fact label="Last sign-in">Today, 08:47</Fact>
          <Fact label="Workspaces">WS-01, WS-04</Fact>
        </FactList>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Change role
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

/**
 * A record opened from its row, from the right edge. The eyebrow names the
 * kind of record and its workspace, so the dialog stays tied to the row.
 * With no field to start in, focus lands on the title, never on the close
 * button; Escape returns it to the opener.
 */
export const FromARow: Story = {
  render: (args) => <Member {...args} />,
  play: async ({ canvasElement }) => {
    const opener = within(canvasElement).getByRole("button", { name: "Open member" });
    await userEvent.click(opener);
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog", { name: "Jonas Brandt" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(getComputedStyle(canvasElement.ownerDocument.body).overflow).toBe("hidden");
    await waitFor(() => expect(within(dialog).getByRole("heading", { name: "Jonas Brandt" })).toHaveFocus());
    // One inset all round: as far from the top to the eyebrow as from the footer to the bottom.
    const box = dialog.getBoundingClientRect();
    const head = dialog.querySelector(".di-dialog-head")!.getBoundingClientRect();
    const actions = within(dialog).getByRole("button", { name: "Change role" }).getBoundingClientRect();
    await expect(Math.round(box.bottom - actions.bottom)).toBe(
      Math.round(parseFloat(getComputedStyle(dialog.querySelector(".di-dialog-head")!).paddingTop)),
    );
    await expect(head.top).toBe(box.top);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(opener).toHaveFocus());
    await userEvent.click(opener);
  },
};

function EditForm(args: Args) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit source</Button>
      <Dialog
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
      >
        <TextField id="source-name" label="Name" defaultValue="North hub" />
        <TextField
          id="source-host"
          label="Host"
          mono
          defaultValue="10.20.4.11"
          hint="An address or a name the collector resolves."
        />
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

/** A form beside the list: focus starts in the first field, Enter saves, Escape cancels. */
export const EditAForm: Story = {
  args: { title: "Edit source", lede: undefined, eyebrow: "Source · WS-01" },
  render: (args) => <EditForm {...args} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Edit source" }));
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog", { name: "Edit source" });
    await waitFor(() => expect(within(dialog).getByLabelText("Name")).toHaveFocus());
  },
};

function Decision(args: Args) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Export register</Button>
      <Dialog {...args} open={open} onClose={() => setOpen(false)}>
        <p>The export carries every seal, so a recipient can verify it offline.</p>
        <FactList>
          <Fact label="Scope">WS-01 · 24,918 entries</Fact>
          <Fact label="Format">JSON Lines, gzip</Fact>
          <Fact label="Size">≈ 84 MB</Fact>
        </FactList>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Export</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

/**
 * A decision in the middle of the screen. Its eyebrow is quiet: an export
 * is not a warning. Only a dialog that asks before something irreversible
 * sets `eyebrowTone="danger"`, and that one is a `ConfirmDialog`.
 */
export const ADecision: Story = {
  args: {
    placement: "center",
    title: "Export the register?",
    lede: undefined,
    eyebrow: "Register · WS-01",
    closeLabel: undefined,
  },
  render: (args) => <Decision {...args} />,
  play: async ({ canvasElement }) => {
    const opener = within(canvasElement).getByRole("button", { name: "Export register" });
    await userEvent.click(opener);
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog", {
      name: "Export the register?",
    });
    await waitFor(() => expect(dialog).toBeVisible());
    // The checks after play measure colour; wait until the fade has ended.
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe("1"));
    await waitFor(() => expect(within(dialog).getByRole("heading", { name: "Export the register?" })).toHaveFocus());
    await expect(within(dialog).getByText("Register · WS-01").closest(".di-eyebrow")).not.toHaveClass("is-danger");
    await expect(dialog.querySelector(".di-modal-icon, .di-dialog-icon")).toBeNull();
    // The space above the eyebrow equals the space below the actions.
    const box = dialog.getBoundingClientRect();
    const eyebrow = dialog.querySelector(".di-eyebrow")!.getBoundingClientRect();
    const actions = Math.max(
      ...Array.from(dialog.querySelectorAll(".di-dialog-footer button")).map((b) => b.getBoundingClientRect().bottom),
    );
    await expect(Math.abs(eyebrow.top - box.top - (box.bottom - actions))).toBeLessThanOrEqual(1);
  },
};

const periods = [
  { id: "p-24h", label: "Last 24 hours" },
  { id: "p-7d", label: "Last 7 days" },
  { id: "p-30d", label: "Last 30 days" },
  { id: "p-q", label: "This quarter" },
];

function Picker(args: Args) {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState("p-7d");
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {periods.find((p) => p.id === period)?.label}
      </Button>
      <Dialog {...args} open={open} onClose={() => setOpen(false)}>
        <ChoiceGroup legend="Period">
          {periods.map((p) => (
            <Radio
              key={p.id}
              id={p.id}
              name="period"
              label={p.label}
              checked={period === p.id}
              onChange={() => setPeriod(p.id)}
            />
          ))}
        </ChoiceGroup>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Apply</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

/** A picker on a phone rises from the bottom edge, within reach of the thumb; a press on the scrim closes it. */
export const APhonePicker: Story = {
  args: { placement: "bottom", title: "Show entries from", lede: undefined, eyebrow: undefined },
  globals: { viewport: { value: "phone", isRotated: false } },
  render: (args) => <Picker {...args} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Last 7 days" }));
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog", { name: "Show entries from" });
    await waitFor(() => expect(dialog).toBeVisible());
    await waitFor(() =>
      expect(Math.round(dialog.getBoundingClientRect().bottom)).toBe(
        canvasElement.ownerDocument.documentElement.clientHeight,
      ),
    );
    await expectPickerWidth(dialog);
  },
};

/** On a phone the picker spans the screen; above 600px it keeps a form's width, centred on the bottom edge. */
async function expectPickerWidth(dialog: HTMLElement) {
  const page = dialog.ownerDocument.documentElement.clientWidth;
  const probe = dialog.ownerDocument.createElement("div");
  probe.style.width = "var(--di-measure-form)";
  dialog.ownerDocument.body.append(probe);
  const form = probe.getBoundingClientRect().width;
  probe.remove();
  const box = dialog.getBoundingClientRect();
  await expect(Math.round(box.width)).toBe(Math.round(page > 600 ? Math.min(page, form) : page));
  await expect(Math.abs(box.left - (page - box.right))).toBeLessThanOrEqual(1);
}

/** The same picker on a wide screen: a form's width, centred, still rising from the bottom edge. */
export const APickerOnAWideScreen: Story = {
  args: { placement: "bottom", title: "Show entries from", lede: undefined, eyebrow: undefined },
  globals: { viewport: { value: "desk", isRotated: false } },
  render: (args) => <Picker {...args} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Last 7 days" }));
    const dialog = await within(canvasElement.ownerDocument.body).findByRole("dialog", { name: "Show entries from" });
    await waitFor(() => expect(dialog).toBeVisible());
    await waitFor(() => expect(dialog.getAnimations().length).toBe(0));
    await expectPickerWidth(dialog);
  },
};

const sources = [
  { name: "North hub", host: "10.20.4.11" },
  { name: "Branch office", host: "10.40.1.3" },
];

function DockedPage(args: Args) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Page width="list">
      <PageHeader>
        <PageHeaderTitle>Sources</PageHeaderTitle>
      </PageHeader>
      <DataTable caption="Sources">
        <TableHead>
          <TableColumn>Source</TableColumn>
        </TableHead>
        <TableBody>
          {sources.map((s) => (
            <TableRow key={s.name}>
              <TableCell>
                <CellStack secondary={s.host}>
                  <TextLink
                    href="#source"
                    onClick={(event) => {
                      event.preventDefault();
                      setOpen(s.name);
                    }}
                  >
                    {s.name}
                  </TextLink>
                </CellStack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
      <Dialog {...args} open={open !== null} title={open ?? ""} onClose={() => setOpen(null)}>
        <FactList layout="columns">
          <Fact label="Host">{sources.find((s) => s.name === open)?.host}</Fact>
          <Fact label="State">Collecting</Fact>
        </FactList>
      </Dialog>
    </Page>
  );
}

/**
 * In a `list` or `detail` page wide enough for its side column, an `md`
 * side dialog docks there: no scrim, the list stays usable beside it.
 * Focus still lands on its title and returns to the row's link.
 */
export const DockedInAPage: Story = {
  args: { eyebrow: "Source · WS-01", lede: undefined },
  parameters: { layout: "fullscreen" },
  render: (args) => <DockedPage {...args} />,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "North hub" });
    await userEvent.click(link);
    const heading = await within(canvasElement.ownerDocument.body).findByRole("heading", { name: "North hub" });
    await waitFor(() => expect(heading).toHaveFocus());
  },
};

// Content that takes focus as it mounts, before the dialog's own effects run.
function FocusOnMount() {
  useEffect(() => document.getElementById("watchlist-name")?.focus(), []);
  return <TextField id="watchlist-name" label="Name" defaultValue="Finance laptops" />;
}

function MountedWhileOpen(args: Args & { shortcut?: string }) {
  const { shortcut, ...dialog } = args;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" shortcut={shortcut} onClick={() => setOpen(true)}>
        Edit watchlist
      </Button>
      {open ? (
        <Dialog {...dialog} open onClose={() => setOpen(false)}>
          <FocusOnMount />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </DialogFooter>
        </Dialog>
      ) : null}
    </>
  );
}

/** A dialog opened by its page key returns focus to the control the key pressed. */
export const OpenedByShortcut: Story = {
  args: { title: "Edit watchlist", lede: undefined, eyebrow: undefined },
  render: (args) => (
    <StrictMode>
      <MountedWhileOpen {...args} shortcut="n" />
    </StrictMode>
  ),
  play: async ({ canvasElement }) => {
    const opener = within(canvasElement).getByRole("button", { name: "Edit watchlist" });
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
    await userEvent.keyboard("n");
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).getByRole("dialog")).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(opener).toHaveFocus());
  },
};

/** A dialog the product removes on close still returns focus to its opener, by Escape, Cancel or the close button. */
export const RemovedOnClose: Story = {
  args: { title: "Edit watchlist", lede: undefined, eyebrow: undefined },
  render: (args) => (
    <StrictMode>
      <MountedWhileOpen {...args} />
    </StrictMode>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const opener = within(canvasElement).getByRole("button", { name: "Edit watchlist" });
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

/**
 * The transition, both ways: a side dialog slides from the edge, a centred
 * one fades and settles down one step, the scrim fades with them, and
 * `allow-discrete` lets the native element animate out as well as in.
 */
export const Transition: Story = {
  args: {
    placement: "center",
    title: "Export the register?",
    lede: undefined,
    eyebrow: "Register · WS-01",
    closeLabel: undefined,
  },
  parameters: { controls: { disable: true } },
  render: (args) => <Decision {...args} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Export register" }));
    await waitFor(() =>
      expect(
        within(canvasElement.ownerDocument.body).getByRole("dialog", { name: "Export the register?" }),
      ).toBeVisible(),
    );
  },
};
