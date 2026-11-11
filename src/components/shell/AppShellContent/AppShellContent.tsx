import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { takeSlot } from "../../../internal/slots";
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
 *
 * An `AppShellFooter` closes every page, wherever it is written.
 */
export function AppShellContent({ width = "full", children }: { width?: "contained" | "full"; children: ReactNode }) {
  const [footer, page] = takeSlot(children, AppShellFooter);
  return (
    <main id="di-content" className={cx("di-content", width === "contained" && "is-contained")} tabIndex={-1}>
      {page}
      {footer}
    </main>
  );
}

/**
 * What closes every page of the app, under its content: `note` says where
 * the data comes from or whose it is, the children are the links every page
 * carries (a `LinkRow` with `size="sm"`). Set apart by space and one fine
 * rule, in the hint size, so it never competes with the page.
 */
export function AppShellFooter({ note, children }: { note?: string; children?: ReactNode }) {
  return (
    <footer className="di-content-footer">
      {note ? <p className="di-content-footer-note">{note}</p> : null}
      {children}
    </footer>
  );
}
