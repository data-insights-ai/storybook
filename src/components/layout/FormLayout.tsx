import type { ReactNode } from "react";
import "./FormLayout.css";

/**
 * A form read down one column. Fields are spaced by `--di-rhythm-field` and
 * sized by what they take: text, an email address or a URL spans the
 * column; a select is as wide as its options; a number is short. The column
 * itself stops at `--di-measure-form`, so a field never runs the width of a
 * table. Follow it with `Actions`.
 */
export function FieldStack({ children }: { children: ReactNode }) {
  return <div className="di-field-stack">{children}</div>;
}

/**
 * A one-line form: add an entry, apply a value. The first field grows and
 * takes the room; the rest are as wide as their content; the button sits
 * on the control row, aligned with the inputs, and an error line under a
 * field does not move it. Under 600px it becomes a `FieldStack`.
 */
export function InlineForm({ children }: { children: ReactNode }) {
  return (
    <div className="di-inline-form">
      <div className="di-inline-form-row">{children}</div>
    </div>
  );
}
