import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown, UserMinus } from "lucide-react";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../Button";
import { Menu, MenuItem } from "../../navigation/Menu";
import { Select } from "../../forms/select/Select";
import { TextArea } from "../../forms/text/TextArea";
import { TextField } from "../../forms/text/TextField";
import { Stack } from "../../layout/arrangement/Stack";
import { Page } from "../../layout/page/Page";
import { Panel } from "../../layout/page/Panel";
import { Toolbar } from "./Toolbar";
import { ToolbarAction, ToolbarEnd, ToolbarNote, ToolbarSelection, ToolbarStatus } from "./ToolbarParts";
import { MembersFilter, MembersTable, words, type Words } from "./Toolbar.sample";

const meta = {
  title: "Actions/Toolbar",
  component: Toolbar,
  tags: ["layer:form", "autodocs"],
  args: { children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Above a list (`role="search"`, `sticky="top"` on a page): the search
 * grows, each filter names itself in its first option, the list's own
 * actions sit in `ToolbarEnd`. `/` focuses the search.
 */
export const AboveAList: Story = {
  render: () => (
    <Page>
      <MembersFilter />
      <MembersTable />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("search", { name: "Filter members" });
    await userEvent.click(canvasElement);
    await userEvent.keyboard("/");
    await waitFor(() => expect(canvas.getByLabelText("Search members")).toHaveFocus());
    const search = canvasElement.querySelector(".di-search")!.getBoundingClientRect();
    const select = canvas.getByLabelText("Role").getBoundingClientRect();
    await expect(Math.abs(search.height - select.height)).toBeLessThanOrEqual(1);
    await expect(bar.getBoundingClientRect().height).toBeGreaterThanOrEqual(search.height);
  },
};

/** In a tab panel, the note under the row says what the tab holds. */
export const WithNote: Story = {
  render: () => (
    <Page>
      <Toolbar label="Filter invitations" role="search">
        <MembersFilterFields />
        <ToolbarNote>People invited to this workspace who have not signed in yet.</ToolbarNote>
      </Toolbar>
      <MembersTable />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector(".di-toolbar")!;
    await expect(bar.lastElementChild).toHaveClass("di-toolbar-note");
  },
};

function MembersFilterFields() {
  return (
    <Select id="tb-invite-state" label="State" hideLabel mono={false} defaultValue="">
      <option value="">Every state</option>
      <option value="open">Open</option>
      <option value="expired">Expired</option>
    </Select>
  );
}

/** The selection's bar in the filter's place, at its height, over the list with the rows it counts. */
function MembersSelection({
  w = words.en,
  onClear,
  onSelectAll,
  initial = ["m2", "m3"],
}: {
  w?: Words;
  onClear?: () => void;
  onSelectAll?: () => void;
  initial?: string[];
}) {
  const [chosen, setChosen] = useState<string[]>(initial);
  const [menu, setMenu] = useState(false);
  const clear = () => {
    setChosen([]);
    onClear?.();
  };
  return (
    <>
      {chosen.length > 0 ? (
        <Toolbar label={w.bulk} frame="bar">
          <ToolbarStatus>{w.selected(chosen.length)}</ToolbarStatus>
          <ToolbarSelection
            clearLabel={w.clear}
            onClear={clear}
            selectAllLabel={w.selectAll}
            onSelectAll={onSelectAll}
          />
          <ToolbarEnd>
            <Menu
              open={menu}
              onOpenChange={setMenu}
              align="end"
              label={w.setRole}
              trigger={(props) => (
                <Button {...props} variant="secondary" size="sm">
                  {w.setRole}
                  <ChevronDown aria-hidden />
                </Button>
              )}
            >
              <MenuItem onSelect={() => setMenu(false)}>Administrator</MenuItem>
              <MenuItem onSelect={() => setMenu(false)}>Member</MenuItem>
            </Menu>
            <ToolbarAction variant="danger" size="sm" icon={<UserMinus aria-hidden />} label={w.remove} />
          </ToolbarEnd>
        </Toolbar>
      ) : (
        <MembersFilter w={w} />
      )}
      <MembersTable w={w} chosen={chosen} onChoose={setChosen} />
    </>
  );
}

/**
 * Rows selected: the bar (`frame="bar"`) takes the filter's place at its
 * height, so the list does not move. The count is announced; Clear, or
 * Escape, ends the selection and the filter comes back.
 */
export const Selection: Story = {
  args: { children: null },
  render: () => (
    <Page>
      <MembersSelection onClear={fn()} onSelectAll={fn()} />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("group", { name: "Actions on the selected members" });
    await expect(within(bar).getByText("2 selected")).toHaveAttribute("aria-live", "polite");
    await userEvent.click(canvas.getByRole("checkbox", { name: "Select Nora Feld" }));
    await expect(within(bar).getByText("3 selected")).toBeVisible();
    const cell = canvasElement.querySelector("tbody td")!;
    const textEdge = cell.getBoundingClientRect().left + parseFloat(getComputedStyle(cell).paddingLeft);
    const status = within(bar).getByText("3 selected").getBoundingClientRect().left;
    await expect(Math.abs(status - textEdge)).toBeLessThanOrEqual(1);
    (document.activeElement as HTMLElement | null)?.blur();
  },
};

/** Escape (or Clear) ends the selection; the filter row comes back at the same height. */
export const SelectionCleared: Story = {
  render: () => (
    <Page>
      <MembersSelection />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const before = canvasElement.querySelector(".di-toolbar")!.getBoundingClientRect().height;
    await userEvent.keyboard("{Escape}");
    const filter = await canvas.findByRole("search", { name: "Filter members" });
    if (window.innerWidth > 600) {
      await expect(Math.abs(filter.getBoundingClientRect().height - before)).toBeLessThanOrEqual(1);
    }
  },
};

/**
 * Unsaved changes (`role="region" frame="bar" sticky="bottom"`): it stays at
 * the foot of the view while the form scrolls and is rendered only while
 * something is unsaved. A short form ends in `align="end"` instead.
 */
export const UnsavedChanges: Story = {
  render: () => (
    <Stack gap={24}>
      <Panel title="Alert template" heading={2}>
        <Stack variant="form">
          <TextField id="tb-subject" label="Subject" defaultValue="{{severity}} on {{host}}: {{rule}}" mono={true} />
          <TextArea
            id="tb-body"
            label="Body"
            rows={14}
            mono={true}
            defaultValue={
              "Case {{case.id}} was opened at {{case.opened}}.\n\nRule: {{rule}}\nHost: {{host}}\nOperator: {{operator}}\n\nOpen the case: {{case.url}}"
            }
          />
        </Stack>
      </Panel>
      <Toolbar label="Unsaved changes" role="region" frame="bar" sticky="bottom">
        <ToolbarStatus>2 unsaved changes in the alert template</ToolbarStatus>
        <ToolbarEnd>
          <Button variant="secondary">Discard</Button>
          <Button>Save changes</Button>
        </ToolbarEnd>
      </Toolbar>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole("region", { name: "Unsaved changes" });
    await expect(region).toHaveTextContent("2 unsaved changes in the alert template");
    const box = region.getBoundingClientRect();
    const save = within(region).getByRole("button", { name: "Save changes" }).getBoundingClientRect();
    const status = region.querySelector(".di-toolbar-status")!.getBoundingClientRect();
    await expect(Math.abs(Math.min(status.top, save.top) - box.top - (box.bottom - save.bottom))).toBeLessThanOrEqual(
      1,
    );
    await expect(Math.abs(status.left - box.left - (box.right - save.right))).toBeLessThanOrEqual(1);
  },
};

/** The buttons that close a form, at its end (`align="end"`); on a phone they stack at full width. */
export const FormEnd: Story = {
  render: () => (
    <Panel title="Invite people" heading={2}>
      <form onSubmit={(event) => event.preventDefault()}>
        <Stack variant="form">
          <TextField id="tb-invite" label="Email addresses" placeholder="name@northwind.example" />
          <Toolbar align="end">
            <Button variant="secondary">Cancel</Button>
            <Button type="submit">Send invitations</Button>
          </Toolbar>
        </Stack>
      </form>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const send = within(canvasElement).getByRole("button", { name: "Send invitations" }).getBoundingClientRect();
    const field = within(canvasElement).getByLabelText("Email addresses").getBoundingClientRect();
    await expect(Math.abs(send.right - field.right)).toBeLessThanOrEqual(1);
  },
};

/** A row's quick actions (`variant="row"`): shown on hover or focus, the row's menu always. */
export const RowActions: Story = {
  render: () => <MembersTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: "Actions for Nora Feld" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "More actions for Nora Feld" })).toBeVisible();
  },
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
        <TextField
          id="toolbar-note"
          label="Note"
          defaultValue="Covers the night shift until Friday, when the rota changes back to the usual handover"
          hint="Use 1 to 80 characters."
          hintTone="error"
        />
        <Button type="submit">Grant</Button>
      </Toolbar>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Grant" });
    const input = canvas.getByLabelText("Person");
    const offset = Math.abs(button.getBoundingClientRect().bottom - input.getBoundingClientRect().bottom);
    await expect(offset).toBeLessThanOrEqual(2);
  },
};

