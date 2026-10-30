import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { Button } from "../Button";
import { editable } from "../../../internal/useShortcut";
import "./BulkActionBar.css";

/**
 * Takes the place of a `ListToolbar` while rows are selected, at the
 * toolbar's height, so nothing moves: how many are selected, the way to
 * select every row the filter matches, Clear; the actions on the selection
 * at the end, as compact buttons and menus. Escape clears the selection,
 * unless a field has focus or a dialog is open.
 */
export function BulkActionBar({
  label,
  selectedLabel,
  selectAllLabel = "",
  onSelectAll,
  clearLabel,
  onClear,
  sticky = true,
  children,
}: {
  /** Names the bar for assistive technology, e.g. "Actions on the selected assets". */
  label: string;
  /** "2 selected". */
  selectedLabel: string;
  /** "Select all 140 matching"; empty, or no `onSelectAll`, means no such link. */
  selectAllLabel?: string;
  onSelectAll?: () => void;
  clearLabel: string;
  onClear: () => void;
  sticky?: boolean;
  /** The actions: `Button`s, `Menu`s, a `Flyout`. */
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent || !sticky) return;
    const set = () => parent.style.setProperty("--di-list-toolbar-h", `${el.offsetHeight}px`);
    set();
    const observer = new ResizeObserver(set);
    observer.observe(el);
    return () => {
      observer.disconnect();
      parent.style.removeProperty("--di-list-toolbar-h");
    };
  }, [sticky]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || editable(event.target)) return;
      if (document.querySelector('dialog[open], [aria-modal="true"]:not(dialog), .di-flyout, .di-menu')) return;
      event.preventDefault();
      onClear();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClear]);

  return (
    <div ref={ref} className="di-bulk" data-sticky={sticky} role="toolbar" aria-label={label}>
      <span className="di-bulk-count" aria-live="polite">
        {selectedLabel}
      </span>
      {selectAllLabel !== "" && onSelectAll ? (
        <Button variant="ghost" size="sm" onClick={onSelectAll}>
          {selectAllLabel}
        </Button>
      ) : null}
      <Button variant="ghost" size="sm" onClick={onClear}>
        {clearLabel}
      </Button>
      <div className="di-bulk-actions">{children}</div>
    </div>
  );
}
