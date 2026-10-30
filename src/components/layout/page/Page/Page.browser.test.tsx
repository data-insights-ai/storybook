import { afterEach, describe, expect, test } from "vitest";
import { page } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../../styles/styles.css";
import { AppShellContent } from "../../../shell/AppShell";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../../data/table/DataTable";
import { ListToolbar } from "../../../data/table/ListToolbar";
import { Sheet } from "../../../overlays/Sheet";
import { Page, PageAside } from "./Page";
import { PageHeader, PageHeaderTitle } from "../PageHeader";
import { Grid } from "../../arrangement/Grid";
import { CreateFlow } from "../../../overlays/CreateFlow";
import { ChoiceCards } from "../../../forms/choice/ChoiceCards";
import { TextField } from "../../../forms/text/TextField";

let root: Root | undefined;

function show(node: React.ReactNode) {
  const host = document.createElement("div");
  host.style.display = "flex";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() => root!.render(node));
  return host;
}

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

const box = (el: Element | null) => el!.getBoundingClientRect();

function dashboard() {
  return show(
    <AppShellContent>
      <Grid min="240px">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="tile">
            {i}
          </div>
        ))}
      </Grid>
    </AppShellContent>,
  );
}

function record() {
  return show(
    <AppShellContent>
      <Page width="detail">
        <PageHeader>
          <PageHeaderTitle>Case 4</PageHeaderTitle>
        </PageHeader>
        <section className="section">Story</section>
        <PageAside label="Triage">
          <section className="aside">Triage</section>
        </PageAside>
      </Page>
    </AppShellContent>,
  );
}

function list(n: number, rail?: boolean) {
  return show(
    <AppShellContent>
      <Page>
        <table className="di-table">
          <thead>
            <tr>
              {Array.from({ length: n }, (_, i) => (
                <th key={i}>{i}</th>
              ))}
            </tr>
          </thead>
        </table>
        {rail !== undefined && (
          <Sheet open={rail} onClose={() => {}} title="Linz branch" closeLabel="Close">
            <section className="rail">Collector</section>
          </Sheet>
        )}
      </Page>
    </AppShellContent>,
  );
}

const columns = (host: Element) => new Set([...host.querySelectorAll(".tile")].map((t) => Math.round(box(t).left))).size;

