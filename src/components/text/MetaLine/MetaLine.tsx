import { useRef, type ReactNode } from "react";
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
 * is split at " · ". An item that holds a component, such as a
 * `TooltipTarget` for a name whose id a reader may need, is a
 * `MetaLineItem` child in place of `items`. The line breaks only between
 * items, and the separator before an item that starts a line is left out,
 * at either alignment; an item longer than the line wraps inside.
 *
 * **Accessibility:** a list, so a screen reader hears the items apart
 * without the drawn separators.
 */
export function MetaLine({
  items,
  children,
  align = "start",
  separator = "dot",
  className,
}: (
  | {
      /** The facts, in reading order: an array, or one string with " · " between them. */
      items: string | string[];
      children?: never;
    }
  | {
      items?: never;
      /** `MetaLineItem`s, in place of `items`, where an item holds a component. */
      children: ReactNode;
    }
) & {
  align?: "start" | "end";
  separator?: "dot" | "arrow";
  className?: string;
}) {
  const list = typeof items === "string" ? items.split(" · ") : (items ?? []);
  const itemsRef = useRef<HTMLSpanElement>(null);
  useLineStarts(itemsRef, items === undefined ? children : list.join("\n"));
  return (
    <span className={cx("di-meta-line", align === "end" && "is-end", separator === "arrow" && "is-path", className)}>
      {/* A list, so a screen reader hears the items apart without the drawn separators. */}
      <span ref={itemsRef} className="di-meta-line-items" role="list">
        {items === undefined ? children : list.map((item, i) => <MetaLineItem key={i}>{item}</MetaLineItem>)}
      </span>
    </span>
  );
}

/** One item of a `MetaLine`, for an item that holds a component. */
export function MetaLineItem({ children }: { children: ReactNode }) {
  return (
    <span className="di-meta-line-item" role="listitem">
      {children}
    </span>
  );
}
