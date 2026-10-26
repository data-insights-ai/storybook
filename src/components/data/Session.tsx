import { Children, isValidElement, type ReactNode } from "react";
import "./Session.css";

/**
 * The signed-in operator, on record. `name` is read as text, so it stays
 * a prop. The mark, the detail line, anything set beside the name and the
 * trailing control are slots: each can hold a component.
 */
export function Session({
  name,
  children,
}: {
  name: string;
  /** A `SessionDetail`, `SessionMark`, `SessionTag`, `SessionAction`. */
  children?: ReactNode;
}) {
  /* `SessionDetail` sits under the name, inside the copy block. */
  const detail: ReactNode[] = [];
  const rest: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === SessionDetail) detail.push(child);
    else rest.push(child);
  });
  return (
    <div className="di-session">
      <div className="di-session-copy">
        <div className="di-session-name">{name}</div>
        {detail}
      </div>
      {rest}
    </div>
  );
}

/**
 * The line under the name: the address and how long the session holds.
 * A slot, because the validity is a timestamp — a value, not prose.
 */
export function SessionDetail({ children }: { children: ReactNode }) {
  return <p className="di-session-detail">{children}</p>;
}

/** The avatar or seal at the leading edge. */
export function SessionMark({ children }: { children: ReactNode }) {
  return <div className="di-session-mark">{children}</div>;
}

/** A pill set beside the name: the role, the plan, the state. */
export function SessionTag({ children }: { children: ReactNode }) {
  return <div className="di-session-tag">{children}</div>;
}

/** The trailing control, for example “Sign out”. */
export function SessionAction({ children }: { children: ReactNode }) {
  return <div className="di-session-action">{children}</div>;
}
