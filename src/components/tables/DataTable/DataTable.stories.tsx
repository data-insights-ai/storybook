import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Globe, Plus, Server } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Toolbar } from "../../actions/Toolbar";
import { Tag } from "../../status/Tag";
import {
  CellIcon,
  CellLead,
  CellStack,
  DataTable,
  TableBody,
  TableCell,
  TableFooter,
  TableColumn,
  TableEmpty,
  TableGroupRow,
  TableHead,
  TableIndex,
  TableRow,
} from "./DataTable";
import { Panel, PanelActions, PanelFooter, PanelLead } from "../../layout/page/Panel";
import { LevelMeter } from "../../status/LevelMeter";
import { Pagination } from "../../navigation/Pagination";
import { Checkbox } from "../../forms/choice/Checkbox";
import { SearchField } from "../../forms/text/SearchField";
import { Select } from "../../forms/select/Select";
import { SealValue } from "../../status/SealValue";
import { StatusPill } from "../../status/StatusPill";
import { TextLink } from "../../text/TextLink";
import { sources, SourceRows, SortableSources, SelectableSources, people, events, devices } from "./DataTable.sample";

const meta = {
  title: "Tables/DataTable",
  component: DataTable,
  tags: ["layer:block", "autodocs"],
  args: {
    caption: "Sources on record",
    indexed: true,
    children: null,
  },
  argTypes: {
    caption: { control: "text" },
    indexed: { control: "boolean" },
    narrow: { control: "inline-radio", options: ["scroll", "stack"] },
    children: { control: false },
  },
} satisfies Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The register extract: ordinals down the left, mono values across. A failed
 * row reads like any other: its State column says "failed", nothing else on
 * the row is tinted.
 *
 * Written out in full rather than through the helper the variants use, so
 * Show code carries the composition itself. There is no `rows` prop, so
 * this mapping is the API.
 */
export const Default: Story = {
  render: (args) => (
    <DataTable {...args}>
      <TableHead>
        <TableColumn index={true}>Ordinal</TableColumn>
        <TableColumn sort="ascending">Host</TableColumn>
        <TableColumn>Kind</TableColumn>
        <TableColumn>Manifest</TableColumn>
        <TableColumn align="end">Last seen</TableColumn>
        <TableColumn align="end">State</TableColumn>
      </TableHead>
      <TableBody>
        {sources.map((row) => (
          <TableRow key={row.ordinal}>
            <TableIndex>{row.ordinal}</TableIndex>
            <TableCell>
              <CellLead>
                <CellIcon>{row.kind === "Registry" ? <Server aria-hidden /> : <Globe aria-hidden />}</CellIcon>
                <CellStack primary={row.host} secondary={`WS-01 · ${row.kind.toLowerCase()}`} />
              </CellLead>
            </TableCell>
            <TableCell>{row.kind}</TableCell>
            <TableCell>
              <SealValue
                state={row.state === "danger" ? "absent" : "sealed"}
                stateLabel={row.state === "danger" ? "Not recorded" : "Sealed"}
              >
                {row.hash}
              </SealValue>
            </TableCell>
            <TableCell align="end" mono={true}>
              {row.seen}
            </TableCell>
            <TableCell align="end">
              <StatusPill tone={row.state}>{row.stateLabel}</StatusPill>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("table", { name: "Sources on record" })).toBeVisible();
    await expect(canvas.getAllByRole("row")).toHaveLength(6);
    const look = (cell: Element) => `${getComputedStyle(cell).backgroundColor} ${getComputedStyle(cell).color}`;
    const ordinals = [...canvasElement.querySelectorAll("tbody .di-table-index")].map(look);
    await expect(new Set(ordinals).size).toBe(1);
  },
};

/** A filter row above the grid, inside the same frame. */
export const WithToolbar: Story = {
  render: (args) => (
    <DataTable {...args}>
      <Toolbar label="Filter sources" role="search">
        <SearchField id="table-search" label="Search sources" placeholder="host or hash" />
        <Tag mono pressed onRemove={() => undefined} removeLabel="Remove the state filter">
          state: running
        </Tag>
        <Tag mono onClick={() => undefined}>
          <Plus aria-hidden />
          kind
        </Tag>
      </Toolbar>
      <SourceRows />
    </DataTable>
  ),
};

/** The count and the pages under the grid. */
export const WithFooter: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(1);
    return (
      <DataTable {...args}>
        <SourceRows />
        <TableFooter>
          <span>1–5 of 24 sources</span>
          <Pagination
            page={page}
            pages={5}
            onPageChange={setPage}
            label="Source pages"
            previousLabel="Previous page"
            nextLabel="Next page"
            pageLabel="Page"
          />
        </TableFooter>
      </DataTable>
    );
  },
};

