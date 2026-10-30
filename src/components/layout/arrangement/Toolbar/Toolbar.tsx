import type { ReactNode } from "react";
import { takeSlot } from "../../../../internal/slots";
import { cx } from "../../../../internal/cx";
import "./Toolbar.css";

/**
 * A row of controls that wraps when it runs out of room. Holding fields, it
 * becomes a one-line form: each button sits on the control row beside the
 * input, an error line under a field does not move it, and under 600px the
 * row stacks.
 *
 * `fillFirst` is the one-line add form (add a domain, assign a person): the
 * first field takes the free width, a select fits its options, a number is
 * short, and the row stacks when the toolbar itself is narrower than 600px,
 * in a sheet as on a phone.
 */
export function Toolbar({ fillFirst = false, children }: { fillFirst?: boolean; children: ReactNode }) {
  const [end, rest] = takeSlot(children, ToolbarEnd);
  const row = (
    <div className={cx("di-toolbar", fillFirst && "is-fill-first")}>
      {rest}
      {end}
    </div>
  );
  return fillFirst ? <div className="di-toolbar-frame">{row}</div> : row;
}

/** The controls a `Toolbar` pushes to its far end. */
export function ToolbarEnd({ children }: { children: ReactNode }) {
  return <div className="di-toolbar-end">{children}</div>;
}
