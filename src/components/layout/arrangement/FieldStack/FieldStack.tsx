import type { ReactNode } from "react";
import "./FieldStack.css";

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
