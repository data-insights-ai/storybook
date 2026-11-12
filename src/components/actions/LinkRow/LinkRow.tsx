import { Children, type ReactNode } from "react";
import { cx } from "../../../internal/cx";
import "./LinkRow.css";

/**
 * A few places to go, side by side, wrapping as words do: the footer's
 * pages, the legal pages beside an offer, a record's other formats.
 *
 * **When to use:** links of equal weight that belong together on one line.
 * **When not to:** views of one record (`Tabs`) or places with their own
 * address in one section (`TabNav`); actions (`Toolbar`); a link inside a
 * sentence (`TextLink` in the text).
 *
 * **Anatomy:** each child, a `TextLink`, is an item; empty children are left
 * out. A link never breaks inside itself while the row can wrap before it.
 * `size="sm"` sets the row in the hint size, for a footer.
 *
 * **Accessibility:** a list, so a screen reader hears how many links there
 * are; with `label` it is a `nav` landmark of that name, for links a reader
 * looks for on every page.
 */
export function LinkRow({
  label,
  size = "md",
  children,
}: {
  /** Names the row as a navigation landmark ("Legal"). */
  label?: string;
  /** `md` sets it in the body size; `sm` in the hint size. */
  size?: "md" | "sm";
  /** `TextLink`s. */
  children: ReactNode;
}) {
  const items = Children.toArray(children);
  const list = (
    // role="list": Safari drops the list role from a <ul> whose markers are styled away.
    <ul className={cx("di-link-row", size === "sm" && "is-sm")} role="list">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
  return label === undefined ? list : <nav aria-label={label}>{list}</nav>;
}
