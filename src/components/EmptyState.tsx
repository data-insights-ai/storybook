import type { ReactNode } from "react";
import { cx } from "../cx";
import "./EmptyState.css";

/**
 * Zero results and zero configuration are different facts, and they
 * never share a screen. Each state names the cause, states the boundary
 * it ran into, and offers exactly one action.
 *
 * It keeps the index column: an absence is also something the register
 * recorded.
 */
export function EmptyState({
  index,
  eyebrow,
  title,
  body,
  mono = false,
  tone = "neutral",
  className,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  /** The body is a query or a path rather than a sentence. */
  mono?: boolean;
  /** `danger` is a failure, not an absence: a boundary the system hit. */
  tone?: "neutral" | "danger";
  className?: string;
  /** Holds one `EmptyStateAction`. An absence offers exactly one way out. */
  children?: ReactNode;
}) {
  return (
    <div className={cx("di-empty", tone === "danger" && "is-danger", className)}>
      <div className="di-empty-index">
        <span className="di-empty-index-label">{index}</span>
      </div>
      <div className="di-empty-body">
        <p className="di-empty-eyebrow">{eyebrow}</p>
        <p className="di-empty-title">{title}</p>
        <p className={cx("di-empty-text", mono && "di-mono")}>{body}</p>
        {children}
      </div>
    </div>
  );
}

/** The one way out of an empty state. Never two. */
export function EmptyStateAction({ children }: { children: ReactNode }) {
  return <div className="di-empty-action">{children}</div>;
}
