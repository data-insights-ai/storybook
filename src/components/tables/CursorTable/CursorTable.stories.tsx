import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { EmptyState } from "../../feedback/EmptyState";
import { LoadError } from "../../feedback/recovery/LoadError";
import { TableCell, TableColumn, TableEmpty, TableHead, TableRow } from "../DataTable";
import { CursorTable, CursorTableEmpty, CursorTableFailed, type CursorTableList } from "./CursorTable";

type Key = { id: string; name: string; created: string };

const keys: Key[] = Array.from({ length: 12 }, (_, i) => ({
  id: `k${i + 1}`,
  name: `Export key ${i + 1}`,
  created: `2026-10-${String(i + 1).padStart(2, "0")}`,
}));

const labels = {
  loading: "Loading keys",
  loadingMore: "Loading more",
  retry: "Try again",
  newEntries: (n: number) => `${n} new keys`,
  footer: (n: number, more: boolean) => (more ? `${n} loaded` : `All ${n} keys`),
};

const list = (items: Key[], state: Partial<CursorTableList<Key>> = {}): CursorTableList<Key> => ({
  items,
  isPending: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: () => undefined,
  ...state,
});

function Keys({ source, filter = "" }: { source: CursorTableList<Key>; filter?: string }) {
  return (
    <CursorTable
      caption="API keys"
      list={source}
      rowKey={(k) => k.id}
      labels={labels}
      row={(k, { key, ...place }) => (
        <TableRow key={key} {...place}>
          <TableCell>{k.name}</TableCell>
          <TableCell mono>{k.created}</TableCell>
        </TableRow>
      )}
    >
      <TableHead>
        <TableColumn width="fill">Name</TableColumn>
        <TableColumn>Created</TableColumn>
      </TableHead>
      {filter ? <TableEmpty message={`No key matches “${filter}”.`} /> : null}
      <CursorTableEmpty>
        <EmptyState title="No API keys yet" body="A key lets a script read this organization's data." />
      </CursorTableEmpty>
      <CursorTableFailed>
        <LoadError
          body="The keys could not be read."
          onRetry={() => undefined}
          labels={{ retry: "Try again", retryAfter: (s) => `In ${s} s`, copyReference: "Copy", copied: "Copied" }}
        />
      </CursorTableFailed>
    </CursorTable>
  );
}

const meta = {
  title: "Tables/CursorTable",
  component: CursorTable,
  tags: ["layer:block", "autodocs"],
} satisfies Meta<typeof CursorTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const args = { caption: "", list: list([]), rowKey: () => "", row: () => null, labels, children: null };

/** Rows of a cursor list, read further as the reader scrolls. */
export const Default: Story = {
  args,
  render: () => <Keys source={list(keys)} />,
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(within(canvasElement).getByText("Export key 1")).toBeVisible());
  },
};

/** A list that never held a row is an empty state on a surface, not an empty table. */
export const Empty: Story = {
  args,
  render: () => <Keys source={list([])} />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("No API keys yet")).toBeVisible();
    await expect(within(canvasElement).queryByRole("table")).toBeNull();
  },
};

/** A filter that matches nothing keeps the table and its head, with one line in the body. */
export const NoMatch: Story = {
  args,
  render: () => <Keys source={list([])} filter="backup" />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent("No key matches “backup”.");
    await expect(within(canvasElement).getByText("Name")).toBeVisible();
  },
};

/** A list that could not be read says so; it is not shown as empty. */
export const Failed: Story = {
  args,
  render: () => <Keys source={list([], { isError: true })} />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("The keys could not be read.")).toBeVisible();
    await expect(within(canvasElement).queryByText("No API keys yet")).toBeNull();
  },
};

/** The skeleton while the first page loads. */
export const Loading: Story = {
  args,
  render: function Render() {
    const [source] = useState(() => list([], { isPending: true }));
    return <Keys source={source} />;
  },
};
