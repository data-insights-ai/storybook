import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { InFigureList } from "../Figure";
import "./FigureRow.css";

/**
 * The supporting figures of a view: three or four `Figure`s in one row,
 * separated by space and a hairline between two figures, never boxed. Not
 * for figures that each need their own surface or actions (a `Grid` of
 * `Panel`s with a `Figure` each), nor for the facts of one record
 * (`FactList`).
 *
 * `footer` is the row's place under a hero `Panel` (`surface="hero"`), closing it in its `PanelFooter`.
 * Where a page has no hero, `strip` sets the row on a tonal band of its
 * own, a step below the ground, so it does not dissolve into the page.
 * `size="compact"` sets the values in the body size: a quiet health line
 * at the foot of a page ("2 of 2 active"), never a row of headline figures.
 *
 * Accessibility: one description list named by `label`; each figure is
 * one term with its details.
 */
export function FigureRow({
  label,
  variant = "strip",
  size = "regular",
  children,
}: {
  /** The row's name for assistive technology: "Case figures". */
  label: string;
  variant?: "footer" | "strip";
  size?: "regular" | "compact";
  /** `Figure`s. */
  children: ReactNode;
}) {
  return (
    <div className={cx("di-figure-row", `di-figure-row-${variant}`, size === "compact" && "is-compact")}>
      <dl className="di-figure-list" aria-label={label}>
        <InFigureList.Provider value={true}>{children}</InFigureList.Provider>
      </dl>
    </div>
  );
}
