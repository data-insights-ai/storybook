import { useEffect, useRef } from "react";

function editable(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select") !== null);
}

/**
 * A single-key shortcut for a page's frequent action: `/` focuses the
 * search, `n` starts a new entry, `e` edits or exports. It never fires
 * while the reader types in a field, with a modifier held, or while a
 * dialog is open. Show the key beside the control (`SearchField`'s
 * `shortcut`, a `Kbd`) so the shortcut is discoverable.
 */
export function useShortcut(key: string | false, action: () => void) {
  const latest = useRef(action);
  latest.current = action;

  useEffect(() => {
    if (key === false) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return;
      if (event.key !== key || editable(event.target)) return;
      if (document.querySelector("dialog[open]")) return;
      event.preventDefault();
      latest.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key]);
}
