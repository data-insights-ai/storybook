import { Children, isValidElement, type ReactNode } from "react";
import { PageHeader } from "./Heading";
import "./Page.css";

/**
 * One console page: its header, then what the page holds, in the console
 * rhythm. `width` is what the page holds, not how wide it should look:
 * a `form` reads down one column, a `detail` record holds sections of facts
 * and forms, a `list` uses the whole frame because a table needs it.
 *
 * Header to content is `--di-rhythm-header`, section to section
 * `--di-rhythm-section`. The blocks inside carry no margin of their own.
 *
 * A `PageAside` holds what accompanies the record (triage, related items,
 * the next steps). From 1920px it stands beside the page's sections;
 * narrower, it follows them.
 */
export function Page({
  width = "list",
  children,
}: {
  /** `list` is the whole frame, `detail` a record with sections, `form` one column. */
  width?: "list" | "detail" | "form";
  /** `PageHeader`, then the page's blocks: a toolbar and a list, or sections; optionally one `PageAside`. */
  children: ReactNode;
}) {
  /*
   * With an aside the sections are wrapped, so they stack in one column
   * beside it, and the header and the aside are picked out of `children`
   * by type. Without one the page keeps its single flow.
   */
  const head: ReactNode[] = [];
  const aside: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === PageAside) aside.push(child);
    else if (isValidElement(child) && child.type === PageHeader) head.push(child);
    else body.push(child);
  });
  if (aside.length === 0) {
    return (
      <div className="di-page" data-width={width}>
        {children}
      </div>
    );
  }
  return (
    <div className="di-page" data-width={width} data-aside="">
      {head}
      <div className="di-page-body">{body}</div>
      {aside}
    </div>
  );
}

/** What accompanies the record: beside its sections from 1920px, after them below. */
export function PageAside({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="di-page-aside" aria-label={label}>
      {children}
    </aside>
  );
}
