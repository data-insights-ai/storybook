import { useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cx } from "../../../../internal/cx";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import type { LabelTrack } from "../../field/Field";
import { FieldLabel } from "../../field/FieldLabel";
import "../../field/Field/Field.css";
import "./TokenField.css";

const separators = /[\s,;]+/;

/**
 * Several values in one field — email addresses to invite, domains to
 * allow. Typing a separator (space, comma, semicolon, Enter) or pasting a
 * list turns the text into entries; Backspace in the empty input takes the
 * last one back. An entry `isValid` rejects stays, marked and announced by
 * `invalidLabel`, so the reader sees what to correct instead of losing it.
 */
export function TokenField({
  id,
  label,
  values,
  onChange,
  isValid = () => true,
  invalidLabel = "",
  removeLabel,
  hint = "",
  hintTone = "neutral",
  labelTrack = "record",
  placeholder = "",
  disabled = false,
  required = false,
  maxLength = 320,
}: {
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  isValid?: (value: string) => boolean;
  /** Read after an entry that `isValid` rejects, e.g. "not an email address". */
  invalidLabel?: string;
  /** The remove button's name for one entry, e.g. (v) => `Remove ${v}`. */
  removeLabel: (value: string) => string;
  hint?: string;
  hintTone?: HintTone;
  labelTrack?: LabelTrack;
  placeholder?: string;
  disabled?: boolean;
  /** At least one entry is needed; marks the label. */
  required?: boolean;
  /** The longest one entry may be. */
  maxLength?: number;
}) {
  const [draft, setDraft] = useState("");
  const invalid = hint !== "" && hintTone === "error";

  const add = (text: string) => {
    const next = text
      .split(separators)
      .map((v) => v.trim())
      .filter((v) => v !== "" && !values.includes(v));
    if (next.length > 0) onChange([...values, ...new Set(next)]);
  };
  const commit = () => {
    add(draft);
    setDraft("");
  };
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "," || event.key === ";" || event.key === " ") {
      if (draft.trim() === "") {
        if (event.key !== "Enter") event.preventDefault();
        return;
      }
      event.preventDefault();
      commit();
    } else if (event.key === "Backspace" && draft === "" && values.length > 0) {
      event.preventDefault();
      setDraft(values[values.length - 1]);
      onChange(values.slice(0, -1));
    }
  };
  const paste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text");
    if (!separators.test(text)) return;
    event.preventDefault();
    add(draft + text);
    setDraft("");
  };

  return (
    <div className="di-field">
      <FieldLabel htmlFor={id} label={label} labelTrack={labelTrack} required={required} />
      <div className={cx("di-token-field", invalid && "is-invalid", disabled && "is-disabled")}>
        <ul className="di-token-list">
          {values.map((value) => {
            const ok = isValid(value);
            return (
              <li key={value} className={cx("di-token", !ok && "is-invalid")}>
                <span className="di-token-text">{value}</span>
                {ok ? null : <span className="di-sr">{invalidLabel}</span>}
                <button
                  type="button"
                  className="di-token-remove"
                  aria-label={removeLabel(value)}
                  disabled={disabled}
                  onClick={() => onChange(values.filter((v) => v !== value))}
                >
                  <X aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
        <input
          id={id}
          className="di-token-input"
          value={draft}
          placeholder={values.length === 0 ? placeholder : ""}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete="off"
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-describedby={hint === "" ? undefined : `${id}-hint`}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={keyDown}
          onPaste={paste}
          onBlur={commit}
        />
      </div>
      <FieldHint id={`${id}-hint`} tone={hintTone}>
        {hint}
      </FieldHint>
    </div>
  );
}
