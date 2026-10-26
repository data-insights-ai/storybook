import { afterEach, describe, expect, test } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "./styles.css";
import { Menu, MenuItem } from "./components/Menu";

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
