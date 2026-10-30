import { Children, isValidElement, type ReactNode } from "react";
import { cx } from "../../../internal/cx";
import "./EmptyState.css";

/**
 * Zero results and zero configuration are different facts, and they
 * never share a screen. Each state names the cause, states the boundary
 * it ran into, and offers exactly one action.
 *
 * The eyebrow is optional: inside a page that already names the place, repeating
 * it over the empty state is noise. `EmptyStateIcon` sets one line icon
 * above the title, for a first-use state that invites the first entry.
 */
export function EmptyState({
  eyebrow,
  title,
  body,
  mono = false,
  tone = "neutral",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  /** The body is a query or a path rather than a sentence. */
  mono?: boolean;
  /** `danger` is a failure, not an absence: a boundary the system hit. */
  tone?: "neutral" | "danger";
  className?: string;
  /** One `EmptyStateAction` (an absence offers exactly one way out), and optionally `EmptyStateIcon`. */
  children?: ReactNode;
}) {
  const icon: ReactNode[] = [];
  const rest: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === EmptyStateIcon) icon.push(child);
    else rest.push(child);
  });
  return (
    <div className={cx("di-empty", tone === "danger" && "is-danger", className)}>
      <div className="di-empty-body">
        {icon}
        {eyebrow ? <p className="di-empty-eyebrow">{eyebrow}</p> : null}
        <p className="di-empty-title">{title}</p>
        <p className={cx("di-empty-text", mono && "di-mono")}>{body}</p>
        {rest}
      </div>
    </div>
  );
}

/** The one way out of an empty state. Never two. */
export function EmptyStateAction({ children }: { children: ReactNode }) {
  return <div className="di-empty-action">{children}</div>;
}

/** One line icon above the title, from `lucide-react`. Decoration: the title carries the meaning. */
export function EmptyStateIcon({ children }: { children: ReactNode }) {
  return (
    <div className="di-empty-icon" aria-hidden>
      {children}
    </div>
  );
}
