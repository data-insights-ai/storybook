import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useRef, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { TableCell, TableColumn, TableEmpty, TableHead, TableRow } from "../DataTable";
import { Button } from "../../actions/Button";
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

/* A server in miniature: pages of 40, a short delay, 200 entries in all; `failing` answers the first page asked for with an error after a short first page. */
function useEntries(failing = false) {
  const failures = useRef(failing ? 1 : 0);
  const [entries, setEntries] = useState(() => Array.from({ length: failing ? 8 : 40 }, (_, i) => entry(200 - i)));
  const [loading, setLoading] = useState(false);
  const more = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      if (failures.current > 0) {
        failures.current--;
        setLoading(false);
        return;
      }
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

function Register({ failing = false }: { failing?: boolean }) {
  const { entries, loading, more, hasMore } = useEntries(failing);
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
      retryLabel="Try again"
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

/**
 * The next page did not arrive: the server answered with an error. The table
 * asks no more on its own, so a failing server is not asked again and again,
 * and the footer offers to try once more.
 */
export const APageFails: StoryObj = {
  render: () => <Register failing />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const retry = await canvas.findByRole("button", { name: "Try again" }, { timeout: 3000 });
    await userEvent.click(retry);
    const table = canvas.getByRole("table", { name: "Collector runs" });
    await waitFor(() => expect(Number(table.getAttribute("aria-rowcount"))).toBeGreaterThanOrEqual(49));
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
  const entries = Array.from({ length: 300 }, (_, i) => wide(300 - i));
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
      retryLabel="Try again"
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
 * Three hundred rows of uneven width. The columns are measured once from the
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
      retryLabel="Try again"
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

type Host = { id: string; name: string; seen: string; hoursAgo: number };

/* Hosts by when they were last seen, newest first: none in the last 7 days but before today. */
const hosts: Host[] = Array.from({ length: 120 }, (_, i) => {
  const hoursAgo = i < 12 ? i * 2 : i < 60 ? 24 * 8 + i * 6 : 24 * 40 + i * 24;
  return { id: `h${i}`, name: `host-${String(i).padStart(3, "0")}`, seen: `${hoursAgo} h ago`, hoursAgo };
});

const seenGroup = (h: Host) =>
  h.hoursAgo < 24
    ? "Last 24 hours"
    : h.hoursAgo < 24 * 7
      ? "Last 7 days"
      : h.hoursAgo < 24 * 30
        ? "Last 30 days"
        : "Older";

function GroupedRegister() {
  const [loaded, setLoaded] = useState(40);
  const [loading, setLoading] = useState(false);
  const more = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoaded((n) => Math.min(n + 40, hosts.length));
      setLoading(false);
    }, 200);
  }, []);
  const shown = hosts.slice(0, loaded);
  return (
    <InfiniteTable
      caption="Hosts"
      count={shown.length}
      rowKey={(i) => shown[i].id}
      groupOf={(i) => seenGroup(shown[i])}
      hasMore={loaded < hosts.length}
      loadingMore={loading}
      onLoadMore={more}
      newEntriesLabel={(n) => `${n} new entries`}
      footerLabel={(n, more) => (more ? `${n} loaded, more follow as you scroll` : `All ${n} hosts`)}
      loadingLabel="Loading more"
      retryLabel="Try again"
      renderRow={(i, { key, ...place }) => (
        <TableRow key={key} {...place}>
          <TableCell pinned>{shown[i].name}</TableCell>
          <TableCell mono label="Last seen">
            {shown[i].seen}
          </TableCell>
        </TableRow>
      )}
    >
      <TableHead>
        <TableColumn width="fill">Host</TableColumn>
        <TableColumn>Last seen</TableColumn>
      </TableHead>
    </InfiniteTable>
  );
}

/**
 * Rows in the order of a value the reader thinks in spans (last seen) are
 * grouped by it: `groupOf` names each row's group and a group row heads each
 * run. A span with no rows gets no group row; here no host was last seen
 * between a day and a week ago. The footer counts hosts, not group rows.
 */
export const Grouped: StoryObj = {
  render: () => <GroupedRegister />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole<HTMLTableElement>("table", { name: "Hosts" });
    await waitFor(() => expect(table.querySelectorAll("tr.di-table-group").length).toBeGreaterThan(1));
    const labels = [...table.querySelectorAll("tr.di-table-group")].map((row) => row.textContent);
    await expect(labels.slice(0, 2)).toEqual(["Last 24 hours", "Last 30 days"]);
    await expect(table).toHaveAttribute("aria-rowcount", String(40 + 2 + 1));
    await expect(within(canvasElement).getByText("40 loaded, more follow as you scroll")).toBeInTheDocument();
  },
};

