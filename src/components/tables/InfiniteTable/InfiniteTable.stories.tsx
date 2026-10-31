import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { TableCell, TableColumn, TableHead, TableRow } from "../DataTable";
import { InfiniteTable } from "./InfiniteTable";
import { StatusPill } from "../../status/StatusPill";
import { Panel } from "../../layout/page/Panel";

const meta = {
  title: "Tables/InfiniteTable",
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
  const entries = Array.from({ length: 600 }, (_, i) => wide(600 - i));
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
 * Six hundred rows of uneven width. The columns are measured once from the
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
    for (let y = 0; y <= total; y += innerHeight) {
      window.scrollTo(0, y);
      // The scroll event the next frame would bring, now: the rows render at once instead of one frame per step.
      window.dispatchEvent(new Event("scroll"));
      await waitFor(() => expect(drawnAcrossTheView(canvasElement)).toBe(true));
      await expect(edges()).toEqual(before);
    }
    window.scrollTo(0, 0);
    await expectAtRest(canvas.getByRole("table"), { top: 0, bottom: window.innerHeight });
  },
};

function Windowed1000({ maxRows }: { maxRows?: number }) {
  const entries = Array.from({ length: 1000 }, (_, i) => entry(1000 - i));
  return (
    <InfiniteTable
      caption="Collector runs"
      count={entries.length}
      rowKey={(i) => entries[i].id}
      hasMore={false}
      loadingMore={false}
      onLoadMore={() => {}}
      newEntriesLabel={(n) => `${n} new entries`}
      footerLabel={(shown) => `All ${shown.toLocaleString("en")} entries`}
      loadingLabel="Loading more"
      maxRows={maxRows}
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

/* The rows for this place are in, not only the ones left over from the last place. */
function drawnAcrossTheView(canvasElement: HTMLElement) {
  const body = canvasElement.querySelector("tbody")!.getBoundingClientRect();
  const rows = [...canvasElement.querySelectorAll("tbody tr[data-index]")].map((row) => row.getBoundingClientRect());
  return rows[0].top <= Math.max(0, body.top) + 1 && rows.at(-1)!.bottom >= Math.min(innerHeight, body.bottom) - 1;
}

const settle = () =>
  new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, 60))));

/* Back at the top, the first rows are drawn in view: the story is never left as a blank stretch of spacer. */
async function expectAtRest(table: HTMLElement, view: { top: number; bottom: number }) {
  await settle();
  await settle();
  const first = table.querySelector<HTMLElement>("tbody tr[data-index]")!;
  await expect(first.dataset.index).toBe("0");
  const box = first.getBoundingClientRect();
  await expect(box.top).toBeGreaterThanOrEqual(view.top - 1);
  await expect(box.bottom).toBeLessThanOrEqual(view.bottom);
}

/* The blank between the edges of what is in view (the window, or the frame under its head) and the rendered rows. */
function blank(table: HTMLTableElement, view: { top: number; bottom: number }) {
  const body = table.tBodies[0].getBoundingClientRect();
  const rows = [...table.tBodies[0].rows].filter((row) => !row.classList.contains("di-table-spacer"));
  const first = rows[0].getBoundingClientRect();
  const last = rows[rows.length - 1].getBoundingClientRect();
  const top = Math.max(view.top, body.top);
  const bottom = Math.min(view.bottom, body.bottom);
  return { above: first.top - top, below: bottom - last.bottom, row: first.height };
}

/**
 * A thousand rows in a panel among other blocks: the register scrolls in a
 * frame twelve rows tall (`maxRows`), its head held at the frame's top and
 * its count under it, and only the rows near the frame's view are rendered.
 * The rows not rendered are held by space as tall as the rendered rows
 * measure, in either density, so the frame scrolls with no blank stretch at
 * the top, the middle or the end.
 */
export const Windowed: StoryObj = {
  render: () => (
    <Panel title="Collector runs" padded={false}>
      <Windowed1000 maxRows={12} />
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole<HTMLTableElement>("table", { name: "Collector runs" });
    await waitFor(() => expect(table.tBodies[0].rows.length).toBeGreaterThan(2));
    await expect(table).toHaveAttribute("aria-rowcount", "1001");
    const frame = table.closest<HTMLElement>(".di-table-scroll")!;
    await expect(frame.scrollHeight).toBeGreaterThan(frame.clientHeight * 10);
    await expect(frame.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight * 2);
    await expect(within(canvasElement).getByText("All 1,000 entries")).toBeVisible();
    for (const at of [0, 0.5, 1]) {
      frame.scrollTop = Math.round((frame.scrollHeight - frame.clientHeight) * at);
      await settle();
      await settle();
      const head = table.tHead!.getBoundingClientRect();
      await expect(Math.abs(head.top - frame.getBoundingClientRect().top)).toBeLessThanOrEqual(1);
      const { above, below, row } = blank(table, { top: head.bottom, bottom: frame.getBoundingClientRect().bottom });
      await expect(above).toBeLessThanOrEqual(row);
      await expect(below).toBeLessThanOrEqual(row);
    }
    frame.scrollTop = 0;
    await expectAtRest(table, frame.getBoundingClientRect());
  },
};

/**
 * When the register is the page itself, an audit log with nothing below
 * it, the page scrolls rather than a frame: the head stays under the app
 * bar and only the rows near the window are rendered.
 */
export const WindowedPage: StoryObj = {
  name: "Windowed, the page scrolls",
  render: () => <Windowed1000 />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole<HTMLTableElement>("table", { name: "Collector runs" });
    await waitFor(() => expect(table.tBodies[0].rows.length).toBeGreaterThan(2));
    await expect(table).toHaveAttribute("aria-rowcount", "1001");
    const end = () => document.documentElement.scrollHeight - window.innerHeight;
    for (const at of [0, 0.5, 1]) {
      window.scrollTo(0, Math.round(end() * at));
      await settle();
      await settle();
      const { above, below, row } = blank(table, { top: 0, bottom: window.innerHeight });
      await expect(above).toBeLessThanOrEqual(row);
      await expect(below).toBeLessThanOrEqual(row);
    }
    window.scrollTo(0, 0);
    await expectAtRest(table, { top: 0, bottom: window.innerHeight });
  },
};
