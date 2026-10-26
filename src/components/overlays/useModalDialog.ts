import { useEffect, useRef, type RefObject } from "react";
import { focusFirstField } from "../navigation/shortcuts/shortcutKeys";

/**
 * Opens and closes a native modal `<dialog>` with `open`, and returns focus
 * to what opened it when it closes or is removed outright: browsers restore
 * focus on `close()`, but not when the product unmounts the dialog.
 */
export function useModalDialog(ref: RefObject<HTMLDialogElement | null>, open: boolean) {
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      const active = document.activeElement;
      opener.current = active instanceof HTMLElement && active !== document.body ? active : null;
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
  opener.current = null;
  if (!target?.isConnected) return;
  const active = document.activeElement;
  const lost = !active || active === document.body || (dialog !== null && dialog.contains(active));
  if (lost) target.focus({ preventScroll: true });
}
