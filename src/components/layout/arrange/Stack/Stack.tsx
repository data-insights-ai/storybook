import type { ReactNode } from "react";
import "./Stack.css";

/**
 * One rhythm down a page. `gap` is named by the value it sets, the way
 * the space tokens are: `gap={12}` is 12px, so a wrong number shows up
 * in the diff rather than behind a word like "loose".
 *
 * The union is the ramp from 8 up, which is every step a stack has a use
 * for — 8 for a line and its detail, 12 for a short run of related lines,
 * 16 for blocks inside a panel, 24 between panels, 32 between the
 * sections of a screen, and 48, 64 and 96 for a brand page, where the
 * distance between two sections is the layout. Each step follows the
 * density.
 *
 * `variant="form"` is a form read down one column: fields `--di-rhythm-field`
 * apart and sized by what they take — text, an email address or a URL
 * spans the column, a select is as wide as its options, a number is short.
 * The column stops at `--di-measure-form`, so a field never runs the width
 * of a table. Its buttons follow as the last child. `gap` does not apply.
 */
export function Stack({
  gap = 16,
  variant = "flow",
  children,
}: {
  gap?: StackGap;
  /** `flow`: blocks at `gap`. `form`: fields at the field rhythm, at the form measure. */
  variant?: "flow" | "form";
  children: ReactNode;
}) {
  if (variant === "form") return <div className="di-stack di-stack-form">{children}</div>;
  return (
    <div className="di-stack" data-gap={gap}>
      {children}
    </div>
  );
}

type StackGap = 8 | 12 | 16 | 24 | 32 | 48 | 64 | 96;
