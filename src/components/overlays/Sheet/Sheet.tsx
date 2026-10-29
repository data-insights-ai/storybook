import { Children, isValidElement, useContext, useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { PageSide } from "../../layout/page/pageSide";
import { focusFirstField } from "../../../internal/shortcutKeys";
import { useShortcut } from "../../../internal/useShortcut";
import { useModalDialog } from "../useModalDialog";
import "./Sheet.css";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  lede?: string;
  /** The close button's accessible name. */
  closeLabel: string;
  /** `md` is a form or a record; `lg` holds a table or two columns; `xl` a record read field by field beside its source. */
  size?: "md" | "lg" | "xl";
  /** The body, and optionally one `SheetFooter`. */
  children: ReactNode;
};

/**
 * A panel for work that needs more room than a section's inline form and
 * should not leave the list behind it: a record's detail opened from its
 * row, a multi-field create or invite.
 *
 * Inside a `list` or `detail` `Page` wide enough for its side column, an
 * `md` sheet docks there: the page stays usable beside it (a list keeps
 * Up, Down and Enter), it starts in its first field, Esc and the close
 * button close it, and focus returns to whatever opened it.
 *
 * Anywhere else, and always at `lg` and `xl`, it is a modal native
 * `<dialog>` from the right edge: focus moves in and is trapped, the page
 * behind is inert, and on a phone it takes the screen. `SheetFooter` holds
 * its actions and stays in view while the body scrolls.
 */
export function Sheet(props: SheetProps) {
  const side = useContext(PageSide);
  if (side && (props.size ?? "md") === "md") return <DockedSheet {...props} side={side} />;
  return <ModalSheet {...props} />;
}

/** The sheet's actions, pinned to its bottom edge: Cancel, then the one that commits. */
export function SheetFooter({ children }: { children: ReactNode }) {
  return <div className="di-sheet-footer">{children}</div>;
}

function ModalSheet({ open, onClose, title, lede, closeLabel, size = "md", children }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useModalDialog(ref, open);

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
        <SheetFrame titleId={titleId} title={title} lede={lede} closeLabel={closeLabel} onClose={onClose}>
          {children}
        </SheetFrame>
      ) : null}
    </dialog>
  );
}

function DockedSheet({ open, onClose, title, lede, closeLabel, children, side }: SheetProps & { side: HTMLElement }) {
  const ref = useRef<HTMLElement>(null);
  const titleId = useId();
  const opener = useRef<HTMLElement | null>(null);
  const shown = useRef(false);
  // Read while rendering, before the sheet takes focus, as the modal does.
  if (open && !shown.current && typeof document !== "undefined") {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) opener.current = active;
  }
  shown.current = open;

  useEffect(() => {
    if (!open) return;
    const panel = ref.current;
    focusFirstField(panel);
    return () => {
      const target = opener.current;
      const active = document.activeElement;
      const lost = !active || active === document.body || (panel !== null && panel.contains(active));
      if (target?.isConnected && lost) target.focus({ preventScroll: true });
    };
  }, [open]);

  // Esc from the page beside it; inside the sheet its own handler answers first, also in a field.
  useShortcut(open ? "Escape" : false, onClose);

  if (!open) return null;
  return createPortal(
    <section
      ref={ref}
      className="di-sheet-docked"
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || event.defaultPrevented) return;
        event.preventDefault();
        onClose();
      }}
    >
      <SheetFrame titleId={titleId} title={title} lede={lede} closeLabel={closeLabel} onClose={onClose}>
        {children}
      </SheetFrame>
    </section>,
    side,
  );
}

function SheetFrame({
  titleId,
  title,
  lede,
  closeLabel,
  onClose,
  children,
}: Pick<SheetProps, "title" | "lede" | "closeLabel" | "onClose" | "children"> & { titleId: string }) {
  const footer: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === SheetFooter) footer.push(child);
    else body.push(child);
  });
  return (
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
  );
}
