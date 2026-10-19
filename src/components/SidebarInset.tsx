import type { ReactNode } from "react";
import "./Sidebar.css";

export function SidebarInset({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <main id={id} className="di-sb-inset" tabIndex={-1}>
      {children}
    </main>
  );
}
