import { Children, isValidElement, type ReactNode } from "react";
import { MetaLine } from "../../../data/text/MetaLine";
import { TickRule } from "../../../data/text/TickRule";
import "./Briefing.css";

/**
 * A page's head. Without a claim it is orientation only, the default: the
 * page's name as the h1 with its `BriefingStatus` on one line, and the
 * `BriefingMeta` (as of when, from where) small at the right, under the
 * name on a narrow page. The page's point then comes from its first block,
 * such as an `AttentionList` with a heading, not from a sentence that
 * tells the cards in advance.
 *
 * With a claim (text with `BriefingMark`s) it states the point itself: the
 * context as a mono kicker, the name, the claim as the largest text, the
 * meta under it, `BriefingAside` with one action beside it, and `ruled`
 * closing it on the tick scale. `BriefingCrumbs` is the way back.
 */
export function Briefing({
  context,
  title,
  ruled = false,
  heading = 1,
  children,
}: {
  /** 2 where the page already has its h1, such as a record opened beside a list. */
  heading?: 1 | 2;
  /** Where the page sits, above its name: "Workspace". */
  context?: string;
  /** The page's name; the document's h1. */
  title: string;
  ruled?: boolean;
  /** Optionally the claim (text with `BriefingMark`s), and the slots `BriefingStatus`, `BriefingMeta`, `BriefingAside`, `BriefingCrumbs`. */
  children?: ReactNode;
}) {
  const slots = { status: [] as ReactNode[], meta: [] as ReactNode[], aside: [] as ReactNode[], crumbs: [] as ReactNode[] };
  const claim: ReactNode[] = [];
  const Title = heading === 1 ? "h1" : "h2";
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === BriefingStatus) slots.status.push(child);
    else if (isValidElement(child) && child.type === BriefingMeta) slots.meta.push(child);
    else if (isValidElement(child) && child.type === BriefingAside) slots.aside.push(child);
    else if (isValidElement(child) && child.type === BriefingCrumbs) slots.crumbs.push(child);
    else claim.push(child);
  });
  const said = claim.some((c) => c !== null && c !== false && c !== "");
  if (!said)
    return (
      <header className="di-briefing is-orientation">
        {slots.crumbs}
        <div className="di-briefing-bar">
          <div className="di-briefing-name">
            <Title className="di-briefing-title">{title}</Title>
            {slots.status}
          </div>
          {slots.meta}
        </div>
      </header>
    );
  return (
    <header className="di-briefing">
      {slots.crumbs}
      <div className="di-briefing-head">
        {context ? <p className="di-briefing-context">{context}</p> : null}
        <div className="di-briefing-name">
          <Title className="di-briefing-title">{title}</Title>
          {slots.status}
        </div>
      </div>
      <div className="di-briefing-body">
        <p className="di-briefing-claim">{claim}</p>
        {slots.aside}
      </div>
      {slots.meta}
      {ruled ? <TickRule /> : null}
    </header>
  );
}

/** The words of the claim that matter, in gold: the one accent on the page. */
export function BriefingMark({ children }: { children: ReactNode }) {
  return <strong className="di-briefing-mark">{children}</strong>;
}

/** After the page's name: the record's state, as `StatusPill`s or a `SeverityMark`. */
export function BriefingStatus({ children }: { children: ReactNode }) {
  return <div className="di-briefing-status">{children}</div>;
}

/** Under the claim, in mono: as of when, from which sources, how sure. Items separated by " · " break only between items. */
export function BriefingMeta({ children }: { children: string | string[] }) {
  return (
    <p className="di-briefing-meta">
      <MetaLine items={children} />
    </p>
  );
}

/** Beside the claim: the page's one action. On a narrow page its buttons stack at full width. */
export function BriefingAside({ children }: { children: ReactNode }) {
  return <div className="di-briefing-aside">{children}</div>;
}

/** Above the name: a `Breadcrumb` back to the list. */
export function BriefingCrumbs({ children }: { children: ReactNode }) {
  return <div className="di-briefing-crumbs">{children}</div>;
}
