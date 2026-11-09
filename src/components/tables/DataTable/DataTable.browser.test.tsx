import { afterEach, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../styles/styles.css";
import { Checkbox } from "../../forms/choice/Checkbox";
import { StatusPill } from "../../status/StatusPill";
import { Tag, TagList } from "../../status/Tag";
import {
  CellIcon,
  CellLead,
  CellStack,
  DataTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "./DataTable";

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

test.each([
  ["on a wide grid", "800px"],
  ["stacked", "360px"],
])("only a row a click does something on changes its fill under the pointer, %s", async (_, width) => {
  const host = document.createElement("div");
  host.style.width = width;
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Records" indexed={false} narrow="stack">
        <TableHead>
          <TableColumn>Record</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow onSelect={() => {}}>
            <TableCell>Opens a pane</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Only reads</TableCell>
          </TableRow>
          <TableRow active onSelect={() => {}}>
            <TableCell>Its pane is open</TableCell>
          </TableRow>
        </TableBody>
      </DataTable>,
    ),
  );
  const [selectable, plain, current] = Array.from(document.querySelectorAll("tbody td"));
  const fillUnderPointer = async (cell: Element) => {
    const before = getComputedStyle(cell).backgroundColor;
    await userEvent.hover(cell);
    return { before, after: getComputedStyle(cell).backgroundColor };
  };

  const onSelectable = await fillUnderPointer(selectable);
  expect(onSelectable.after).not.toBe(onSelectable.before);
  const onPlain = await fillUnderPointer(plain);
  expect(onPlain.after).toBe(onPlain.before);
  const onCurrent = await fillUnderPointer(current);
  expect(onCurrent.after).toBe(onCurrent.before);
});

test.each([
  ["a name on one line", "ws-01.example.com", "480px"],
  ["a name that wraps", "workstation-finance-014-with-a-long-name.corp.example.com", "320px"],
  ["a name beside a pill that takes the next line", "ws-fin-014.corp.example.com", "340px"],
])("a stacked row's first line centres its box, icon, name and action on one middle: %s", (_, name, width) => {
  const host = document.createElement("div");
  host.style.width = width;
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Assets" indexed={false} narrow="stack">
        <TableHead>
          <TableColumn>
            <span className="di-sr">Select</span>
          </TableColumn>
          <TableColumn pinned>Name</TableColumn>
          <TableColumn>Seen</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Checkbox id="select-asset" label={`Select ${name}`} hideLabel />
            </TableCell>
            <TableCell pinned>
              <CellLead>
                <CellIcon>
                  <svg aria-hidden />
                </CellIcon>
                <a href="#asset">{name}</a>
                <span className="pill">licensed</span>
              </CellLead>
            </TableCell>
            <TableCell label="Seen">today</TableCell>
            <TableCell align="end">
              <button type="button" className="action">
                More
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </DataTable>,
    ),
  );
  const middle = (rect: DOMRect) => rect.top + rect.height / 2;
  const box = document.querySelector(".di-choice-box")!.getBoundingClientRect();
  const icon = document.querySelector(".di-cell-icon")!.getBoundingClientRect();
  const action = document.querySelector(".action")!.getBoundingClientRect();
  const range = document.createRange();
  range.selectNodeContents(document.querySelector(".di-cell-lead a")!);
  const firstLine = range.getClientRects()[0];

  expect(Math.abs(middle(box) - middle(icon))).toBeLessThanOrEqual(1);
  expect(Math.abs(middle(firstLine) - middle(icon))).toBeLessThanOrEqual(1);
  expect(Math.abs(middle(action) - middle(icon))).toBeLessThanOrEqual(1);

  const text = range.getBoundingClientRect();
  const pill = document.querySelector(".pill")!.getBoundingClientRect();
  expect(text.left).toBeGreaterThanOrEqual(icon.right);
  expect(document.querySelector(".di-table-scroll")!.scrollWidth).toBeLessThanOrEqual(
    document.querySelector(".di-table-scroll")!.clientWidth,
  );
  if (pill.top >= firstLine.bottom) {
    expect(Math.abs(pill.left - text.left)).toBeLessThanOrEqual(1);
  }
});

const frames = () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));

