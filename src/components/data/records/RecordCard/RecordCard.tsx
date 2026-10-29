import { Children, isValidElement, type ReactNode } from "react";
import "./RecordCard.css";

/**
 * A record as a card: the mark and the state above, the title and its
 * count, then the lines that make it up.
 *
 * `title` is read as text, so it stays a prop. Everything else — the
 * mark, the state pill, the count and the footer — can hold a component,
 * so each is a slot.
 */
export function RecordCard({
  title,
  children,
}: {
  title: string;
  /** A `RecordCount`, `RecordMark`, `RecordStatus`, `RecordLines`, `RecordFooter`. */
  children?: ReactNode;
}) {
  /* `RecordCount` sits beside the title, above the rest. Picked by type. */
  const count: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === RecordCount) count.push(child);
    else body.push(child);
  });
  return (
    <article className="di-record">
      <div className="di-record-heading">
        <h2>{title}</h2>
        {count}
      </div>
      {body}
    </article>
  );
}

/**
 * How much the record holds, beside its title. A slot: a count is a
 * measured value, and it routinely arrives sealed or with a state.
 */
export function RecordCount({ children }: { children: ReactNode }) {
  return <p className="di-record-count">{children}</p>;
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