/* Three long spans, every host loaded: a group runs far past the screen. */
const manyHosts: Host[] = Array.from({ length: 300 }, (_, i) => {
  const hoursAgo = i < 100 ? i / 5 : i < 200 ? 24 * 8 + i : 24 * 40 + i * 24;
  return { id: `m${i}`, name: `host-${String(i).padStart(3, "0")}`, seen: `${Math.round(hoursAgo)} h ago`, hoursAgo };
});

const wideColumns = ["Owner", "Business unit", "Tags", "Reported by", "Operating system", "Network"];

function LongGroupedRegister({ maxRows, wide = false }: { maxRows?: number; wide?: boolean }) {
  return (
    <InfiniteTable
      caption="Hosts"
      count={manyHosts.length}
      rowKey={(i) => manyHosts[i].id}
      groupOf={(i) => seenGroup(manyHosts[i])}
      hasMore={false}
      loadingMore={false}
      onLoadMore={() => {}}
      newEntriesLabel={(n) => `${n} new entries`}
      footerLabel={(n) => `All ${n} hosts`}
      loadingLabel="Loading more"
      retryLabel="Try again"
      maxRows={maxRows}
      renderRow={(i, { key, ...place }) => (
        <TableRow key={key} {...place}>
          <TableCell pinned>{manyHosts[i].name}</TableCell>
          <TableCell mono label="Last seen">
            {manyHosts[i].seen}
          </TableCell>
          {wide
            ? wideColumns.map((column) => (
                <TableCell key={column} label={column}>
                  {`${column} of ${manyHosts[i].name}, written out at length`}
                </TableCell>
              ))
            : null}
        </TableRow>
      )}
    >
      <TableHead>
        <TableColumn width="fill">Host</TableColumn>
        <TableColumn>Last seen</TableColumn>
        {wide ? wideColumns.map((column) => <TableColumn key={column}>{column}</TableColumn>) : null}
      </TableHead>
    </InfiniteTable>
  );
}

/* The group row the view is in: rendered although its place is far above, and held right under the head. */
async function expectGroupHeld(table: HTMLTableElement, label: string, line = stickyLine(table)) {
  await settle();
  await settle();
  const group = [...table.querySelectorAll("tr.di-table-group")].find((row) => row.textContent === label);
  await expect(group).toBeDefined();
  const head = table.tHead!;
  if (getComputedStyle(head).position !== "sticky" && !head.classList.contains("is-held")) return;
  // A head held by hand has the group row tuck 2px under its edge.
  const under = head.getBoundingClientRect().bottom - (head.classList.contains("is-held") ? 2 : 0);
  await expect(Math.abs(group!.getBoundingClientRect().top - under)).toBeLessThanOrEqual(1);
  await expect(Math.abs(head.getBoundingClientRect().top - line)).toBeLessThanOrEqual(1);
}

/* The line under the app bar and a sticky toolbar, as the register resolves it. */
function stickyLine(table: HTMLElement) {
  return parseFloat(getComputedStyle(table.closest(".di-infinite")!).scrollMarginTop) || 0;
}

/*
 * Scrolled sideways, the measured columns clip what lies past them, so the
 * shade beside the pinned name is the frame's: it runs past the held head
 * and every row, and lies over the head that is moved down to stay in view.
 */
async function expectStartShadeOverHeld(table: HTMLTableElement) {
  const frame = table.closest<HTMLElement>(".di-table-scroll")!;
  const rtl = getComputedStyle(frame).direction === "rtl";
  frame.scrollLeft = rtl ? -frame.scrollWidth : frame.scrollWidth;
  const shade = await waitFor(() => {
    const found = table.closest(".di-table-view")!.querySelector<HTMLElement>(".di-table-start-shade");
    expect(found).not.toBeNull();
    return found!;
  });
  const box = shade.getBoundingClientRect();
  const view = shade.parentElement!.getBoundingClientRect();
  await expect(Math.abs(box.top - view.top)).toBeLessThan(1);
  await expect(Math.abs(box.bottom - view.bottom)).toBeLessThan(1);
  const passing = table.tHead!.querySelector("th:not(.is-pinned, .di-table-index)")!;
  await expect(Number(getComputedStyle(shade).zIndex)).toBeGreaterThanOrEqual(
    Number(getComputedStyle(passing).zIndex) || 0,
  );
  await expect(box.top).toBeLessThanOrEqual(passing.getBoundingClientRect().top + 1);
  frame.scrollLeft = 0;
  await waitFor(() => expect(shade.isConnected).toBe(false));
}

/* Scrolls the page until the row of host n is in the middle of the window. */
async function scrollToHost(table: HTMLTableElement, n: number) {
  const rowOf = () => [...table.querySelectorAll("tr")].find((r) => r.textContent?.startsWith(`host-${n}`));
  for (let tries = 0; tries < 20 && !rowOf(); tries++) {
    window.scrollBy(0, innerHeight / 2);
    window.dispatchEvent(new Event("scroll"));
    await settle();
  }
  window.scrollBy(0, rowOf()!.getBoundingClientRect().top - innerHeight / 2);
  window.dispatchEvent(new Event("scroll"));
}

