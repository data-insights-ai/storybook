import { X } from "lucide-react";
import { useEffect, useRef, type MouseEventHandler, type ReactNode } from "react";
import { editable } from "../../../internal/useShortcut";
import { useMedia } from "../../../internal/useMedia";
import { Tooltip } from "../../feedback/Tooltip";
import { Button } from "../Button";

/** The controls a `Toolbar` pushes to its far end, wherever they are written. */
export function ToolbarEnd({ children }: { children: ReactNode }) {
  return <div className="di-toolbar-end">{children}</div>;
}

/**
 * An action in `ToolbarEnd` with a compact form: an icon and a label on a
 * wide screen; on a phone the icon alone, named by the label for a screen
 * reader and in a tooltip for the eye, so it fits beside the search and
 * the list toolbar keeps to two rows (the search with its actions, then the
 * filters).
 */
export function ToolbarAction({
  icon,
  label,
  variant = "secondary",
  size = "md",
  disabled,
  loading,
  onClick,
}: {
  /** The icon that stands for the action when the label folds away. */
  icon: ReactNode;
  /** The action in a word or three: "Export CSV". */
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const phone = useMedia("(max-width: 600px)");
  const props = { variant, size, disabled, loading, onClick };
  return phone ? (
    <Tooltip label={label}>
      <Button {...props} iconOnly aria-label={label}>
        {icon}
      </Button>
    </Tooltip>
  ) : (
    <Button {...props}>
      {icon}
      {label}
    </Button>
  );
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
 * a dialog, a menu or a flyout is open. On a phone, Clear is an icon
 * named by `clearLabel`, so the status and both ways out keep to one row.
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
  const phone = useMedia("(max-width: 600px)");
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
      {phone ? (
        <Tooltip label={clearLabel}>
          <Button variant="ghost" size="sm" iconOnly aria-label={clearLabel} onClick={onClear}>
            <X aria-hidden />
          </Button>
        </Tooltip>
      ) : (
        <Button variant="ghost" size="sm" onClick={onClear}>
          {clearLabel}
        </Button>
      )}
    </>
  );
}
