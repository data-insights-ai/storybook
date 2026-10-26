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
