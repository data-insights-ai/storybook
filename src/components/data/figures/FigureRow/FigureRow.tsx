import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { MetaLine } from "../../../text/MetaLine";
import "./FigureRow.css";

/**
 * The supporting figures of a view: three or four measures in one row,
 * separated by space and a hairline between two figures, never boxed. The
 * label runs in mono capitals above the value, so it reads as a different
 * kind of text than the figure.
 *
 * `footer` is the row's place under a `Hero`, closing it (`HeroFooter`).
 * Where a page has no hero, `strip` sets the row on a tonal band of its
 * own, a step below the ground, so it does not dissolve into the page.
 *
 * `size="compact"` sets the values in the body size: a quiet health line
 * at the foot of a page ("2 of 2 active"), never a row of headline figures.
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
        {children}
      </dl>
    </div>
  );
}

/**
 * One figure. The child is its note — a cause, a comparison — and a string
 * note breaks only between its " · " items.
 */
export function Figure({
  label,
  value,
  tone = "neutral",
  children,
}: {
  label: string;
  value: string;
  /** `warn` or `danger` when the figure itself is past a threshold. */
  tone?: "neutral" | "warn" | "danger";
  children?: ReactNode;
}) {
  return (
    <div className={cx("di-figure", `is-${tone}`)}>
      <dt className="di-figure-label">{label}</dt>
      <dd className="di-figure-value">{value}</dd>
      {children ? (
        <dd className="di-figure-note">{typeof children === "string" ? <MetaLine items={children} /> : children}</dd>
      ) : null}
    </div>
  );
}
