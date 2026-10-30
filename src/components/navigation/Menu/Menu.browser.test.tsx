import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../styles/styles.css";
import { Menu, MenuItem } from "./Menu";

let root: Root | undefined;

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

function openMenuAt(edge: "top" | "bottom") {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "16px";
  host.style[edge] = "8px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <Menu open onOpenChange={() => {}} label="Theme" align="start" trigger={(props) => <button {...props}>Theme</button>}>
        <MenuItem onSelect={() => {}}>Auto</MenuItem>
        <MenuItem onSelect={() => {}}>Light</MenuItem>
        <MenuItem onSelect={() => {}}>Dark</MenuItem>
      </Menu>,
    ),
  );
  return {
    trigger: host.querySelector("button")!.getBoundingClientRect(),
    menu: host.querySelector('[role="menu"]')!.getBoundingClientRect(),
  };
}

describe("menu placement", () => {
  test("opens below a trigger with room beneath", () => {
    const { trigger, menu } = openMenuAt("top");
    expect(menu.top).toBeGreaterThanOrEqual(trigger.bottom);
  });

  test("opens above a trigger at the viewport's bottom and stays on screen", () => {
    const { trigger, menu } = openMenuAt("bottom");
    expect(menu.bottom).toBeLessThanOrEqual(trigger.top);
    expect(menu.top).toBeGreaterThanOrEqual(0);
    expect(menu.bottom).toBeLessThanOrEqual(window.innerHeight);
  });
});

// An item is shown when a pointer over its middle reaches it: nothing clips or covers it.
function reachable(item: Element) {
  const at = item.getBoundingClientRect();
  return item.contains(document.elementFromPoint(at.left + at.width / 2, at.top + at.height / 2));
}

function openMenuIn(frame: HTMLElement) {
  document.body.append(frame);
  const host = document.createElement("div");
  frame.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <Menu open onOpenChange={() => {}} label="Actions" trigger={(props) => <button {...props}>Actions</button>}>
        <MenuItem onSelect={() => {}}>Rename</MenuItem>
        <MenuItem onSelect={() => {}}>Archive</MenuItem>
        <MenuItem onSelect={() => {}}>Delete</MenuItem>
      </Menu>,
    ),
  );
  return {
    trigger: host.querySelector("button")!.getBoundingClientRect(),
    menu: host.querySelector('[role="menu"]')!.getBoundingClientRect(),
    items: [...host.querySelectorAll('[role="menuitem"]')],
  };
}

describe("menu inside what clips or contains it", () => {
  beforeEach(async () => {
    await page.viewport(1280, 800);
  });

  test("a table's frame, which clips its overflow, does not cut the menu off", () => {
    const frame = document.createElement("div");
    frame.className = "di-table-wrap";
    frame.style.cssText = "margin: 40px; height: 36px; width: 120px";
    const { trigger, menu, items } = openMenuIn(frame);
    expect(menu.top).toBeGreaterThanOrEqual(trigger.bottom);
    expect(items.every(reachable)).toBe(true);
  });

  test("an ancestor that transforms and contains its layout still has the menu at the trigger", () => {
    const frame = document.createElement("div");
    frame.style.cssText = "margin: 60px 0 0 300px; width: 200px; container-type: inline-size; transform: translateX(30px); overflow: hidden; height: 30px";
    const { trigger, menu, items } = openMenuIn(frame);
    const box = frame.getBoundingClientRect();
    expect(Math.abs(menu.top - (trigger.bottom + 4))).toBeLessThanOrEqual(5);
    expect(menu.left).toBeGreaterThanOrEqual(box.left);
    expect(menu.right).toBeLessThanOrEqual(box.right);
    expect(items.every(reachable)).toBe(true);
  });
});

describe("menu keys", () => {
  test("a letter jumps to the next item that starts with it, wrapping", async () => {
    openMenuAt("top");
    const item = (name: string) => Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find((el) => el.textContent === name);
    item("Auto")!.focus();
    await userEvent.keyboard("d");
    expect(document.activeElement).toBe(item("Dark"));
    await userEvent.keyboard("l");
    expect(document.activeElement).toBe(item("Light"));
    await userEvent.keyboard("a");
    expect(document.activeElement).toBe(item("Auto"));
  });
});