/**
 * A one-line add form (`fillFirst`): the first field takes the free width,
 * the select fits its options, the button sits on the control row. When the
 * toolbar itself is narrower than 600px, in a dialog or on a phone, it stacks.
 */
export const AddForm: Story = {
  name: "Add form",
  render: () => (
    <Panel title="Domains" heading={2}>
      <form onSubmit={(event) => event.preventDefault()}>
        <Toolbar fillFirst>
          <TextField
            id="tb-domain"
            label="Domain"
            mono
            placeholder="northwind.example"
            hint="Verified by a DNS record."
          />
          <Select id="tb-mode" label="Sign-in" mono={false} defaultValue="required">
            <option value="required">Required</option>
            <option value="optional">Optional</option>
          </Select>
          <Button type="submit">Add domain</Button>
        </Toolbar>
      </form>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Domain").getBoundingClientRect();
    const select = canvas.getByLabelText("Sign-in").getBoundingClientRect();
    const button = canvas.getByRole("button", { name: "Add domain" }).getBoundingClientRect();
    if (canvasElement.querySelector(".di-toolbar")!.getBoundingClientRect().width >= 600) {
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
    <Toolbar label="Filter sources" role="search">
      <ToolbarEnd>
        <Button variant="secondary">Export</Button>
      </ToolbarEnd>
      <Select id="tb-first-state" label="State" hideLabel mono={false} defaultValue="">
        <option value="">Every state</option>
        <option value="running">Running</option>
      </Select>
    </Toolbar>
  ),
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector(".di-toolbar")!;
    await expect(bar.lastElementChild).toHaveClass("di-toolbar-end");
    const end = bar.lastElementChild!.getBoundingClientRect();
    await expect(Math.abs(end.right - bar.getBoundingClientRect().right)).toBeLessThanOrEqual(1);
  },
};

