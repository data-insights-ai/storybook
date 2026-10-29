import type { ReactNode } from "react";
import "./KeyValues.css";

/**
 * The terms behind a figure. Both halves of a row are text, so both are
 * props; the list holds nothing but its own rows, which is why it is a
 * primitive rather than a frame.
 */
export function KeyValue({ term, value }: { term: string; value: string }) {
  return (
    <>
      <dt>{term}</dt>
      <dd>{value}</dd>
    </>
  );
}

export function KeyValues({ children }: { children: ReactNode }) {
  return <dl className="di-kv">{children}</dl>;
}
