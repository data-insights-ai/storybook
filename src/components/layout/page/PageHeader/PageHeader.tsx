import { createContext, useContext, type ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { Eyebrow } from "../../../text/Eyebrow";
import { MetaLine } from "../../../text/MetaLine";
import "./PageHeader.css";

/**
 * The heading of a page or of a section of it, in one of two tiers.
 *
 * Use it once at the top of every page (`level={1}`, the h1) and over a
 * section of a screen or a brand page (`level={2}`, an h2). Not for the
 * name of one block: a `Panel` or a `DetailSection` carries its own title.
 *
 * `console` is the product screen, and its header only orients: the name
 * in the display face, its state beside it (`PageHeaderStatus`), and
 * `PageHeaderMeta` — as of when, from where, how many — at the right,
 * under the name on a narrow header. The page's point comes from its first
 * block, such as an `AttentionList`, not from a sentence in the header.
 * `brand` is the display tier of a brand page, measured to 16ch (22ch at
 * level 2) over an 18px lede.
 *
 * Anatomy: `PageHeaderCrumbs` (the way back to a record's list), the
 * `eyebrow`, `PageHeaderTitle` with `PageHeaderStatus` beside it,
 * `PageHeaderMeta`, the `lede`, `PageHeaderFacts` (a record's key facts),
 * and `PageHeaderAside` at the right (a list or record page's one primary
 * action; an overview has none). The frame places every slot with grid
 * areas, so they may be written in any order.
 *
 * Content rules: no kicker, no claim, no button besides the one primary
 * action, no rule under it. The header carries no margin: the page or the
 * `Stack` around it owns the rhythm.
 *
 * Accessibility: level 1 is a `header` landmark around the h1; level 2 a
 * plain block around an h2, so a page keeps one banner.
 */
export function PageHeader({
  level = 1,
  eyebrow,
  lede,
  tier = "console",
  children,
}: {
  /** `1` heads the page (h1 in a header landmark); `2` heads a section of it (h2). */
  level?: 1 | 2;
  eyebrow?: string;
  lede?: string;
  /** `console` is a screen. `brand` is the display tier of a brand page. */
  tier?: "console" | "brand";
  /** `PageHeaderTitle`, and optionally `PageHeaderStatus`, `PageHeaderMeta`, `PageHeaderAside`, `PageHeaderCrumbs`, `PageHeaderFacts`. */
  children: ReactNode;
}) {
  const Frame = level === 1 ? "header" : "div";
  return (
    <HeadingLevel.Provider value={level}>
      <Frame className={cx("di-page-head", `di-page-head-${tier}`, level === 2 && "di-page-head-section")}>
        <div className="di-page-grid">
          {eyebrow ? (
            <Eyebrow variant="plain" className="di-page-eyebrow">
              {eyebrow}
            </Eyebrow>
          ) : null}
          {children}
          {lede ? <p className="di-lede">{lede}</p> : null}
        </div>
      </Frame>
    </HeadingLevel.Provider>
  );
}

const HeadingLevel = createContext<1 | 2>(1);

/**
 * The header's heading: the h1 of a `PageHeader`, the h2 of a
 * `PageHeader level={2}`. Text, and at most one `Highlight` inside it.
 */
export function PageHeaderTitle({ children }: { children: ReactNode }) {
  return useContext(HeadingLevel) === 1 ? (
    <h1 className="di-page-title">{children}</h1>
  ) : (
    <h2 className="di-page-title">{children}</h2>
  );
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
 * only between items. At the right of the name on a wide header, under it
 * on a narrow one. A string is split at " · "; a count with its pill, or a
 * `SealValue`, goes in as it is.
 */
export function PageHeaderMeta({ children }: { children: ReactNode }) {
  const items = metaItems(children);
  return <div className="di-page-meta">{items ? <MetaLine items={items} /> : children}</div>;
}

function metaItems(children: ReactNode): string | string[] | undefined {
  if (typeof children === "string") return children;
  if (Array.isArray(children) && children.every((child) => typeof child === "string")) return children as string[];
  return undefined;
}
