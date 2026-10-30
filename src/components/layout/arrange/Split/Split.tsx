import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import "./Split.css";

/**
 * Two panes side by side: what is read, and what stays beside it.
 *
 * - `rail` (the default): a record read beside the decisions about it. The
 *   story in `SplitMain`, a narrower `SplitAside` that keeps the controls
 *   in view while the main column scrolls. Under 1024px the aside follows
 *   the main column; with `asideFirst` it comes first, for the decisions
 *   that must not be missed on a phone.
 * - `preview`: a form beside the live result of what it edits. From 1280px
 *   the aside is a wide column (two fifths) that stays in view while the
 *   form scrolls; narrower, the preview follows the form.
 * - `list`: work through many records. A `SplitList` on the left as its own
 *   full-height pane, the open record in `SplitMain` on the right. Narrower
 *   than about 900px the two take turns: `showing` says which one is on
 *   screen and the record carries a `SplitBack`. When they swap, focus
 *   follows: to the record when it opens, back to the selected item when
 *   the list returns. Browser history (a back gesture, a URL per record) is
 *   the product's job.
 */
export function Split({
  asideFirst = false,
  variant = "rail",
  showing = "list",
  className,
  children,
}: {
  /** `rail` and `preview`: the aside comes first on a narrow screen. */
  asideFirst?: boolean;
  /** `rail`: an aside at `--di-rail-width` from 1024px. `preview`: a wide aside from 1280px. `list`: a list beside its open record. */
  variant?: "rail" | "preview" | "list";
  /** `list` only: which half a narrow screen shows. Both show from about 900px. */
  showing?: "list" | "detail";
  className?: string;
  /** `rail`, `preview`: one `SplitMain` and one `SplitAside`. `list`: one `SplitList`, then one `SplitMain`. */
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const shown = useRef(showing);
  useEffect(() => {
    if (variant !== "list" || shown.current === showing) return;
    shown.current = showing;
    const el = root.current;
    const list = el?.querySelector<HTMLElement>(".di-split-list");
    const pane = el?.querySelector<HTMLElement>(".di-split-main");
    /* Only when the halves take turns: side by side, focus stays where the reader put it. */
    if (!list || !pane || (list.offsetParent !== null && pane.offsetParent !== null)) return;
    if (showing === "detail") pane.focus();
    else list.querySelector<HTMLElement>('[aria-current="true"]')?.focus();
  }, [variant, showing]);

  if (variant === "list")
    return (
      <div ref={root} className={cx("di-split-frame", className)} data-showing={showing}>
        <div className="di-split is-list">{children}</div>
      </div>
    );
  return (
    <div className={cx("di-split", variant === "preview" && "is-preview", asideFirst && "is-aside-first", className)}>
      {children}
    </div>
  );
}

/**
 * The main column of a `Split`: the record, which scrolls. In a `list`
 * split it is the open record, named by `label`, and takes focus when a
 * narrow screen swaps to it.
 */
export function SplitMain({ label, children }: { label?: string; children: ReactNode }) {
  if (label === undefined) return <div className="di-split-main">{children}</div>;
  return (
    <section className="di-split-main" aria-label={label} tabIndex={-1}>
      {children}
    </section>
  );
}

/** Sticks below the app bar while the main column scrolls. */
export function SplitAside({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="di-split-aside" aria-label={label}>
      {children}
    </aside>
  );
}
