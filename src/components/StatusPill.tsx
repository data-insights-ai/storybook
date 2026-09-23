import type { ReactNode } from "react";
import { cx } from "../cx";
import "./StatusPill.css";

/**
 * `recorded` is a fact the register holds. `ai` is a model's claim and
 * carries the hollow ring instead of a dot, so the two never read alike.
 */
export type StatusTone = "ok" | "warn" | "danger" | "recorded" | "neutral" | "ai";

/**
 * Machine state, set lowercase in the mono track: reported, not
 * announced. The dot is a second channel beside the word, never the
 * only one — colour alone does not carry the state.
 */
export function StatusPill({
  tone = "neutral",
  children,
  dot = true,
}: {
  tone?: StatusTone;
  children: ReactNode;
  dot?: boolean;
}) {
  return (
    <span className={cx("di-pill", `di-pill-${tone}`)}>
      {dot ? <span className={cx("di-pill-dot", tone === "ai" && "di-pill-ring")} aria-hidden /> : null}
      {children}
    </span>
  );
}
