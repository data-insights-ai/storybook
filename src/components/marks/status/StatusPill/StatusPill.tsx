import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import "./StatusPill.css";

/**
 * `recorded` is a fact the register holds. `ai` is a model's claim and
 * carries the hollow ring instead of a dot, so the two never read alike.
 */
export type StatusTone = "ok" | "warn" | "danger" | "recorded" | "neutral" | "inferred";

/**
 * A state, in the reading font: the word a person reads beside a record.
 * The dot is a second channel beside the word, never the only one —
 * colour alone does not carry the state.
 *
 * `track="record"` sets it lowercase in the mono track, for a state a
 * machine reported among machine values (a run in a log).
 */
export function StatusPill({
  tone = "neutral",
  children,
  dot = true,
  track = "prose",
}: {
  tone?: StatusTone;
  children: ReactNode;
  dot?: boolean;
  track?: "record" | "prose";
}) {
  return (
    <span className={cx("di-pill", `di-pill-${tone}`, track === "prose" && "di-pill-prose")}>
      {dot ? <span className={cx("di-pill-dot", tone === "inferred" && "di-pill-ring")} aria-hidden /> : null}
      {children}
    </span>
  );
}
