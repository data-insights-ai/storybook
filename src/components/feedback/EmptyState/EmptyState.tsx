import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { Eyebrow } from "../../text/Eyebrow";
import "./EmptyState.css";

/**
 * Stands in place of content that is not there: a list with no rows, a
 * search that found nothing, a feature nothing is set up for yet.
 *
 * **When to use:** in place of a table, a list or a panel's content when it
 * is empty, inside the surface that content would sit on. **When not to:**
 * content that failed to load is a failure, not an absence: a `Notice` with
 * `tone="danger"`; a state of the system above the content is a `Notice`
 * banner; nothing due on an overview is a `Notice variant="line"`.
 *
 * **Anatomy:** an optional `EmptyStateIcon`, the `eyebrow` (what kind of
 * empty, "No results"), the `title` (what is empty), the `body` (why, or
 * what fills it), an optional `EmptyStateAction` (the one way out). No tone,
 * no frame: it takes the ground of the surface it stands in.
 *
 * **Variants:** `mono` sets the body in the mono track, for a query or a
 * path that matched nothing.
 *
 * **Content rules:** no results and nothing configured are different facts
 * and never share a screen. The title says what is empty in one sentence;
 * the body says why or what fills it; one action, never two. Leave the
 * eyebrow out where the panel already names the place.
 *
 * **Accessibility:** a `status`, so a search that found nothing is
 * announced. The icon is hidden from screen readers: the title carries the
 * meaning.
 */
export function EmptyState({
  eyebrow = "",
  title,
  body = "",
  mono = false,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  /** The body is a query or a path rather than a sentence. */
  mono?: boolean;
  className?: string;
  /** `EmptyStateIcon` and one `EmptyStateAction`, in any order. */
  children?: ReactNode;
}) {
  return (
    <div className={cx("di-empty-state", className)} role="status">
      {eyebrow === "" ? null : (
        <Eyebrow variant="plain" tone="quiet">
          {eyebrow}
        </Eyebrow>
      )}
      <p className="di-empty-state-title">{title}</p>
      {body === "" ? null : <p className={cx("di-empty-state-body", mono && "di-mono")}>{body}</p>}
      {children}
    </div>
  );
}

/** One line icon above the title, from `lucide-react`. Decoration: the title carries the meaning. */
export function EmptyStateIcon({ children }: { children: ReactNode }) {
  return (
    <span className="di-empty-state-icon" aria-hidden>
      {children}
    </span>
  );
}

/** The one way out: a single button or link under the body. */
export function EmptyStateAction({ children }: { children: ReactNode }) {
  return <div className="di-empty-state-action">{children}</div>;
}
