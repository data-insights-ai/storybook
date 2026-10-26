import { useEffect, useRef, type RefObject } from "react";
import { focusFirstField } from "../navigation/shortcuts/shortcutKeys";

const focusable =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Focus for a dialog that is not a native `<dialog>`: it moves into the
 * panel when it mounts and back to what had it when the panel goes. Escape
 * calls `onClose`; `trap` keeps Tab and Shift+Tab inside the panel.
 */
export function useDialogFocus(panel: RefObject<HTMLElement | null>, onClose: () => void, trap: boolean) {
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const node = panel.current;
    if (!node) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!focusFirstField(node)) node.focus({ preventScroll: true });

    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        close.current();
        return;
      }
      if (!trap || event.key !== "Tab") return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(focusable)).filter((el) => el.getClientRects().length > 0);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === node)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", keydown);
    return () => {
      node.removeEventListener("keydown", keydown);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [panel, trap]);
}
