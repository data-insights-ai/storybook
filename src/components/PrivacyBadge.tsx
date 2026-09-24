import type { ReactNode } from "react";
import { cx } from "../cx";
import "./PrivacyBadge.css";

/** Where a query goes and how long it is kept. Both, or neither. */
export function PrivacyBadge({
  tone,
  children,
}: {
  tone: "local" | "external" | "retention";
  /** The icon first, then the words — the same order `Button` takes. */
  children: ReactNode;
}) {
  return <span className={cx("di-privacy", `di-privacy-${tone}`)}>{children}</span>;
}