describe("large screens", () => {
  for (const [width, pad] of [
    [1920, 32],
    [2560, 48],
    [3440, 48],
  ] as const) {
    test(`at ${width}px a page follows the window with a ${pad}px frame`, async () => {
      await page.viewport(width, 1080);
      const host = dashboard();
      const content = host.querySelector(".di-content")!;
      expect(Math.round(box(content).width)).toBe(width);
      expect(getComputedStyle(content).paddingLeft).toBe(`${pad}px`);
    });

    test(`at ${width}px a dashboard adds columns`, async () => {
      await page.viewport(width, 1080);
      const host = dashboard();
      for (const tile of host.querySelectorAll(".tile")) expect(box(tile).width).toBeLessThanOrEqual(480);
      expect(columns(host)).toBeGreaterThanOrEqual(width >= 2560 ? 8 : 6);
    });

    test(`at ${width}px a record's aside stands in the side column`, async () => {
      await page.viewport(width, 1080);
      const host = record();
      const section = box(host.querySelector(".section"));
      const aside = box(host.querySelector(".aside"));
      expect(aside.left).toBeGreaterThan(section.right);
      expect(aside.width).toBe(320);
      expect(Math.round(section.width)).toBe(width - 2 * pad - 320 - 24);
    });

    test(`at ${width}px a list keeps the side column free, however few its columns`, async () => {
      await page.viewport(width, 1080);
      const host = list(3, false);
      expect(host.querySelector(".di-sheet-docked")).toBeNull();
      expect(Math.round(box(host.querySelector(".di-table")).width)).toBe(width - 2 * pad - 320 - 24);
    });
  }

  test("at 1920px an open row stands beside the list at the rail's width", async () => {
    await page.viewport(1920, 1080);
    const host = list(3, true);
    const table = box(host.querySelector(".di-table"));
    const rail = box(host.querySelector(".di-sheet-docked"));
    expect(rail.width).toBe(320);
    expect(rail.left).toBeGreaterThan(table.right);
    expect(Math.round(rail.right)).toBe(1920 - 32);
    expect(host.querySelector("dialog")).toBeNull();
  });

  test("at 1920px the side column starts level with the content, below the header", async () => {
    await page.viewport(1920, 1080);
    const host = show(
      <AppShellContent>
        <Page>
          <PageHeader lede="Where the collectors run.">
            <PageHeaderTitle>Sites</PageHeaderTitle>
          </PageHeader>
          <table className="di-table">
            <thead>
              <tr>
                <th>Site</th>
              </tr>
            </thead>
          </table>
          <Sheet open onClose={() => {}} title="Linz branch" closeLabel="Close">
            <section>Collector</section>
          </Sheet>
        </Page>
      </AppShellContent>,
    );
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const table = box(host.querySelector(".di-table"));
    const sheet = box(host.querySelector(".di-sheet-docked"));
    expect(Math.round(sheet.top)).toBe(Math.round(table.top));
  });

  test("at 1920px on a list the side column starts level with the table, below its filters", async () => {
    await page.viewport(1920, 1080);
    const host = show(
      <AppShellContent>
        <Page>
          <PageHeader lede="Hosts and accounts.">
            <PageHeaderTitle>Assets</PageHeaderTitle>
          </PageHeader>
          <ListToolbar label="Filter assets">
            <button type="button">Views</button>
          </ListToolbar>
          <DataTable caption="Assets">
            <TableHead>
              <TableColumn>Name</TableColumn>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>srv-dc-01</TableCell>
              </TableRow>
            </TableBody>
          </DataTable>
          <Sheet open onClose={() => {}} title="Saved views" closeLabel="Close">
            <section>None yet</section>
          </Sheet>
        </Page>
      </AppShellContent>,
    );
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const table = box(host.querySelector(".di-table-wrap"));
    const sheet = box(host.querySelector(".di-sheet-docked"));
    expect(Math.round(sheet.top)).toBe(Math.round(table.top));
  });

  test("at 1920px a wide sheet still covers the page: a table does not fit the column", async () => {
    await page.viewport(1920, 1080);
    const host = show(
      <AppShellContent>
        <Page>
          <section className="section">Feeds</section>
          <Sheet open onClose={() => {}} title="Indicators" closeLabel="Close" size="lg">
            <section>Table</section>
          </Sheet>
        </Page>
      </AppShellContent>,
    );
    expect(host.querySelector(".di-sheet-docked")).toBeNull();
    expect(host.querySelector<HTMLDialogElement>("dialog.di-sheet")!.open).toBe(true);
  });

  test("at 2560px an overview takes the whole frame", async () => {
    await page.viewport(2560, 1440);
    const host = show(
      <AppShellContent>
        <Page width="full">
          <section className="section">Figures</section>
        </Page>
      </AppShellContent>,
    );
    expect(box(host.querySelector(".section")).width).toBe(2560 - 96);
  });

  test("at 1920px a create flow's step is a panel whose cards fill it, while a lone field keeps the form measure", async () => {
    await page.viewport(1920, 1080);
    const host = show(
      <AppShellContent>
        <Page width="detail">
          <CreateFlow
            label="Steps"
            steps={["Type", "Details"]}
            step={0}
            stateLabels={{ done: "done", current: "current", upcoming: "upcoming" }}
            backLabel="Back"
            nextLabel="Next"
            submitLabel="Create"
            width="page"
            onBack={() => {}}
            onNext={() => {}}
            onSubmit={() => {}}
          >
            <ChoiceCards
              name="kind"
              legend="Type"
              options={["a", "b", "c", "d", "e", "f"].map((v) => ({ value: v, label: v }))}
              value="a"
              onChange={() => {}}
            />
            <TextField id="flow-name" label="Name" value="" onChange={() => {}} />
          </CreateFlow>
        </Page>
      </AppShellContent>,
    );
    const panel = box(host.querySelector(".di-create-flow-panel"));
    expect(Math.round(panel.width)).toBe(1920 - 64 - 320 - 24);
    expect(new Set([...host.querySelectorAll(".di-choicecard")].map((c) => Math.round(box(c).top))).size).toBe(2);
    expect(box(host.querySelector(".di-field")).width).toBeLessThanOrEqual(800);
  });

  test("at 2560px a chart is taller than at 1440px", async () => {
    await page.viewport(1440, 900);
    const at1440 = getComputedStyle(document.documentElement).getPropertyValue("--di-chart-height").trim();
    await page.viewport(2560, 1440);
    const at2560 = getComputedStyle(document.documentElement).getPropertyValue("--di-chart-height").trim();
    expect([at1440, at2560]).toEqual(["240px", "360px"]);
  });
});

describe("regressions below", () => {
  test("at 1280px a record's aside follows its sections", async () => {
    await page.viewport(1280, 900);
    const host = record();
    expect(box(host.querySelector(".aside")).top).toBeGreaterThan(box(host.querySelector(".section")).bottom);
  });

  test("at 1280px a list takes the whole width: the page is too narrow for the side column", async () => {
    await page.viewport(1280, 900);
    expect(box(list(3, false).querySelector(".di-table")).width).toBe(1280 - 48);
  });

  test("at 1024px an open row is a sheet over the list", async () => {
    await page.viewport(1024, 768);
    const host = list(3, true);
    expect(host.querySelector(".di-sheet-docked")).toBeNull();
    expect(host.querySelector<HTMLDialogElement>("dialog.di-sheet")!.open).toBe(true);
    expect(box(host.querySelector(".di-table")).width).toBe(1024 - 48);
  });

  test("at 390px a dashboard is one column and nothing scrolls sideways", async () => {
    await page.viewport(390, 844);
    const host = dashboard();
    expect(columns(host)).toBe(1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(390);
  });
});
