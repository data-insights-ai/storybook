import { type KeyboardEvent, useRef, useState } from "react";
import { cx } from "../../../../internal/cx";
import type { LabelTrack } from "../../field/Field";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import { FieldLabel } from "../../field/FieldLabel";
import "../../field/Field/Field.css";
import "../TextArea/TextArea.css";
import "./CompletingTextArea.css";

export type Completion = {
  /** What fits at the caret, the first highlighted. */
  items: readonly { value: string; label: string; meta?: string }[];
  /** The text and caret once an item is taken. */
  apply: (value: string) => { text: string; caret: number };
};

/**
 * TextArea that completes a word at the caret, such as a path in an
 * expression. The caller says what fits where (`suggest`) and how a choice
 * changes the text (`apply`); the field owns the list, its keyboard (arrows,
 * Enter or Tab takes, Escape closes) and its ARIA. Focus never leaves the text,
 * which stays a textbox: a text area cannot take the combobox role.
 */
export function CompletingTextArea({
  id,
  label,
  value,
  onValueChange,
  suggest,
  suggestionsLabel,
  hint = "",
  hintTone = "neutral",
  labelTrack = "record",
  mono = false,
  hideLabel = false,
  required = false,
  disabled = false,
  readOnly = false,
  rows = 2,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  /** What completes the text at the caret; undefined closes the list. */
  suggest: (text: string, caret: number) => Completion | undefined;
  /** The list's accessible name. */
  suggestionsLabel: string;
  hint?: string;
  hintTone?: HintTone;
  labelTrack?: LabelTrack;
  mono?: boolean;
  /** Keeps the label for assistive technology only. */
  hideLabel?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  // A completion holds for the text and caret it was made for; a moved caret or
  // a value set from outside drops it, so Enter and Tab never splice elsewhere.
  const [open, setOpen] = useState<{ completion: Completion; text: string; caret: number }>();
  const [active, setActive] = useState(0);
  const listId = `${id}-suggestions`;
  const shown = open && open.text === value && open.completion.items.length > 0 ? open.completion : undefined;

  const take = (choice: string) => {
    if (!shown) return;
    const next = shown.apply(choice);
    onValueChange(next.text);
    setOpen(undefined);
    requestAnimationFrame(() => ref.current?.setSelectionRange(next.caret, next.caret));
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!shown) return;
    const count = shown.items.length;
    const handled = new Map<string, () => void>([
      ["ArrowDown", () => setActive((a) => (a + 1) % count)],
      ["ArrowUp", () => setActive((a) => (a - 1 + count) % count)],
      ["Enter", () => take(shown.items[active]!.value)],
      ["Tab", () => take(shown.items[active]!.value)],
      ["Escape", () => setOpen(undefined)],
    ]).get(e.key);
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
      handled();
    }
  };

  return (
    <div className={cx("di-field", "di-completing", className)}>
      <FieldLabel htmlFor={id} label={label} labelTrack={labelTrack} hideLabel={hideLabel} required={required} />
      <textarea
        ref={ref}
        id={id}
        className={cx("di-control", mono && "di-control-mono")}
        rows={rows}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        value={value}
        aria-controls={shown ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={shown ? `${listId}-${active}` : undefined}
        aria-invalid={(hint !== "" && hintTone === "error") || undefined}
        aria-describedby={hint === "" ? undefined : `${id}-hint`}
        onChange={(e) => {
          onValueChange(e.target.value);
          const completion = suggest(e.target.value, e.target.selectionStart);
          setOpen(completion && { completion, text: e.target.value, caret: e.target.selectionStart });
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        onSelect={(e) => {
          if (open && e.currentTarget.selectionStart !== open.caret) setOpen(undefined);
        }}
        onBlur={() => setOpen(undefined)}
      />
      {shown ? (
        <div className="di-completing-popover">
          <ul id={listId} role="listbox" aria-label={suggestionsLabel} className="di-completing-list">
            {shown.items.map((item, i) => (
              <li
                key={`${item.value} ${item.meta ?? ""}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                data-highlighted={i === active || undefined}
                className="di-option di-completing-option"
                onMouseDown={(e) => {
                  e.preventDefault();
                  take(item.value);
                }}
              >
                <span className="di-option-label">{item.label}</span>
                {item.meta ? <span className="di-option-meta">{item.meta}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <FieldHint id={`${id}-hint`} tone={hintTone}>
        {hint}
      </FieldHint>
    </div>
  );
}
