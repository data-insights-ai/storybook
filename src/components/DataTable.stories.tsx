import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Globe, Plus, Server } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { Chip } from "./Chip";
import {
  CellIcon,
  CellLead,
  CellStack,
  DataTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableIndex,
  TableRow,
} from "./DataTable";
import { Pagination } from "./Pagination";
import { SearchField } from "./SearchField";
import { SealValue } from "./Seal";
import { StatusPill } from "./StatusPill";

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
  title: "Blocks/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  args: {
    caption: "Sources on record",
    indexed: true,
    children: null,
  },
  argTypes: {
    caption: { control: "text" },
    indexed: { control: "boolean" },
    children: { control: false },
    toolbar: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

function Rows({ rows = sources, active = "" }: { rows?: Source[]; active?: string }) {
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
            tone={row.state === "danger" ? "danger" : "default"}
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

/** The register extract: ordinals down the left, mono values across. */
export const Default: Story = {
  render: (args) => (
    <DataTable {...args}>
      <Rows />
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
    <DataTable
      {...args}
      toolbar={
        <>
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
        </>
      }
    >
      <Rows />
    </DataTable>
  ),
};

/** The count and the pages under the grid. */
export const WithFooter: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(1);
    return (
      <DataTable
        {...args}
        footer={
          <>
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
          </>
        }
      >
        <Rows />
      </DataTable>
    );
  },
};

/** The row an open drawer is showing. */
export const ActiveRow: Story = {
  render: (args) => (
    <DataTable {...args}>
      <Rows active="03" />
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

/** One row. The frame does not change shape for a short register. */
export const SingleRow: Story = {
  render: (args) => (
    <DataTable {...args}>
      <Rows rows={sources.slice(0, 1)} />
    </DataTable>
  ),
};

/** Nothing on record. The frame stays and says so in its own footer. */
export const NoRows: Story = {
  args: { caption: "Sources on record" },
  render: (args) => (
    <DataTable {...args} footer={<span>0 of 0 sources</span>}>
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
