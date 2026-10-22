import type { ReactNode } from "react";
import { cx } from "../cx";
import "./Tag.css";

/**
 * A compact label in the reading font: a role someone holds, a group a
 * thing belongs to. `detail` qualifies it, muted after the name — the
 * scope of a grant, for example. Tags in a cell wrap like words. For a
 * machine state use `StatusPill`.
 */
export function Tag({ children, detail = "", className }: { children: string; detail?: string; className?: string }) {
  return (
    <span className={cx("di-tag", className)}>
      <span className="di-tag-name">{children}</span>
      {detail === "" ? null : <span className="di-tag-detail">{detail}</span>}
    </span>
  );
}

/** Tags side by side, wrapping onto further lines in a narrow cell. */
export function TagList({ children }: { children: ReactNode }) {
  return <span className="di-tag-list">{children}</span>;
}
