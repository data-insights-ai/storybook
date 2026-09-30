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
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  tier = "console",
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  /** `console` is a screen. `brand` is the display tier of a brand page. */
  tier?: "console" | "brand";
  /** Trailing slot. A status, a figure, or whatever the page puts beside the title. */
  children?: ReactNode;
}) {
  return (
    <header className={cx("di-page-head", `di-page-head-${tier}`)}>
      <div className="di-page-copy">
        <Eyebrow variant="plain">{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        {lede ? <p className="di-lede">{lede}</p> : null}
      </div>
      {children ? <div className="di-page-aside">{children}</div> : null}
    </header>
  );
}
