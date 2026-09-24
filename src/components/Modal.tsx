import { Children, isValidElement, useEffect, useRef, type ReactNode } from "react";
import "./Modal.css";

/**
 * Only an irreversible action earns a modal. The scrim is solid navy,
 * never a blur: the record behind it must not turn decorative while an
 * operator is deciding.
 *
 * Built on the native `<dialog>`, so focus is trapped, the page behind
 * goes inert and Escape closes without a keyboard trap of our own.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** The id of the element naming the dialog, usually the title. */
  labelledBy: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="di-modal" aria-labelledby={labelledBy} onCancel={onClose} onClose={onClose}>
      {open ? children : null}
    </dialog>
  );
}

/**
 * Icon column, then the content: the modal keeps the register's shape.
 * A leading `ModalIcon` fills the column; everything else is the body.
 */
export function ModalFrame({ children }: { children: ReactNode }) {
  const icon: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === ModalIcon) icon.push(child);
    else body.push(child);
  });
  return (
    <div className="di-modal-frame">
      {icon}
      <div className="di-modal-body">{body}</div>
    </div>
  );
}

/** The mark in the modal's index column. */
export function ModalIcon({ children }: { children: ReactNode }) {
  return <div className="di-modal-icon">{children}</div>;
}

export function ModalContent({ children }: { children: ReactNode }) {
  return <div className="di-modal-content">{children}</div>;
}

export function ModalTitle({ id, eyebrow, children }: { id: string; eyebrow?: string; children: ReactNode }) {
  return (
    <>
      {eyebrow === undefined ? null : <p className="di-modal-eyebrow">{eyebrow}</p>}
      <h2 className="di-modal-title" id={id}>
        {children}
      </h2>
    </>
  );
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <p className="di-modal-text">{children}</p>;
}
export function ModalFooter({ children }: { children: ReactNode }) {
  return <div className="di-modal-footer">{children}</div>;
}
