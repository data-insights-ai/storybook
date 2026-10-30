import { useId, type ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { takeSlot } from "../../../internal/slots";
import { SealMark } from "../../marks/status/SealValue";
import "../Inference.css";
import "./ConfirmPanel.css";

/**
 * Ask, then act, then record. Nothing runs before an operator agrees to
 * it: the question, then its basis, scope and whether it can be reversed
 * as `ExplainRow`s, then the actions — the one asked for is the primary
 * button. One surface, no bands, the same family as `ExplainPanel`. The
 * receipt afterwards is a `Toast`, not a way back.
 */
export function ConfirmPanel({
  label,
  question,
  whyLabel,
  onWhy,
  heading = 3,
  className,
  children,
}: {
  /** The panel's name, a mono label: "Proposed action". */
  label: string;
  question: string;
  /** Opens the explanation. An operator may always ask why first. */
  whyLabel: string;
  onWhy: () => void;
  /** The question's heading level, to fit the page outline. */
  heading?: 2 | 3 | 4;
  className?: string;
  /** The `ExplainRow`s stating the basis, and one `ConfirmActions`, in any order. */
  children: ReactNode;
}) {
  const id = useId();
  const [actions, rows] = takeSlot(children, ConfirmActions);
  const Question = `h${heading}` as "h2" | "h3" | "h4";
  return (
    <section className={cx("di-confirm", className)} aria-labelledby={id}>
      <p className="di-inference-label">
        <SealMark state="inferred" size={7} />
        {label}
      </p>
      <Question className="di-confirm-question" id={id}>
        {question}
      </Question>
      <dl className="di-inference-rows">{rows}</dl>
      <div className="di-confirm-foot">
        <button type="button" className="di-confirm-why" onClick={onWhy}>
          {whyLabel}
        </button>
        {actions}
      </div>
    </section>
  );
}

/** The controls that commit or refuse the proposal: the asked-for action as `primary`, Cancel beside it. */
export function ConfirmActions({ children }: { children: ReactNode }) {
  return <div className="di-confirm-actions">{children}</div>;
}
