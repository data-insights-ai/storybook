import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { surfaceClass } from "../../../internal/surface";
import "./Notice.css";

/**
 * Frame only. Children: an optional `NoticeIcon`, then one `NoticeText`.
 * `NoticeText` holds a block with `NoticeTitle` and `NoticeBody` and, after
 * it, an optional `NoticeAction`, so the action sits inside the padding.
 *
 * A notice spans the sheet and carries the same icon column the panel
 * gives its index: a notice is also a record, not an interruption.
 * `danger` takes `role="alert"` so it is announced when it appears.
 */
export function Notice({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "ok" | "warn" | "danger";
  children?: ReactNode;
}) {
  return (
    <div
      className={cx(surfaceClass({ padded: false }), "di-notice", `di-notice-${tone}`)}
      role={tone === "danger" ? "alert" : "note"}
    >
      {children}
    </div>
  );
}

/**
 * The notice's icon column: one lucide icon, which the notice's tone colours.
 */
export function NoticeIcon({ children }: { children: ReactNode }) {
  return <span className="di-notice-icon">{children}</span>;
}

/**
 * The notice's text column: a block with `NoticeTitle` and `NoticeBody`, then
 * an optional `NoticeAction`, so the action stays inside the padding.
 */
export function NoticeText({ children }: { children: ReactNode }) {
  return <div className="di-notice-copy">{children}</div>;
}

/**
 * The notice's first line, what happened, in one sentence.
 */
export function NoticeTitle({ children }: { children: ReactNode }) {
  return <p className="di-notice-title">{children}</p>;
}

/**
 * The notice's message under its `NoticeTitle`. `mono` sets it in the mono
 * track, for an identifier or a command.
 */
export function NoticeBody({ mono = false, children }: { mono?: boolean; children: ReactNode }) {
  return <div className={cx("di-notice-body", mono && "di-mono")}>{children}</div>;
}

/** One or more controls, spaced and aligned on one line. */
export function NoticeAction({ children }: { children: ReactNode }) {
  return <div className="di-notice-action">{children}</div>;
}
