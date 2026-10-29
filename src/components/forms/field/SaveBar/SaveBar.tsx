import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import "./SaveBar.css";

/**
 * Stays at the bottom of the view while a form has unsaved changes, so
 * save and cancel are in reach however far the form scrolls. The message
 * is announced when it changes.
 */
export function SaveBar({
  label,
  message,
  children,
  className,
}: {
  /** Names the region, such as "Unsaved changes". */
  label: string;
  /** What is unsaved, in one line. */
  message: string;
  /** The buttons: cancel, then save. */
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("di-savebar", className)} role="region" aria-label={label}>
      <p className="di-savebar-message" aria-live="polite">
        {message}
      </p>
      <div className="di-savebar-actions">{children}</div>
    </div>
  );
}
