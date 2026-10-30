import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { cx } from "../../../../internal/cx";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import type { LabelTrack } from "../../field/Field";
import { FieldLabel } from "../../field/FieldLabel";
import "../../field/Field/Field.css";
import "./QuantityField.css";

/**
 * A whole number between `min` and `max`, stepped with − and + or typed.
 * Only a valid number reaches `onChange`; while the typed text is not one,
 * the field shows `invalidHint` and keeps the last valid value. In a table
 * whose column already names the value, `hideLabel` keeps the label for
 * screen readers only.
 */
export function QuantityField({
  id,
  label,
  hideLabel,
  labelHidden = false,
  labelTrack = "record",
  required = false,
  value,
  onChange,
  min = 1,
  max = 10000,
  decrementLabel,
  incrementLabel,
  invalidHint,
  hint = "",
  hintTone = "neutral",
  disabled = false,
  className,
}: {
  id: string;
  label: string;
  /** The label is read out but not shown, e.g. under a table column header. */
  hideLabel?: boolean;
  /** @deprecated Use `hideLabel`, the name every other field uses. Removed in 0.12. */
  labelHidden?: boolean;
  labelTrack?: LabelTrack;
  required?: boolean;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Accessible names of the − and + buttons. */
  decrementLabel: string;
  incrementLabel: string;
  /** Shown while the typed text is not a whole number from `min` to `max`. */
  invalidHint: string;
  /** The line under the field when the text is valid. Empty means none. */
  hint?: string;
  hintTone?: HintTone;
  disabled?: boolean;
  className?: string;
}) {
  const [text, setText] = useState(String(value));
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    setText(String(value));
  }

  const parsed = /^\s*\d+\s*$/.test(text) ? Number(text) : NaN;
  const valid = Number.isInteger(parsed) && parsed >= min && parsed <= max;
  const line = valid ? hint : invalidHint;
  const tone = valid ? hintTone : "error";
  const invalid = line !== "" && tone === "error";
  const set = (n: number) => onChange(Math.min(max, Math.max(min, n)));

  return (
    <div className={cx("di-field", "di-quantity", className)}>
      <FieldLabel
        htmlFor={id}
        label={label}
        labelTrack={labelTrack}
        hideLabel={hideLabel ?? labelHidden}
        required={required}
      />
      <div className="di-quantity-group">
        <button
          type="button"
          className="di-quantity-step"
          aria-label={decrementLabel}
          aria-controls={id}
          disabled={disabled || value <= min}
          onClick={() => set(value - 1)}
        >
          <Minus aria-hidden />
        </button>
        <input
          id={id}
          className="di-control di-control-mono di-quantity-input"
          inputMode="numeric"
          role="spinbutton"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-describedby={line === "" ? undefined : `${id}-hint`}
          disabled={disabled}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            const n = Number(e.target.value);
            if (/^\s*\d+\s*$/.test(e.target.value) && n >= min && n <= max) onChange(n);
          }}
          onBlur={() => setText(String(value))}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              set(value + 1);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              set(value - 1);
            }
          }}
        />
        <button
          type="button"
          className="di-quantity-step"
          aria-label={incrementLabel}
          aria-controls={id}
          disabled={disabled || value >= max}
          onClick={() => set(value + 1)}
        >
          <Plus aria-hidden />
        </button>
      </div>
      <FieldHint id={`${id}-hint`} tone={tone}>
        {line}
      </FieldHint>
    </div>
  );
}
