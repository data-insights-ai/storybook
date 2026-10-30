import { Children, isValidElement, useRef, type ReactNode } from "react";
import { Eyebrow } from "../../text/Eyebrow";
import { useModalDialog } from "../useModalDialog";
import "./Modal.css";

/**
 * Only an irreversible action earns a modal. The scrim is solid navy,
 * never a blur: the record behind it must not turn decorative while an
 * operator is deciding.
 *
 * Built on the native `<dialog>`, so focus is trapped, the page behind
 * goes inert and Escape closes without a keyboard trap of our own.
 *
 * @deprecated Removed in 0.12: use `Dialog placement="center"`, which takes the title, eyebrow and lede as props and `DialogFooter` for the actions; the icon column goes.
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

  useModalDialog(ref, open);

  return (
    <dialog
      ref={ref}
      className="di-modal"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onCancel={onClose}
      onClose={onClose}
    >
      {open ? children : null}
    </dialog>
  );
}

/**
 * Icon column, then the content: the modal keeps the register's shape.
 * A leading `ModalIcon` fills the column; everything else is the body.
 *
 * @deprecated Removed in 0.12: use `Dialog placement="center"`, which takes the title, eyebrow and lede as props and `DialogFooter` for the actions; the icon column goes.
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

/** @deprecated Removed in 0.12 with `Modal`: `Dialog` has no icon column. */
export function ModalIcon({ children }: { children: ReactNode }) {
  return <div className="di-modal-icon">{children}</div>;
}

/**
 * The title, the body and, last, the `ModalFooter`. The footer is lifted out
 * of the padded content wherever it is placed, so it always spans the
 * modal's width with the same padding and a step of space above it.
 *
 * @deprecated Removed in 0.12: use `Dialog placement="center"`, which takes the title, eyebrow and lede as props and `DialogFooter` for the actions; the icon column goes.
 */
export function ModalContent({ children }: { children: ReactNode }) {
  const footer: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === ModalFooter) footer.push(child);
    else body.push(child);
  });
  return (
    <div className="di-modal-column">
      <div className="di-modal-content">{body}</div>
      {footer}
    </div>
  );
}

/**
 * The modal's heading. Its `id` is what `ModalFrame` names the dialog by, so
 * the two must match; `eyebrow` is an optional line above it, in the danger
 * ink only when `eyebrowTone="danger"`: an export is not a warning.
 *
 * @deprecated Removed in 0.12: use `Dialog placement="center"`, which takes the title, eyebrow and lede as props and `DialogFooter` for the actions; the icon column goes.
 */
export function ModalTitle({
  id,
  eyebrow,
  eyebrowTone = "quiet",
  children,
}: {
  id: string;
  eyebrow?: string;
  eyebrowTone?: "quiet" | "danger";
  children: ReactNode;
}) {
  return (
    <>
      {eyebrow === undefined ? null : (
        <Eyebrow variant="plain" tone={eyebrowTone}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2 className="di-modal-title" id={id}>
        {children}
      </h2>
    </>
  );
}

/**
 * The explanation under the title: a sentence, or paragraphs and a field.
 * A block, so paragraphs and controls inside it stay valid HTML.
 *
 * @deprecated Removed in 0.12: use `Dialog placement="center"`, which takes the title, eyebrow and lede as props and `DialogFooter` for the actions; the icon column goes.
 */
export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="di-modal-text">{children}</div>;
}
/**
 * The modal's closing row of actions, set at its end. The primary action comes
 * last.
 *
 * @deprecated Removed in 0.12: use `Dialog placement="center"`, which takes the title, eyebrow and lede as props and `DialogFooter` for the actions; the icon column goes.
 */
export function ModalFooter({ children }: { children: ReactNode }) {
  return <div className="di-modal-footer">{children}</div>;
}
