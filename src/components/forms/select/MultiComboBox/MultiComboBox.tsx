import { useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { flushSync } from "react-dom";
import { Combobox } from "@base-ui/react/combobox";
import { cx } from "../../../../internal/cx";
import type { LabelTrack } from "../../field/Field";
import { FieldLabel } from "../../field/FieldLabel";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import { useOverlayHost } from "../../../../internal/useOverlayHost";
import { useListToggle } from "../../../../internal/useListToggle";
import { EntryList } from "./EntryList";
import { StatusPill, type StatusTone } from "../../../status/StatusPill";
import { useFreeEntry } from "./useFreeEntry";
import "../../field/Field/Field.css";
import "../ComboBox/ComboBox.css";
import "./MultiComboBox.css";

export type MultiComboBoxOption = {
  /** Unique key delivered to the caller. */
  value: string;
  /** What the reader sees and searches by. */
  label: string;
  /** Lines under the label in the list, such as a title and the facts that tell options apart; read with the label. */
  detail?: readonly string[];
  /** Short states after the lines, each a pill, such as "KEV" or "In review". */
  marks?: readonly MultiComboBoxMark[];
};

export type MultiComboBoxMark = { label: string; tone?: StatusTone };

const always = () => true;

/**
 * Several values in one field. The chosen ones stand in the field as
 * entries; Backspace in the empty input takes the last one back.
 *
 * From a known set — members to notify, roles to grant — `options` is the
 * list: typing narrows it, it stays open so the reader can pick on, and a
 * chosen row carries a check and is pressed again to drop it.
 *
 * With `freeEntry` the reader makes the values up — addresses to invite,
 * domains to allow: a space, comma, semicolon or Enter turns the typed text
 * into an entry, a pasted list becomes one entry each, and an entry
 * `validate` rejects stays, marked, so the reader sees what to correct.
 * `options` are then suggestions and may be left out; without them the
 * field is a plain text input with no list, so a screen reader is not told
 * of a popup that never opens.
 *
 * With `onQueryChange` the caller finds the options for what was typed —
 * records searched on a server: `options` are taken as already matched,
 * `loading` says a search is under way, and a chosen value keeps its entry
 * when the next search no longer returns it. Debounce the search in the
 * caller; the field reports every keystroke.
 */
export function MultiComboBox({
  id,
  label,
  options = [],
  values,
  onChange,
  freeEntry = false,
  onQueryChange,
  loading = false,
  loadingLabel = "",
  validate = always,
  invalidLabel = "",
  toggleLabel = "",
  emptyLabel,
  removeLabel,
  hint = "",
  hintTone = "neutral",
  labelTrack = "record",
  placeholder,
  disabled = false,
  required = false,
  maxLength = 320,
  className,
}: {
  id: string;
  label: string;
  /** The set to choose from; with `freeEntry`, suggestions, and optional. */
  options?: readonly MultiComboBoxOption[];
  /** The chosen values, in the order they were chosen. */
  values: readonly string[];
  onChange: (values: string[]) => void;
  /** Typed text becomes entries of its own, not only picks from `options`. */
  freeEntry?: boolean;
  /** The caller searches for the typed text and passes the matches as `options`. */
  onQueryChange?: (query: string) => void;
  /** With `onQueryChange`: a search for the typed text is under way. */
  loading?: boolean;
  /** Shown in the list while `loading` and nothing is listed yet, e.g. "Searching…". */
  loadingLabel?: string;
  /** With `freeEntry`: whether one entry is acceptable. A rejected one stays, marked. */
  validate?: (value: string) => boolean;
  /** Read after an entry `validate` rejects, e.g. "not an email address". */
  invalidLabel?: string;
  /** The button that opens the list, e.g. "Show members". Needed whenever there are `options`. */
  toggleLabel?: string;
  /**
   * Shown in the list when nothing matches what was typed. Without it the
   * list stays closed while nothing matches, so the line under the field
   * stays readable.
   */
  emptyLabel?: string;
  /** The remove button's name for one entry, e.g. (name) => `Remove ${name}`. */
  removeLabel: (label: string) => string;
  hint?: string;
  hintTone?: HintTone;
  labelTrack?: LabelTrack;
  /** Shown while nothing is chosen. */
  placeholder?: string;
  disabled?: boolean;
  /** At least one entry is needed; marks the label. */
  required?: boolean;
  /** With `freeEntry`: the longest one entry may be. */
  maxLength?: number;
  className?: string;
}) {
  const { contains } = Combobox.useFilter({ sensitivity: "base" });
  const root = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [query, setTyped] = useState("");
  const [labels, setLabels] = useState<ReadonlyMap<string, string>>(new Map());
  const setQuery = (next: string) => {
    setTyped(next);
    onQueryChange?.(next);
  };
  const [open, setOpen] = useState(false);
  const searched = onQueryChange !== undefined;
  const byValue = new Map(options.map((o) => [o.value, o]));
  const labelOf = (value: string) => byValue.get(value)?.label ?? labels.get(value) ?? value;
  const chosen = freeEntry || searched ? [...values] : values.filter((v) => byValue.has(v));
  const entries = chosen.map((value) => ({ value, label: labelOf(value) }));
  const listed = options.length > 0 || !freeEntry || searched;
  const shown = searched
    ? options.map((o) => o.value)
    : options.filter((o) => contains(o.label, query.trim())).map((o) => o.value);
  const waiting = searched && loading && shown.length === 0 && loadingLabel !== "";
  // A search answers only typed text: before any, or while it runs, nothing is "no match".
  const nothing = shown.length === 0 && Boolean(emptyLabel) && !(searched && (loading || query.trim() === ""));
  const invalid = hint !== "" && hintTone === "error";
  const visible = listed && open && !disabled && (shown.length > 0 || waiting || nothing);
  const { host, update } = useOverlayHost(root, visible);
  const free = useFreeEntry({ values: chosen, onChange, draft: query, setDraft: setQuery });

  const show = () => {
    if (disabled) return;
    update();
    setOpen(true);
  };
  // While nothing matches what was typed the toggle leaves the text alone and opens nothing, as in ComboBox.
  const toggle = useListToggle(input, () =>
    visible ? setOpen(false) : shown.length > 0 || waiting || nothing ? show() : undefined,
  );
  const set = (next: string[]) => {
    if (searched) setLabels(new Map([...labels, ...next.filter((v) => byValue.has(v)).map((v) => [v, labelOf(v)] as const)]));
    onChange(next);
    setQuery("");
  };
  const remove = (value: string) => set(chosen.filter((v) => v !== value));
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Tab leaves the field: the list closes before focus moves on, so it never covers the next control.
    if (event.key === "Tab" && visible) flushSync(() => setOpen(false));
    if (freeEntry) {
      const listChoosing = visible && event.currentTarget.hasAttribute("aria-activedescendant");
      if (free.keyDown(event, { listChoosing }) && listed) {
        (event as KeyboardEvent<HTMLInputElement> & { preventBaseUIHandler?: () => void }).preventBaseUIHandler?.();
      }
    } else if (event.key === "Backspace" && query === "" && chosen.length > 0) set(chosen.slice(0, -1));
    // Typed text with no option highlighted is a search, not the form's submission.
    else if (event.key === "Enter" && query.trim() !== "" && !event.currentTarget.hasAttribute("aria-activedescendant"))
      event.preventDefault();
  };
  // Leaving the field keeps what was typed as an entry; a press in the list is not leaving it.
  const blur = (event: FocusEvent<HTMLInputElement>) => {
    if (freeEntry && !popup.current?.contains(event.relatedTarget as Node | null)) free.commit();
    if (!visible) setOpen(false);
  };
  // A press on the field's empty space puts the reader in its input.
  const pressControl = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === control.current) input.current?.focus();
  };
  const inputProps = {
    className: "di-token-input",
    placeholder: chosen.length === 0 ? placeholder : "",
    maxLength: freeEntry ? maxLength : undefined,
    "aria-invalid": invalid || undefined,
    "aria-required": required || undefined,
    "aria-describedby": hint === "" ? undefined : `${id}-hint`,
    onKeyDown: keyDown,
    onPaste: freeEntry ? free.paste : undefined,
    onBlur: blur,
  };
  const frame = (field: ReactNode) => (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- a press on the frame puts focus in the input, which takes the keys
    <div
      ref={control}
      className={cx(
        "di-token-field",
        "di-field-control",
        "di-multicombo-control",
        listed && "has-toggle",
        invalid && "is-invalid",
        disabled && "is-disabled",
      )}
      onMouseDown={pressControl}
    >
      <EntryList
        entries={entries}
        isValid={freeEntry ? validate : always}
        invalidLabel={invalidLabel}
        removeLabel={removeLabel}
        onRemove={remove}
        disabled={disabled}
        focusable={!listed}
      />
      {field}
    </div>
  );
  const hintLine = (
    <FieldHint id={`${id}-hint`} tone={hintTone}>
      {hint}
    </FieldHint>
  );

  if (!listed) {
    return (
      <div ref={root} className={cx("di-field", "di-multicombo", className)}>
        <FieldLabel htmlFor={id} label={label} labelTrack={labelTrack} required={required} />
        {frame(
          <input
            ref={input}
            id={id}
            {...inputProps}
            value={query}
            disabled={disabled}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />,
        )}
        {hintLine}
      </div>
    );
  }

  return (
    <div ref={root} className={cx("di-field", "di-combobox", "di-multicombo", className)}>
      <Combobox.Root
        id={id}
        multiple
        items={[...new Set([...options.map((o) => o.value), ...chosen])]}
        filteredItems={shown}
        value={chosen}
        onValueChange={(next, details) => {
          // Escape on a closed list would empty the field: one key too easily pressed twice.
          if (details.reason === "escape-key") return;
          set([...next]);
        }}
        inputValue={query}
        onInputValueChange={(next, details) => {
          if (details.reason === "input-change") setQuery(next);
        }}
        itemToStringLabel={labelOf}
        open={visible}
        onOpenChange={(next, details) => {
          if (details.reason === "item-press") return;
          if (next) show();
          else setOpen(false);
        }}
        disabled={disabled}
      >
        <FieldLabel id={`${id}-label`} htmlFor={id} label={label} labelTrack={labelTrack} required={required} />
        {frame(
          <>
            <Combobox.Input ref={input} {...inputProps} aria-labelledby={`${id}-label`} onFocus={show} />
            <button {...toggle} className="di-multicombo-toggle" aria-label={toggleLabel} disabled={disabled}>
              <ChevronDown aria-hidden />
            </button>
          </>,
        )}
        {hintLine}
        {/* Unmounted in the render that closes it, so the page behind is readable again at once. */}
        {visible ? (
          <Combobox.Portal container={host.container}>
            <Combobox.Positioner
              anchor={control}
              data-theme={host.theme}
              side="bottom"
              align="start"
              sideOffset={4}
              style={{ zIndex: 100 }}
            >
              <Combobox.Popup ref={popup} className="di-combobox-popover">
                {waiting ? (
                  <p className="di-combobox-empty" role="status">
                    {loadingLabel}
                  </p>
                ) : nothing ? (
                  <p className="di-combobox-empty">{emptyLabel}</p>
                ) : null}
                <Combobox.List className="di-combobox-list" aria-labelledby={`${id}-label`}>
                  {(value: string) => (
                    <Combobox.Item key={value} value={value} className="di-option di-combobox-option">
                      <span className="di-multicombo-check" aria-hidden>
                        {chosen.includes(value) ? <Check /> : null}
                      </span>
                      {byValue.get(value)?.detail || byValue.get(value)?.marks ? (
                        <OptionText option={byValue.get(value)!} />
                      ) : (
                        <span className="di-option-label">{labelOf(value)}</span>
                      )}
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        ) : null}
      </Combobox.Root>
    </div>
  );
}

// OptionText is a searched option: its label, the lines that tell it
// apart, and its marks.
function OptionText({ option }: { option: MultiComboBoxOption }) {
  return (
    <span className="di-multicombo-option-text">
      <span className="di-option-label">{option.label}</span>
      {option.detail?.map((line, i) => (
        <span key={i} className="di-multicombo-detail">
          {line}
        </span>
      ))}
      {option.marks?.length ? (
        <span className="di-multicombo-marks">
          {option.marks.map((m) => (
            <StatusPill key={m.label} tone={m.tone}>
              {m.label}
            </StatusPill>
          ))}
        </span>
      ) : null}
    </span>
  );
}
