import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { SeverityMark, type Severity } from "../../../marks/SeverityMark";
import "./AttentionList.css";

/**
 * What needs the reader, ranked: at most three items, each with why it
 * needs them and the one action that answers it. An overview opens with
 * this list under its claim, before any figure, so the reader acts on the
 * page rather than assembling its message from tiles.
 *
 * The first item may carry `emphasis`: the gold edge marks the one thing
 * that matters in the view, and `emphasisLabel` says so in words.
 */
export function AttentionList({ label, children }: { label: string; /** `AttentionItem`s, most urgent first. */ children: ReactNode }) {
  return (
    <ol className="di-attention" aria-label={label}>
      {children}
    </ol>
  );
}

/** One ranked item: severity, what, why, and its one action as the child. */
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
        {meta ? <p className="di-attention-meta">{meta}</p> : null}
      </div>
      {children ? <div className="di-attention-action">{children}</div> : null}
    </li>
  );
}
