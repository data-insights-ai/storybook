import type { ReactNode } from "react";
import "./Stack.css";

/**
 * One rhythm down a page. `gap` is named by the value it sets, the way
 * the space tokens are: `gap={12}` is 12px, so a wrong number shows up
 * in the diff rather than behind a word like "loose".
 *
 * The union is the ramp from 8 up, which is every step a stack has a use
 * for — 12 for a column of fields, 16 for blocks inside a panel, 24
 * between panels, 32 between the sections of a screen, and 48, 64 and 96
 * for a brand page, where the distance between two sections is the layout.
 */
export function Stack({ gap = 16, children }: { gap?: StackGap; children: ReactNode }) {
  return (
    <div className="di-stack" data-gap={gap}>
      {children}
    </div>
  );
}

type StackGap = 8 | 12 | 16 | 24 | 32 | 48 | 64 | 96;
