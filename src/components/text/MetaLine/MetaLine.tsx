import { useRef } from "react";
import { cx } from "../../../internal/cx";
import { useLineStarts } from "../../../internal/useLineStarts";
import "./MetaLine.css";

/**
 * A line of facts in the mono track: "As of 12 Oct, 10:00 · 14 sources ·
 * updates live".
 *
 * **When to use:** the as-of, source and count facts under or beside a
 * title (`PageHeaderMeta` and `RecordDetail` render it from a string), and
 * a path of hosts. **When not to:** labelled facts (`FactList`); a sentence
 * (body text); a state (`StatusPill`).
 *
 * **Anatomy:** items with a drawn separator in the gap before each one.
 *
 * **Variants:** `align="end"` sets the items against the right edge, as a
 * page header's meta does on a wide page. `separator="arrow"` reads the
 * items as a path: a host, the next host, where the data went.
 *
 * **Content:** short facts, each a figure or a name with its unit; a string
 * is split at " · ". The line breaks only between items, and the separator
 * before an item that starts a line is left out, at either alignment; an
 * item longer than the line wraps inside.
 *
 * **Accessibility:** a list, so a screen reader hears the items apart
 * without the drawn separators.
 */
export function MetaLine({
  items,
  align = "start",
  separator = "dot",
  className,
}: {
  /** The facts, in reading order: an array, or one string with " · " between them. */
  items: string | string[];
  align?: "start" | "end";
  separator?: "dot" | "arrow";
  className?: string;
}) {
  const list = typeof items === "string" ? items.split(" · ") : items;
  const itemsRef = useRef<HTMLSpanElement>(null);
  useLineStarts(itemsRef, list.join("\n"));
  return (
    <span className={cx("di-meta-line", align === "end" && "is-end", separator === "arrow" && "is-path", className)}>
      {/* A list, so a screen reader hears the items apart without the drawn separators. */}
      <span ref={itemsRef} className="di-meta-line-items" role="list">
        {list.map((item, i) => (
          <span key={i} className="di-meta-line-item" role="listitem">
            {item}
          </span>
        ))}
      </span>
    </span>
  );
}
