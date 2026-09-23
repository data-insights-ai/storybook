import { useEffect, useRef, type ReactNode } from "react";
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

/** Icon column, then the content: the modal keeps the register's shape. */
export function ModalFrame({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="di-modal-frame">
      {icon === undefined ? null : <div className="di-modal-icon">{icon}</div>}
      <div className="di-modal-body">{children}</div>
    </div>
  );
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

/**
 * What the action will touch, stated before it runs. Scope and
 * reversibility belong here, not in a tooltip.
 */
export function FactList({ children }: { children: ReactNode }) {
  return <dl className="di-facts">{children}</dl>;
}

export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="di-fact">
      <dt className="di-fact-label">{label}</dt>
      <dd className="di-fact-value">{children}</dd>
    </div>
  );
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return <div className="di-modal-footer">{children}</div>;
}
