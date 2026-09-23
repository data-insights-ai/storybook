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
  tone?: "neutral" | "alert" | "gold";
}) {
  return <span className={cx("di-badge", `di-badge-${tone}`)}>{children}</span>;
}

/**
 * A version, a build or a short hash. Mono, quiet, no dot: it names a
 * thing rather than reporting a state.
 */
export function VersionTag({ children }: { children: ReactNode }) {
  return <span className="di-version-tag">{children}</span>;
}
