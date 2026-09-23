import type { ReactNode } from "react";
import { cx } from "../cx";
import "./Icon.css";

/**
 * Sizes and colours an icon. The SVG is a child, imported by name from
 * `lucide-react`, so an app keeps only the icons it renders.
 */
export function Icon({
  size = 24,
  cited = false,
  label = "",
  className,
  children,
}: {
  /** 24 is the brand grid. 16 is the size inside tiles and dense controls. */
  size?: 16 | 24;
  /** Gold. One cited or active icon, not a default. */
  cited?: boolean;
  /** Accessible name. Leave empty when a neighbouring word already names the action. */
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  const named = label !== "";
  return (
    <span
      className={cx("di-icon", size === 16 ? "di-icon-16" : "di-icon-24", cited && "is-cited", className)}
      role={named ? "img" : undefined}
      aria-label={named ? label : undefined}
      aria-hidden={named ? undefined : true}
    >
      {children}
    </span>
  );
}
