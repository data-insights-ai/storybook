import { cx } from "../cx";
import "./SegmentedControl.css";

/**
 * Controlled. Two to four mutually exclusive views of the same data —
 * a density, a range, a unit. Anything longer is a select.
 *
 * Built as a radio group so arrow keys move between the segments and a
 * screen reader hears which one of how many is set.
 */
export function SegmentedControl({
  name,
  legend,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: {
  /** Shared across the segments, so the browser treats them as one choice. */
  name: string;
  /** Names the choice. Hidden visually; the segments read as the options. */
  legend: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <fieldset className={cx("di-segmented", className)} disabled={disabled}>
      <legend className="di-sr">{legend}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className={cx("di-segment", option.value === value && "is-active")}
        >
          <input
            type="radio"
            className="di-sr"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
