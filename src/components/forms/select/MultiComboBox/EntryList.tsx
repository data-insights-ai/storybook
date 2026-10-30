import { X } from "lucide-react";
import { cx } from "../../../../internal/cx";

/**
 * The entries standing in the field, each with its remove button. An entry
 * `isValid` rejects stays, marked, and `invalidLabel` is read after it.
 * `focusable` is off while a list is open around the input: the page behind
 * it is hidden from assistive technology, and the keyboard drops an entry in
 * the list or with Backspace instead.
 */
export function EntryList({
  entries,
  isValid,
  invalidLabel,
  removeLabel,
  onRemove,
  disabled,
  focusable,
}: {
  entries: readonly { value: string; label: string }[];
  isValid: (value: string) => boolean;
  invalidLabel: string;
  removeLabel: (label: string) => string;
  onRemove: (value: string) => void;
  disabled: boolean;
  focusable: boolean;
}) {
  return (
    <ul className="di-token-list">
      {entries.map(({ value, label }) => {
        const ok = isValid(value);
        return (
          <li key={value} className={cx("di-token", !ok && "is-invalid")}>
            <span className="di-token-text">{label}</span>
            {ok || invalidLabel === "" ? null : <span className="di-sr">{invalidLabel}</span>}
            <button
              type="button"
              tabIndex={focusable ? undefined : -1}
              className="di-token-remove"
              aria-label={removeLabel(label)}
              disabled={disabled}
              onClick={() => onRemove(value)}
            >
              <X aria-hidden />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
