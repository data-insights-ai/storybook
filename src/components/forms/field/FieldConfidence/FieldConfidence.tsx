import { LevelMeter } from "../../../status/LevelMeter";
import { SealMark } from "../../../status/SealValue";
import { TextLink } from "../../../text/TextLink";
import "../Field/Field.css";
import "./FieldConfidence.css";

/**
 * How sure a model was of a value it filled in. The caller owns the
 * threshold: `level` says which side of it the reading fell on, the field
 * only draws and announces it.
 */
export type FieldConfidenceReading = {
  /** 0 to 1. Drawn as a meter and announced as a number. */
  value: number;
  /** The reading in words, e.g. "0.94 · matched on 3 of 4 inputs". */
  label: string;
  level?: "high" | "review";
  /** Opens the reasoning, e.g. "Why?". */
  whyLabel?: string;
  onWhy?: () => void;
};

/**
 * The meter and the line under a field a model filled in: the hollow ring
 * of an inferred value, the reading in words, and the way to its reasons.
 * It takes the place of the field's hint; an error still replaces both.
 */
export function FieldConfidence({ id, reading }: { id: string; reading: FieldConfidenceReading }) {
  const { value, label, level = "high", whyLabel = "", onWhy } = reading;
  return (
    <>
      <LevelMeter
        className="di-field-confidence-meter"
        label={label}
        value={Math.round(value * 100)}
        segments="continuous"
        tone={level === "review" ? "warn" : "neutral"}
      />
      <div className={`di-field-hint is-inferred is-${level}`} id={id}>
        <SealMark state="inferred" />
        <span className="di-field-confidence-label">{label}</span>
        {whyLabel === "" || !onWhy ? null : <TextLink onClick={onWhy}>{whyLabel}</TextLink>}
      </div>
    </>
  );
}
