import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { TableCell, TableColumn, TableHead, TableRow } from "../DataTable";
import { InfiniteTable } from "./InfiniteTable";
import { StatusPill } from "../../../marks/status/StatusPill";

const meta = {
  title: "Data/Table/InfiniteTable",
  component: InfiniteTable,
  tags: ["layer:block", "autodocs"],
} satisfies Meta<typeof InfiniteTable>;

export default meta;

type Entry = { id: string; what: string; at: string; ok: boolean };

const entry = (n: number): Entry => ({
  id: `e${n}`,
  what: `Collector run ${n} finished`,
  at: `09:${String(n % 60).padStart(2, "0")}:00Z`,
  ok: n % 7 !== 0,
});

/* A server in miniature: pages of 40, a short delay, 200 entries in all. */
function useEntries() {
  const [entries, setEntries] = useState(() => Array.from({ length: 40 }, (_, i) => entry(200 - i)));
  const [loading, setLoading] = useState(false);
  const more = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setEntries((all) =>
        [...all, ...Array.from({ length: 40 }, (_, i) => entry(200 - all.length - i))].filter(
          (e) => Number(e.id.slice(1)) > 0,
        ),
      );
      setLoading(false);
    }, 200);
  }, []);
  return { entries, loading, more, hasMore: entries.length < 200 };
}

function Register() {
  const { entries, loading, more, hasMore } = useEntries();
  return (
    <InfiniteTable
      caption="Collector runs"
      count={entries.length}
      rowKey={(i) => entries[i].id}
      hasMore={hasMore}
      loadingMore={loading}
      onLoadMore={more}
      order="newest-first"
      newEntriesLabel={(n) => `${n} new entries`}
      footerLabel={(shown, more) => (more ? `${shown} loaded, more follow as you scroll` : `All ${shown} entries`)}
      loadingLabel="Loading more"
      renderRow={(i, { key, ...place }) => (
        <TableRow key={key} {...place}>
          <TableCell mono>{entries[i].at}</TableCell>
          <TableCell>{entries[i].what}</TableCell>
          <TableCell align="end">
            <StatusPill tone={entries[i].ok ? "ok" : "danger"}>{entries[i].ok ? "Done" : "Failed"}</StatusPill>
          </TableCell>
        </TableRow>
      )}
    >
      <TableHead>
        <TableColumn>When</TableColumn>
        <TableColumn width="fill">What happened</TableColumn>
        <TableColumn align="end">Result</TableColumn>
      </TableHead>
    </InfiniteTable>
  );
}

export const GrowsAsYouScroll: StoryObj = {
  render: () => <Register />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole("table", { name: "Collector runs" });
    await waitFor(() => expect(within(table).getAllByRole("row").length).toBeGreaterThan(1));
    await expect(Number(table.getAttribute("aria-rowcount"))).toBeGreaterThanOrEqual(41);
  },
};

const wide = (n: number): Entry => ({
  ...entry(n),
  what:
    n % 9 === 0
      ? `Collector run ${n} finished after reading every partition of the hub twice, which took longer than the window allowed`
      : n % 4 === 0
        ? `Run ${n}`
        : `Collector run ${n} finished`,
});

/* Every row loaded at once, so the test scrolls the whole register. */
function LongRegister() {
  const entries = Array.from({ length: 2000 }, (_, i) => wide(2000 - i));
  return (
    <InfiniteTable
      caption="Collector runs"
      count={entries.length}
      rowKey={(i) => entries[i].id}
      hasMore={false}
      loadingMore={false}
      onLoadMore={() => {}}
      newEntriesLabel={(n) => `${n} new entries`}
      footerLabel={(shown) => `All ${shown} entries`}
      loadingLabel="Loading more"
      renderRow={(i, { key, ...place }) => (
        <TableRow key={key} {...place}>
          <TableCell mono>{entries[i].at}</TableCell>
          <TableCell>{entries[i].what}</TableCell>
          <TableCell align="end">
            <StatusPill tone={entries[i].ok ? "ok" : "danger"}>{entries[i].ok ? "Done" : "Failed"}</StatusPill>
          </TableCell>
        </TableRow>
      )}
    >
      <TableHead>
        <TableColumn>Time</TableColumn>
        <TableColumn width="fill">What happened</TableColumn>
        <TableColumn align="end">Result</TableColumn>
      </TableHead>
    </InfiniteTable>
  );
}

/**
 * Two thousand rows of uneven width. The columns are measured once from the
 * head and the first rows and keep their place while the register scrolls,
 * whatever the rows on screen happen to hold.
 */
export const StableColumns: StoryObj = {
  render: () => <LongRegister />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const heads = await canvas.findAllByRole("columnheader");
    await waitFor(() => expect(canvasElement.querySelector("table.is-measured")).not.toBeNull());
    const edges = () => heads.map((th) => Math.round(th.getBoundingClientRect().left * 2) / 2);
    const before = edges();
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y <= total; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
      await expect(edges()).toEqual(before);
    }
    window.scrollTo(0, 0);
  },
};
