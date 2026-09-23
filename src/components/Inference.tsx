import type { ReactNode } from "react";
import { cx } from "../cx";
import { RingDot } from "./Seal";
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
        <RingDot size={7} />
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
  actions,
  className,
  children,
}: {
  eyebrow: string;
  question: string;
  /** Opens the explanation. An operator may always ask why first. */
  whyLabel: string;
  onWhy: () => void;
  actions: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx("di-confirm", className)}>
      <div className="di-confirm-head">
        <RingDot size={7} />
        <span className="di-explain-title">{eyebrow}</span>
      </div>
      <div className="di-confirm-body">
        <p className="di-confirm-question">{question}</p>
        <dl className="di-explain-rows">{children}</dl>
      </div>
      <div className="di-confirm-foot">
        <button type="button" className="di-confirm-why" onClick={onWhy}>
          {whyLabel}
        </button>
        <div className="di-confirm-actions">{actions}</div>
      </div>
    </div>
  );
}

/**
 * A field that states its own confidence: a rule under it, plus the
 * number in words. Colour never carries this alone — `review` and
 * `high` read the same to anyone who cannot separate the two hues.
 */
export function ConfidenceField({
  id,
  label,
  confidence,
  confidenceLabel,
  tone = "high",
  whyLabel = "",
  onWhy,
  className,
  children,
}: {
  id: string;
  label: string;
  /** 0 to 1. Drawn as a rule and announced as a number. */
  confidence: number;
  /** The reading in words, e.g. "0.94 · matched on 3 of 4 inputs". */
  confidenceLabel: string;
  /** `review` is below the threshold this field trusts. */
  tone?: "high" | "review";
  whyLabel?: string;
  onWhy?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const percent = Math.round(confidence * 100);
  return (
    <div className={cx("di-confidence", `is-${tone}`, className)}>
      <label className="di-field-label" htmlFor={id}>
        {label}
      </label>
      <div className="di-confidence-value">{children}</div>
      <div
        className="di-confidence-track"
        role="meter"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={confidenceLabel}
      >
        <div className="di-confidence-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="di-confidence-foot">
        <RingDot size={6} />
        <span className="di-confidence-label">{confidenceLabel}</span>
        {whyLabel === "" || !onWhy ? null : (
          <button type="button" className="di-confirm-why" onClick={onWhy}>
            {whyLabel}
          </button>
        )}
      </div>
    </div>
  );
}

/** Where a query goes and how long it is kept. Both, or neither. */
export function PrivacyBadge({
  tone,
  icon,
  children,
}: {
  tone: "local" | "external" | "retention";
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className={cx("di-privacy", `di-privacy-${tone}`)}>
      {icon}
      {children}
    </span>
  );
}
