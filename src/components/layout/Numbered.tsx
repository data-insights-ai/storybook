import type { ReactNode } from "react";
import "./Numbered.css";

/** A step on a surface, with its index in the mono track beside what it holds. */
export function Numbered({ index, children }: { index: string; children: ReactNode }) {
  return (
    <section className="di-numbered">
      <span className="di-numbered-index">{index}</span>
      <div className="di-numbered-body">{children}</div>
    </section>
  );
}
