import type { ReactNode } from "react";
import "./RecordCard.css";

export function RecordCard({
  title,
  count,
  mark,
  status,
  footer,
  children,
}: {
  title: string;
  count: string;
  mark: ReactNode;
  status: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="di-record">
      <header>
        {mark}
        {status}
      </header>
      <div>
        <h2>{title}</h2>
        <p className="di-record-count">{count}</p>
      </div>
      <ul className="di-record-list">{children}</ul>
      {footer ? <footer>{footer}</footer> : null}
    </article>
  );
}

export function RecordLine({ primary, detail }: { primary: string; detail: string }) {
  return (
    <li>
      <strong>{primary}</strong>
      <span>{detail}</span>
    </li>
  );
}
