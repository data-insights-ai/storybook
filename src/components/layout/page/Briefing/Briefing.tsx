import { Children, isValidElement, type ReactNode } from "react";
import { TickRule } from "../../../data/text/TickRule";
import "./Briefing.css";

/**
 * A page that states its point first. The page's name is the h1, set small
 * in mono capitals after its context ("Workspace · Production"), because
 * the navigation already says where the reader is. What the page is for
 * comes first in size: the claim, one sentence computed from the data —
 * "Two things need you: a critical case nobody owns, and two sources have
 * gone quiet." — with the words that matter in a `BriefingMark`.
 *
 * Under the claim, a `BriefingMeta` says as of when and from where, in
 * mono. `BriefingAside` holds the page's one action, `BriefingStatus` the
 * record's state inline after its name, `BriefingCrumbs` the way back.
 * `ruled` closes the head on the tick scale, as the brand slides do.
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
  /** Where the page sits, before its name: "Workspace". */
  context?: string;
  /** The page's name; the document's h1. */
  title: string;
  ruled?: boolean;
  /** The claim (text with `BriefingMark`s), and the slots `BriefingStatus`, `BriefingMeta`, `BriefingAside`, `BriefingCrumbs`. */
  children: ReactNode;
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
  return (
    <header className="di-briefing">
      {slots.crumbs}
      <div className="di-briefing-name">
        <Title className="di-briefing-title">
          {context ? <span className="di-briefing-context">{context}</span> : null}
          {title}
        </Title>
        {slots.status}
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

/** Under the claim, in mono: as of when, from which sources, how sure. */
export function BriefingMeta({ children }: { children: ReactNode }) {
  return <p className="di-briefing-meta">{children}</p>;
}

/** Beside the claim: the page's one action. */
export function BriefingAside({ children }: { children: ReactNode }) {
  return <div className="di-briefing-aside">{children}</div>;
}

/** Above the name: a `Breadcrumb` back to the list. */
export function BriefingCrumbs({ children }: { children: ReactNode }) {
  return <div className="di-briefing-crumbs">{children}</div>;
}
