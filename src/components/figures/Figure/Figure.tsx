import { useContext, type ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { MetaLine } from "../../text/MetaLine";
import { InFigureList } from "./context";
import "./Figure.css";

/**
 * One measured value with its label, and what it is read against.
 *
 * Use it for a count, a rate or a share a person reads at a glance: in a
 * `Panel` of its own, in a `FigureRow`, in a hero `Panel` (`size="hero"`), in a
 * `RecordCard`. Not for a value among other facts of a record (use
 * `FactList`), a state word (`StatusPill`) or a series over time with an
 * axis (`TrendChart`).
 *
 * Anatomy: the mono label; the value in the display face, with an
 * optional `unit`; then the children, what the value is read against:
 * `FigureNote`s, a `Sparkline`, `SeverityMark`s. A string child is one note.
 *
 * `size` is the figure's role: `compact` in a card or a panel row,
 * `regular` in a row of figures, `hero` for the one number a view exists
 * for, at most one per view. `tone` is `warn` or `danger` only when the
 * value itself is past a threshold. Density sets the gaps; the type keeps
 * its size.
 *
 * Content: the value formatted for the reader ("1,284", "86.4"), the unit
 * apart ("%", "of 5"); a note names its direction in words ("down 2.1
 * points"), never by colour alone.
 *
 * Accessibility: a description list, the label its term and the value and
 * notes its details; inside a `FigureRow` the row is the one list.
 */
export function Figure({
  label,
  value,
  unit,
  tone = "neutral",
  size = "regular",
  className,
  children,
}: {
  /** What is measured, in a few words: "Unsealed", "Seats in use". */
  label: string;
  /** The figure as it should read, formatted: "1,284", "86.4%". */
  value: string;
  /** A unit or a denominator after the value, quieter: "entries", "of 5". */
  unit?: string;
  /** `warn` or `danger` when the value itself is past a threshold, never for styling. */
  tone?: "neutral" | "warn" | "danger";
  size?: "compact" | "regular" | "hero";
  className?: string;
  /** `FigureNote`s, a `Sparkline` or marks; a string is one note. */
  children?: ReactNode;
}) {
  const inList = useContext(InFigureList);
  const Root = inList ? "div" : "dl";
  return (
    <Root className={cx("di-figure", `di-figure-${size}`, `is-${tone}`, className)}>
      <dt className="di-figure-label">{label}</dt>
      <dd className="di-figure-value">
        {value}
        {unit ? <span className="di-figure-unit"> {unit.trim()}</span> : null}
      </dd>
      {children === undefined || children === null || children === false ? null : (
        <dd className="di-figure-read">
          {typeof children === "string" ? <FigureNote>{children}</FigureNote> : children}
        </dd>
      )}
    </Root>
  );
}

/**
 * A note under a figure: the change since the last reading, a cause, a
 * comparison. A `tone` colours it, and the words name the direction as
 * well ("down 2.1 points"), so a screen reader hears it, never a colour.
 * A string breaks only between its " · " items.
 */
export function FigureNote({ tone, children }: { tone?: "ok" | "warn" | "danger"; children: ReactNode }) {
  return (
    <span className={cx("di-figure-note", tone && `is-${tone}`)}>
      {typeof children === "string" ? <MetaLine items={children} /> : children}
    </span>
  );
}
