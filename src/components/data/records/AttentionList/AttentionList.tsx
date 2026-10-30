import { useId, type ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import {
  SeverityMark,
  type Severity,
} from "../../../marks/status/SeverityMark";
import { MetaLine } from "../../text/MetaLine";
import "./AttentionList.css";

/**
 * What needs the reader, ranked: at most three items, each with why it
 * needs them and the one action that answers it. An overview opens with
 * this list, before any figure, so the reader acts on the page rather than
 * assembling its message from tiles. `title` is its short heading — "3
 * things need you" — and is the page's point; no sentence above it tells
 * the items in advance.
 *
 * The first item carries `emphasis`: it spans the row, it holds the page's
 * one button, and its gold edge marks the one thing that matters. When
 * nothing is due the list is not drawn empty; `AttentionClear` says so in
 * one quiet line.
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
  /** `AttentionItem`s, most urgent first, at most three. */
  children: ReactNode;
}) {
  const id = useId();
  const list = (
    // role="list": Safari drops the list role from an <ol> whose markers are styled away.
    <ol
      className="di-attention"
      role="list"
      aria-label={title ? undefined : label}
      aria-labelledby={title ? id : undefined}
    >
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
 * One ranked item: its severity, what, why, and its one action as the
 * child — a `Button` on the first item, a `TextLink` on the others. The
 * rank sits in a fixed column, so every item's text starts at one indent.
 */
export function AttentionItem({
  rank,
  severity,
  severityLabel = "",
  title,
  reason,
  meta = "",
  emphasis = false,
  emphasisLabel = "",
  heading = 3,
  children,
}: {
  /** "01", "02": the order is the ranking. */
  rank: string;
  severity?: Severity;
  /** The severity as a word; required with `severity`. */
  severityLabel?: string;
  title: string;
  /** Why it needs the reader, in one sentence. */
  reason: string;
  /** Where it came from and since when: facts with " · " between them. */
  meta?: string;
  /** The one thing that matters on the page. Only the first item. */
  emphasis?: boolean;
  /** Said beside the gold edge, so the mark is never the only channel: "Start here", "Due 23 Oct". */
  emphasisLabel?: string;
  /** The title's heading level: 3 under the list's h2, 2 or 4 where the page outline asks. */
  heading?: 2 | 3 | 4;
  /** The one action. */
  children?: ReactNode;
}) {
  const Title = `h${heading}` as "h2" | "h3" | "h4";
  const marked = emphasis && emphasisLabel !== "";
  const rated = severity !== undefined && severityLabel !== "";
  return (
    <li className={cx("di-attention-item", emphasis && "is-emphasis")}>
      <span className="di-attention-rank" aria-hidden>
        {rank}
      </span>
      <div className="di-attention-body">
        {marked || rated ? (
          <div className="di-attention-top">
            {marked ? (
              <span className="di-attention-one">{emphasisLabel}</span>
            ) : null}
            {rated ? (
              <SeverityMark level={severity} label={severityLabel} />
            ) : null}
          </div>
        ) : null}
        <Title className="di-attention-title">{title}</Title>
        <p className="di-attention-reason">{reason}</p>
        {meta ? <MetaLine items={meta} /> : null}
      </div>
      {children ? <div className="di-attention-action">{children}</div> : null}
    </li>
  );
}

/**
 * The first block of an overview when nothing needs the reader: one quiet
 * line, "Everything is running", and what it rests on.
 */
export function AttentionClear({
  title,
  note = "",
}: {
  title: string;
  /** What the calm rests on: facts with " · " between them. */
  note?: string;
}) {
  return (
    <p className="di-attention-clear">
      <span className="di-attention-clear-title">{title}</span>
      {note ? <MetaLine items={note} /> : null}
    </p>
  );
}
