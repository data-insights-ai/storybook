import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import "./Numbered.css";

/**
 * A numbered item with its index in the mono track beside what it holds.
 * `step` sets it on its own tonal ground, for a section of a page; `row` is
 * a line in a list inside a surface, with a rule to the row before it, so a
 * run of steps never adds a third level of boxes.
 */
export function Numbered({
  index,
  variant = "step",
  children,
}: {
  index: string;
  variant?: "step" | "row";
  children: ReactNode;
}) {
  return (
    <section className={cx("di-numbered", `is-${variant}`)}>
      <span className="di-numbered-index">{index}</span>
      <div className="di-numbered-body">{children}</div>
    </section>
  );
}
