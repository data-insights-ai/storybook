import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Globe, Plus, Server } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Chip } from "../marks/Chip";
import {
  CellIcon,
  CellLead,
  CellStack,
  DataTable,
  TableBody,
  TableCell,
  TableFooter,
  TableColumn,
  TableHead,
  TableIndex,
  TableRow,
  TableSpacer,
  TableToolbar,
} from "./DataTable";
import { LevelMeter } from "../../charts/LevelMeter";
import { Pagination } from "../../navigation/Pagination";
import { SearchField } from "../../forms/SearchField";
import { Select } from "../../forms/Select";
import { SealValue } from "../marks/Seal";
import { StatusPill } from "../marks/StatusPill";
import { TextLink } from "../../navigation/TextLink";

type Source = {
  ordinal: string;
  host: string;
  kind: string;
  hash: string;
  seen: string;
  state: "ok" | "warn" | "danger";
  stateLabel: string;
};

const sources: Source[] = [
  { ordinal: "01", host: "registry.example.org", kind: "Registry", hash: "a4f9c21e", seen: "09:12:04Z", state: "ok", stateLabel: "running" },
  { ordinal: "02", host: "mirror.example.net", kind: "Mirror", hash: "7f3a99e0", seen: "09:11:52Z", state: "ok", stateLabel: "running" },
  { ordinal: "03", host: "feed.example.io", kind: "Feed", hash: "c18b70d4", seen: "08:47:11Z", state: "warn", stateLabel: "paused" },
  { ordinal: "04", host: "archive.example.com", kind: "Archive", hash: "5e0d3a91", seen: "08:44:03Z", state: "danger", stateLabel: "failed" },
  { ordinal: "05", host: "index.example.dev", kind: "Index", hash: "b207ff6c", seen: "09:09:38Z", state: "ok", stateLabel: "running" },
];

const meta = {
  title: "Data/Table/DataTable",
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

/*
 * The rows, abbreviated to one tag for the variants below, whose subject is
 * the toolbar, the footer or the active state rather than the composition.
 * `Default` writes the same tree out in full, because Show code prints a
 * helper as `<SourceRows />` and that is the one snippet which has to teach
 * this table's only API rule: the caller maps its own data into the frame.
 */
function SourceRows({ rows = sources, active = "" }: { rows?: Source[]; active?: string }) {
  return (
    <>
      <TableHead>
        <TableColumn index={true}>Ordinal</TableColumn>
        <TableColumn sort="ascending">Host</TableColumn>
        <TableColumn>Kind</TableColumn>
        <TableColumn>Manifest</TableColumn>
        <TableColumn align="end">Last seen</TableColumn>
        <TableColumn align="end">State</TableColumn>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.ordinal}
            active={row.ordinal === active}
            tone={row.state === "danger" ? "danger" : "neutral"}
          >
            <TableIndex>{row.ordinal}</TableIndex>
            <TableCell>
              <CellLead>
                <CellIcon>{row.kind === "Registry" ? <Server aria-hidden /> : <Globe aria-hidden />}</CellIcon>
                <CellStack primary={row.host} secondary={`WS-01 · ${row.kind.toLowerCase()}`} />
              </CellLead>
            </TableCell>
            <TableCell>{row.kind}</TableCell>
            <TableCell>
              <SealValue state={row.state === "danger" ? "absent" : "sealed"} stateLabel={row.state === "danger" ? "Not recorded" : "Sealed"}>
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
    </>
  );
}

