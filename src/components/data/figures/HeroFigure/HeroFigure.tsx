import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import "./HeroFigure.css";

/**
 * The one number a view exists for, set large in the display face with its
 * label in mono capitals above it. At most one per view: a second hero
 * figure makes both ordinary.
 *
 * `tone="one"` sets the figure in gold — the one thing that matters on the
 * page; `danger` is a figure past a threshold. Neither is a decoration.
 * What the figure is read against (a comparison, a cause) is the child.
 */
export function HeroFigure({
  label,
  value,
  unit,
  tone = "plain",
  children,
}: {
  label: string;
  value: string;
  /** A unit or a denominator after the figure, smaller: "of 5", "credits". */
  unit?: string;
  tone?: "plain" | "one" | "danger";
  /** One line the figure is read against. */
  children?: ReactNode;
}) {
  return (
    <div className={cx("di-hero-fig", `is-${tone}`)}>
      <p className="di-hero-fig-label">{label}</p>
      <p className="di-hero-fig-value">
        {value}
        {unit ? <span className="di-hero-fig-unit"> {unit}</span> : null}
      </p>
      {children ? <div className="di-hero-fig-note">{children}</div> : null}
    </div>
  );
}
