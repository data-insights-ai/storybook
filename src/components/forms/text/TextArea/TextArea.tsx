import type { ReactNode, TextareaHTMLAttributes } from "react";
import { cx } from "../../../../internal/cx";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import type { LabelTrack } from "../../field/Field";
import "../../field/Field/Field.css";
import "./TextArea.css";

/**
 * TextField for text of several lines, such as a PEM certificate. Same
 * label, hint and error line; `mono` for pasted keys and certificates.
 */
export function TextArea({
  id,
  label,
  hint = "",
  hintTone = "neutral",
  labelTrack = "record",
  mono = false,
  className,
  children,
  ...props
}: {
  id: string;
  label: string;
  hint?: string;
  hintTone?: HintTone;
  labelTrack?: LabelTrack;
  mono?: boolean;
  /** Slot beside the label, for example a file picker. */
  children?: ReactNode;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children">) {
  const invalid = hint !== "" && hintTone === "error";
  return (
    <div className={cx("di-field", className)}>
      <div className="di-field-row">
        <label className={cx("di-field-label", `di-field-label-${labelTrack}`)} htmlFor={id}>
          {label}
        </label>
        {children}
      </div>
      <textarea
        id={id}
        className={cx("di-control", mono && "di-control-mono")}
        aria-invalid={invalid || undefined}
        aria-describedby={hint === "" ? undefined : `${id}-hint`}
        {...props}
      />
      <FieldHint id={`${id}-hint`} tone={hintTone}>
        {hint}
      </FieldHint>
    </div>
  );
}
