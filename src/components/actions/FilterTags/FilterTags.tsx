import type { ReactNode } from "react";
import type { FilterPlace } from "../FilterBar";
import { FieldLabel } from "../../forms/field/FieldLabel";
import "./FilterTags.css";

/**
 * Toggle tags (`Tag` with `onClick`) that filter together: one line in the
 * bar, a labelled group that wraps in the sheet.
 */
export function FilterTags({
  label,
  place = "bar",
  children,
}: {
  label: string;
  place?: FilterPlace;
  children: ReactNode;
}) {
  const group = (
    <div className="di-filter-tags" role="group" aria-label={label}>
      {children}
    </div>
  );
  return place === "bar" ? (
    group
  ) : (
    <div className="di-filter-tags-field">
      <FieldLabel label={label} />
      {group}
    </div>
  );
}
