import { cloneElement, isValidElement, useId, type ReactNode } from "react";
import "./DangerAction.css";

/**
 * One destructive action in a `Panel tone="danger"`: what it does, what
 * follows from it, and its button (`Button variant="danger"`, which opens a
 * `ConfirmDialog`) as the child. `note` explains why the button is disabled
 * when it is, e.g. that the last owner cannot leave: it sits under the
 * button, end-aligned with it, and describes it (`aria-describedby`).
 */
export function DangerAction({
  title,
  body,
  note = "",
  children,
}: {
  title: string;
  /** The consequence, in one or two sentences. */
  body: string;
  /** Why the action is not available right now. Empty means it is. */
  note?: string;
  /** The destructive button. */
  children: ReactNode;
}) {
  const noteId = useId();
  const control =
    note && isValidElement<{ "aria-describedby"?: string }>(children)
      ? cloneElement(children, {
          "aria-describedby": [children.props["aria-describedby"], noteId].filter(Boolean).join(" "),
        })
      : children;
  return (
    <div className="di-danger-action">
      <div className="di-danger-action-text">
        <p className="di-danger-action-title">{title}</p>
        <p className="di-danger-action-body">{body}</p>
      </div>
      <div className="di-danger-action-control">
        {control}
        {note ? (
          <p className="di-danger-action-note" id={noteId}>
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
