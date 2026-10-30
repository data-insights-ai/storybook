import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { Eyebrow } from "../../../text/Eyebrow";
import "./HeroFigure.css";

/**
 * The one number a view exists for, set large in the display face with its
 * label in mono capitals above it. At most one per view: a second hero
 * figure makes both ordinary. Its place is a `Hero`'s `HeroLead`.
 *
 * What the figure is read against — a breakdown, a comparison — is the
 * child.
 */
export function HeroFigure({
  label,
  value,
  unit = "",
  tone = "neutral",
  children,
}: {
  label: string;
  value: string;
  /** A unit or a denominator after the figure, smaller: "of 5", "credits". */
  unit?: string;
  /** `danger` when the figure itself is past a threshold. */
  tone?: "neutral" | "warn" | "danger";
  /** What the figure is read against, such as `SeverityMark`s. */
  children?: ReactNode;
}) {
  return (
    <div className={cx("di-hero-fig", `is-${tone}`)}>
      <Eyebrow variant="plain" tone="quiet">
        {label}
      </Eyebrow>
      <p className="di-hero-fig-value">
        {value}
        {unit ? <span className="di-hero-fig-unit"> {unit}</span> : null}
      </p>
      {children ? <div className="di-hero-fig-note">{children}</div> : null}
    </div>
  );
}