/** The row an open drawer is showing. */
export const ActiveRow: Story = {
  render: (args) => (
    <DataTable {...args}>
      <SourceRows active="03" />
    </DataTable>
  ),
};

/**
 * On a padded surface, beside a lead and a footer: the table keeps to the
 * panel's content edge like everything else in it. Its head band and rules
 * start where the lead's text does and end where the button does; its text
 * sits inside them at the cell inset. Use `Panel padded={false}` when the
 * table is the panel's whole content and runs to its edges instead.
 */
export const OnAPanel: Story = {
  name: "On a panel",
  args: { indexed: false, caption: "Retention per class" },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <Panel title="Retention" heading={2}>
        <PanelLead>How long each class of entry is kept.</PanelLead>
        <DataTable {...args}>
          <TableHead>
            <TableColumn>Class</TableColumn>
            <TableColumn align="end">Kept</TableColumn>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Signals</TableCell>
              <TableCell align="end" mono={true}>
                30 days
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cases</TableCell>
              <TableCell align="end" mono={true}>
                2 years
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Audit log</TableCell>
              <TableCell align="end" mono={true}>
                7 years
              </TableCell>
            </TableRow>
          </TableBody>
        </DataTable>
        <PanelFooter>Changed 12 Oct by Nora Feld</PanelFooter>
        <PanelActions>
          <Button variant="secondary" size="sm">
            Change retention
          </Button>
        </PanelActions>
      </Panel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const box = (selector: string) => canvasElement.querySelector(selector)!.getBoundingClientRect();
    const start = box(".di-panel-lead").left;
    await expect(Math.abs(box(".di-table-wrap").left - start)).toBeLessThan(1);
    await expect(Math.abs(box("thead tr").left - start)).toBeLessThan(1);
    await expect(Math.abs(box(".di-table-wrap").right - box(".di-panel-foot .di-btn").right)).toBeLessThan(1);
  },
};

/** Without the ordinal column, for a table that is not a register extract. */
export const Unindexed: Story = {
  args: { indexed: false },
  render: (args) => (
    <DataTable {...args}>
      <TableHead>
        <TableColumn>Setting</TableColumn>
        <TableColumn align="end">Value</TableColumn>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Retention</TableCell>
          <TableCell align="end" mono={true}>
            30 days
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Seal on ingest</TableCell>
          <TableCell align="end" mono={true}>
            on
          </TableCell>
        </TableRow>
      </TableBody>
    </DataTable>
  ),
};

/**
 * `onSort` turns a header into the control that orders the rows. A sortable
 * column that is not the sorted one carries a quiet ↕, so it reads as a
 * control before it is pressed.
 */
export const Sortable: Story = {
  render: (args) => <SortableSources caption={args.caption} indexed={args.indexed ?? true} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const host = canvas.getByRole("button", { name: "Host" });
    const seen = canvas.getByRole("columnheader", { name: "Last seen" });
    await expect(seen).toHaveAttribute("aria-sort", "descending");
    await expect(host.closest("th")).not.toHaveAttribute("aria-sort");

    await userEvent.click(host);
    await expect(host.closest("th")).toHaveAttribute("aria-sort", "descending");
    await expect(seen).not.toHaveAttribute("aria-sort");

    await userEvent.click(host);
    await expect(host.closest("th")).toHaveAttribute("aria-sort", "ascending");
    await expect(canvas.getAllByRole("row")[1]).toHaveTextContent("archive.example.com");
  },
};

