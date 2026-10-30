import { useId, type ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { SeverityMark, type Severity } from "../../../marks/SeverityMark";
import { MetaLine } from "../../text/MetaLine";
import "./AttentionList.css";

/**
 * What needs the reader, ranked: at most three items, each with why it
 * needs them and the one action that answers it. An overview opens with
 * this list, before any figure, so the reader acts on the page rather than
 * assembling its message from tiles. `title` is its short heading — "3
 * things need you" — and is the page's point; no sentence above it should
 * tell the items in advance.
 *
 * The first item may carry `emphasis`: it spans the row as the strongest
 * element on the page, with the action as a button; the gold edge marks
 * the one thing that matters, and `emphasisLabel` says so in words.
 */
export function AttentionList({
  label,
  title,
  children,
}: {
  /** The list's name for assistive technology, when it has no `title`. */
  label: string;
  /** A short heading above the list (an h2): "3 things need you". */
  title?: string;
  /** `AttentionItem`s, most urgent first. */
  children: ReactNode;
}) {
  const id = useId();
  const list = (
    <ol className="di-attention" aria-label={title ? undefined : label} aria-labelledby={title ? id : undefined}>
      {children}
    </ol>
  );
  if (!title) return list;
  return (
    <section className="di-attention-section" aria-labelledby={id}>
      <h2 id={id} className="di-attention-heading">
        {title}
      </h2>
      {list}
    </section>
  );
}

/**
 * One ranked item: severity, what, why, and its one action as the child.
 * The rank sits in a fixed column on the baseline of the item's first
 * line, so every item's content starts at the same indent.
 */
export function AttentionItem({
  rank,
  severity,
  severityLabel,
  title,
  reason,
  meta,
  emphasis = false,
  emphasisLabel,
  children,
}: {
  /** "01", "02": the order is the ranking. */
  rank: string;
  severity?: Severity;
  severityLabel?: string;
  title: string;
  /** Why it needs the reader, in one sentence. */
  reason: string;
  /** Where it came from and since when, in mono. */
  meta?: string;
  emphasis?: boolean;
  /** Said beside the gold edge, so the mark is never the only channel: "Start here". */
  emphasisLabel?: string;
  /** The one action: a `Button` or a `TextLink`. */
  children?: ReactNode;
}) {
  return (
    <li className={cx("di-attention-item", emphasis && "is-emphasis")}>
      <span className="di-attention-rank" aria-hidden>
        {rank}
      </span>
      <div className="di-attention-body">
        <div className="di-attention-top">
          {emphasis && emphasisLabel ? <span className="di-attention-one">{emphasisLabel}</span> : null}
          {severity && severityLabel ? <SeverityMark level={severity} label={severityLabel} /> : null}
        </div>
        <p className="di-attention-title">{title}</p>
        <p className="di-attention-reason">{reason}</p>
        {meta ? (
          <p className="di-attention-meta">
            <MetaLine items={meta} />
          </p>
        ) : null}
      </div>
      {children ? <div className="di-attention-action">{children}</div> : null}
    </li>
  );
}
