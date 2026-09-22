import type { ReactNode } from "react";
import "./Session.css";

export function Session({
  name,
  detail,
  mark,
  action,
}: {
  name: ReactNode;
  detail: string;
  mark: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="di-session">
      {mark}
      <div className="di-session-copy">
        <div className="di-session-name">{name}</div>
        <p className="di-session-detail">{detail}</p>
      </div>
      {action}
    </div>
  );
}
