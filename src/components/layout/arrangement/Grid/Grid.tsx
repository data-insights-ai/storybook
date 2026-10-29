import type { CSSProperties, ReactNode } from "react";
import "./Grid.css";

/** Wraps. A column never forces the story canvas wider than the preview. */
export function Grid({ min = "200px", children }: { min?: string; children: ReactNode }) {
  return (
    <div className="di-grid" style={{ "--di-grid-min": min } as CSSProperties}>
      {children}
    </div>
  );
}
