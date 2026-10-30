import type { ReactNode } from "react";
import "../Sidebar.css";

/**
 * The column beside the sidebar: the bar over the page. A plain box, so the
 * one `main` landmark is `AppShellContent` inside it.
 */
export function SidebarInset({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div id={id} className="di-sb-inset">
      {children}
    </div>
  );
}
