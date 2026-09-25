import type { ReactNode } from "react";
import { cx } from "../cx";
import "./IconTile.css";

export function IconTile({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  /** Which of the three tile looks. */
  variant?: "neutral" | "inverse" | "ok";
}) {
  return <span className={cx("di-tile", `di-tile-${variant}`)}>{children}</span>;
}
