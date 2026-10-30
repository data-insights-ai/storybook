import { cx } from "../../../../internal/cx";
import "./MetaLine.css";

/**
 * A line of facts in mono — "As of 12 Oct, 10:00 · 14 sources · updates
 * live" — that breaks between its items first. An item stays whole unless
 * it is longer than the line, and the separator belongs to the gap, so no
 * line starts or ends on a lone "·". A string is split at " · ".
 */
export function MetaLine({ items, className }: { items: string | string[]; className?: string }) {
  const list = typeof items === "string" ? items.split(" · ") : items;
  return (
    <span className={cx("di-meta-line", className)}>
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
