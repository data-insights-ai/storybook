import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { SkipLink } from "../SkipLink";
import "./AppShell.css";

/**
 * Rail, topbar, workpane, full-bleed: the shell a product renders.
 *
 * The rail sits on paper a step below the ground (navy after dark), and it
 * is fixed on desktop. A caller can opt into compact mobile navigation
 * through `AppShellRail.mobileNavigation`, supplying its translated labels.
 *
 * Every part is a slot: `AppShellRail` (with `AppShellFoot` inside it),
 * then `AppShellMain` holding `AppShellBar` and `AppShellContent`. The
 * shell draws no copy of its own; what the bar says is the product's.
 */
export function AppShell({ skipLabel, children }: { skipLabel: string; children: ReactNode }) {
  return (
    <div className="di-shell">
      <SkipLink label={skipLabel} />
      {children}
    </div>
  );
}

/** The column beside the rail: the bar over the content. */
export function AppShellMain({ children }: { children: ReactNode }) {
  return <div className="di-main">{children}</div>;
}

/**
 * The page. The skip link lands here.
 *
 * `full` (the default) follows the window: lists, registers, dashboards and
 * charts use every column they are given, and `Page` keeps a record or a form
 * at its measure. `contained` stops widening at 1440px.
 */
export function AppShellContent({ width = "full", children }: { width?: "contained" | "full"; children: ReactNode }) {
  return (
    <main id="di-content" className={cx("di-content", width === "contained" && "is-contained")} tabIndex={-1}>
      {children}
    </main>
  );
}
