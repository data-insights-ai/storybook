import type { CSSProperties, ReactNode } from "react";
import "./Grid.css";

/**
 * Columns of at least `min`, as many as fit: a wider page gets more columns,
 * not wider cells. A column never forces the page wider than the window.
 *
 * `gap` is named by the value it sets, as `Stack`'s is: 12 for tiles, 16
 * for fields side by side (the form's rhythm), 24 for panels (the rhythm
 * between blocks).
 */
export function Grid({ min = "200px", gap = 12, children }: { min?: string; gap?: 12 | 16 | 24; children: ReactNode }) {
  return (
    <div className="di-grid" data-gap={gap} style={{ "--di-grid-min": min } as CSSProperties}>
      {children}
    </div>
  );
}
