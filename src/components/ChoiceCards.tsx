import type { ReactNode } from "react";
import { cx } from "../cx";
import "./ChoiceCards.css";

export type ChoiceCard = {
  value: string;
  label: string;
  /** A second line under the label. */
  description?: string;
  /** One Lucide icon. */
  icon?: ReactNode;
};

/**
 * Controlled. One of a handful of kinds to start from, each a card with
 * an icon, for the first step of a create flow. A radio group underneath,
 * so arrow keys move between cards and a screen reader hears the choice.
 */
export function ChoiceCards({
  name,
  legend,
  options,
  value,
  onChange,
  className,
}: {
  name: string;
  /** Names the choice, shown above the cards. */
  legend: string;
  options: ChoiceCard[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <fieldset className={cx("di-choicecards", className)}>
      <legend className="di-choicecards-legend">{legend}</legend>
      <div className="di-choicecards-grid">
        {options.map((option) => (
          <label key={option.value} className={cx("di-choicecard", option.value === value && "is-active")}>
            <input
              type="radio"
              className="di-sr"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            {option.icon === undefined ? null : (
              <span className="di-choicecard-icon" aria-hidden>
                {option.icon}
              </span>
            )}
            <span className="di-choicecard-text">
              <span className="di-choicecard-label">{option.label}</span>
              {option.description === undefined ? null : (
                <span className="di-choicecard-desc">{option.description}</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
