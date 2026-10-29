import { useEffect, useRef, type RefObject } from "react";
import { focusFirstField } from "../../navigation/useShortcut";

/**
 * Opens and closes a native modal `<dialog>` with `open`, and returns focus
 * to what opened it when it closes or is removed outright: browsers restore
 * focus on `close()`, but not when the product unmounts the dialog.
 */
export function useModalDialog(ref: RefObject<HTMLDialogElement | null>, open: boolean) {
  const opener = useRef<HTMLElement | null>(null);
  const shown = useRef(false);
  // Read while rendering: by the time effects run, the content may already
  // have moved focus into the dialog. Kept until the next open, so a second
  // effect pass in StrictMode still finds it.
  if (open && !shown.current && typeof document !== "undefined") {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body && !ref.current?.contains(active)) opener.current = active;
  }
  shown.current = open;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      focusFirstField(dialog);
    }
    if (!open && dialog.open) {
      dialog.close();
      returnFocus(opener, dialog);
    }
  }, [ref, open]);

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
