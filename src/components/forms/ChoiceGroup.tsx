import type { ReactNode } from "react";
import { cx } from "../../cx";
import "./ChoiceGroup.css";

/** A fieldset with a visible legend. A radio group needs both. */
export function ChoiceGroup({
  legend,
  className,
  children,
}: {
  legend: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className={cx("di-choice-group", className)}>
      <legend className="di-choice-legend">{legend}</legend>
      {children}
    </fieldset>
  );
}
