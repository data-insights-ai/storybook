import type { ReactNode } from "react";
import { Figure } from "../Figure";

/**
 * The one number a view exists for.
 *
 * @deprecated Removed in 0.12.0. Use `Figure size="hero"`; `label`,
 * `value`, `unit`, `tone` and the children stay as they are.
 */
export function HeroFigure({
  label,
  value,
  unit,
  tone = "neutral",
  children,
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: "neutral" | "warn" | "danger";
  children?: ReactNode;
}) {
  return (
    <Figure size="hero" label={label} value={value} unit={unit} tone={tone}>
      {children}
    </Figure>
  );
}
