import { useContext, useEffect, useRef } from "react";
import type { CalendarDate } from "@internationalized/date";
import { DateField, DateFieldStateContext, DateInput, DateSegment, Label } from "react-aria-components/DateField";
import { FieldHint } from "../FieldHint";
import { parseTypedDate } from "./dateRangeDraft";
import "../Field.css";
import "./Calendar.css";
import "./DateField.css";

// React Aria keeps the last whole day while a segment is emptied; the
// typed value is empty then, as a native date input reports it. The field
// keeps that day, since an empty value would also clear the other segments.
function EmptyWhileIncomplete({ onEmpty }: { onEmpty: () => void }) {
  const state = useContext(DateFieldStateContext);
  const incomplete = state?.segments.some((segment) => segment.isEditable && segment.isPlaceholder) ?? false;
  useEffect(() => {
    if (incomplete) onEmpty();
  }, [incomplete]);
  return null;
}

/**
 * A day typed in segments without a calendar of its own, for a form that
 * already shows one beside it. The value is an ISO day or empty; a hint
 * under it is an error.
 */
export function TypedDay({
  id,
  label,
  value,
  onChange,
  error = "",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const last = useRef<CalendarDate | null>(null);
  last.current = parseTypedDate(value) ?? last.current;
  return (
    <DateField
      id={id}
      className="di-field"
      value={last.current}
      onChange={(day) => {
        last.current = day;
        onChange(day ? day.toString() : "");
      }}
      isInvalid={error !== ""}
      shouldForceLeadingZeros
      aria-describedby={error === "" ? undefined : `${id}-hint`}
    >
      <EmptyWhileIncomplete onEmpty={() => value !== "" && onChange("")} />
      <Label className="di-field-label di-field-label-record">{label}</Label>
      <DateInput className="di-control di-date-control di-date-input">
        {(segment) => <DateSegment segment={segment} className="di-date-segment" />}
      </DateInput>
      <FieldHint id={`${id}-hint`} tone="error">
        {error}
      </FieldHint>
    </DateField>
  );
}