/**
 * `width="fill"` on one column hands it the width the others leave. Without
 * it a wide table spreads the spare room over every column; a bar or a
 * meter is the column that can use it.
 */
export const FillColumn: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  args: { caption: "Load per source" },
  render: (args) => (
    <DataTable {...args}>
      <TableHead>
        <TableColumn index>No.</TableColumn>
        <TableColumn>Host</TableColumn>
        <TableColumn width="fill">Load</TableColumn>
        <TableColumn align="end">Now</TableColumn>
      </TableHead>
      <TableBody>
        {[
          { host: "registry.example.org", load: 82 },
          { host: "feed.example.io", load: 47 },
          { host: "archive.example.com", load: 12 },
        ].map((row, i) => (
          <TableRow key={row.host}>
            <TableIndex>{String(i + 1).padStart(2, "0")}</TableIndex>
            <TableCell mono>{row.host}</TableCell>
            <TableCell>
              <LevelMeter label={`${row.host} load`} value={row.load} />
            </TableCell>
            <TableCell align="end" mono>
              {row.load}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const load = canvas.getByRole("columnheader", { name: "Load" });
    const host = canvas.getByRole("columnheader", { name: "Host" });
    await expect(load.getBoundingClientRect().width).toBeGreaterThan(host.getBoundingClientRect().width);
    // The other columns keep their content on one line.
    await expect(getComputedStyle(canvas.getByText("registry.example.org")).whiteSpace).toBe("nowrap");
    // The ordinal column keeps its width rather than shrinking to the figures.
    const index = canvasElement.querySelector("td.di-table-index")!;
    await expect(index.getBoundingClientRect().width).toBeGreaterThanOrEqual(38);
  },
};

/**
 * Prose in the filling column wraps inside it; the other columns keep
 * their line, and the table does not run past its frame.
 */
export const FillColumnProse: Story = {
  name: "Fill column with prose",
  args: { caption: "Findings", indexed: false },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <DataTable {...args}>
        <TableHead>
          <TableColumn>Finding</TableColumn>
          <TableColumn width="fill">What happened</TableColumn>
          <TableColumn>Seen</TableColumn>
        </TableHead>
        <TableBody>
          {[
            {
              id: "F-1042",
              text: "A service account signed in from a host it had never used, then read the payroll share for forty minutes.",
            },
            { id: "F-1043", text: "The mail gateway stopped sending audit events after its certificate was renewed." },
          ].map((row) => (
            <TableRow key={row.id}>
              <TableCell mono>{row.id}</TableCell>
              <TableCell>{row.text}</TableCell>
              <TableCell mono>09:12</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const scroll = canvasElement.querySelector(".di-table-scroll") as HTMLElement;
    await expect(scroll.scrollWidth).toBeLessThanOrEqual(scroll.clientWidth + 1);
    const prose = within(canvasElement).getByText(/payroll share/);
    await expect(getComputedStyle(prose).whiteSpace).toBe("normal");
  },
};

/**
 * Stacked on a phone beside a filling column: the other prose and the
 * identifiers wrap inside the card instead of running out of it.
 */
export const FillColumnStacked: Story = {
  name: "Fill column stacked",
  args: { caption: "Findings", indexed: false, narrow: "stack" },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <DataTable {...args}>
        <TableHead>
          <TableColumn>Finding</TableColumn>
          <TableColumn width="fill">What happened</TableColumn>
          <TableColumn>Next step</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell mono>sha256:9f2c4e1b7a03d58e6c21f4b09a7d3e15c8b62f40</TableCell>
            <TableCell>A service account signed in from a host it had never used.</TableCell>
            <TableCell>Reset the account's password and review what it read on the payroll share.</TableCell>
          </TableRow>
        </TableBody>
      </DataTable>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector(".di-table-wrap")!.getBoundingClientRect();
    for (const cell of canvasElement.querySelectorAll<HTMLElement>("tbody td")) {
      await expect(cell.scrollWidth).toBeLessThanOrEqual(cell.clientWidth + 1);
      await expect(cell.getBoundingClientRect().right).toBeLessThanOrEqual(frame.right + 1);
    }
  },
};

/**
 * `onSelect`: the whole row is the pointer target for the pane it opens.
 * The identifier stays a control, because a keyboard cannot reach a row.
 */
export const SelectableRows: Story = {
  render: () => <SelectableSources />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getAllByRole("row")[3]!;
    await userEvent.click(within(row).getByText("Registry"));
    await expect(row).toHaveClass("is-active");
    await expect(within(row).getByRole("button", { name: "archive.example.com" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(getComputedStyle(row).cursor).toBe("pointer");
  },
};

/** One row. The frame does not change shape for a short register. */
export const SingleRow: Story = {
  render: (args) => (
    <DataTable {...args}>
      <SourceRows rows={sources.slice(0, 1)} />
    </DataTable>
  ),
};

/**
 * A row's actions stay on one line: "Open" and the row's "…" beside it, not
 * broken under each other in a narrow actions column.
 */
export const RowActionsOnOneLine: Story = {
  args: { caption: "Products" },
  render: (args) => (
    <DataTable {...args}>
      <TableHead>
        <TableColumn width="fill">Product</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn align="end">Actions</TableColumn>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Reports</TableCell>
          <TableCell>
            <StatusPill tone="ok">Enabled</StatusPill>
          </TableCell>
          <TableCell align="end">
            <Toolbar>
              <Button variant="secondary" size="sm" href="#reports">
                Open
              </Button>
              <Button variant="ghost" size="sm" iconOnly aria-label="Actions for Reports">
                <Plus aria-hidden />
              </Button>
            </Toolbar>
          </TableCell>
        </TableRow>
      </TableBody>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const open = canvas.getByRole("link", { name: "Open" }).getBoundingClientRect();
    const more = canvas.getByRole("button", { name: "Actions for Reports" }).getBoundingClientRect();
    await expect(Math.abs(open.top + open.height / 2 - (more.top + more.height / 2))).toBeLessThan(1);
    await expect(more.left).toBeGreaterThan(open.right);
  },
};

/**
 * A filter that matches nothing: the head stays, one row says why and offers
 * the way back. The message starts on the first data column, past the index
 * column, and the way out ends on the last column; the footer is dropped,
 * since "0 of 0" only repeats the message.
 */
export const NoRows: Story = {
  args: { caption: "Sources on record" },
  render: (args) => (
    <DataTable {...args}>
      <TableHead>
        <TableColumn index={true}>Ordinal</TableColumn>
        <TableColumn>Host</TableColumn>
        <TableColumn>State</TableColumn>
        <TableColumn align="end">Entries</TableColumn>
      </TableHead>
      <TableBody>
        <TableEmpty message="No source matches the current filter.">
          <TextLink onClick={() => {}}>Clear filters</TextLink>
        </TableEmpty>
      </TableBody>
      <TableFooter>
        <span>0 of 0 sources</span>
      </TableFooter>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    const message = within(canvasElement).getByText("No source matches the current filter.");
    const cell = message.closest("td")!;
    await expect(within(canvasElement).getByRole("status")).toBe(message);
    await expect(cell).toHaveAttribute("colspan", "1000");
    await expect(message.getBoundingClientRect().width).toBeGreaterThan(160);
    const text = (el: Element) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect();
    };
    const heads = canvasElement.querySelectorAll("thead th");
    const first = heads[1];
    const last = heads[heads.length - 1];
    if (getComputedStyle(first).position !== "absolute") {
      await expect(Math.abs(text(message).left - text(first).left)).toBeLessThanOrEqual(1);
      // The way out ends on the last column's edge, or, wrapped under a long message, starts on the message's.
      const out = text(within(canvasElement).getByRole("button", { name: "Clear filters" }));
      if (out.top >= text(message).bottom) await expect(Math.abs(out.left - text(message).left)).toBeLessThanOrEqual(1);
      else await expect(Math.abs(out.right - text(last).right)).toBeLessThanOrEqual(1);
    }
    await expect(canvasElement.querySelector(".di-table-foot")).toBeNull();
  },
};

const seenGroups = [
  {
    label: "Last 24 hours",
    rows: [
      { ordinal: "01", host: "edge-gw-01", seen: "12 min ago" },
      { ordinal: "02", host: "dc-ldap-02", seen: "3 h ago" },
    ],
  },
  {
    label: "Last 30 days",
    rows: [
      { ordinal: "03", host: "build-runner-07", seen: "11 days ago" },
      { ordinal: "04", host: "print-03", seen: "26 days ago" },
    ],
  },
  { label: "Never seen", rows: [{ ordinal: "05", host: "lab-scanner", seen: "never" }] },
];

/**
 * Rows ordered by when they were last seen, grouped by span: a
 * `TableGroupRow` heads each run. A span with no rows has no group row
 * (nothing was seen in the last 7 days but before today). The label starts
 * on the first data column's line, past the ordinals.
 */
export const Grouped: Story = {
  args: { caption: "Hosts by last seen" },
  render: (args) => (
    <DataTable {...args}>
      <TableHead>
        <TableColumn index={true}>Ordinal</TableColumn>
        <TableColumn>Host</TableColumn>
        <TableColumn align="end">Last seen</TableColumn>
      </TableHead>
      <TableBody>
        {seenGroups.flatMap((group) => [
          <TableGroupRow key={group.label} label={group.label} />,
          ...group.rows.map((row) => (
            <TableRow key={row.ordinal}>
              <TableIndex>{row.ordinal}</TableIndex>
              <TableCell>{row.host}</TableCell>
              <TableCell align="end" mono={true}>
                {row.seen}
              </TableCell>
            </TableRow>
          )),
        ])}
      </TableBody>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heads = canvas.getAllByRole("rowheader");
    await expect(heads.map((th) => th.textContent)).toEqual(["Last 24 hours", "Last 30 days", "Never seen"]);
    await expect(heads[0]).toHaveAttribute("scope", "rowgroup");
    const host = canvasElement.querySelectorAll("thead th")[1];
    const label = heads[0].querySelector(".di-table-group-label")!;
    const text = (el: Element) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect();
    };
    if (getComputedStyle(host).position !== "absolute") {
      await expect(Math.abs(text(label).left - text(host).left)).toBeLessThanOrEqual(1);
    }
  },
};

/**
 * A separator row between two runs of rows: one `TableCell colSpan="all"`
 * runs across every column, and its words wrap inside the grid instead of
 * widening it.
 */
export const RowAcrossColumns: Story = {
  args: { caption: "Hosts by last seen", indexed: false },
  render: (args) => (
    <DataTable {...args}>
      <TableHead>
        <TableColumn width="fill">Host</TableColumn>
        <TableColumn align="end">Last seen</TableColumn>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>edge-gw-01</TableCell>
          <TableCell align="end" mono={true}>
            12 min ago
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan="all">
            Not seen for 30 days or more: these hosts are kept on record until someone retires them or they report
            again.
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>lab-scanner</TableCell>
          <TableCell align="end" mono={true}>
            41 days ago
          </TableCell>
        </TableRow>
      </TableBody>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    const across = canvasElement.querySelector<HTMLTableCellElement>("td.is-spanning")!;
    const row = across.closest("tr")!.getBoundingClientRect();
    await expect(Math.abs(across.getBoundingClientRect().width - row.width)).toBeLessThanOrEqual(1);
  },
};

export const InlineSelect: Story = {
  name: "Inline select (role per row)",
  render: (args) => (
    <DataTable {...args} caption="People">
      <TableHead>
        <TableColumn width="fill">Person</TableColumn>
        <TableColumn>Role</TableColumn>
      </TableHead>
      <TableBody>
        {people.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <CellStack primary={p.name} secondary={p.email} />
            </TableCell>
            <TableCell>
              <Select id={`role-${p.id}`} label={`Role of ${p.name}`} hideLabel mono={false} defaultValue={p.role}>
                <option value="operator">Operator</option>
                <option value="auditor">Auditor</option>
                <option value="administrator">Administrator</option>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByLabelText("Role of Nora Feld");
    await expect(select.getBoundingClientRect().width).toBeGreaterThan(100);
  },
};

/**
 * `narrow="stack"` is for a table read row by row — a log, a list of events. In a
 * frame under 600px each row becomes a block: short values share a line,
 * prose takes its own, the ordinal keeps the left edge. Sort controls stay
 * as a row above. The frame here is a phone's width.
 */
export const Stacked: Story = {
  args: { caption: "Source events", narrow: "stack" },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <DataTable {...args}>
        <TableHead>
          <TableColumn index={true}>Ordinal</TableColumn>
          <TableColumn sort="descending" onSort={() => undefined}>
            When
          </TableColumn>
          <TableColumn>State</TableColumn>
          <TableColumn>Entry</TableColumn>
        </TableHead>
        <TableBody>
          {events.map((row) => (
            <TableRow key={row.ordinal}>
              <TableIndex>{row.ordinal}</TableIndex>
              <TableCell mono={true}>{row.at}</TableCell>
              <TableCell>
                <StatusPill tone={row.state}>{row.stateLabel}</StatusPill>
              </TableCell>
              <TableCell>{row.text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rows = canvas.getAllByRole("row");
    await expect(rows).toHaveLength(4);
    await expect(getComputedStyle(rows[1]).display).toBe("flex");
    await expect(canvas.getByRole("columnheader", { name: "When" })).toHaveAttribute("aria-sort", "descending");
  },
};

/**
 * A stacked row with a selection box: the box, the icon, the name's first line
 * and a pill share one middle, also when the name wraps or the pill takes the
 * next line. A labelled cell with no value takes no line at all, and a long
 * identifier or status breaks inside the card.
 */
export const StackedWithSelection: Story = {
  args: { caption: "Devices", indexed: false, narrow: "stack" },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <DataTable {...args}>
        <TableHead>
          <TableColumn>
            <span className="di-sr">Select</span>
          </TableColumn>
          <TableColumn pinned>Name</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Owner</TableColumn>
        </TableHead>
        <TableBody>
          {[
            { name: "ws-01.example.com", licensed: false, status: "Running", owner: "Nora Feld" },
            { name: "ws-finance-014.corp.example.com", licensed: true, status: "Running", owner: "" },
            {
              name: "a-device-with-a-name-longer-than-the-card-that-holds-it.corp.example.com",
              licensed: true,
              status: "Reading files, 39% of 306.2 MB, with the rest following within the hour",
              owner: "",
            },
          ].map((d) => (
            <TableRow key={d.name}>
              <TableCell>
                <Checkbox id={`stacked-${d.name}`} label={`Select ${d.name}`} hideLabel />
              </TableCell>
              <TableCell pinned>
                <CellLead>
                  <CellIcon>
                    <Server aria-hidden />
                  </CellIcon>
                  <TextLink href="#">{d.name}</TextLink>
                  {d.licensed && (
                    <StatusPill tone="recorded" dot={false}>
                      Licensed
                    </StatusPill>
                  )}
                </CellLead>
              </TableCell>
              <TableCell label="Status">
                <StatusPill tone="neutral">{d.status}</StatusPill>
              </TableCell>
              <TableCell label="Owner">{d.owner || null}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector(".di-table-scroll")!;
    await expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth);
  },
};

/**
 * An inventory with more columns than a laptop shows. The name is `pinned`:
 * it stays at the left edge while the others scroll under it. Stacked on a
 * phone, every labelled cell is one line of the card with its column's name.
 */
export const PinnedAndLabelled: Story = {
  args: { caption: "Devices", indexed: false, narrow: "stack" },
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      {[760, 360].map((width) => (
        <div key={width} style={{ maxWidth: width }}>
          <DataTable {...args} caption={`${args.caption}, ${width}px`}>
            <TableHead>
              <TableColumn pinned>Name</TableColumn>
              <TableColumn>Criticality</TableColumn>
              <TableColumn>Owner</TableColumn>
              <TableColumn>Business unit</TableColumn>
              <TableColumn>Last seen</TableColumn>
              <TableColumn>Source</TableColumn>
            </TableHead>
            <TableBody>
              {devices.map((d) => (
                <TableRow key={d.name}>
                  <TableCell pinned>
                    <TextLink href="#">{d.name}</TextLink>
                  </TableCell>
                  <TableCell label="Criticality">
                    <StatusPill tone={d.criticality === "High" ? "danger" : "ok"}>{d.criticality}</StatusPill>
                  </TableCell>
                  <TableCell label="Owner">{d.owner}</TableCell>
                  <TableCell label="Business unit">{d.unit}</TableCell>
                  <TableCell label="Last seen" mono>
                    {d.seen}
                  </TableCell>
                  <TableCell label="Source">{d.source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [wide, narrow] = within(canvasElement).getAllByRole("table");
    const pinned = within(wide).getAllByRole("cell")[0];
    const scrolls = wide.closest(".di-table-wrap")!.classList.contains("is-overflowing");
    await expect(getComputedStyle(pinned).position).toBe(scrolls ? "sticky" : "static");
    const owner = within(narrow).getByText("Nora Feld");
    await expect(owner).toHaveAttribute("data-label", "Owner");
    await expect(getComputedStyle(owner).display).toBe("grid");
  },
};

/**
 * A grid wider than its frame scrolls sideways inside it. The row's name (the
 * first column headed by a word) stays at the inline-start edge with the
 * selection box before it, and a shade marks each side that hides columns:
 * the end at rest, the start once scrolled. Right to left, the same from the
 * other side.
 */
export const ScrollingSideways: Story = {
  args: { caption: "Devices", indexed: false },
  render: (args) => (
    <div style={{ display: "grid", gap: 24, maxWidth: 360 }}>
      {(["ltr", "rtl"] as const).map((dir) => (
        <Panel key={dir} title={dir === "ltr" ? "Devices" : "Devices, right to left"} padded={false}>
          <div dir={dir}>
            <DataTable {...args} caption={`${args.caption}, ${dir}`}>
              <TableHead>
                <TableColumn>
                  <Checkbox id={`devices-all-${dir}`} label="Select every device" hideLabel />
                </TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Criticality</TableColumn>
                <TableColumn>Owner</TableColumn>
                <TableColumn>Last seen</TableColumn>
                <TableColumn>Source</TableColumn>
              </TableHead>
              <TableBody>
                {devices.map((d) => (
                  <TableRow key={d.name}>
                    <TableCell>
                      <Checkbox id={`device-${dir}-${d.name}`} label={`Select ${d.name}`} hideLabel />
                    </TableCell>
                    <TableCell>
                      <TextLink href="#">{d.name}</TextLink>
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={d.criticality === "High" ? "danger" : "ok"}>{d.criticality}</StatusPill>
                    </TableCell>
                    <TableCell>{d.owner}</TableCell>
                    <TableCell mono>{d.seen}</TableCell>
                    <TableCell>{d.source}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          </div>
        </Panel>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const table of within(canvasElement).getAllByRole("table")) {
      const wrap = table.closest<HTMLElement>(".di-table-wrap")!;
      const frame = wrap.querySelector<HTMLElement>(".di-table-scroll")!;
      const rtl = getComputedStyle(frame).direction === "rtl";
      const name = within(table).getByText(devices[0].name).closest("td")!;
      const box = name.getBoundingClientRect();
      await expect(wrap).toHaveClass("is-overflowing", "is-more-end");
      await expect(wrap).not.toHaveClass("is-more-start");
      await expect(getComputedStyle(name).position).toBe("sticky");
      // The selection box keeps the cell inset from the frame's edge, like any first column.
      const mark = table.querySelector("tbody .di-choice-mark")!.getBoundingClientRect();
      const edge = frame.getBoundingClientRect();
      await expect(rtl ? edge.right - mark.right : mark.left - edge.left).toBeGreaterThanOrEqual(11.5);
      frame.scrollLeft = rtl ? -frame.scrollWidth : frame.scrollWidth;
      await waitFor(() => expect(wrap).toHaveClass("is-more-start"));
      await expect(wrap).not.toHaveClass("is-more-end");
      await expect(Math.abs(name.getBoundingClientRect().left - box.left)).toBeLessThan(1);
      const select = name.previousElementSibling!.getBoundingClientRect();
      const meet = rtl
        ? select.left - name.getBoundingClientRect().right
        : name.getBoundingClientRect().left - select.right;
      await expect(Math.abs(meet)).toBeLessThan(1);
      await expectStartShade(wrap, name);
      frame.scrollLeft = 0;
      await waitFor(() => expect(wrap).not.toHaveClass("is-more-start"));
    }
  },
};

/* The start shade falls from the pinned name's edge and runs the frame's full height, its head and every row. */
async function expectStartShade(wrap: HTMLElement, name: HTMLElement) {
  const shade = wrap.querySelector(".di-table-start-shade");
  await expect(shade).not.toBeNull();
  const box = shade!.getBoundingClientRect();
  const view = wrap.querySelector(".di-table-view")!.getBoundingClientRect();
  const edge = name.getBoundingClientRect();
  const rtl = getComputedStyle(wrap).direction === "rtl";
  await expect(Math.abs(rtl ? edge.left - box.right : box.left - edge.right)).toBeLessThan(1);
  await expect(Math.abs(box.top - view.top)).toBeLessThan(1);
  await expect(Math.abs(box.bottom - view.bottom)).toBeLessThan(1);
}

/** A price with what the quantity buys and its total, one line each, so a narrow frame never cuts them. */
export const CellLines: Story = {
  render: (args) => (
    <DataTable {...args} narrow="stack">
      <TableHead>
        <TableColumn width="fill">Offer</TableColumn>
        <TableColumn align="end">Price</TableColumn>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <CellStack primary="Register retention" secondary="Yearly · 25 seats per unit" />
          </TableCell>
          <TableCell align="end" mono>
            <CellStack
              primary="€9,900.00 per year"
              secondary={["100 × 25 = 2,500 seats", "Total €990,000.00 per year"]}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("100 × 25 = 2,500 seats")).toHaveClass("di-cell-secondary");
    await expect(canvas.getByText("Total €990,000.00 per year")).toHaveClass("di-cell-secondary");
  },
};

/**
 * A pinned name column in a table without an index column — the default
 * `indexed` left as it is, as most product tables do. The name starts at the
 * frame's edge and the cell after it shows whole: nothing sits 38px in.
 */
export const PinnedWithoutIndex: Story = {
  args: { caption: "Plans" },
  render: (args) => (
    <div style={{ maxWidth: 720 }}>
      <DataTable {...args}>
        <TableHead>
          <TableColumn width="fill" pinned>
            Offer
          </TableColumn>
          <TableColumn align="end">Price</TableColumn>
          <TableColumn align="end">Action</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell pinned>
              <CellStack primary="Team Add‑on" secondary="Yearly · 3 seats per unit" prose />
            </TableCell>
            <TableCell align="end">
              <CellStack primary="€9,900.00 per year" secondary={["Total €9,900.00 per year"]} prose />
            </TableCell>
            <TableCell align="end">
              <Button size="sm">Subscribe</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </DataTable>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByRole("table").getBoundingClientRect();
    const name = canvas.getByRole("columnheader", { name: "Offer" }).getBoundingClientRect();
    const price = canvas.getByRole("columnheader", { name: "Price" }).getBoundingClientRect();
    await expect(Math.abs(name.left - frame.left)).toBeLessThan(1);
    await expect(name.right).toBeLessThanOrEqual(price.left + 1);
    const total = canvas.getByText("Total €9,900.00 per year");
    await expect(total.scrollWidth).toBeLessThanOrEqual(total.clientWidth + 1);
  },
};
