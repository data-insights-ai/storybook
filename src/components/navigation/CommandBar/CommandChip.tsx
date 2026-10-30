import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { SealMark } from "../../marks/status/SealValue";

/**
 * A scope the bar is searching within, or one it offers to add. A
 * suggested scope came from a model, so it carries the ring.
 */
export function CommandChip({
  state = "available",
  onSelect,
  children,
}: {
  /** Whether the scope is applied, offered or merely available. */
  state?: "active" | "available" | "suggested";
  onSelect?: () => void;
  children: ReactNode;
}) {
  const body = (
    <>
      {state === "suggested" ? <SealMark state="inferred" size={6} /> : null}
      {children}
    </>
  );
  if (!onSelect) {
    return <span className={cx("di-command-chip", `is-${state}`)}>{body}</span>;
  }
  return (
    <button type="button" className={cx("di-command-chip", `is-${state}`)} onClick={onSelect}>
      {body}
    </button>
  );
}
