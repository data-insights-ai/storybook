import { useState } from "react";
import { cx } from "../../../internal/cx";
import "./Breadcrumb.css";

type Crumb = { label: string; href?: string };

/**
 * Where the reader is: the page's place in the app, from the top to the
 * page itself, on one line.
 *
 * - **Use it** at the start of `AppShellBar`, where it doubles as the page
 *   name, or above a record's title when the record sits deep in a tree.
 * - **Not** for steps of a process (`Steps`), for the sections of a record
 *   (`TabNav`), or as the only way back up (the `Sidebar` is that).
 *
 * Anatomy: the ancestors, each a link when it has an `href`, separated by
 * "/", then the current page, which is never a link. Content: page names as
 * the sidebar and the page title write them; an id stays as the system
 * writes it.
 *
 * It never wraps. The current page keeps its room and truncates last with
 * an ellipsis; the ancestors give way first. With `collapseLabel`, a path
 * longer than `maxItems` folds its middle into one "…" button that shows
 * the rest. On a phone (600px and below) only the current page shows: the
 * drawer is the way back up, and the bar has one row.
 *
 * Accessibility: a `nav` named by `label` holding an ordered list; the
 * current page has `aria-current="page"`; the separators are hidden from
 * screen readers.
 */
export function Breadcrumb({
  label,
  items,
  maxItems = 4,
  collapseLabel,
  className,
}: {
  /** Names the trail, e.g. "Breadcrumb" or "Pfad". */
  label: string;
  items: Crumb[];
  /** The longest path shown whole when `collapseLabel` is set. */
  maxItems?: number;
  /** The "…" button's name, e.g. "Show the full path". Without it the path is never folded. */
  collapseLabel?: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const fold = collapseLabel !== undefined && !expanded && items.length > maxItems && maxItems >= 2;
  const shown: (Crumb | "fold")[] = fold ? [items[0], "fold", ...items.slice(items.length - (maxItems - 1))] : items;

  return (
    <nav aria-label={label} className={cx("di-breadcrumb", className)}>
      <ol className="di-breadcrumb-list">
        {shown.map((item, i) => {
          const last = i === shown.length - 1;
          const sep =
            i > 0 ? (
              <span className="di-breadcrumb-sep" aria-hidden>
                /
              </span>
            ) : null;
          if (item === "fold") {
            return (
              <li key="fold" className="di-breadcrumb-item">
                {sep}
                <button
                  type="button"
                  className="di-breadcrumb-link di-breadcrumb-fold"
                  aria-label={collapseLabel}
                  onClick={() => setExpanded(true)}
                >
                  …
                </button>
              </li>
            );
          }
          return (
            <li key={`${i}-${item.label}`} className={cx("di-breadcrumb-item", last && "is-current")}>
              {sep}
              {last ? (
                <span className="di-breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a className="di-breadcrumb-link" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span className="di-breadcrumb-text">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
