import { afterEach, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { composeStories } from "@storybook/react-vite";
import "../../../../styles/styles.css";
import * as stories from "./Pagination.stories";

const { UnderATable } = composeStories(stories);

let root: Root | undefined;
afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

/*
 * A story's play clicks with synthetic events, which Chromium treats like a
 * keyboard and so shows the focus ring. A real pointer press is checked
 * here: the page it chose is a filled cell, with no focus ring around it.
 */
test("a page chosen with the pointer is filled, not ringed", async () => {
  await page.viewport(1280, 720);
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  flushSync(() => root!.render(<UnderATable />));
  await userEvent.click(page.getByRole("button", { name: "Page 37" }));
  await Promise.all(document.getAnimations().map((motion) => motion.finished));
  const chosen = document.querySelector<HTMLElement>('[aria-current="page"]')!;
  expect(chosen.textContent).toBe("37");
  expect(chosen.matches(":focus-visible")).toBe(false);
  const look = getComputedStyle(chosen);
  expect(look.outlineStyle === "none" || look.outlineWidth === "0px").toBe(true);
  expect(look.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
});
