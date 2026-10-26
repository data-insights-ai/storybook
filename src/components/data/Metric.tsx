import type { ReactNode } from "react";
import { Card } from "./Card";
import "./Metric.css";

/**
 * One figure on a card. `label` and `figure` are read as text, so they
 * stay props; what the figure is qualified by is a slot.
 */
export function Metric({
  label,
  figure,
  children,
}: {
  label: string;
  figure: string;
  /** A `MetricNote`, and whatever else the card carries. */
  children?: ReactNode;
}) {
  return (
    <Card>
      <p className="di-metric-label">{label}</p>
      <p className="di-metric-figure">{figure}</p>
      {children}
    </Card>
  );
}

/**
 * The line under the figure: the window it covers, the source, the seal.
 * A slot, because each of those is a value the library already draws —
 * a bare string cannot carry the mono track or the mark.
 */
export function MetricNote({ children }: { children: ReactNode }) {
  return <p className="di-metric-note">{children}</p>;
}
