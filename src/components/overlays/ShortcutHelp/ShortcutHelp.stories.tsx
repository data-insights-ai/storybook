import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Toolbar, ToolbarEnd } from "../../actions/Toolbar";
import { Page } from "../../layout/page/Page";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { Panel } from "../../layout/page/Panel";
import { SearchField } from "../../forms/text/SearchField";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../tables/DataTable";
import { TextLink } from "../../text/TextLink";
import { ShortcutHelp } from "./ShortcutHelp";

const meta = {
  title: "Overlays/ShortcutHelp",
  tags: ["layer:pattern", "autodocs"],
  component: ShortcutHelp,
  args: {
    title: "Keyboard shortcuts",
    closeLabel: "Close",
    labels: {
      search: "Search",
      create: "Create",
      edit: "Edit",
      help: "Show the shortcuts",
      close: "Close a dialog",
      rows: "Move between rows",
      open: "Open the row",
    },
    appKeys: [
      { keys: ["⌘K", "Ctrl+K"], what: "Search everything" },
      { keys: ["⌘B", "Ctrl+B"], what: "Toggle navigation" },
    ],
  },
} satisfies Meta<typeof ShortcutHelp>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `/` focuses the search, `n` presses the marked button, `?` lists both. */
export const OnAPage: Story = {
  render: (args) => (
    <Page width="full">
      <PageHeader>
        <PageHeaderTitle>Sources</PageHeaderTitle>
      </PageHeader>
      <Toolbar role="search">
        <SearchField id="sc-search" label="Search sources" placeholder="Search sources" />
        <ToolbarEnd>
          <Button shortcut="n">New source</Button>
        </ToolbarEnd>
      </Toolbar>
      <Panel padded={false}>
        <DataTable caption="Sources">
          <TableHead>
            <TableColumn>Source</TableColumn>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextLink href="#nvd">NVD</TextLink>
              </TableCell>
            </TableRow>
          </TableBody>
        </DataTable>
      </Panel>
      <ShortcutHelp {...args} />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.keyboard("/");
    await expect(canvas.getByLabelText("Search sources")).toHaveFocus();
    (document.activeElement as HTMLElement).blur();
    await userEvent.keyboard("?");
    const dialog = await within(document.body).findByRole("dialog");
    await expect(within(dialog).getByText("New source")).toBeInTheDocument();
    await expect(within(dialog).getByText("Search everything")).toBeInTheDocument();
    await expect(within(dialog).getByText("Search sources")).toBeInTheDocument();
    await expect(within(dialog).queryByText("Search")).toBeNull();
    await expect(within(dialog).getByText("Move between rows")).toBeInTheDocument();
    await expect(within(dialog).getByText("Open the row")).toBeInTheDocument();
    const edges = new Set(
      Array.from(dialog.querySelectorAll("dd")).map((dd) => Math.round(dd.getBoundingClientRect().left)),
    );
    await expect(edges.size).toBe(1);
    await userEvent.keyboard("{Escape}");
  },
};
