import type { ReactNode } from "react";
import "./Stat.css";

/**
 * A labelled figure: `label` above, `value` with an optional `suffix` (a unit)
 * below. What qualifies the figure, a `StatusPill` or a note, goes in as
 * children. For a figure with a trend and a delta, use `StatTile`; for a large
 * one in a panel, `Metric`.
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
 */
export function StatRow({ children }: { children: ReactNode }) {
  return <div className="di-stat-row">{children}</div>;
}