/**
 * Deep in a long group its row stays under the head, so the reader always
 * sees which span the rows on screen belong to; the next group's row takes
 * its place when it arrives. Where the head scrolls with the page (a
 * narrow frame), the group row scrolls with it.
 */
export const GroupedHeld: StoryObj = {
  name: "Grouped, the group stays named",
  render: () => <LongGroupedRegister />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole<HTMLTableElement>("table", { name: "Hosts" });
    await waitFor(() => expect(table.tBodies[0].rows.length).toBeGreaterThan(2));
    await scrollToHost(table, 160);
    await expectGroupHeld(table, "Last 30 days");
    window.scrollTo(0, 0);
    await expectAtRest(table, { top: 0, bottom: window.innerHeight });
  },
};

/** The same in a frame: the group row stays under the frame's head. */
export const GroupedHeldInFrame: StoryObj = {
  name: "Grouped, in a frame",
  render: () => (
    <Panel title="Hosts by last seen">
      <LongGroupedRegister maxRows={10} />
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole<HTMLTableElement>("table", { name: "Hosts" });
    const frame = table.closest<HTMLElement>(".di-table-scroll")!;
    await waitFor(() => expect(table.tBodies[0].rows.length).toBeGreaterThan(2));
    frame.scrollTop = frame.scrollHeight * 0.5;
    await expectGroupHeld(table, "Last 30 days", frame.getBoundingClientRect().top);
    frame.scrollTop = 0;
  },
};

/**
 * A grid wider than the page scrolls sideways in its own frame, and its
 * head and the open group's row still stay under the app bar while the page
 * scrolls. Back at the top, nothing is held.
 */
export const GroupedHeldWide: StoryObj = {
  name: "Grouped, wider than the page",
  render: () => <LongGroupedRegister wide />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole<HTMLTableElement>("table", { name: "Hosts" });
    await waitFor(() => expect(table.tBodies[0].rows.length).toBeGreaterThan(2));
    if (getComputedStyle(table).display === "table") {
      await waitFor(() => expect(table.closest(".di-table-wrap")).toHaveClass("is-overflowing"));
    }
    await scrollToHost(table, 160);
    await expectGroupHeld(table, "Last 30 days");
    if (getComputedStyle(table).display === "table") await expectStartShadeOverHeld(table);
    await scrollToHost(table, 250);
    await expectGroupHeld(table, "Older");
    window.scrollTo(0, 0);
    await settle();
    await expect(table.querySelectorAll(".is-held")).toHaveLength(0);
    await expectAtRest(table, { top: 0, bottom: window.innerHeight });
  },
};

/**
 * A filter that matches nothing: the head stays, the body is its `TableEmpty`
 * child with its one way out, and the footer goes, since "0 loaded" only
 * repeats it. The message is a `status`, so the empty list is announced.
 * Clearing the filter brings the rows back in the same table.
 */
export const NothingMatches: StoryObj = {
  render: function Render() {
    const [filtered, setFiltered] = useState(true);
    const rows = filtered ? [] : Array.from({ length: 12 }, (_, i) => entry(12 - i));
    return (
      <InfiniteTable
        caption="Collector runs"
        count={rows.length}
        rowKey={(i) => rows[i].id}
        hasMore={false}
        loadingMore={false}
        onLoadMore={() => {}}
        newEntriesLabel={(n) => `${n} new entries`}
        footerLabel={(shown) => `All ${shown} entries`}
        loadingLabel="Loading more"
        retryLabel="Try again"
        renderRow={(i, { key, ...place }) => (
          <TableRow key={key} {...place}>
            <TableCell mono>{rows[i].at}</TableCell>
            <TableCell>{rows[i].what}</TableCell>
            <TableCell align="end">
              <StatusPill tone={rows[i].ok ? "ok" : "danger"}>{rows[i].ok ? "Done" : "Failed"}</StatusPill>
            </TableCell>
          </TableRow>
        )}
      >
        <TableHead>
          <TableColumn>When</TableColumn>
          <TableColumn width="fill">What happened</TableColumn>
          <TableColumn align="end">Result</TableColumn>
        </TableHead>
        <TableEmpty message="No run matches the current filter.">
          <Button variant="ghost" onClick={() => setFiltered(false)}>
            Clear filters
          </Button>
        </TableEmpty>
      </InfiniteTable>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole("table", { name: "Collector runs" });
    await expect(within(table).getAllByRole("columnheader")).toHaveLength(3);
    const status = within(table).getByRole("status");
    await expect(status).toHaveTextContent("No run matches the current filter.");
    await expect(status.closest("td")).not.toBeNull();
    await expect(canvasElement.querySelector(".di-table-foot")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Clear filters" }));
    await waitFor(() => expect(within(table).queryByRole("status")).toBeNull());
    await expect(await canvas.findByText("All 12 entries")).toBeTruthy();
  },
};
