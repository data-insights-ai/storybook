import type { ReactNode } from "react";
import { cx } from "../cx";
import "./Notice.css";

/**
 * Frame only. Icon, text and action are children, in that order.
 *
 * A notice spans the sheet and carries the same icon column the panel
 * gives its index: a notice is also a record, not an interruption.
 * `danger` takes `role="alert"` so it is announced when it appears.
 */
export function Notice({
  tone = "neutral",
  size = "md",
  children,
}: {
  tone?: "neutral" | "ok" | "warn" | "danger";
  /**
   * The density, in the same words `Button` uses. `md` is the console
   * notice. `comfort` pads to 16 and lifts the title and body one step
   * each, for a notice on a brand page, where it is a paragraph of the
   * page rather than a line in a register.
   */
  size?: "md" | "comfort";
  children?: ReactNode;
}) {
  return (
    <div
      className={cx("di-notice", `di-notice-${tone}`, `di-notice-${size}`)}
      role={tone === "danger" ? "alert" : "note"}
    >
      {children}
    </div>
  );
}

export function NoticeIcon({ children }: { children: ReactNode }) {
  return <span className="di-notice-icon">{children}</span>;
}

export function NoticeText({ children }: { children: ReactNode }) {
  return <div className="di-notice-copy">{children}</div>;
}

export function NoticeTitle({ children }: { children: ReactNode }) {
  return <p className="di-notice-title">{children}</p>;
}

export function NoticeBody({ mono = false, children }: { mono?: boolean; children: ReactNode }) {
  return <div className={cx("di-notice-body", mono && "di-mono")}>{children}</div>;
}

export function NoticeAction({ children }: { children: ReactNode }) {
  return <div className="di-notice-action">{children}</div>;
}
