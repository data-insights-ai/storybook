import { Children, isValidElement, useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { focusFirstField } from "./shortcutKeys";
import "./Sheet.css";

/**
 * A modal panel from the right edge, for work that needs more room than a
 * section's inline form and should not leave the list behind it: a
 * record's detail opened from its row, a multi-field create or invite.
 *
 * A native `<dialog>`: focus moves into the sheet and is trapped there,
 * the page behind is inert, Escape and the close button close it, and
 * focus returns to whatever opened it. On a phone it takes the screen.
 * `SheetFooter` holds its actions and stays in view while the body scrolls.
 */
export function Sheet({
  open,
  onClose,
  title,
  lede,
  closeLabel,
  size = "md",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  lede?: string;
  /** The close button's accessible name. */
  closeLabel: string;
  /** `md` is a form or a record; `lg` holds a table or two columns. */
  size?: "md" | "lg";
  /** The body, and optionally one `SheetFooter`. */
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      focusFirstField(dialog);
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const footer: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === SheetFooter) footer.push(child);
    else body.push(child);
  });

  return (
    <dialog
      ref={ref}
      className="di-sheet"
      role="dialog"
      aria-modal="true"
      data-size={size}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || event.defaultPrevented) return;
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      {open ? (
        <div className="di-sheet-frame">
          <header className="di-sheet-head">
            <div className="di-sheet-heading">
              <h2 className="di-sheet-title" id={titleId}>
                {title}
              </h2>
              {lede ? <p className="di-sheet-lede">{lede}</p> : null}
            </div>
            <button type="button" className="di-sheet-close" aria-label={closeLabel} onClick={onClose}>
              <X aria-hidden />
            </button>
          </header>
          <div className="di-sheet-body">{body}</div>
          {footer}
        </div>
      ) : null}
    </dialog>
  );
}

/** The sheet's actions, pinned to its bottom edge: Cancel, then the one that commits. */
export function SheetFooter({ children }: { children: ReactNode }) {
  return <div className="di-sheet-footer">{children}</div>;
}
