import type { ReactNode } from "react";
import { cx } from "../cx";
import "./FactList.css";

/**
 * A term and what is on record against it. Two layouts, one list.
 *
 * `rows` is the console's: hairline rows, a 96px term column, the value
 * in the mono track. It is what an action states about itself before it
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
  /** `rows` is a screen. `grid` is a brand page's stated facts. */
  layout?: "rows" | "grid";
  children: ReactNode;
}) {
  return <dl className={cx("di-facts", `di-facts-${layout}`)}>{children}</dl>;
}

export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="di-fact">
      <dt className="di-fact-label">{label}</dt>
      <dd className="di-fact-value">{children}</dd>
    </div>
  );
}
