import type { ReactNode } from "react";
import { cx } from "../cx";
import "./Badge.css";

/**
 * A count or a label on a dark ground: the rail, a tab, a topbar. For a
 * machine state on paper use `StatusPill`; for a version or a hash use
 * `VersionTag`.
 */
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "alert" | "seal";
}) {
  return <span className={cx("di-badge", `di-badge-${tone}`)}>{children}</span>;
}
