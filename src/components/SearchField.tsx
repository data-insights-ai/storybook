import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cx } from "../cx";
import "./SearchField.css";

export function SearchField({
  label,
  className,
  id = "search",
  disabled = false,
  readOnly = false,
  required = false,
  ...props
}: {
  label: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cx("di-search", className)}>
      <label className="di-sr" htmlFor={id}>
        {label}
      </label>
      <Search aria-hidden />
      <input
        id={id}
        type="search"
        className="di-search-input"
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        {...props}
      />
    </div>
  );
}
