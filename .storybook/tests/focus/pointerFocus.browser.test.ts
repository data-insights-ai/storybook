import { createElement, type ComponentType } from "react";
import { afterEach, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { composeStories } from "@storybook/react-vite";
import "../../../src/styles/styles.css";
import * as disclosure from "../../../src/components/layout/arrange/Disclosure/Disclosure.stories";
import * as proposal from "../../../src/components/records/ProposalPanel/ProposalPanel.stories";
import * as tooltip from "../../../src/components/overlays/Tooltip/Tooltip.stories";

/*
 * A pointer click focuses a control without a ring; Tab to the same control
 * shows it. A play function's click is a script event, which Chromium answers
 * with :focus-visible, so the story projects cannot tell the two apart: this
 * test clicks with the real pointer.
 */
let root: Root | undefined;
afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

const frame = () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));

/** Every element from the target up to the host, and their ::before, that paints an outline. */
function rings(target: Element, host: Element) {
  const found: string[] = [];
  for (let el: Element | null = target; el && el !== host; el = el.parentElement) {
    for (const pseudo of [null, "::before", "::after"]) {
      const style = getComputedStyle(el, pseudo);
      if (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0)
        found.push(`${el.className || el.tagName}${pseudo ?? ""}`);
    }
  }
  return found;
}

const cases: Array<[string, ComponentType, (host: HTMLElement) => HTMLElement]> = [
  [
    "Disclosure head",
    composeStories(disclosure).AttackPhases,
    (host) => host.querySelectorAll<HTMLElement>("button.di-disclosure-head")[2],
  ],
  [
    "ProposalPanel why",
    composeStories(proposal).FoldedAtFirst,
    (host) => host.querySelector<HTMLElement>(".di-proposal-why button")!,
  ],
  [
    "Tooltip icon button",
    composeStories(tooltip).OnAnIconButton,
    (host) => host.querySelectorAll<HTMLElement>("button")[1],
  ],
];

test.each(cases)("%s: a pointer click leaves no ring, Tab does", async (_, Story, find) => {
  await page.viewport(1280, 800);
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  flushSync(() => root!.render(createElement(Story)));
  await frame();
  const target = find(host);
  await userEvent.click(target);
  await frame();
  expect(document.activeElement).toBe(target);
  expect(rings(target, host)).toEqual([]);

  await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
  await userEvent.keyboard("{Tab}");
  await frame();
  expect(document.activeElement).toBe(target);
  expect(rings(target, host).length).toBeGreaterThan(0);
});
