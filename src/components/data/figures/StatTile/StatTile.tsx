import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { surfaceClass } from "../../../../internal/surface";
import { Figure, FigureNote } from "../Figure";

/**
 * One measured value on its own surface.
 *
 * @deprecated Removed in 0.12.0. Use `<Panel><Figure/></Panel>`: `label`,
 * `value` and `tone` go to `Figure`, `compact` becomes `size="compact"`,
 * and the children stay (a `StatTileDelta` becomes a `FigureNote`).
 * `ruled` goes: the tick rule was decoration.
 */
export function StatTile({
  label,
  value,
  tone = "neutral",
  compact = false,
  className,
  children,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "danger";
  compact?: boolean;
  /** Ignored; the tick rule was decoration. */
  ruled?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cx(surfaceClass(), className)}>
      <Figure label={label} value={value} tone={tone} size={compact ? "compact" : "regular"}>
        {children}
      </Figure>
    </div>
  );
}

/**
 * The change since the last reading.
 *
 * @deprecated Removed in 0.12.0. Use `FigureNote`, with the same `tone`.
 */
export function StatTileDelta({ tone = "ok", children }: { tone?: "ok" | "warn" | "danger"; children: ReactNode }) {
  return <FigureNote tone={tone}>{children}</FigureNote>;
}
