import type { ReactNode } from "react";
import { Card } from "./Card";
import "./Metric.css";

export function Metric({
  label,
  figure,
  note,
  children,
}: {
  label: string;
  figure: string;
  note: string;
  children?: ReactNode;
}) {
  return (
    <Card>
      <p className="di-metric-label">{label}</p>
      <p className="di-metric-figure">{figure}</p>
      <p className="di-metric-note">{note}</p>
      {children}
    </Card>
  );
}
