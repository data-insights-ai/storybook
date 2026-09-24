import type { ReactNode } from "react";
import "./Session.css";

/**
 * The signed-in operator, on record. `name` and `detail` are text, so
 * they are props. The mark, anything set beside the name, and the
 * trailing control are slots: each can hold a component.
 */
export function Session({
  name,
  detail,
  children,
}: {
  name: string;
  /** The address and the validity, in one line. */
  detail: string;
  children?: ReactNode;
}) {
  return (
    <div className="di-session">
      <div className="di-session-copy">
        <div className="di-session-name">{name}</div>
        <p className="di-session-detail">{detail}</p>
      </div>
      {children}
    </div>
  );
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
