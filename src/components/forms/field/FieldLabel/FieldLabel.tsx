import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import type { LabelTrack } from "../Field";
import "../Field/Field.css";

/**
 * The row above a control: the label, the required mark, and an optional
 * slot at the trailing edge. Every field draws it, so a label reads the
 * same above a text field, a select and a date.
 *
 * `htmlFor` makes it a `<label>`; a control that is not one input (a date
 * in segments, a group) names itself with `aria-labelledby` and the `id`
 * instead. The required mark is drawn by CSS with empty alternative text,
 * so it is not part of the label's text or its accessible name: the
 * control's own `required` is what a screen reader announces.
 */
export function FieldLabel({
  id,
  htmlFor,
  label,
  labelTrack = "record",
  hideLabel = false,
  required = false,
  children,
}: {
  /** For `aria-labelledby` on a control the label does not point at. */
  id?: string;
  /** The input the label names. Without it the label is a `<span>`. */
  htmlFor?: string;
  label: string;
  labelTrack?: LabelTrack;
  /** Keeps the row for assistive technology only. */
  hideLabel?: boolean;
  required?: boolean;
  /** At the trailing edge of the row, such as a “Forgot password?” link. */
  children?: ReactNode;
}) {
  const className = cx("di-field-label", `di-field-label-${labelTrack}`, required && "is-required");
  return (
    <div className={cx("di-field-row", hideLabel && "di-sr")}>
      {htmlFor === undefined ? (
        <span id={id} className={className}>
          {label}
        </span>
      ) : (
        <label id={id} className={className} htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
