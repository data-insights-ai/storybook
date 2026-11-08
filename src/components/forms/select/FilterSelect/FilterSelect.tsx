import type { FilterPlace } from "../../../actions/FilterBar";
import { Select } from "../Select";

/**
 * A filter in a list's filter bar: its first option names it and shows
 * everything ("All roles"). In the bar the label is read, in the sheet it
 * is shown; the sheet's copy takes its own id, since the bar's stays
 * mounted behind it.
 */
export function FilterSelect<V extends string>({
  id,
  label,
  all,
  value,
  options,
  onChange,
  place = "bar",
}: {
  id: string;
  label: string;
  /** The first option, which shows everything. */
  all: string;
  value: V | "";
  options: readonly { value: V; label: string }[];
  onChange: (value: V | "") => void;
  place?: FilterPlace;
}) {
  return (
    <Select
      id={place === "sheet" ? `${id}-sheet` : id}
      label={label}
      hideLabel={place === "bar"}
      value={value}
      onChange={(event) => onChange(event.target.value as V | "")}
    >
      <option value="">{all}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
