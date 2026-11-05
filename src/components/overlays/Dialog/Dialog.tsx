import {
  Children,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
  type FormEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { OctagonAlert, X } from "lucide-react";
import { PageSide, SIDE_LIST } from "../../layout/page/pageSide";
import { cx } from "../../../internal/cx";
import { pressedOf, takePress } from "../../../internal/lastPress";
import { focusFirstField } from "../../../internal/shortcutKeys";
import { surfaceClass } from "../../../internal/surface";
import { Eyebrow } from "../../text/Eyebrow";
import { useShortcut } from "../../../internal/useShortcut";
import { useModalDialog } from "../useModalDialog";
import { useVisibleViewport } from "../../../internal/useVisibleViewport";
import "./Dialog.css";

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** One line under the title: an address, what the dialog decides. */
  lede?: string;
  /** A line above the title naming the record it acts on, such as `Member · WS-01`. */
  eyebrow?: string;
  /** `danger` only when the dialog asks before something that cannot be taken back; otherwise the quiet label ink. */
  eyebrowTone?: "quiet" | "danger";
  /** `danger` when the dialog asks before something that cannot be taken back: the danger mark leads the title, and the eyebrow takes the danger ink. */
  tone?: "neutral" | "danger";
  /** The close button's accessible name. A `side` or `bottom` dialog always has one; a `center` decision may rely on its Cancel. */
  closeLabel?: string;
  /** `side` from the right edge (a record, a form); `center` a decision; `bottom` a picker on a phone. */
  placement?: "side" | "center" | "bottom";
  /** `sm` a short question; `md` a form or a record; `lg` a table or two columns; `xl` a record read beside its source. */
  size?: "sm" | "md" | "lg" | "xl";
  /** With it the body and footer are one form: Enter in a field submits, the footer's submit button commits. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  /** The body, and optionally one `DialogFooter`. */
  children: ReactNode;
};

/**
 * Work that has to be done before the page goes on, above the page.
 *
 * - `side`: a record opened from its row, a create or edit form with more
 *   fields than a section's inline form. In a `list` or `detail` `Page`
 *   wide enough for its side column an `md` side dialog docks there and the
 *   page stays usable beside it.
 * - `center`: a decision, short and final — the question before an
 *   irreversible step (use `ConfirmDialog`), the keys of a page
 *   (`ShortcutHelp`), an export to confirm.
 * - `bottom`: a picker on a phone that rises from the bottom edge.
 *
 * Not for a panel under a topbar control (`Flyout`), a receipt (`Toast`) or
 * a label (`Tooltip`).
 *
 * Anatomy: an optional `eyebrow` (the record), the `title` in the display
 * face, an optional `lede`, the close button, the body, then one
 * `DialogFooter` — Cancel, then the one action that commits. All rows sit
 * on one surface at one inset, with no rule and no band.
 *
 * Built on the native `<dialog>`: focus moves in, to the first field or,
 * with none, to the title (never the close button), and is trapped; the
 * page behind is inert; Escape closes, and so does a press on the scrim
 * beside a `side` or `bottom` dialog; focus returns to what opened it.
 * Docked, the page is not inert, but focus lands and returns the same way,
 * and what was pressed to open it closes it on a second press (it carries
 * `aria-expanded` meanwhile); another row of the same list shows its record.
 * Opened from a row of a table, it stands level with that table.
 */
export function Dialog(props: DialogProps) {
  const side = useContext(PageSide);
  const placement = props.placement ?? "side";
  if (side && placement === "side" && (props.size ?? "md") === "md") return <DockedDialog {...props} side={side} />;
  return <ModalDialog {...props} />;
}

/**
 * The dialog's actions, pinned to its bottom edge: Cancel, then the one that
 * commits. `note` says at the start why the action waits, such as "Choose at
 * least one permission"; where it does not fit beside them it takes the row
 * above, and the actions stay together.
 */
export function DialogFooter({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className="di-dialog-footer">
      {note ? <p className="di-dialog-footer-note">{note}</p> : null}
      <div className="di-dialog-footer-actions">{children}</div>
    </div>
  );
}

function ModalDialog(props: DialogProps) {
  const { open, onClose, placement = "side", size = "md" } = props;
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useModalDialog(ref, open, ".di-dialog-title");
  useVisibleViewport(ref, open);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Esc and a press on the scrim close the dialog
    <dialog
      ref={ref}
      className="di-dialog"
      aria-modal="true"
      data-placement={placement}
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
        if (placement !== "center" && event.target === ref.current) onClose();
      }}
    >
      {open ? <DialogFrame {...props} titleId={titleId} /> : null}
    </dialog>
  );
}

