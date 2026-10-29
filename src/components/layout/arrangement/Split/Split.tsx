import type { ReactNode } from "react";
import { cx } from "../../../../cx";
import "./Split.css";

/**
 * A record read beside the decisions about it: the story in the main
 * column, a narrower aside that keeps the controls in view while the main
 * column scrolls. Under 1024px the aside follows the main column; with
 * `asideFirst` it comes before it, for the decisions that must not be
 * missed on a phone.
 *
 * `variant="preview"` is a form beside the live result of what it edits:
 * from 1280px the aside is a wide column (two fifths) that stays in view
 * while the form scrolls; narrower, the preview follows the form.
 */
export function Split({
  asideFirst = false,
  variant = "rail",
  className,
  children,
}: {
  asideFirst?: boolean;
  /** `rail`: an aside at `--di-rail-width` from 1024px. `preview`: a wide aside from 1280px. */
  variant?: "rail" | "preview";
  className?: string;
  /** One `SplitMain` and one `SplitAside`. */
  children: ReactNode;
}) {
  return (
    <div className={cx("di-split", variant === "preview" && "is-preview", asideFirst && "is-aside-first", className)}>
      {children}
    </div>
  );
}

export function SplitMain({ children }: { children: ReactNode }) {
  return <div className="di-split-main">{children}</div>;
}

/** Sticks below the app bar while the main column scrolls. */
export function SplitAside({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="di-split-aside" aria-label={label}>
      {children}
    </aside>
  );
}
