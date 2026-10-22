import type { ReactNode } from "react";
import { cx } from "../cx";
import "./FactList.css";

/**
 * A term and what is on record against it. Four layouts, one list.
 *
 * `rows` is the console's: hairline rows, a term column that wraps, the
 * value beside it. It is what an action states about itself before it
 * runs — scope and reversibility belong here, not in a tooltip.
 *
 * `grid` is the brand pages': a ruled grid of cells, the term in seal
 * ink above and the value set as a statement at 20px. Same markup, same
 * `dl`, same pairing of a label with a slot — the brand page was drawing
 * its own copy of this until it became a second name for one thing.
 */
export function FactList({
  layout = "rows",
  children,
}: {
  /**
   * `rows` is a screen. `grid` is a brand page's stated facts. `columns` is
   * the facts of one record inside a section: label above value, as many
   * columns as fit. `inline` is a header's key facts on one wrapping line.
   */
  layout?: "rows" | "grid" | "columns" | "inline";
  children: ReactNode;
}) {
  return <dl className={cx("di-facts", `di-facts-${layout}`)}>{children}</dl>;
}

/**
 * Labels and values are prose in the UI font. `mono` sets a value that is
 * an identifier or code in the code track.
 */
export function Fact({ label, mono = false, children }: { label: string; mono?: boolean; children: ReactNode }) {
  return (
    <div className="di-fact">
      <dt className="di-fact-label">{label}</dt>
      <dd className={cx("di-fact-value", mono && "di-fact-mono")}>{children}</dd>
    </div>
  );
}
