import type { ReactNode } from "react";
import "./InlineForm.css";

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
