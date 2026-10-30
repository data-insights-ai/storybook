import type { ReactNode } from "react";
import { takeSlot } from "../../../../internal/slots";
import "./Toolbar.css";

/**
 * A row of controls that wraps when it runs out of room. Holding fields, it
 * becomes a one-line form: each button sits on the control row beside the
 * input, an error line under a field does not move it, and under 600px the
 * row stacks.
 */
export function Toolbar({ children }: { children: ReactNode }) {
  const [end, rest] = takeSlot(children, ToolbarEnd);
  return (
    <div className="di-toolbar">
      {rest}
      {end}
    </div>
  );
}

/** The controls a `Toolbar` pushes to its far end. */
export function ToolbarEnd({ children }: { children: ReactNode }) {
  return <div className="di-toolbar-end">{children}</div>;
}
