import type { ReactNode } from "react";
import "./Stat.css";

/**
 * A labelled figure: `label` above, `value` with an optional `suffix` (a unit)
 * below. What qualifies the figure, a `StatusPill` or a note, goes in as
 * children. For a figure on its own surface, with a trend
 * or a delta, use `StatTile`.
 *
 * @deprecated Removed in 0.12.0. Use `Figure` inside a `FigureRow`: `label`
 * stays, `value` takes the figure with its unit, and what qualified it goes in
 * `Figure`'s children.
 */
export function Stat({
  label,
  value,
  suffix = "",
  children,
}: {
  label: string;
  value?: string;
  suffix?: string;
  children?: ReactNode;
}) {
  return (
    <div className="di-stat">
      <div className="di-stat-label">{label}</div>
      {value ? (
        <div className="di-stat-value">
          {value}
          {suffix ? <span>{suffix}</span> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/**
 * A row of `Stat`s side by side, wrapping on a narrow page.
 *
 * @deprecated Removed in 0.12.0 with `Stat`. Use `FigureRow` (`variant="strip"`,
 * or `"footer"` under a `Hero`), which also names the row with `label`.
 */
export function StatRow({ children }: { children: ReactNode }) {
  return <div className="di-stat-row">{children}</div>;
}
