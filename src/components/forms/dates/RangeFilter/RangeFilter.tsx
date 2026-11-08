import type { ComponentProps } from "react";
import type { FilterPlace } from "../../../actions/FilterBar";
import { Stack } from "../../../layout/arrange/Stack";
import { FieldLabel } from "../../field/FieldLabel";
import { DateRangePicker } from "../DateRangePicker";

/**
 * A list's period in its filter bar, after the filters: the picker reads
 * its label in the bar and shows it in the sheet, where its copy takes its
 * own id. Keep the period in the URL with `periodSearch` and read it back
 * with `periodOf`.
 */
export function RangeFilter({
  id,
  label,
  place = "bar",
  ...picker
}: ComponentProps<typeof DateRangePicker> & { place?: FilterPlace }) {
  const shownId = place === "sheet" ? `${id}-sheet` : id;
  const control = <DateRangePicker id={shownId} label={label} {...picker} />;
  return place === "bar" ? (
    control
  ) : (
    <Stack gap={8}>
      <FieldLabel htmlFor={shownId} label={label} />
      {control}
    </Stack>
  );
}
