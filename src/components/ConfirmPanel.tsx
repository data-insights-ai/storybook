import { Children, isValidElement, type ReactNode } from "react";
import { cx } from "../cx";
import { SealMark } from "./Seal";
import "./Inference.css";
import "./ConfirmPanel.css";

/**
 * Ask, then act, then record. Nothing runs before an operator agrees to
 * it, and the question states the basis, the scope and whether it can be
 * reversed. The receipt afterwards is a `Toast`, not a way back.
 */
export function ConfirmPanel({
  eyebrow,
  question,
  whyLabel,
  onWhy,
  className,
  children,
}: {
  eyebrow: string;
  question: string;
  /** Opens the explanation. An operator may always ask why first. */
  whyLabel: string;
  onWhy: () => void;
  className?: string;
  /** The `ExplainRow`s stating the basis, and one `ConfirmActions`. */
  children: ReactNode;
}) {
  const rows: ReactNode[] = [];
  const actions: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === ConfirmActions) actions.push(child);
    else rows.push(child);
  });

  return (
    <div className={cx("di-confirm", className)}>
      <div className="di-confirm-head">
        <SealMark state="inferred" size={7} />
        <span className="di-explain-title">{eyebrow}</span>
      </div>
      <div className="di-confirm-body">
        <p className="di-confirm-question">{question}</p>
        <dl className="di-explain-rows">{rows}</dl>
      </div>
      <div className="di-confirm-foot">
        <button type="button" className="di-confirm-why" onClick={onWhy}>
          {whyLabel}
        </button>
        {actions}
      </div>
    </div>
  );
}

/** The controls that commit or refuse the proposal. */
export function ConfirmActions({ children }: { children: ReactNode }) {
  return <div className="di-confirm-actions">{children}</div>;
}
