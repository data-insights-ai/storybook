import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import "./FactList.css";

/**
 * A term and what is on record against it. Six layouts, one list.
 *
 * `rows` is the console's: hairline rows, a term column that wraps, the
 * value beside it. It is what an action states about itself before it
 * runs — scope and reversibility belong here, not in a tooltip.
 *
 * `grid` is the brand pages': a ruled grid of cells, the term in seal
 * ink above and the value set as a statement at 20px. Same markup, same
 * `dl`, same pairing of a label with a slot — the brand page was drawing
 * its own copy of this until it became a second name for one thing.
 *
 * `pairs` is a short list beside a figure: the term at the start, the
 * value at the end of the line. `stacked` is the basis of a proposal:
 * a mono label above each value, one under the other.
 *
 * `tier="brand"` sets any layout to be read on a brand page: values at
 * 16px (`--di-brand-fact-value-size`), a label beside them at 14px
 * (`--di-brand-fact-label-size`), a caption above them at 12px
 * (`--di-brand-fact-caption-size`). The grid's statements are
 * `--di-brand-fact-statement-size` in either tier.
 */
export function FactList({
  layout = "rows",
  tier = "console",
  children,
}: {
  /**
   * `rows` is a screen. `grid` is a brand page's stated facts. `columns` is
   * the facts of one record inside a section: label above value, as many
   * columns as fit. `inline` is a header's key facts on one wrapping line.
   * `pairs` is a short term/value list with the values at the end.
   * `stacked` sets each label above its value, one fact under the other.
   */
  layout?: "rows" | "grid" | "columns" | "inline" | "pairs" | "stacked";
  /** `console` is a screen. `brand` is a brand page, where the facts are read rather than scanned. */
  tier?: "console" | "brand";
  children: ReactNode;
}) {
  return <dl className={cx("di-facts", `di-facts-${layout}`, tier === "brand" && "di-facts-brand")}>{children}</dl>;
}

/**
 * Labels and values are prose in the UI font. `mono` sets a value that is
 * an identifier or code in the code track. `wide` gives a value that is
 * longer than a column, such as a URL, the whole row of a `columns` list
 * instead of breaking it inside a word.
 */
export function Fact({
  label,
  mono = false,
  wide = false,
  children,
}: {
  label: string;
  mono?: boolean;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cx("di-fact", wide && "di-fact-wide")}>
      <dt className="di-fact-label">{label}</dt>
      <dd className={cx("di-fact-value", mono && "di-fact-mono")}>{children}</dd>
    </div>
  );
}
