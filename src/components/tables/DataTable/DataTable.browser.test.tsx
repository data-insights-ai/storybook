import { afterEach, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../styles/styles.css";
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

test("the head names each column in the interface label, at a row's height and a cell's inset", () => {
  renderRegister();
  const th = document.querySelector("th:not(.di-table-index)")!;
  const td = document.querySelector("tbody td:not(.di-table-index)")!;
  const head = getComputedStyle(th);
  const cell = getComputedStyle(td);
  expect(head.fontFamily).toContain("IBM Plex Sans");
  expect(head.textTransform).toBe("none");
  expect(head.fontWeight).toBe("500");
  expect(head.paddingInlineStart).toBe(cell.paddingInlineStart);
  expect(head.paddingInlineEnd).toBe(cell.paddingInlineEnd);
  const textBlock = parseFloat(cell.lineHeight) + parseFloat(cell.paddingTop) + parseFloat(cell.paddingBottom);
  expect(th.getBoundingClientRect().height).toBeGreaterThanOrEqual(textBlock - 0.5);
});

test("beside a filling column every other cell keeps its line, while the filling column's prose wraps", () => {
  renderRegister("360px");
  const [record, title] = Array.from(document.querySelectorAll("tbody tr:first-child td"));
  expect(getComputedStyle(record).whiteSpace).toBe("nowrap");
  expect(getComputedStyle(title).whiteSpace).toBe("normal");
  expect(title.classList.contains("is-fill")).toBe(true);
});

test("a stacked row names its cells with the same label as the head", () => {
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
  expect(label.fontFamily).toContain("IBM Plex Sans");
});

test("a row's disclosure is a column the arrows keep", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Changes" indexed={false}>
        <TableHead>
          <TableColumn>Record</TableColumn>
          <TableColumn width="fill">Change</TableColumn>
        </TableHead>
        <TableBody>
          {["C-1", "C-2"].map((id) => (
            <TableRow key={id}>
              <TableCell>
                <a href={`#${id}`}>{id}</a>
              </TableCell>
              <TableCell>
                <details>
                  <summary>Change to {id}</summary>
                  <p>Fields</p>
                </details>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>,
    ),
  );
  host.querySelector<HTMLElement>("summary")!.focus();
  await userEvent.keyboard("{ArrowDown}");
  expect(document.activeElement?.textContent).toBe("Change to C-2");
});
