import { useId, type ReactNode } from "react";
import "./DangerZone.css";

/**
 * The end of a detail page: what cannot be taken back, set apart so it
 * never reads as one more setting. Each `DangerAction` names the action,
 * states its consequence in a sentence, and carries one destructive button
 * that opens a `ConfirmDialog`. Nothing else goes here, and nothing
 * destructive goes anywhere else on the page.
 */
export function DangerZone({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  /** One or more `DangerAction`s. */
  children: ReactNode;
}) {
  const titleId = useId();
  return (
    <section className="di-danger-zone" aria-labelledby={titleId}>
      <header className="di-danger-zone-head">
        <h2 className="di-danger-zone-title" id={titleId}>
          {title}
        </h2>
        {lede ? <p className="di-danger-zone-lede">{lede}</p> : null}
      </header>
      <div className="di-danger-zone-list">{children}</div>
    </section>
  );
}

/**
 * One destructive action: what it does, what follows from it, and its
 * button (`Button variant="danger"`) as the child. `note` explains why the
 * button is disabled when it is, e.g. that the last owner cannot leave.
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
  return (
    <div className="di-danger-action">
      <div className="di-danger-action-text">
        <p className="di-danger-action-title">{title}</p>
        <p className="di-danger-action-body">{body}</p>
        {note ? (
          <p className="di-danger-action-note">
            {note}
          </p>
        ) : null}
      </div>
      <div className="di-danger-action-control">
        {children}
      </div>
    </div>
  );
}
