import { useId, type ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { takeSlot } from "../../../internal/slots";
import { SealMark } from "../../marks/status/SealValue";
import "../Inference.css";

/**
 * Why a model proposed something, read top to bottom: the answer in one
 * plain sentence, its confidence as one figure, the evidence it matched
 * on, what it did not consider (folded), and the one caveat. One surface,
 * no bands; `ConfirmPanel` beside it reads as the same family.
 */
export function ExplainPanel({
  label,
  answer,
  confidenceLabel = "",
  confidence = "",
  confidenceWord = "",
  className,
  children,
}: {
  /** The panel's name, a mono label: "Why this was proposed". */
  label: string;
  /** The reason in one sentence: "Proposed because 1,284 entries are queued behind one paused host." */
  answer: string;
  /** "Confidence". Empty leaves the figure out. */
  confidenceLabel?: string;
  /** The figure: "0.88". */
  confidence?: string;
  /** The figure in a word: "high". */
  confidenceWord?: string;
  className?: string;
  /** `ExplainRow`s (the evidence), at most one `ExplainIgnored` and one `ExplainFooter`, in any order. */
  children?: ReactNode;
}) {
  const id = useId();
  const [ignored, rest] = takeSlot(children, ExplainIgnored);
  const [footer, rows] = takeSlot(rest, ExplainFooter);
  return (
    <section className={cx("di-explain", className)} aria-labelledby={id}>
      <p className="di-inference-label" id={id}>
        <SealMark state="inferred" size={7} />
        {label}
      </p>
      <p className="di-explain-answer">{answer}</p>
      {confidenceLabel && confidence ? (
        <div className="di-explain-figure">
          <span className="di-inference-term">{confidenceLabel}</span>
          <span className="di-explain-figure-value">
            {confidence}
            {confidenceWord ? (
              <span className="di-explain-figure-word">{confidenceWord}</span>
            ) : null}
          </span>
        </div>
      ) : null}
      {rows.length ? <dl className="di-inference-rows">{rows}</dl> : null}
      {ignored}
      {footer}
    </section>
  );
}

/**
 * One piece of evidence: its label in mono capitals above the value. The
 * value is body text; `mono` sets it in the code track when it is a real
 * token — a date range, a host, an id — and never for a sentence.
 */
export function ExplainRow({
  label,
  mono = false,
  children,
}: {
  label: string;
  mono?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="di-inference-row">
      <dt className="di-inference-term">{label}</dt>
      <dd className={cx("di-inference-value", mono && "is-mono")}>
        {children}
      </dd>
    </div>
  );
}

/**
 * The inputs the model did not use, folded under one line — "Not
 * considered (2)" — and listed plainly when opened. Named, never hidden.
 */
export function ExplainIgnored({
  summary,
  items,
}: {
  summary: string;
  items: string[];
}) {
  return (
    <details className="di-explain-ignored">
      <summary>{summary}</summary>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </details>
  );
}

/**
 * The caveat, one quiet line at the end: what this inference does not
 * account for. A slot, so it can name a source or a sealed cut-off.
 */
export function ExplainFooter({ children }: { children: ReactNode }) {
  return <p className="di-inference-note">{children}</p>;
}
