import type { ReactNode } from "react";
import { cx } from "../cx";
import "./StatusPill.css";

export type StatusTone = "ok" | "warn" | "danger" | "neutral";

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
      {dot ? <span className="di-pill-dot" aria-hidden /> : null}
      {children}
    </span>
  );
}
