import type { ReactNode } from "react";
import "./FactList.css";

/**
 * What the action will touch, stated before it runs. Scope and
 * reversibility belong here, not in a tooltip.
 */
export function FactList({ children }: { children: ReactNode }) {
  return <dl className="di-facts">{children}</dl>;
}

export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="di-fact">
      <dt className="di-fact-label">{label}</dt>
      <dd className="di-fact-value">{children}</dd>
    </div>
  );
}
