import { useEffect, useRef, type ReactNode } from "react";
import { editable } from "../../../internal/useShortcut";
import { Button } from "../Button";

/** The controls a `Toolbar` pushes to its far end, wherever they are written. */
export function ToolbarEnd({ children }: { children: ReactNode }) {
  return <div className="di-toolbar-end">{children}</div>;
}

/** One muted line under the row: what this tab or list holds. */
export function ToolbarNote({ children }: { children: ReactNode }) {
  return <p className="di-toolbar-note">{children}</p>;
}

/** What the bar is about, announced when it changes: "2 selected", "2 unsaved changes in the alert template". */
export function ToolbarStatus({ children }: { children: ReactNode }) {
  return (
    <span className="di-toolbar-status" aria-live="polite">
      {children}
    </span>
  );
}

/**
 * The ways out of a selection, after `ToolbarStatus`: select every row the
 * filter matches, and clear. Escape clears too, unless a field has focus or
 * a dialog, a menu or a flyout is open.
 */
export function ToolbarSelection({
  clearLabel,
  onClear,
  selectAllLabel = "",
  onSelectAll,
}: {
  clearLabel: string;
  onClear: () => void;
  /** "Select all 140 matching"; empty, or no `onSelectAll`, means no such button. */
  selectAllLabel?: string;
  onSelectAll?: () => void;
}) {
  const clear = useRef(onClear);
  useEffect(() => {
    clear.current = onClear;
  });
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || editable(event.target)) return;
      if (document.querySelector('dialog[open], [aria-modal="true"]:not(dialog), .di-flyout, .di-menu')) return;
      event.preventDefault();
      clear.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  return (
    <>
      {selectAllLabel !== "" && onSelectAll ? (
        <Button variant="ghost" size="sm" onClick={onSelectAll}>
          {selectAllLabel}
        </Button>
      ) : null}
      <Button variant="ghost" size="sm" onClick={onClear}>
        {clearLabel}
      </Button>
    </>
  );
}