function renderLongStatus(host: HTMLElement) {
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Sites" indexed={false} narrow="stack">
        <TableHead>
          <TableColumn width="fill">Name</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Owner</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Vienna</TableCell>
            <TableCell label="Status">
              <StatusPill tone="danger">
                A status long enough to hold the grid wider than a phone, sharing its line with a detail that also wants
                to stay on it
              </StatusPill>
            </TableCell>
            <TableCell label="Owner">{null}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>averyveryveryveryveryveryveryveryveryveryverylongidentifierwithoutabreak.example.com</TableCell>
            <TableCell label="Status">Fine</TableCell>
            <TableCell label="Owner">Nora Feld</TableCell>
          </TableRow>
        </TableBody>
      </DataTable>,
    ),
  );
}

test("a stacked row stays inside its frame after a wide grid narrowed, as when a phone turns", async () => {
  const host = document.createElement("div");
  host.style.width = "700px";
  document.body.append(host);
  renderLongStatus(host);
  await frames();
  const wrap = document.querySelector(".di-table-wrap")!;
  expect(wrap.classList.contains("is-overflowing")).toBe(true);

  host.style.width = "360px";
  await frames();
  await frames();
  const frame = document.querySelector(".di-table-scroll")!;
  expect(wrap.classList.contains("is-overflowing")).toBe(false);
  expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth);
});

test("a stacked table loaded on a phone breaks a long pill and identifier inside the card", async () => {
  const host = document.createElement("div");
  host.style.width = "320px";
  document.body.append(host);
  renderLongStatus(host);
  await frames();
  const wrap = document.querySelector(".di-table-wrap")!;
  const frame = document.querySelector(".di-table-scroll")!;
  expect(wrap.classList.contains("is-overflowing")).toBe(false);
  expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth);
  const pill = document.querySelector(".di-badge")!.getBoundingClientRect();
  expect(pill.right).toBeLessThanOrEqual(frame.getBoundingClientRect().right);
});

test("a stacked pill beside words keeps its width, and the words take the next line", () => {
  const host = document.createElement("div");
  host.style.width = "320px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Sites" indexed={false} narrow="stack">
        <TableHead>
          <TableColumn pinned>Name</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell pinned>Vienna</TableCell>
            <TableCell label="Status">
              <CellLead>
                <StatusPill tone="danger">needs attention</StatusPill>
                <span>3 sources failing, 1 notification channel failing, 1 export target failing</span>
              </CellLead>
            </TableCell>
          </TableRow>
        </TableBody>
      </DataTable>,
    ),
  );
  const pill = document.querySelector<HTMLElement>(".di-badge")!;
  const words = document.querySelector<HTMLElement>(".di-cell-lead > span:not(.di-badge)")!;
  expect(pill.getBoundingClientRect().height).toBeLessThan(30);
  expect(words.getBoundingClientRect().top).toBeGreaterThanOrEqual(pill.getBoundingClientRect().bottom);
});

test("a tag beside a name in a measured grid takes the next line instead of narrowing letter by letter", async () => {
  const host = document.createElement("div");
  host.style.width = "420px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Sources" indexed={false} layout="measured">
        <TableHead>
          <TableColumn pinned>Name</TableColumn>
          <TableColumn width="fill">Status</TableColumn>
          <TableColumn>Through</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell pinned>
              <CellLead>
                <CellIcon>
                  <svg aria-hidden />
                </CellIcon>
                <a href="#source">Branch office export, 19–21 Aug</a>
                <Tag detail="silent">Linz branch</Tag>
              </CellLead>
            </TableCell>
            <TableCell>Collecting</TableCell>
            <TableCell>an hour ago, or a little more than that</TableCell>
          </TableRow>
        </TableBody>
      </DataTable>,
    ),
  );
  await frames();
  await frames();
  const tag = document.querySelector<HTMLElement>(".di-tag")!;
  expect(tag.getBoundingClientRect().height).toBeLessThan(40);
  expect(tag.getBoundingClientRect().width).toBeGreaterThan(80);
  expect(tag.getBoundingClientRect().right).toBeLessThanOrEqual(tag.closest("td")!.getBoundingClientRect().right);
  const name = document.querySelector(".di-cell-lead a")!.getBoundingClientRect();
  expect(name.height).toBeLessThan(30);
  if (tag.getBoundingClientRect().top >= name.bottom) {
    expect(Math.abs(tag.getBoundingClientRect().left - name.left)).toBeLessThanOrEqual(1);
  }
});

