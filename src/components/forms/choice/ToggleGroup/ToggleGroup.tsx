import { cx } from "../../../../internal/cx";
import "../../field/Field/Field.css";
import "./ToggleGroup.css";

export type ToggleOption = {
  value: string;
  /** Shown on the button, such as "Mo". */
  label: string;
  /** Read by a screen reader instead, such as "Monday". */
  name?: string;
};

/**
 * Several of a short list switched on and off at once, such as the days
 * of a week. Each button says whether it is pressed. The legend names the
 * group above it as a field label does, so the group lines up with the
 * fields beside it; `hideLegend` keeps it for assistive technology only,
 * where the place already names the group.
 */
export function ToggleGroup({
  legend,
  hideLegend = false,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: {
  legend: string;
  hideLegend?: boolean;
  options: readonly ToggleOption[];
  value: readonly string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
}) {
  const toggle = (v: string) =>
    onChange(
      value.includes(v)
        ? value.filter((x) => x !== v)
        : options.map((o) => o.value).filter((x) => x === v || value.includes(x)),
    );
  return (
    <fieldset className={cx("di-toggle-group", className)} disabled={disabled}>
      <legend className={cx("di-field-label", "di-field-label-record", "di-toggle-legend", hideLegend && "di-sr")}>
        {legend}
      </legend>
      <div className="di-toggle-row">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className="di-toggle"
            aria-pressed={value.includes(o.value)}
            aria-label={o.name}
            onClick={() => toggle(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
