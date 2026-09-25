import type { ReactNode } from "react";
import { cx } from "../cx";
import { SealMark } from "./Seal";
import "./Field.css";
import "./ConfirmPanel.css";
import "./ConfidenceField.css";

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
  level = "high",
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
/**
   * Which side of the threshold the reading fell on. The caller owns the
   * threshold: the field draws and announces `confidence`, it does not
   * decide what counts as high.
   */
  level?: "high" | "review";
  whyLabel?: string;
  onWhy?: () => void;
  className?: string;
  children: ReactNode;
}) {
  const percent = Math.round(confidence * 100);
  return (
    <div className={cx("di-confidence", `is-${level}`, className)}>
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
        <SealMark state="inferred" size={6} />
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