test("a stacked card's compact tags wrap their name and scope inside the frame instead of cutting them", async () => {
  const host = document.createElement("div");
  host.style.width = "320px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Holders" indexed={false} narrow="stack">
        <TableHead>
          <TableColumn>Subject</TableColumn>
          <TableColumn width="fill">Access</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>CI pipeline</TableCell>
            <TableCell>
              <TagList max={2} moreLabel={(count) => `${count} more`}>
                <Tag detail="Vienna branch office">Administrador del espacio de trabajo</Tag>
                <Tag detail="Production">Lector</Tag>
              </TagList>
            </TableCell>
          </TableRow>
        </TableBody>
      </DataTable>,
    ),
  );
  await frames();
  await frames();
  const card = document.querySelector("tbody tr")!.getBoundingClientRect();
  for (const part of document.querySelectorAll<HTMLElement>(".di-tag-name, .di-tag-detail")) {
    expect(part.checkVisibility()).toBe(true);
    expect(part.scrollWidth).toBeLessThanOrEqual(part.clientWidth + 1);
    expect(part.getBoundingClientRect().right).toBeLessThanOrEqual(card.right);
  }
});

test("a measured grid that turns out to scroll measures again, so the pill beside a pinned filling name is not cut", async () => {
  const host = document.createElement("div");
  host.style.width = "700px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Assets" indexed={false} layout="measured">
        <TableHead>
          <TableColumn pinned width="fill">
            Name
          </TableColumn>
          <TableColumn>Workspace</TableColumn>
          <TableColumn>Owner</TableColumn>
          <TableColumn>Last seen</TableColumn>
          <TableColumn>Last recorded by the AI SOC</TableColumn>
        </TableHead>
        <TableBody>
          {["ws-fin-014", "srv-file-02", "lt-vie-211"].map((name) => (
            <TableRow key={name}>
              <TableCell pinned>
                <CellLead>
                  <a href={`#${name}`}>{name}.corp.example.com</a>
                  <StatusPill tone="recorded" dot={false}>
                    licensed
                  </StatusPill>
                </CellLead>
              </TableCell>
              <TableCell>Production</TableCell>
              <TableCell>Facility services (external)</TableCell>
              <TableCell>Nov 2, 2026, 1:35 AM</TableCell>
              <TableCell>Seen again</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>,
    ),
  );
  await frames();
  await frames();
  expect(document.querySelector(".di-table-wrap")!.classList).toContain("is-overflowing");
  for (const pill of document.querySelectorAll<HTMLElement>(".di-badge")) {
    expect(pill.getBoundingClientRect().right).toBeLessThanOrEqual(pill.closest("td")!.getBoundingClientRect().right);
  }
});

test("a stacked end cell with lines of its own keeps its height; only actions stand on the first line", async () => {
  const host = document.createElement("div");
  host.style.width = "320px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Offers" indexed={false} narrow="stack">
        <TableHead>
          <TableColumn width="fill">Offer</TableColumn>
          <TableColumn align="end">Price</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <CellStack primary="Register retention" secondary="Yearly · 25 seats per unit" />
            </TableCell>
            <TableCell align="end" mono>
              <CellStack
                primary="€9,900.00 per year"
                secondary={["100 × 25 = 2,500 seats", "Total €990,000.00 per year"]}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </DataTable>,
    ),
  );
  await frames();
  const frame = document.querySelector(".di-table-scroll")!;
  const cell = document.querySelector<HTMLElement>("td.is-end")!;
  expect(cell.scrollHeight).toBeLessThanOrEqual(cell.clientHeight);
  expect(frame.scrollHeight).toBeLessThanOrEqual(frame.clientHeight);
  expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth);
});

