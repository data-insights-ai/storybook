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

/**
 * A short list of `KeyValue` pairs, a term and its value each, as a
 * description list. For a longer set of facts read down a page, use
 * `FactList`.
 */
export function KeyValues({ children }: { children: ReactNode }) {
  return <dl className="di-kv">{children}</dl>;
}
