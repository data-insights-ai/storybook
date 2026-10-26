import type { ReactNode } from "react";
import { cx } from "../../cx";
import { Eyebrow } from "../data/marks/Seal";
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
 *
 * The heading is a slot, `SectionTitleHeading`, because it can hold a
 * `Highlight`; what the section reports is `SectionTitleMeta`. The frame
 * places both with grid areas, so they may be written in either order.
 */
export function SectionTitle({
  eyebrow = "",
  lede,
  tier = "console",
  children,
}: {
  /** The line above the heading. Empty means none. Repeatable. */
  eyebrow?: string;
  lede?: string;
  /** `console` is a screen section. `brand` is the display tier. */
  tier?: "console" | "brand";
  /** `SectionTitleHeading`, and optionally `SectionTitleMeta`. */
  children: ReactNode;
}) {
  return (
    <div className={cx("di-section-title", `di-section-title-${tier}`)}>
      {eyebrow === "" ? null : <Eyebrow variant="plain" className="di-section-eyebrow">{eyebrow}</Eyebrow>}
      {children}
      {lede ? <p className="di-section-lede">{lede}</p> : null}
    </div>
  );
}

/** The section's h2. Text, and at most one `Highlight` inside it. */
export function SectionTitleHeading({ children }: { children: ReactNode }) {
  return <h2 className="di-section-heading">{children}</h2>;
}

/** What the section reports: a count, a timestamp, a short status. */
export function SectionTitleMeta({ children }: { children: ReactNode }) {
  return <div className="di-section-meta">{children}</div>;
}
