import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cx } from "../cx";
import { Kbd } from "./Seal";
import "./Field.css";
import "./SearchField.css";

/**
 * One field that narrows the register. The shortcut sits inside the
 * control because that is where the operator looks for it, and it is
 * decoration only — the caller binds the key.
 */
export function SearchField({
  id = "search",
  label,
  shortcut = "",
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
  /** Shown at the trailing edge, for example ⌘K. Empty means none. */
  shortcut?: string;
  dense?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
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
        {...props}
      />
      {shortcut === "" ? null : <Kbd>{shortcut}</Kbd>}
    </div>
  );
}
