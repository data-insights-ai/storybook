import { afterEach, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../styles.css";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "./DataTable";

let root: Root | undefined;

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

function renderRegister(width = "800px") {
  const host = document.createElement("div");
  host.style.width = width;
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Records" indexed={false}>
        <TableHead>
          <TableColumn>Record</TableColumn>
          <TableColumn width="fill">Title</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHead>
        <TableBody>
          {["A-1", "A-2", "A-3"].map((id) => (
            <TableRow key={id} onSelect={() => {}}>
              <TableCell>
                <a href={`#${id}`}>{id}</a>
              </TableCell>
              <TableCell>Title of {id}</TableCell>
              <TableCell>
                <button type="button">Menu {id}</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>,
    ),
  );
  return host;
}

const link = (name: string) => document.querySelector<HTMLElement>(`a[href="#${name}"]`)!;

test("the arrows move between rows in the same column, Home and End to the ends", async () => {
  renderRegister();
  link("A-1").focus();
  await userEvent.keyboard("{ArrowDown}");
  expect(document.activeElement).toBe(link("A-2"));
  await userEvent.keyboard("{End}");
  expect(document.activeElement).toBe(link("A-3"));
  await userEvent.keyboard("{Home}");
  expect(document.activeElement).toBe(link("A-1"));
  await userEvent.keyboard("{ArrowUp}");
  expect(document.activeElement).toBe(link("A-1"));
  await userEvent.tab();
  await userEvent.keyboard("{ArrowDown}");
  expect(document.activeElement?.textContent).toBe("Menu A-2");
});

test("a frame that fits is no tab stop; one that scrolls is", () => {
  renderRegister();
  expect(document.querySelector(".di-table-scroll")!.hasAttribute("tabindex")).toBe(false);
});

test("the head reads in the interface's type, not as a shouted eyebrow", () => {
  renderRegister();
  const head = getComputedStyle(document.querySelector("th")!);
  expect(head.textTransform).toBe("none");
  expect(head.letterSpacing).toBe("normal");
});

test("a stacked row names its cells in the interface's type too", () => {
  const host = document.createElement("div");
  host.style.width = "360px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Events" indexed={false} narrow="stack">
        <TableHead>
          <TableColumn>Event</TableColumn>
          <TableColumn>Seen</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Published</TableCell>
            <TableCell label="Seen">today</TableCell>
          </TableRow>
        </TableBody>
      </DataTable>,
    ),
  );
  const label = getComputedStyle(document.querySelector("td.is-labelled")!, "::before");
  expect(label.content).toContain("Seen");
  expect(label.textTransform).toBe("none");
});
