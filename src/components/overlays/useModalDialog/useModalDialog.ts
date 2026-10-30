import { useEffect, useInsertionEffect, useRef, type RefObject } from "react";
import { focusFirstField } from "../../../internal/shortcutKeys";

/**
 * Opens and closes a native modal `<dialog>` with `open`, and returns focus
 * to what opened it when it closes or is removed outright: browsers restore
 * focus on `close()`, but not when the product unmounts the dialog.
 *
 * On open, focus goes to the element marked `data-autofocus` (the Cancel of
 * a question), else to the first field; with neither, to the element
 * `fallback` selects (a dialog's title), rather than to the close button.
 */
export function useModalDialog(ref: RefObject<HTMLDialogElement | null>, open: boolean, fallback?: string) {
  const opener = useRef<HTMLElement | null>(null);
  const shown = useRef(false);
  // Read before any layout or passive effect: by then the content may already
  // have moved focus into the dialog. Kept until the next open, so a second
  // effect pass in StrictMode still finds it.
  useInsertionEffect(() => {
    if (open && !shown.current) {
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body && !ref.current?.contains(active))
        opener.current = active;
    }
    shown.current = open;
  }, [ref, open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      const marked = dialog.querySelector<HTMLElement>("[data-autofocus]");
      if (marked) marked.focus({ preventScroll: true });
      else if (!focusFirstField(dialog) && fallback)
        dialog.querySelector<HTMLElement>(fallback)?.focus({ preventScroll: true });
    }
    if (!open && dialog.open) {
      dialog.close();
      returnFocus(opener, dialog);
    }
  }, [ref, open, fallback]);

  useEffect(() => {
    const dialog = ref.current;
    return () => returnFocus(opener, dialog);
  }, [ref]);
}

function returnFocus(opener: { current: HTMLElement | null }, dialog: HTMLDialogElement | null) {
  const target = opener.current;
  if (!target?.isConnected) return;
  const active = document.activeElement;
  const lost = !active || active === document.body || (dialog !== null && dialog.contains(active));
  if (lost) target.focus({ preventScroll: true });
}
