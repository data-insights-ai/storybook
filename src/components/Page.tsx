import type { ReactNode } from "react";
import "./Page.css";

/**
 * One console page: its header, then what the page holds, in the console
 * rhythm. `width` is what the page holds, not how wide it should look:
 * a `form` reads down one column, a `detail` record holds sections of facts
 * and forms, a `list` uses the whole frame because a table needs it.
 *
 * Header to content is `--di-rhythm-header`, section to section
 * `--di-rhythm-section`. The blocks inside carry no margin of their own.
 */
export function Page({
  width = "list",
  children,
}: {
  /** `list` is the whole frame, `detail` a record with sections, `form` one column. */
  width?: "list" | "detail" | "form";
  /** `PageHeader`, then the page's blocks: a toolbar and a list, or sections. */
  children: ReactNode;
}) {
  return (
    <div className="di-page" data-width={width}>
      {children}
    </div>
  );
}
