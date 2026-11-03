import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { useState } from "react";
import "../../../styles/styles.css";
import { TableCell, TableColumn, TableEmpty, TableHead, TableRow } from "../DataTable";
import { InfiniteTable } from "./InfiniteTable";

let root: Root | undefined;

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
  scrollTo(0, 0);
});

const frame = () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));

test("scrolled down, the pinned column's head stays above the rows passing under it", async () => {
  await page.viewport(1280, 720);
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <InfiniteTable
        caption="Assets"
        count={200}
        rowKey={(i) => `a-${i}`}
        renderRow={(i, place) => (
          <TableRow key={place.key} rowIndex={place.rowIndex} ref={place.ref}>
            <TableCell pinned>host-{i}</TableCell>
            <TableCell>Server</TableCell>
          </TableRow>
        )}
        hasMore={false}
        loadingMore={false}
        onLoadMore={() => {}}
        newEntriesLabel={() => ""}
        footerLabel={() => ""}
        loadingLabel=""
        retryLabel=""
        order="sorted"
      >
        <TableHead>
          <TableColumn pinned width="fill">
            Name
          </TableColumn>
          <TableColumn>Kind</TableColumn>
        </TableHead>
      </InfiniteTable>,
    ),
  );
  await frame();
  scrollTo(0, 1500);
  await frame();

  const head = document.querySelector<HTMLElement>("th.is-pinned")!;
  const box = head.getBoundingClientRect();
  expect(box.top).toBeGreaterThanOrEqual(0);
  expect(head.contains(document.elementFromPoint(box.left + 8, box.top + box.height / 2))).toBe(true);
});

function Failing({ fails, onCall, extra = 0 }: { fails: () => boolean; onCall: () => void; extra?: number }) {
  const [loaded, setCount] = useState(5);
  const count = loaded + extra;
  const [loading, setLoading] = useState(false);
  const more = () => {
    onCall();
    setLoading(true);
    setTimeout(() => {
      if (!fails()) setCount((n) => n + 5);
      setLoading(false);
    }, 10);
  };
  return (
    <InfiniteTable
      caption="Runs"
      count={count}
      rowKey={(i) => `r-${i}`}
      renderRow={(i, place) => (
        <TableRow key={place.key} rowIndex={place.rowIndex} ref={place.ref}>
          <TableCell>run-{i}</TableCell>
        </TableRow>
      )}
      hasMore={count < 15}
      loadingMore={loading}
      onLoadMore={more}
      newEntriesLabel={() => ""}
      footerLabel={(n) => `${n} loaded`}
      loadingLabel="Loading"
      retryLabel="Try again"
    >
      <TableHead>
        <TableColumn width="fill">Run</TableColumn>
      </TableHead>
    </InfiniteTable>
  );
}

function render(node: React.ReactNode) {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  flushSync(() => root!.render(node));
  return host;
}

const settle = () => new Promise((done) => setTimeout(done, 200));
const retry = (host: HTMLElement) =>
  Array.from(host.querySelectorAll("button")).find((b) => b.textContent === "Try again");

test("a page that did not arrive is not asked for again until the reader presses Try again", async () => {
  await page.viewport(1280, 720);
  const calls = { n: 0 };
  let failing = true;
  const host = render(<Failing fails={() => failing} onCall={() => calls.n++} />);
  await settle();
  expect(calls.n).toBe(1);
  expect(retry(host)).toBeDefined();

  retry(host)!.click();
  await settle();
  expect(calls.n).toBe(2);
  expect(retry(host)).toBeDefined();

  failing = false;
  retry(host)!.click();
  await expect.poll(() => host.querySelectorAll("tbody tr:not([aria-hidden])").length).toBe(15);
  expect(calls.n).toBe(4);
  expect(retry(host)).toBeUndefined();
});

test("a stall ends when the rows change from outside", async () => {
  await page.viewport(1280, 720);
  const calls = { n: 0 };
  const host = render(<Failing fails={() => true} onCall={() => calls.n++} />);
  await settle();
  expect(calls.n).toBe(1);
  flushSync(() => root!.render(<Failing fails={() => true} onCall={() => calls.n++} extra={1} />));
  await settle();
  expect(calls.n).toBe(2);
  expect(retry(host)).toBeDefined();
});

test("the empty body shows only once no row is loaded and none is left to load", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  const show = (state: { count: number; hasMore: boolean; loadingMore: boolean }) =>
    flushSync(() =>
      root!.render(
        <InfiniteTable
          caption="Assets"
          {...state}
          rowKey={(i) => `a-${i}`}
          renderRow={(i, place) => (
            <TableRow key={place.key} rowIndex={place.rowIndex} ref={place.ref}>
              <TableCell>host-{i}</TableCell>
            </TableRow>
          )}
          onLoadMore={() => {}}
          newEntriesLabel={() => ""}
          footerLabel={(n) => `${n} loaded`}
          loadingLabel="Loading"
          retryLabel=""
          order="sorted"
        >
          <TableHead>
            <TableColumn width="fill">Name</TableColumn>
          </TableHead>
          <TableEmpty message="No asset matches." />
        </InfiniteTable>,
      ),
    );
  const empty = () => document.querySelector(".di-table-empty");
  const foot = () => document.querySelector(".di-table-foot");
  show({ count: 0, hasMore: false, loadingMore: true });
  expect(empty()).toBeNull();
  show({ count: 0, hasMore: true, loadingMore: false });
  expect(empty()).toBeNull();
  show({ count: 0, hasMore: false, loadingMore: false });
  expect(empty()?.querySelector('[role="status"]')?.textContent).toBe("No asset matches.");
  expect(foot()).toBeNull();
  show({ count: 3, hasMore: false, loadingMore: false });
  await frame();
  expect(empty()).toBeNull();
  expect(foot()?.textContent).toBe("3 loaded");
});
