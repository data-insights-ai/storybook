import type { ReactNode } from "react";
import "./Channel.css";

export function Channel({
  title,
  status,
  value,
  children,
}: {
  title: string;
  status: ReactNode;
  value: ReactNode;
  children?: ReactNode;
}) {
  return (
    <article className="di-channel">
      <header>
        {title}
        {status}
      </header>
      <div className="di-channel-value">{value}</div>
      {children ? <div className="di-channel-specs">{children}</div> : null}
    </article>
  );
}
