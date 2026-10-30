import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import "./AppShellContent.css";

/**
 * The page inside the app frame, below the `AppShellBar`. The skip link lands here.
 *
 * - **Use it** once per screen, as the last child of `SidebarInset`. Its direct
 *   children (`PageHeader`, a `Notice`, a `Panel`, a table) are spaced 24px apart.
 * - **Not** for a page outside the frame (an error route, the sign-in): a `Page`
 *   keeps the same frame on its own.
 *
 * `full` (the default) follows the window: lists, registers, dashboards and charts
 * use every column they are given, and `Page` keeps a record or a form at its
 * measure. `contained` stops widening at 1440px.
 */
export function AppShellContent({ width = "full", children }: { width?: "contained" | "full"; children: ReactNode }) {
  return (
    <main id="di-content" className={cx("di-content", width === "contained" && "is-contained")} tabIndex={-1}>
      {children}
    </main>
  );
}
