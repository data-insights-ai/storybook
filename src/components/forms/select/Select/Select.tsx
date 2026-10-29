import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../../../../cx";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import type { LabelTrack } from "../../field/Field";
import "../../field/Field/Field.css";
import "./Select.css";

/**
 * A native select. The caller maps its own data into `option` children,
 * so the control never owns a list it cannot see. Opened with a pointer
 * where the browser allows it, the list is drawn like a `ComboBox`'s; a
 * phone keeps its own picker.
 *
 * The line under it follows `TextField`: one `hint`, one `hintTone`.
 */
export function Select({
  id,
  label,
  hint = "",
  hintTone = "neutral",
  labelTrack = "record",
  hideLabel = false,
  mono = false,
  className,
  disabled = false,
  required = false,
  children,
  ...props
}: {
  id: string;
  label: string;
  /** The line under the field. Empty means none. */
  hint?: string;
  /** What that line is. `error` also marks the control invalid. */
  hintTone?: HintTone;
  /** Which track the label runs in. `record` is the console, `prose` a form. */
  labelTrack?: LabelTrack;
  /**
   * Keeps the label for assistive technology only, for a control whose
   * column or row already names it, such as a role picker in a table.
   */
  hideLabel?: boolean;
  /** Mono when the options are identifiers a machine wrote; words stay in the UI track. */
  mono?: boolean;
  disabled?: boolean;
  required?: boolean;
  children: ReactNode;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "children">) {
  const invalid = hint !== "" && hintTone === "error";

  return (
    <div className={cx("di-field", className)}>
      <label className={cx("di-field-label", `di-field-label-${labelTrack}`, hideLabel && "di-sr")} htmlFor={id}>
        {label}
      </label>
      <div className="di-select">
        <select
          id={id}
          className={cx("di-control", "di-select-control", mono && "di-control-mono")}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={hint === "" ? undefined : `${id}-hint`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="di-select-caret" aria-hidden />
      </div>
      <FieldHint id={`${id}-hint`} tone={hintTone}>
        {hint}
      </FieldHint>
    </div>
  );
}
