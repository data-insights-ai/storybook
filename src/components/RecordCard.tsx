import type { ReactNode } from "react";
import "./RecordCard.css";

/**
 * A record as a card: the mark and the state above, the title and its
 * count, then the lines that make it up.
 *
 * `title` and `count` are text, so they are props. The mark, the state
 * pill and the footer can each hold a component, so they are slots.
 */
export function RecordCard({
  title,
  count,
  children,
}: {
  title: string;
  /** How much the record holds, in words. */
  count: string;
  children?: ReactNode;
}) {
  return (
    <article className="di-record">
      <div className="di-record-heading">
        <h2>{title}</h2>
        <p className="di-record-count">{count}</p>
      </div>
      {children}
    </article>
  );
}

/** The seal, icon or ordinal at the top left. */
export function RecordMark({ children }: { children: ReactNode }) {
  return <div className="di-record-mark">{children}</div>;
}

/** The state pill at the top right. */
export function RecordStatus({ children }: { children: ReactNode }) {
  return <div className="di-record-status">{children}</div>;
}

/** The lines that make the record up. Holds `RecordLine`. */
export function RecordLines({ children }: { children: ReactNode }) {
  return <ul className="di-record-list">{children}</ul>;
}

export function RecordLine({ primary, detail }: { primary: string; detail: string }) {
  return (
    <li>
      <strong>{primary}</strong>
      <span>{detail}</span>
    </li>
  );
}

/** The ruled line at the foot: a timestamp, a source, one control. */
export function RecordFooter({ children }: { children: ReactNode }) {
  return <footer className="di-record-footer">{children}</footer>;
}
