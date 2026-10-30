import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import "./Badge.css";

/**
 * Counts on a dark ground (`neutral`, `alert`, `seal`), a quiet count on
 * paper (`quiet`), and the grounds `StatusPill` sets a state word on.
 */
export type BadgeTone = "neutral" | "alert" | "seal" | "quiet" | "ok" | "warn" | "danger" | "recorded" | "inferred";

/**
 * The one pill: a count on a control (a tab, the rail, a button) or a
 * short label beside a name. Every pill in the system draws through it —
 * `StatusPill`, `VersionTag` and `PrivacyBadge` set their content on it —
 * so the height, the radius and the inset exist once and follow the
 * density.
 *
 * `track` is the text inside: `count` (the default) in the reading font,
 * `prose` a word a person reads, `record` the mono track for what a machine
 * named, a version or a hash.
 */
export function Badge({
  children,
  tone = "neutral",
  track = "count",
}: {
  children: ReactNode;
  /** `seal` is gold, a brand moment: never in an operational view beside the one gold object. */
  tone?: BadgeTone;
  track?: "count" | "prose" | "record";
}) {
  return <span className={cx("di-badge", `di-badge-${tone}`, `di-badge-${track}`)}>{children}</span>;
}
