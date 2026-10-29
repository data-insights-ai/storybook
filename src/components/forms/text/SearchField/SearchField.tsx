import type { InputHTMLAttributes, Ref } from "react";
import { Search } from "lucide-react";
import { cx } from "../../../../internal/cx";
import { Kbd } from "../../../data/text/Kbd";
import { useShortcutKeys } from "../../../../internal/shortcutKeys";
import "../../field/Field/Field.css";
import "./SearchField.css";

/**
 * One field that narrows the register. `/` focuses it from anywhere on the
 * page (the first visible one answers); the key sits inside the control
 * because that is where the operator looks for it. Any other `shortcut`
 * is decoration only, bound by the caller.
 */
export function SearchField({
  id = "search",
  label,
  shortcut = "/",
  dense = false,
  className,
  disabled = false,
  readOnly = false,
  required = false,
  ...props
}: {
  id?: string;
  /** Names the field for a screen reader; the magnifier alone does not. */
  label: string;
  /** Shown at the trailing edge; `/` also binds it. Empty means none. */
  shortcut?: string;
  dense?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  ref?: Ref<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>) {
  const slash = shortcut === "/" && !disabled;
  useShortcutKeys(slash);
  return (
    <div className={cx("di-search", dense && "is-dense", className)}>
      <label className="di-sr" htmlFor={id}>
        {label}
      </label>
      <Search className="di-search-icon" aria-hidden />
      <input
        id={id}
        type="search"
        className="di-search-input"
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        data-di-shortcut={slash ? "/" : undefined}
        aria-keyshortcuts={slash ? "/" : undefined}
        {...props}
      />
      {shortcut === "" ? null : <Kbd className="di-search-kbd">{shortcut}</Kbd>}
    </div>
  );
}
