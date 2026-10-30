import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { Eyebrow } from "../../../data/text/Eyebrow";
import { MetaLine } from "../../../data/text/MetaLine";
import "./PageHeader.css";

/**
 * The h1 of a page, in one of two tiers.
 *
 * `console` is the product screen, and its header only orients: the
 * page's name in the display face, its state beside it
 * (`PageHeaderStatus`), and `PageHeaderMeta` — as of when, from where —
 * at the right, under the name on a narrow page. The page's point comes
 * from its first block, such as an `AttentionList`, not from a sentence in
 * the header. `brand` is the display tier the brand pages use, measured to
 * 16ch, with an 18px lede.
 *
 * The title is a slot, `PageHeaderTitle`, because a brand title can hold a
 * `Highlight`. A list or record page keeps its one primary action in
 * `PageHeaderAside`; an overview has none, its first block carries it. A
 * record adds `PageHeaderCrumbs` above (the way back to its list) and
 * `PageHeaderFacts` under the lede. The frame places every slot with grid
 * areas, so they may be written in any order.
 */
export function PageHeader({
  eyebrow,
  lede,
  tier = "console",
  children,
}: {
  eyebrow?: string;
  lede?: string;
  /** `console` is a screen. `brand` is the display tier of a brand page. */
  tier?: "console" | "brand";
  /** `PageHeaderTitle`, and optionally `PageHeaderStatus`, `PageHeaderMeta`, `PageHeaderAside`, `PageHeaderCrumbs`, `PageHeaderFacts`. */
  children: ReactNode;
}) {
  return (
    <header className={cx("di-page-head", `di-page-head-${tier}`)}>
      <div className="di-page-grid">
        {eyebrow ? (
          <Eyebrow variant="plain" className="di-page-eyebrow">
            {eyebrow}
          </Eyebrow>
        ) : null}
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

/** At the right of the header: the page's one primary action, on a list or a record page. */
export function PageHeaderAside({ children }: { children: ReactNode }) {
  return <div className="di-page-aside">{children}</div>;
}

/** Above the eyebrow: a `Breadcrumb` back to the list a detail page belongs to. */
export function PageHeaderCrumbs({ children }: { children: ReactNode }) {
  return <div className="di-page-crumbs">{children}</div>;
}

/** Beside the title: the page's or the record's state, as `StatusPill`s or a `SeverityMark`. */
export function PageHeaderStatus({ children }: { children: ReactNode }) {
  return <div className="di-page-status">{children}</div>;
}

/** Under the lede: the record’s key facts, a `FactList layout="inline"`. */
export function PageHeaderFacts({ children }: { children: ReactNode }) {
  return <div className="di-page-facts">{children}</div>;
}

/**
 * As of when, from where, how many: facts in the mono track that break
 * only between items. At the right of the name on a wide page, under it on
 * a narrow one. A string is split at " · ".
 */
export function PageHeaderMeta({ children }: { children: string | string[] }) {
  return (
    <div className="di-page-meta">
      <MetaLine items={children} />
    </div>
  );
}
