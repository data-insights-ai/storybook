import { useLayoutEffect, useRef, type ReactNode } from "react";
import "./ListToolbar.css";

/**
 * Above a list: the search that narrows it, its filters, and the list's
 * own actions at the end (export, the view). It stays in view under the
 * app bar while the list scrolls, so a filter is never a scroll away;
 * an `InfiniteTable` below keeps its head under it.
 *
 * The `SearchField` grows; each filter is a `Select` with `hideLabel`
 * whose first option names the filter ("All roles"). On a page without
 * tabs the primary action ("New …", "Invite people") belongs in
 * `PageHeaderAside`. In a tab panel it is the tab's own and sits here, in
 * `ListToolbarEnd`; the panel has no heading of its own, only an optional
 * `ListToolbarNote` under the row.
 * Search and filters are state the reader shares by link: keep them in the
 * URL.
 */
export function ListToolbar({
  label,
  sticky = true,
  children,
}: {
  /** Names the toolbar for assistive technology, e.g. "Filter members". */
  label: string;
  sticky?: boolean;
  /** A `SearchField`, filters, and optionally `ListToolbarEnd`. */
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent || !sticky) return;
    const set = () => parent.style.setProperty("--di-list-toolbar-h", `${el.offsetHeight}px`);
    set();
    const observer = new ResizeObserver(set);
    observer.observe(el);
    return () => {
      observer.disconnect();
      parent.style.removeProperty("--di-list-toolbar-h");
    };
  }, [sticky]);

  return (
    <div ref={ref} className="di-list-toolbar" data-sticky={sticky} role="search" aria-label={label}>
      {children}
    </div>
  );
}

/** The toolbar's trailing actions on the list as a whole: export, a view switch. */
export function ListToolbarEnd({ children }: { children: ReactNode }) {
  return <div className="di-list-toolbar-end">{children}</div>;
}

/** One muted line under a tab panel's toolbar: what this tab holds. */
export function ListToolbarNote({ children }: { children: ReactNode }) {
  return <p className="di-list-toolbar-note">{children}</p>;
}
