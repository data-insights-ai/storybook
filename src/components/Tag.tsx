import { Children, type ReactNode } from "react";
import { cx } from "../cx";
import "./Tag.css";

/**
 * A compact label in the reading font: a role someone holds, a group a
 * thing belongs to. `detail` qualifies it, muted after the name — the
 * scope of a grant, for example. Tags in a cell wrap like words. For a
 * machine state use `StatusPill`.
 */
export function Tag({
  children,
  detail = "",
  title,
  className,
}: {
  children: string;
  detail?: string;
  /** The full wording when the tag shows a short name, as a tooltip. */
  title?: string;
  className?: string;
}) {
  return (
    <span className={cx("di-tag", className)} title={title}>
      <span className="di-tag-name">{children}</span>
      {detail === "" ? null : <span className="di-tag-detail">{detail}</span>}
    </span>
  );
}

/**
 * Tags side by side. In a table cell give `max`: the first tags stay on one
 * line and the rest become one "+N more" tag (`moreLabel`), which calls
 * `onMore` — open the record's side panel there. Without `max` the tags
 * wrap like words.
 */
export function TagList({
  children,
  max,
  moreLabel,
  onMore,
}: {
  children: ReactNode;
  max?: number;
  /** "+3 more", for the tags not shown. */
  moreLabel?: (hidden: number) => string;
  onMore?: () => void;
}) {
  const tags = Children.toArray(children);
  const shown = max === undefined ? tags : tags.slice(0, max);
  const hidden = tags.length - shown.length;
  return (
    <span className={cx("di-tag-list", max !== undefined && "is-compact")}>
      {shown}
      {hidden > 0 ? (
        onMore ? (
          <button type="button" className="di-tag di-tag-more" onClick={onMore}>
            {moreLabel ? moreLabel(hidden) : `+${hidden}`}
          </button>
        ) : (
          <span className="di-tag di-tag-more">{moreLabel ? moreLabel(hidden) : `+${hidden}`}</span>
        )
      ) : null}
    </span>
  );
}
