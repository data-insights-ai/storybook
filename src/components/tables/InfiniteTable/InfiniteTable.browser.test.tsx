import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../styles/styles.css";
import { TableCell, TableColumn, TableHead, TableRow } from "../DataTable";
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
