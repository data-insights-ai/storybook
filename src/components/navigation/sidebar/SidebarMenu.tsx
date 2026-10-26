import type { ReactNode } from "react";
import "./SidebarMenu.css";

export function SidebarMenu({ children }: { children: ReactNode }) {
  return <ul className="di-sb-menu">{children}</ul>;
}

export function SidebarMenuItem({ children }: { children: ReactNode }) {
  return <li className="di-sb-menu-item">{children}</li>;
}
