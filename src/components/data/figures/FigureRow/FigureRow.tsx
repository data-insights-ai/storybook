import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { MetaLine } from "../../text/MetaLine";
import "./FigureRow.css";

/**
 * The supporting figures beside or under a hero: three or four measures in
 * one row, separated by space and a hairline, never boxed. A label in mono
 * capitals, the value bright under it — the label is visibly a different
 * kind of text than the value.
 *
 * Its place is the foot of the hero it supports (in a `SurfaceFooter`).
 * Where there is no hero, `strip` sets the row on a quiet tonal band of
 * its own, so it does not dissolve into the page ground.
 */
export function FigureRow({
  label,
  variant = "plain",
  children,
}: {
  label: string;
  variant?: "plain" | "strip";
  /** `Figure`s. */
  children: ReactNode;
}) {
  const row = (
    <dl className="di-figure-row" aria-label={label}>
      {children}
    </dl>
  );
  return variant === "strip" ? <div className="di-figure-strip">{row}</div> : row;
}

/** One supporting figure; the child is its note (a cause, a comparison), which breaks only between its " · " items. */
export function Figure({
  label,
  value,
  tone = "plain",
  children,
}: {
  label: string;
  value: string;
  tone?: "plain" | "warn" | "danger";
  children?: ReactNode;
}) {
  return (
    <div className={cx("di-figure", `is-${tone}`)}>
      <dt className="di-figure-label">{label}</dt>
      <dd className="di-figure-value">{value}</dd>
      {children ? <dd className="di-figure-note">{typeof children === "string" ? <MetaLine items={children} /> : children}</dd> : null}
    </div>
  );
}
