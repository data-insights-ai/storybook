import { afterEach, expect, test } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../../styles/styles.css";
import { Split, SplitAside, SplitLead, SplitMain } from "./Split";

let root: Root | undefined;

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

function renderRail(width: string) {
  const host = document.createElement("div");
  host.style.width = width;
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <Split asideFirst>
        <SplitMain>
          <p>The record</p>
        </SplitMain>
        <SplitAside label="Decisions">
          <p>The decisions</p>
        </SplitAside>
      </Split>,
    ),
  );
  return {
    main: document.querySelector(".di-split-main")!.getBoundingClientRect(),
    aside: document.querySelector(".di-split-aside")!.getBoundingClientRect(),
  };
}

test("the rail stands beside the main column once the split itself leaves that column 40rem, whatever the window", () => {
  const { main, aside } = renderRail("1000px");
  expect(main.width).toBeGreaterThanOrEqual(640);
  expect(aside.left).toBeGreaterThanOrEqual(main.right);
  expect(aside.top).toBe(main.top);
});

function renderLed(width: string) {
  const host = document.createElement("div");
  host.style.width = width;
  // Below the sticky offset, so the rail stands where the grid puts it.
  host.style.marginTop = "100px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <Split asideFirst>
        <SplitLead>
          <p>The verdict</p>
        </SplitLead>
        <SplitMain>
          <p>The record</p>
        </SplitMain>
        <SplitAside label="Facts">
          <p>The facts</p>
        </SplitAside>
      </Split>,
    ),
  );
  const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
  return { lead: box(".di-split-lead"), main: box(".di-split-main"), aside: box(".di-split-aside") };
}

test("a lead heads the main column and the rail stands beside both from the top", () => {
  const { lead, main, aside } = renderLed("1000px");
  expect(lead.bottom).toBeLessThanOrEqual(main.top);
  expect(lead.left).toBe(main.left);
  expect(aside.left).toBeGreaterThanOrEqual(lead.right);
  expect(aside.top).toBe(lead.top);
});

test("on a narrow split the lead comes first, then an asideFirst rail, then the main column", () => {
  const { lead, main, aside } = renderLed("390px");
  expect(lead.bottom).toBeLessThanOrEqual(aside.top);
  expect(aside.bottom).toBeLessThanOrEqual(main.top);
});

test("a split too narrow for 40rem beside the rail puts the rail first, above the main column", () => {
  const { main, aside } = renderRail("900px");
  expect(aside.bottom).toBeLessThanOrEqual(main.top);
  expect(main.width).toBe(900);
});