test("a stacked row's compact tag list wraps, so two tags both read whole on a phone", async () => {
  const host = document.createElement("div");
  host.style.width = "358px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Access" indexed={false} narrow="stack">
        <TableHead>
          <TableColumn>Who</TableColumn>
          <TableColumn width="fill">Access</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Nora Feld</TableCell>
            <TableCell>
              <TagList max={2}>
                <Tag detail="Production">Analyst</Tag>
                <Tag detail="Second branch">Incident responder</Tag>
              </TagList>
            </TableCell>
          </TableRow>
        </TableBody>
      </DataTable>,
    ),
  );
  await frames();
  await frames();
  const parts = [...document.querySelectorAll<HTMLElement>(".di-tag-name, .di-tag-detail")];
  expect(parts).toHaveLength(4);
  for (const part of parts) expect(part.scrollWidth).toBeLessThanOrEqual(part.clientWidth);
  const frame = document.querySelector(".di-table-scroll")!;
  expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth);
});

test("a stacked row leaves out a labelled cell with no value, its label too", () => {
  const host = document.createElement("div");
  host.style.width = "320px";
  document.body.append(host);
  renderLongStatus(host);
  const [empty, filled] = Array.from(document.querySelectorAll<HTMLElement>('td[data-label="Owner"]'));
  expect(getComputedStyle(empty).display).toBe("none");
  expect(getComputedStyle(filled).display).not.toBe("none");
});

test("a long status in a filling column wraps instead of holding the grid wide", async () => {
  const host = document.createElement("div");
  host.style.width = "700px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Sources" indexed={false}>
        <TableHead>
          <TableColumn pinned>Name</TableColumn>
          <TableColumn width="fill">Status</TableColumn>
          <TableColumn>Through</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell pinned>Branch office export</TableCell>
            <TableCell>
              <StatusPill>
                Analysed · 812,440 records · finished Oct 22, 2026, 11:56 PM and kept for as long as the retention says
                it should be kept
              </StatusPill>
            </TableCell>
            <TableCell>an hour ago</TableCell>
          </TableRow>
        </TableBody>
      </DataTable>,
    ),
  );
  await frames();
  const frame = document.querySelector(".di-table-scroll")!;
  expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth);
  const pill = document.querySelector<HTMLElement>(".di-badge")!;
  expect(pill.scrollWidth).toBeLessThanOrEqual(pill.clientWidth);
  expect(document.querySelector<HTMLElement>("td.is-pinned")!.getBoundingClientRect().height).toBeGreaterThan(0);
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

function renderSpans(width: string, layout: "auto" | "measured") {
  const host = document.createElement("div");
  host.style.width = width;
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <DataTable caption="Hosts" indexed={false} layout={layout}>
        <TableHead>
          <TableColumn>Host</TableColumn>
          <TableColumn width="fill">Role</TableColumn>
          <TableColumn>Seen</TableColumn>
          <TableColumn>Owner</TableColumn>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>edge-gw-01</TableCell>
            <TableCell>Gateway</TableCell>
            <TableCell>today</TableCell>
            <TableCell>Nora Feld</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan="all">{"Not seen for 30 days or more ".repeat(8)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>lab-scanner</TableCell>
            <TableCell colSpan={2}>Scanner, retired</TableCell>
            <TableCell>Nora Feld</TableCell>
          </TableRow>
        </TableBody>
      </DataTable>,
    ),
  );
  return host;
}

for (const layout of ["auto", "measured"] as const) {
  test(`a cell spans the columns it is given, and "all" every column, without widening the grid (${layout})`, () => {
    const host = renderSpans("600px", layout);
    const [first, separator, last] = Array.from(host.querySelectorAll("tbody tr"));
    const across = separator.querySelector("td")!;
    expect(separator.querySelectorAll("td").length).toBe(1);
    expect(Math.abs(across.getBoundingClientRect().width - first.getBoundingClientRect().width)).toBeLessThanOrEqual(1);
    const heads = host.querySelectorAll("thead th");
    const two = last.querySelectorAll("td")[1];
    expect(Math.round(two.getBoundingClientRect().left)).toBe(Math.round(heads[1].getBoundingClientRect().left));
    expect(Math.round(two.getBoundingClientRect().right)).toBe(Math.round(heads[2].getBoundingClientRect().right));
    const frame = host.querySelector(".di-table-scroll")!;
    expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth + 1);
  });
}
