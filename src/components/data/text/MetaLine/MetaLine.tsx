import { cx } from "../../../../internal/cx";
import "./MetaLine.css";

/**
 * A line of facts in the mono track — "As of 12 Oct, 10:00 · 14 sources ·
 * updates live" — that breaks only between its items. An item stays whole
 * unless it is longer than the line, and the separator belongs to the gap,
 * so no line starts or ends on a lone "·". A string is split at " · ".
 *
 * `align="end"` sets the items against the right edge, as a page header's
 * meta does on a wide page.
 */
export function MetaLine({
  items,
  align = "start",
  className,
}: {
  /** The facts, in reading order: an array, or one string with " · " between them. */
  items: string | string[];
  align?: "start" | "end";
  className?: string;
}) {
  const list = typeof items === "string" ? items.split(" · ") : items;
  return (
    <span className={cx("di-meta-line", align === "end" && "is-end", className)}>
      <span className="di-meta-line-items">
        {list.map((item, i) => (
          <span key={i} className="di-meta-line-item">
            {item}
          </span>
        ))}
      </span>
    </span>
  );
}
