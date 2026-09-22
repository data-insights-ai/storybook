import type { ReactNode } from "react";
import "./Heading.css";

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  /** Trailing slot. A status, a figure, or whatever the page puts beside the title. */
  children?: ReactNode;
}) {
  return (
    <header className="di-page-head">
      <div className="di-page-copy">
        <p className="di-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lede ? <p className="di-lede">{lede}</p> : null}
      </div>
      {children ? <div className="di-page-aside">{children}</div> : null}
    </header>
  );
}

export function SectionTitle({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  /** Trailing slot. A count, a timestamp, or a short status. */
  children?: ReactNode;
}) {
  return (
    <div className="di-section-title">
      <div>
        <h2>{title}</h2>
        {lede ? <p>{lede}</p> : null}
      </div>
      {children ? <div className="di-section-meta">{children}</div> : null}
    </div>
  );
}
