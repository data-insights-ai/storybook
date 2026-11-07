import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../../styles/styles.css";
import { Disclosure, DisclosureLead, DisclosureMeta } from "./Disclosure";

let root: Root | undefined;

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

test("a long value inside a folded disclosure does not widen what holds it", () => {
  const host = document.createElement("div");
  host.style.width = "300px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <Disclosure title="Technical details">
        <div style={{ display: "flex" }}>
          <span style={{ whiteSpace: "nowrap" }}>
            an-identifier-far-longer-than-the-disclosure-that-holds-it-and-the-page
          </span>
        </div>
      </Disclosure>,
    ),
  );
  const held = host.querySelector(".di-disclosure")!.getBoundingClientRect().right;
  const clip = host.querySelector(".di-disclosure-clip")!.getBoundingClientRect().right;
  expect(clip).toBeLessThanOrEqual(held + 8);
});

test("on a phone a chevron group's meta goes under its lead", async () => {
  await page.viewport(390, 844);
  const host = document.createElement("div");
  host.style.width = "340px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <Disclosure toggleLabel="Show the setup">
        <DisclosureMeta>Template or script</DisclosureMeta>
        <DisclosureLead>Set up the directory once</DisclosureLead>
        <p>Body</p>
      </Disclosure>,
    ),
  );
  const lead = host.querySelector(".di-disclosure-lead")!.getBoundingClientRect();
  const meta = host.querySelector(".di-disclosure-meta")!.getBoundingClientRect();
  const toggle = host.querySelector(".di-disclosure-toggle")!.getBoundingClientRect();
  expect(meta.top).toBeGreaterThanOrEqual(lead.bottom);
  expect(toggle.top).toBeLessThan(lead.bottom);
});