/**
 * A one-line form that closes a panel. Without a hint the toolbar ends on its
 * controls, so the panel's inset under them equals the inset above its title.
 */
export const EndOfAPanel: Story = {
  render: () => (
    <Panel title="Retention">
      <form onSubmit={(event) => event.preventDefault()}>
        <Toolbar>
          <Select id="tb-keep" label="Keep events for" mono={false} defaultValue="90">
            <option value="30">30 days</option>
            <option value="90">90 days</option>
          </Select>
          <Button type="submit">Apply</Button>
        </Toolbar>
      </form>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector(".di-panel")!.getBoundingClientRect();
    const title = canvasElement.querySelector(".di-panel-title")!.getBoundingClientRect();
    const button = within(canvasElement).getByRole("button", { name: "Apply" }).getBoundingClientRect();
    const toolbar = canvasElement.querySelector(".di-toolbar")!.getBoundingClientRect();
    await expect(Math.abs(toolbar.bottom - button.bottom)).toBeLessThanOrEqual(1);
    await expect(Math.abs(panel.bottom - toolbar.bottom - (title.top - panel.top))).toBeLessThanOrEqual(4);
  },
};

/** Long German labels: the filters keep their own width, the bar's actions take a line of their own on a phone. */
export const German: Story = {
  render: () => (
    <Page>
      <MembersFilter w={words.de} />
      <MembersSelection w={words.de} onSelectAll={() => undefined} />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    for (const bar of canvasElement.querySelectorAll(".di-toolbar:not(.is-row)")) {
      await expect(bar.scrollWidth).toBeLessThanOrEqual(bar.clientWidth + 1);
    }
    await expect(within(canvasElement).getByRole("group", { name: /ausgewählten Mitglieder/ })).toBeVisible();
  },
};
