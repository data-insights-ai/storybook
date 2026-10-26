import { afterEach, describe, expect, test } from "vitest";
import { page } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../styles.css";
import { AppShellContent } from "./shell/AppShell";
import { Page, PageAside } from "./Page";
import { PageHeader, PageHeaderTitle } from "./Heading";
import { Grid } from "./Layout";

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

    test(`at ${width}px a record keeps its measure and its aside stands beside it`, async () => {
      await page.viewport(width, 1080);
      const host = record();
      const section = box(host.querySelector(".section"));
      const aside = box(host.querySelector(".aside"));
      expect(aside.left).toBeGreaterThan(section.right);
      expect(Math.abs(aside.top - section.top)).toBeLessThan(2);
      expect(section.width).toBeLessThanOrEqual(width >= 2560 ? 1360 : 1200);
    });
  }

  test("at 2560px a list of few columns stops at the list measure, a wide one uses the frame", async () => {
    await page.viewport(2560, 1440);
    const list = (n: number) =>
      show(
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
          </Page>
        </AppShellContent>,
      );
    expect(box(list(3).querySelector(".di-page")).width).toBe(1600);
    document.body.replaceChildren();
    expect(box(list(9).querySelector(".di-page")).width).toBe(2560 - 96);
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
  test("at 1440px a record's aside follows its sections", async () => {
    await page.viewport(1440, 900);
    const host = record();
    expect(box(host.querySelector(".aside")).top).toBeGreaterThan(box(host.querySelector(".section")).bottom);
  });

  test("at 390px a dashboard is one column and nothing scrolls sideways", async () => {
    await page.viewport(390, 844);
    const host = dashboard();
    expect(columns(host)).toBe(1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(390);
  });
});
