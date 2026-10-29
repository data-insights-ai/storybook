import type { InputHTMLAttributes } from "react";
import { cx } from "../../../../internal/cx";
import "./Choice.css";

export type ChoiceProps = {
  id: string;
  /** The choice, in one line of prose. */
  label: string;
  /** A second line under the label. Empty means none. */
  description?: string;
  disabled?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function ChoiceText({
  id,
  label,
  description,
  hidden = false,
}: {
  id: string;
  label: string;
  description: string;
  hidden?: boolean;
}) {
  return (
    <span className={cx("di-choice-text", hidden && "di-sr")}>
      <label className="di-choice-label" htmlFor={id}>
        {label}
      </label>
      {description === "" ? null : (
        <span className="di-choice-desc" id={`${id}-desc`}>
          {description}
        </span>
      )}
    </span>
  );
}
