import type { ReactNode } from "react";
import { cx } from "../cx";
import { Eyebrow } from "./Seal";
import "./SectionTitle.css";

/**
 * The heading over one section, with a slot for what the section reports:
 * a count, a timestamp, a short status.
 *
 * `tier` is the same axis `PageHeader` carries. `console` is the 20px
 * heading a screen puts over a panel. `brand` is the display tier — 28px
 * up to 34, measured to 22ch — which is what a brand page sets over every
 * section, and the reason this is not a separate component.
 *
 * `eyebrow` is the plain one: no dot, no rule, repeatable down a page.
 * The sealed `Eyebrow` is the mark for the one section on record, and a
 * page that put it over every heading would be claiming ten seals.
 */
export function SectionTitle({
  eyebrow = "",
  title,
  lede,
  tier = "console",
  children,
}: {
  /** The line above the heading. Empty means none. Repeatable. */
  eyebrow?: string;
  title: string;
  lede?: string;
  /** `console` is a screen section. `brand` is the display tier. */
  tier?: "console" | "brand";
  /** Trailing slot. A count, a timestamp, or a short status. */
  children?: ReactNode;
}) {
  return (
    <div className={cx("di-section-title", `di-section-title-${tier}`)}>
      <div className="di-section-copy">
        {eyebrow === "" ? null : <Eyebrow variant="plain">{eyebrow}</Eyebrow>}
        <h2>{title}</h2>
        {lede ? <p className="di-section-lede">{lede}</p> : null}
      </div>
      {children ? <div className="di-section-meta">{children}</div> : null}
    </div>
  );
}
