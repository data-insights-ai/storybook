import { useEffect } from "react";

function editable(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select") !== null);
}

export function useToggleShortcut(key: string | false, toggle: () => void) {
  useEffect(() => {
    if (key === false) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const modified = (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey;
      // Cmd/Ctrl+B means bold inside a text field; leave it to the field.
      if (!modified || event.key.toLowerCase() !== key || editable(event.target)) return;
      event.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, toggle]);
}
