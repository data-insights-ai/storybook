import type { ReactNode } from "react";
import { cx } from "../cx";
import { SealMark } from "./Seal";
import "./Inference.css";

/**
 * Why. Parameters, not prose: an inference discloses the inputs it used
 * and, just as importantly, the ones it ignored.
 */
export function ExplainPanel({
  heading,
  footer,
  className,
  children,
}: {
  heading: string;
  /** The caveat in one line — what this does not account for. */
  footer: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx("di-explain", className)}>
      <div className="di-explain-head">
        <SealMark state="inferred" size={7} />
        <span className="di-explain-title">{heading}</span>
      </div>
      <dl className="di-explain-rows">{children}</dl>
      <p className="di-explain-foot">{footer}</p>
    </div>
  );
}

export function ExplainRow({
  label,
  ignored = false,
  children,
}: {
  label: string;
  /** An input the model did not use. It is named, not hidden. */
  ignored?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cx("di-explain-row", ignored && "is-ignored")}>
      <dt className="di-explain-label">{label}</dt>
      <dd className="di-explain-value">{children}</dd>
    </div>
  );
}
