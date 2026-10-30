import type { ReactNode } from "react";
import "./SidebarMenu.css";

/**
 * A list of sidebar items, each a `SidebarMenuItem`.
 */
export function SidebarMenu({ children }: { children: ReactNode }) {
  return <ul className="di-sb-menu">{children}</ul>;
}

/**
 * One entry in a `SidebarMenu`, holding a `SidebarMenuButton`.
 */
export function SidebarMenuItem({ children }: { children: ReactNode }) {
  return <li className="di-sb-menu-item">{children}</li>;
}
