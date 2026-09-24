import type { ReactNode } from "react";
import "./SectionTitle.css";

/**
 * The heading over one section of a screen, with a slot for what the
 * section reports: a count, a timestamp, a short status.
 */
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
