import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { Figure, InFigureList } from "../Figure";

/**
 * A labelled figure.
 *
 * @deprecated Removed in 0.12.0. Use `Figure`: `label` and `value` stay,
 * `suffix` becomes `unit`, and what qualified it goes in its children.
 */
export function Stat({
  label,
  value = "",
  suffix,
  children,
}: {
  label: string;
  value?: string;
  suffix?: string;
  children?: ReactNode;
}) {
  return (
    <Figure label={label} value={value} unit={suffix}>
      {children}
    </Figure>
  );
}

/**
 * A row of `Stat`s.
 *
 * @deprecated Removed in 0.12.0 with `Stat`. Use `FigureRow` with a
 * `label` that names the row.
 */
export function StatRow({ children }: { children: ReactNode }) {
  return (
    <div className={cx("di-figure-row", "di-figure-row-strip")}>
      <dl className="di-figure-list">
        <InFigureList.Provider value={true}>{children}</InFigureList.Provider>
      </dl>
    </div>
  );
}
