import type { ReactNode } from "react";
import "./SourceList.css";

/**
 * The numbered sources a text's `CiteMark`s lead to, in the order they
 * are first cited.
 *
 * **Anatomy:** each `SourceEntry` with its number in a fixed column, then
 * what the source is and its link. The entry a mark led to (`:target`)
 * shows its number in full tone.
 */
export function SourceList({ children }: { children: ReactNode }) {
  return <ol className="di-source-list">{children}</ol>;
}

/**
 * One source: `n` as its `CiteMark` shows it, `id` the anchor the mark's
 * href names, and what the source is as children.
 */
export function SourceEntry({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <li className="di-source-entry" id={id}>
      <span className="di-source-n" aria-hidden>
        {n}
      </span>
      <span className="di-source-body">{children}</span>
    </li>
  );
}
