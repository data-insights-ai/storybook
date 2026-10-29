import { cx } from "../../../../cx";
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
 * of a week. Each button says whether it is pressed; the legend names the
 * group.
 */
export function ToggleGroup({
  legend,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: {
  legend: string;
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
        : options
            .map((o) => o.value)
            .filter((x) => x === v || value.includes(x)),
    );
  return (
    <fieldset className={cx("di-toggle-group", className)} disabled={disabled}>
      <legend className="di-toggle-legend">{legend}</legend>
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
    </fieldset>
  );
}
