import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import "./ChoiceCards.css";

export type ChoiceCard = {
  value: string;
  label: string;
  /** One line under the label; what does not fit is cut. */
  description?: string;
  /** The rest of it, shown on hover and read by assistive technology. */
  more?: string;
  /** Cards with the same group are shown together under it. */
  group?: string;
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
  hideLegend = false,
  options,
  value,
  onChange,
  className,
}: {
  name: string;
  /** Names the choice, shown above the cards. */
  legend: string;
  /** Keeps the legend for assistive technology only, where a heading above already says it. */
  hideLegend?: boolean;
  options: ChoiceCard[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const groups = [...new Set(options.map((o) => o.group ?? ""))];
  return (
    <fieldset className={cx("di-choicecards", className)}>
      <legend className={cx("di-choicecards-legend", hideLegend && "di-sr")}>{legend}</legend>
      {groups.map((group) => (
        <div key={group} className="di-choicecards-group">
          {group ? <p className="di-choicecards-group-label">{group}</p> : null}
          <div className="di-choicecards-grid">
            {options
              .filter((o) => (o.group ?? "") === group)
              .map((option) => (
                <label
                  key={option.value}
                  className={cx("di-choicecard", option.value === value && "is-active")}
                  title={option.more}
                >
                  <input
                    type="radio"
                    className="di-sr"
                    name={name}
                    value={option.value}
                    checked={option.value === value}
                    aria-description={option.more}
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
        </div>
      ))}
    </fieldset>
  );
}
