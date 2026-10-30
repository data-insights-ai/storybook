import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import "./FigureRow.css";

/**
 * The supporting figures beside or under a hero: three or four measures in
 * one row, separated by space and a hairline, never boxed. A label in mono
 * capitals, the value bright under it — the label is visibly a different
 * kind of text than the value.
 */
export function FigureRow({ label, children }: { label: string; /** `Figure`s. */ children: ReactNode }) {
  return (
    <dl className="di-figure-row" aria-label={label}>
      {children}
    </dl>
  );
}

/** One supporting figure; the child is its note (a cause, a comparison). */
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
      {children ? <dd className="di-figure-note">{children}</dd> : null}
    </div>
  );
}
