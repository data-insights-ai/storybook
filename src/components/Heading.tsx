import type { ReactNode } from "react";
import { cx } from "../cx";
import { Eyebrow } from "./Seal";
import "./Heading.css";

/**
 * The h1 of a page, in one of two tiers.
 *
 * `console` is the product screen: 28px, a 12px lede, the dense rhythm
 * every screen in `Screens/` opens with. `brand` is the display tier the
 * brand pages use — 34px up to 56, measured to 16ch so the line breaks
 * where it means to, with an 18px lede. They are the same header doing
 * the same job at two scales, which is why this is one union prop and
 * not a second component with a second name.
 *
 * A product screen never sets `brand`: the display steps are the top of
 * the type ramp and the console stops below them.
 *
 * The title is a slot, `PageHeaderTitle`, because a title can hold a
 * `Highlight`. What sits beside it is `PageHeaderAside`. The frame places
 * both with grid areas, so they may be written in either order.
 */
export function PageHeader({
  eyebrow,
  lede,
  tier = "console",
  children,
}: {
  eyebrow: string;
  lede?: string;
  /** `console` is a screen. `brand` is the display tier of a brand page. */
  tier?: "console" | "brand";
  /** `PageHeaderTitle`, and optionally `PageHeaderAside`. */
  children: ReactNode;
}) {
  return (
    <header className={cx("di-page-head", `di-page-head-${tier}`)}>
      <div className="di-page-grid">
        <Eyebrow variant="plain" className="di-page-eyebrow">{eyebrow}</Eyebrow>
        {children}
        {lede ? <p className="di-lede">{lede}</p> : null}
      </div>
    </header>
  );
}

/** The page's one h1. Text, and at most one `Highlight` inside it. */
export function PageHeaderTitle({ children }: { children: ReactNode }) {
  return <h1 className="di-page-title">{children}</h1>;
}

/** Beside the title: a status, a figure, or the page's actions. */
export function PageHeaderAside({ children }: { children: ReactNode }) {
  return <div className="di-page-aside">{children}</div>;
}
