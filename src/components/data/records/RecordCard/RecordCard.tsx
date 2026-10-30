import { Children, isValidElement, type ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { surfaceClass } from "../../../../internal/surface";
import { MetaLine } from "../../../text/MetaLine";
import "./RecordCard.css";

/**
 * One record: what it is, its state, and what is on record against it.
 * `card` stands on its own surface (a source, a watched entity, a measured
 * value with an insight); `row` is one line in a list of records (a
 * session, a member), without a surface of its own.
 *
 * `title` is read as text, so it is a prop. Everything else can hold a
 * component, so it is a slot. The mark, the state, the actions, the count
 * and the detail are placed in the head whatever order they are written
 * in; the body slots follow in the order written, the footer last.
 */
export function RecordCard({
  title,
  heading = 2,
  layout = "card",
  className,
  children,
}: {
  title: string;
  /** The title's heading level in the page outline; `false` when the record is not a section (a row in a list). */
  heading?: 2 | 3 | false;
  layout?: "card" | "row";
  className?: string;
  /**
   * Head: `RecordMark`, `RecordStatus`, `RecordActions`, `RecordCount`,
   * `RecordDetail`. Body: `RecordValue`, `RecordBody`, `RecordLines`, a
   * `FactList`, `RecordInsight`. Foot: `RecordFooter`.
   */
  children?: ReactNode;
}) {
  const slot = { mark: [], under: [], end: [], body: [], footer: [] } as Record<string, ReactNode[]>;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) slot.body.push(child);
    else if (child.type === RecordMark) slot.mark.push(child);
    else if (child.type === RecordCount || child.type === RecordDetail) slot.under.push(child);
    else if (child.type === RecordStatus || child.type === RecordActions) slot.end.push(child);
    else if (child.type === RecordFooter) slot.footer.push(child);
    else slot.body.push(child);
  });
  const Title = heading === false ? "p" : (`h${heading}` as const);
  const Root = layout === "card" ? "article" : "div";
  return (
    <Root
      className={cx(
        layout === "card" && surfaceClass({ padded: false }),
        "di-record",
        `di-record-${layout}`,
        className,
      )}
    >
      <div className="di-record-head">
        {slot.mark}
        <div className="di-record-name">
          <Title className="di-record-title">{title}</Title>
          {slot.under}
        </div>
        {slot.end.length > 0 ? <div className="di-record-end">{slot.end}</div> : null}
      </div>
      {slot.body}
      {slot.footer}
    </Root>
  );
}

/** The icon tile, avatar or seal at the start of the head. */
export function RecordMark({ children }: { children: ReactNode }) {
  return <div className="di-record-mark">{children}</div>;
}

/** The state pill at the end of the head: "running", "this device", "ai insight". */
export function RecordStatus({ children }: { children: ReactNode }) {
  return <div className="di-record-status">{children}</div>;
}

/** The record's own controls at the end of the head: a menu, "End session". */
export function RecordActions({ children }: { children: ReactNode }) {
  return <div className="di-record-actions">{children}</div>;
}

/** How much the record holds, under its title. A slot: a count is a measured value and may arrive sealed. */
export function RecordCount({ children }: { children: ReactNode }) {
  return <p className="di-record-count">{children}</p>;
}

/**
 * The line under the title: an address, when it was last seen. A string
 * breaks only between its " · " items, so a timestamp never splits.
 */
export function RecordDetail({ children }: { children: ReactNode }) {
  return <p className="di-record-detail">{typeof children === "string" ? <MetaLine items={children} /> : children}</p>;
}

/** What the record resolves to, under the head: an address, a hash, a count. */
export function RecordValue({ children }: { children: ReactNode }) {
  return <div className="di-record-value">{children}</div>;
}

/** The measurement: a `Figure` and, beside it, what it is read against (a `Sparkline`). */
export function RecordBody({ children }: { children: ReactNode }) {
  return <div className="di-record-body">{children}</div>;
}

/** The lines that make the record up. Holds `RecordLine`. */
export function RecordLines({ children }: { children: ReactNode }) {
  return <ul className="di-record-lines">{children}</ul>;
}

/** One line in a `RecordLines` list: the entry and a detail after it. */
export function RecordLine({ primary, detail }: { primary: string; detail: string }) {
  return (
    <li>
      <span className="di-record-line-primary">{primary}</span>
      <span className="di-record-line-detail">{detail}</span>
    </li>
  );
}

/**
 * What a model read into the record, in place: the claim, the ground it
 * rests on (`RecordBasis`) and the actions an operator may take, each
 * still going through its own confirmation. A step of tone inside the
 * card, quieter than the measurement; the head's `StatusPill
 * tone="inferred"` names it. The first action is the one asked for.
 */
export function RecordInsight({ body, children }: { body: string; children?: ReactNode }) {
  const basis: ReactNode[] = [];
  const actions: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === RecordBasis) basis.push(child);
    else actions.push(child);
  });
  return (
    <div className={cx(surfaceClass({ plane: "inset" }), "di-record-insight")}>
      <p className="di-record-insight-body">{body}</p>
      {basis}
      {actions.length > 0 ? <div className="di-record-insight-actions">{actions}</div> : null}
    </div>
  );
}

/** Where an insight comes from: the sources and the confidence it rests on. A string breaks only between its " · " items. */
export function RecordBasis({ children }: { children: ReactNode }) {
  return <p className="di-record-basis">{typeof children === "string" ? <MetaLine items={children} /> : children}</p>;
}

/** The foot of the card: a timestamp, a source, one way on. */
export function RecordFooter({ children }: { children: ReactNode }) {
  return <footer className="di-record-footer">{children}</footer>;
}
