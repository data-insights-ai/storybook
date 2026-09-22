import type { ReactNode } from "react";
import { cx } from "../cx";
import "./IconTile.css";

export function IconTile({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "inverse" | "ok";
}) {
  return <span className={cx("di-tile", `di-tile-${tone}`)}>{children}</span>;
}
