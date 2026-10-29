import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { page } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { House } from "lucide-react";
import "../../../styles.css";
import { Sidebar } from "./Sidebar";
import { SidebarFooter } from "./SidebarSections";
import { SidebarMenu, SidebarMenuItem } from "./SidebarMenu";
import { SidebarMenuButton } from "./SidebarMenuButton";
import { SidebarProvider } from "./SidebarProvider";
import { SidebarThemeChoice } from "./SidebarThemeChoice";

let root: Root | undefined;

beforeEach(async () => {
  await page.viewport(1440, 900);
});

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

function renderSidebar(expanded: boolean) {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <SidebarProvider expanded={expanded} onExpandedChange={() => {}}>
        <Sidebar label="Navigation" closeLabel="Close">
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton label="Home" href="#">
                  <House />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarThemeChoice value="auto" onChange={() => {}} />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>,
    ),
  );
  return [...host.querySelectorAll<HTMLElement>(".di-sb-button")].map((button) => {
    const box = button.getBoundingClientRect();
    const icon = button.querySelector(".di-sb-icon")!.getBoundingClientRect();
    return { width: box.width, iconCentre: icon.left + icon.width / 2 };
  });
}

describe("sidebar items", () => {
  test.each([true, false])("an item that opens a menu is as wide as the others (expanded %s)", (expanded) => {
    const [link, menu] = renderSidebar(expanded);
    expect(menu.width).toBe(link.width);
  });

  test("the collapsed rail centres every icon on one axis, the theme menu's too", () => {
    const [link, menu] = renderSidebar(false);
    expect(menu.iconCentre).toBeCloseTo(link.iconCentre, 0);
  });
});

// An item is shown when a pointer over its middle reaches it: nothing clips or covers it.
function reachable(item: Element) {
  const at = item.getBoundingClientRect();
  return item.contains(document.elementFromPoint(at.left + at.width / 2, at.top + at.height / 2));
}

async function openThemeMenu(expanded: boolean) {
  renderSidebar(expanded);
  const trigger = document.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')!;
  trigger.click();
  await new Promise((done) => requestAnimationFrame(done));
  const menu = document.querySelector('[role="menu"]')!;
  return {
    trigger: trigger.getBoundingClientRect(),
    menu: menu.getBoundingClientRect(),
    sidebar: document.querySelector(".di-sb")!.getBoundingClientRect(),
    items: [...menu.querySelectorAll('[role="menuitemradio"]')],
  };
}

describe("the theme menu in the sidebar's footer", () => {
  test("in the collapsed rail it opens beside the item, whole and on screen", async () => {
    const { trigger, menu, sidebar, items } = await openThemeMenu(false);
    expect(menu.left).toBeGreaterThanOrEqual(trigger.right);
    expect(menu.right).toBeGreaterThan(sidebar.right);
    expect(menu.bottom).toBeLessThanOrEqual(window.innerHeight);
    expect(items).toHaveLength(3);
    expect(items.every(reachable)).toBe(true);
  });

  test("in the expanded sidebar it opens above the item at the footer, whole and on screen", async () => {
    const { trigger, menu, items } = await openThemeMenu(true);
    expect(menu.bottom).toBeLessThanOrEqual(trigger.top);
    expect(menu.top).toBeGreaterThanOrEqual(0);
    expect(items.every(reachable)).toBe(true);
  });
});
