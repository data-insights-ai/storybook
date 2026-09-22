import type { ReactNode } from "react";
import "./Stat.css";

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

export function StatRow({ children }: { children: ReactNode }) {
  return <div className="di-stat-row">{children}</div>;
}