const listOf = (el: HTMLElement) => el.closest("table, ul, ol, [role=grid], [role=list]");

function DockedDialog(props: DialogProps & { side: HTMLElement }) {
  const { open, onClose, side } = props;
  const ref = useRef<HTMLElement>(null);
  const titleId = useId();
  const opener = useRef<HTMLElement | null>(null);
  const toggle = useRef<HTMLElement | null>(null);
  const close = useRef(onClose);
  const shown = useRef(false);
  // Read before any other effect, before the dialog takes focus, as the modal one does.
  useInsertionEffect(() => {
    close.current = onClose;
    if (open && !shown.current) {
      toggle.current = takePress();
      const active = document.activeElement;
      opener.current = toggle.current ?? (active instanceof HTMLElement && active !== document.body ? active : null);
    }
    shown.current = open;
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!open) return;
    const list = toggle.current?.closest(".di-table-wrap");
    list?.setAttribute(SIDE_LIST, "");
    return () => list?.removeAttribute(SIDE_LIST);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const panel = ref.current;
    const marked = panel?.querySelector<HTMLElement>("[data-autofocus]");
    if (marked) marked.focus({ preventScroll: true });
    else if (!focusFirstField(panel))
      panel?.querySelector<HTMLElement>(".di-dialog-title")?.focus({ preventScroll: true });
    return () => {
      const target = opener.current;
      const active = document.activeElement;
      const lost = !active || active === document.body || (panel !== null && panel.contains(active));
      if (target?.isConnected && lost) target.focus({ preventScroll: true });
    };
  }, [open]);

  // The page beside stays usable, so what was pressed to open it is a toggle: a second press closes
  // instead of opening again. Another row of the same list takes the toggle over, as it shows its record.
  useEffect(() => {
    if (!open) return;
    let marked: HTMLElement | null = null;
    const arm = (el: HTMLElement | null) => {
      marked?.removeAttribute("aria-expanded");
      marked = el && el.tagName !== "TR" && !el.hasAttribute("aria-expanded") ? el : null;
      marked?.setAttribute("aria-expanded", "true");
      toggle.current = el;
    };
    arm(toggle.current);
    const press = (event: MouseEvent) => {
      const el = pressedOf(event.target);
      if (!el || ref.current?.contains(el)) return;
      if (el === toggle.current) {
        event.preventDefault();
        event.stopPropagation();
        close.current();
      } else if (toggle.current && listOf(el) !== null && listOf(el) === listOf(toggle.current)) {
        opener.current = el;
        arm(el);
      }
    };
    document.addEventListener("click", press, true);
    return () => {
      document.removeEventListener("click", press, true);
      arm(null);
    };
  }, [open]);

  // Esc from the page beside it; inside the dialog its own handler answers first, also in a field.
  useShortcut(open ? "Escape" : false, onClose);

  if (!open) return null;
  return createPortal(
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Esc inside the docked dialog closes it
    <section
      ref={ref}
      className={cx(surfaceClass({ padded: false }), "di-dialog-docked")}
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || event.defaultPrevented) return;
        event.preventDefault();
        onClose();
      }}
    >
      <DialogFrame {...props} titleId={titleId} />
    </section>,
    side,
  );
}

function DialogFrame({
  titleId,
  title,
  lede,
  eyebrow,
  eyebrowTone = "quiet",
  tone = "neutral",
  closeLabel,
  onClose,
  onSubmit,
  children,
}: DialogProps & { titleId: string }) {
  const footer: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === DialogFooter) footer.push(child);
    else body.push(child);
  });
  const rest = (
    <>
      <div className="di-dialog-body">{body}</div>
      {footer}
    </>
  );
  return (
    <div className="di-dialog-frame">
      <header className="di-dialog-head">
        {eyebrow ? (
          <Eyebrow variant="plain" tone={tone === "danger" ? "danger" : eyebrowTone}>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <div className="di-dialog-title-row">
          {tone === "danger" ? <OctagonAlert className="di-dialog-mark" aria-hidden /> : null}
          <h2 className="di-dialog-title" id={titleId} tabIndex={-1}>
            {title}
          </h2>
          {closeLabel ? (
            <button type="button" className="di-dialog-close" aria-label={closeLabel} onClick={onClose}>
              <X aria-hidden />
            </button>
          ) : null}
        </div>
        {lede ? <p className="di-dialog-lede">{lede}</p> : null}
      </header>
      {onSubmit ? (
        <form className="di-dialog-form" onSubmit={onSubmit}>
          {rest}
        </form>
      ) : (
        rest
      )}
    </div>
  );
}
