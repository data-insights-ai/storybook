import { FieldHint } from "../../field/FieldHint";
import { FieldLabel } from "../../field/FieldLabel";
import { SegmentedInput } from "../segments";
import "../../field/Field/Field.css";
import "../Calendar.css";
import "../DateField/DateField.css";

/**
 * A day typed in segments without a calendar of its own, for a form that
 * already shows one beside it. The value is an ISO day, or empty while a
 * segment is; the other segments keep what was typed. A hint under it is
 * an error.
 */
export function TypedDay({
  id,
  label,
  value,
  onChange,
  locale,
  emptyLabel,
  error = "",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  locale: string;
  emptyLabel?: string;
  error?: string;
}) {
  return (
    <div className="di-field">
      <FieldLabel id={`${id}-label`} label={label} />
      <SegmentedInput
        kind="date"
        group
        id={id}
        className="di-control di-date-control di-date-input"
        locale={locale}
        value={value}
        onChange={onChange}
        labelledBy={`${id}-label`}
        describedBy={error === "" ? undefined : `${id}-hint`}
        invalid={error !== ""}
        emptyLabel={emptyLabel}
      />
      <FieldHint id={`${id}-hint`} tone="error">
        {error}
      </FieldHint>
    </div>
  );
}
