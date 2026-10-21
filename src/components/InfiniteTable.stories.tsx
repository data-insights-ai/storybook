import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useEffect, useState } from "react";
import { MoreHorizontal, Pencil } from "lucide-react";
import { expect, waitFor, within } from "storybook/test";
import { Button } from "./Button";
import { TableCell, TableColumn, TableHead, TableRow } from "./DataTable";
import { EmptyState } from "./EmptyState";
import { InfiniteTable } from "./InfiniteTable";
import { RowActions } from "./RowActions";
import { StatusPill } from "./StatusPill";

type Person = { id: string; name: string; email: string; role: string };

const first = ["Nora", "Jonas", "Mira", "Tomas", "Lea", "Arne", "Ines", "Paul"];
const last = ["Feld", "Brandt", "Kern", "Vogt", "Lind", "Roth"];
const people: Person[] = Array.from({ length: 240 }, (_, i) => {
  const name = `${first[i % first.length]} ${last[i % last.length]} ${String(i + 1).padStart(3, "0")}`;
  return {
    id: `p${i}`,
    name,
    email: `${name.split(" ")[0].toLowerCase()}.${i + 1}@data-insights.ai`,
    role: i % 7 === 0 ? "Administrator" : "Member",
  };
});
const pageSize = 50;

function usePages() {
  const [loaded, setLoaded] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => (setLoaded(people.slice(0, pageSize)), setLoading(false)), 300);
    return () => clearTimeout(t);
  }, []);
  const loadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setLoaded((l) => people.slice(0, l.length + pageSize));
      setLoadingMore(false);
    }, 300);
  }, []);
  return { loaded, loading, loadingMore, loadMore, hasMore: loaded.length < people.length };
}

const meta = {
  title: "Blocks/InfiniteTable",
  component: InfiniteTable,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof InfiniteTable>;

export default meta;
type Story = StoryObj<typeof meta>;

function Members() {
  const list = usePages();
  return (
    <InfiniteTable
      caption="Members"
      items={list.loaded}
      rowKey={(p: Person) => p.id}
      loading={list.loading}
      hasMore={list.hasMore}
      loadingMore={list.loadingMore}
      onLoadMore={list.loadMore}
      order="sorted"
      memoryKey="story-members"
      loadingLabel="Loading members"
      loadingMoreLabel="Loading more members"
      footerLabel={list.hasMore ? `${list.loaded.length} shown` : `All ${list.loaded.length} shown`}
      newEntriesLabel={(n) => `${n} new members`}
      row={(p, place) => (
        <TableRow {...place}>
          <TableCell>{p.name}</TableCell>
          <TableCell mono>{p.email}</TableCell>
          <TableCell>
            <StatusPill tone="neutral" dot={false}>
              {p.role}
            </StatusPill>
          </TableCell>
          <TableCell align="end">
            <RowActions>
              <Button variant="ghost" size="dense" iconOnly aria-label={`Change role of ${p.name}`}>
                <Pencil aria-hidden />
              </Button>
              <Button variant="ghost" size="dense" iconOnly aria-label={`Actions for ${p.name}`}>
                <MoreHorizontal aria-hidden />
              </Button>
            </RowActions>
          </TableCell>
        </TableRow>
      )}
    >
      <TableHead>
        <TableColumn width="fill">Name</TableColumn>
        <TableColumn>Email</TableColumn>
        <TableColumn>Role</TableColumn>
        <TableColumn align="end">Actions</TableColumn>
      </TableHead>
      <EmptyState title="No members match." body="Try another name or clear the filters." />
    </InfiniteTable>
  );
}

/** 240 members, 50 a page: rows render near the viewport only, the next page loads before the end. */
export const Paged: Story = {
  args: {} as never,
  render: () => <Members />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("table", { name: "Members" })).toBeVisible());
    const rows = canvas.getAllByRole("row");
    await expect(rows.length).toBeLessThan(80);
  },
};

/** Nothing matches: the empty state stands in for the table. */
export const Empty: Story = {
  args: {} as never,
  render: () => (
    <InfiniteTable
      caption="Members"
      items={[] as Person[]}
      rowKey={(p) => p.id}
      loading={false}
      hasMore={false}
      loadingMore={false}
      onLoadMore={() => {}}
      order="sorted"
      memoryKey="story-empty"
      loadingLabel="Loading members"
      loadingMoreLabel="Loading more members"
      footerLabel=""
      newEntriesLabel={(n) => `${n} new`}
      row={() => null}
    >
      <TableHead>
        <TableColumn>Name</TableColumn>
      </TableHead>
      <EmptyState title="No members match." body="Try another name or clear the filters." />
    </InfiniteTable>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("No members match.")).toBeVisible();
  },
};
