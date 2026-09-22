import type { ReactNode } from "react";
import { cx } from "../cx";
import "./Badge.css";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "alert" | "gold";
}) {
  return <span className={cx("di-badge", `di-badge-${tone}`)}>{children}</span>;
}