/**
 * The register extract: ordinals down the left, mono values across.
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
          <TableRow key={row.ordinal} tone={row.state === "danger" ? "danger" : "neutral"}>
            <TableIndex>{row.ordinal}</TableIndex>
            <TableCell>
              <CellLead>
                <CellIcon>
                  {row.kind === "Registry" ? <Server aria-hidden /> : <Globe aria-hidden />}
                </CellIcon>
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
  },
};

/** A filter row above the grid, inside the same frame. */
export const WithToolbar: Story = {
  render: (args) => (
    <DataTable {...args}>
      <TableToolbar>
        <div style={{ width: 240 }}>
          <SearchField id="table-search" label="Search sources" placeholder="host or hash" dense={true} />
        </div>
        <Chip active={true} removeLabel="Remove the state filter">
          state: running
        </Chip>
        <Chip active={false} removeLabel="Add a kind filter">
          <Plus aria-hidden />
          kind
        </Chip>
      </TableToolbar>
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

type SortKey = "host" | "seen";
type SortOrder = "ascending" | "descending";

/*
 * The caller owns the order. In a product it is part of the query that
 * fetches the page, so the server sorts every row rather than the slice
 * in hand; here the five sample rows stand in for that query.
 */
function SortableSources({ caption, indexed }: { caption: string; indexed: boolean }) {
  const [by, setBy] = useState<SortKey>("seen");
  const [order, setOrder] = useState<SortOrder>("descending");
  const sortOn = (key: SortKey) => () => {
    setOrder(key === by && order === "descending" ? "ascending" : "descending");
    setBy(key);
  };
  const rows = [...sources].sort((a, b) => a[by].localeCompare(b[by]) * (order === "ascending" ? 1 : -1));
  const state = (key: SortKey) => (key === by ? order : "none");

  return (
    <DataTable caption={caption} indexed={indexed}>
      <TableHead>
        <TableColumn index={true}>Ordinal</TableColumn>
        <TableColumn sort={state("host")} onSort={sortOn("host")}>
          Host
        </TableColumn>
        <TableColumn>Kind</TableColumn>
        <TableColumn align="end" sort={state("seen")} onSort={sortOn("seen")}>
          Last seen
        </TableColumn>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.ordinal}>
            <TableIndex>{row.ordinal}</TableIndex>
            <TableCell>{row.host}</TableCell>
            <TableCell>{row.kind}</TableCell>
            <TableCell align="end" mono={true}>
              {row.seen}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
}

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

function SelectableSources() {
  const rows = ["registry.example.org", "feed.example.io", "archive.example.com"];
  const [active, setActive] = useState(rows[0]);
  return (
    <DataTable caption="Sources on record">
      <TableHead>
        <TableColumn index>No.</TableColumn>
        <TableColumn>Host</TableColumn>
        <TableColumn>Kind</TableColumn>
      </TableHead>
      <TableBody>
        {rows.map((host, i) => (
          <TableRow key={host} active={host === active} onSelect={() => setActive(host)}>
            <TableIndex>{String(i + 1).padStart(2, "0")}</TableIndex>
            <TableCell mono>
              <TextLink quiet aria-pressed={host === active} onClick={() => setActive(host)}>
                {host}
              </TextLink>
            </TableCell>
            <TableCell>Registry</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
}

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
    await expect(within(row).getByRole("button", { name: "archive.example.com" })).toHaveAttribute("aria-pressed", "true");
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

/** Nothing on record. The frame stays and says so in its own footer. */
export const NoRows: Story = {
  args: { caption: "Sources on record" },
  render: (args) => (
    <DataTable {...args}>
      <TableFooter>
        <span>0 of 0 sources</span>
      </TableFooter>
      <TableHead>
        <TableColumn index={true}>Ordinal</TableColumn>
        <TableColumn>Host</TableColumn>
        <TableColumn align="end">State</TableColumn>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <span className="di-quiet">No source matches the current filter.</span>
          </TableCell>
          <TableCell>
            <span aria-hidden />
          </TableCell>
          <TableCell align="end">
            <Button variant="ghost" size="dense">
              Clear filters
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </DataTable>
  ),
};

const people = [
  { id: "nora", name: "Nora Feld", email: "nora.feld@data-insights.ai", role: "operator" },
  { id: "jon", name: "Jon Arlt", email: "jon.arlt@data-insights.ai", role: "auditor" },
];

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

const events = [
  { ordinal: "03", at: "2026-10-19 09:12:04", state: "danger", stateLabel: "failed", text: "archive.example.com stopped answering; the last manifest on record is a4f9c21e." },
  { ordinal: "02", at: "2026-10-19 08:47:11", state: "warn", stateLabel: "paused", text: "Nora Feld paused feed.example.io while its signing key is rotated." },
  { ordinal: "01", at: "2026-10-19 08:44:03", state: "ok", stateLabel: "running", text: "registry.example.org sealed manifest 7f3a99e0." },
] as const;

/**
 * `narrow="stack"` is for a table read row by row — a log, a list of events. In a
 * frame under 600px each row becomes a block: short values share a line,
 * prose takes its own, the ordinal keeps the left edge. Sort controls stay
 * as a row above. The frame here is a phone's width.
 */
export const Stacked: Story = {
  args: { caption: "Source events", narrow: "stack" },
  render: (args) => (
    <div style={{ width: 360 }}>
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
            <TableRow key={row.ordinal} tone={row.state === "danger" ? "danger" : "neutral"}>
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

const devices = [
  { name: "srv-vie-212.example.com", criticality: "High", owner: "Nora Feld", unit: "Finance", seen: "4 min ago", source: "Endpoint agent" },
  { name: "ws-hr-007.example.com", criticality: "Low", owner: "Jonas Wirt", unit: "People", seen: "2 h ago", source: "Directory" },
] as const;

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
        <div key={width} style={{ width }}>
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
    await expect(getComputedStyle(pinned).position).toBe("sticky");
    const owner = within(narrow).getByText("Nora Feld");
    await expect(owner).toHaveAttribute("data-label", "Owner");
    await expect(getComputedStyle(owner).display).toBe("grid");
  },
};

/*
 * A register too long to render: the product's virtualizer decides which
 * rows are on screen, the spacers stand in for the rest, and `rowCount`
 * with each row's `rowIndex` tells a screen reader where it is.
 */
const windowed = Array.from({ length: 20 }, (_, i) => 40 + i);

export const Windowed: Story = {
  render: (args) => (
    <DataTable {...args} rowCount={1000}>
      <TableHead>
        <TableColumn index={true}>Ordinal</TableColumn>
        <TableColumn width="fill">Entry</TableColumn>
        <TableColumn align="end">Seen</TableColumn>
      </TableHead>
      <TableBody>
        <TableSpacer height={40 * 41} />
        {windowed.map((i) => (
          <TableRow key={i} rowIndex={i}>
            <TableIndex>{String(i + 1).padStart(4, "0")}</TableIndex>
            <TableCell>Entry {i + 1}</TableCell>
            <TableCell align="end" mono>
              09:{String(i % 60).padStart(2, "0")}:00Z
            </TableCell>
          </TableRow>
        ))}
        <TableSpacer height={(1000 - 60) * 41} />
      </TableBody>
      <TableFooter>Rows 41–60 of 1,000 on screen</TableFooter>
    </DataTable>
  ),
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole("table");
    await expect(table).toHaveAttribute("aria-rowcount", "1001");
    const rows = within(table).getAllByRole("row");
    await expect(rows[1]).toHaveAttribute("aria-rowindex", "42");
  },
};

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
            <CellStack primary="€9,900.00 per year" secondary={["100 × 25 = 2,500 seats", "Total €990,000.00 per year"]} />
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
    <div style={{ width: 720 }}>
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
              <CellStack primary="Team Add-on" secondary="Yearly · 3 seats per unit" prose />
            </TableCell>
            <TableCell align="end">
              <CellStack primary="€9,900.00 per year" secondary={["Total €9,900.00 per year"]} prose />
            </TableCell>
            <TableCell align="end">
              <Button size="dense">Subscribe</Button>
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
