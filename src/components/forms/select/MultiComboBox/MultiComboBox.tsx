import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Combobox } from "@base-ui/react/combobox";
import { cx } from "../../../../internal/cx";
import type { LabelTrack } from "../../field/Field";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import { useOverlayHost } from "../../../../internal/useOverlayHost";
import { useListToggle } from "../../../../internal/useListToggle";
import "../../field/Field/Field.css";
import "../ComboBox/ComboBox.css";
import "../../text/TokenField/TokenField.css";
import "./MultiComboBox.css";

export type MultiComboBoxOption = {
  /** Unique key delivered to the caller. */
  value: string;
  /** What the reader sees and searches by. */
  label: string;
};

/**
 * Several of a known set — members to notify, roles to grant. The chosen
 * ones stand in the field as entries; typing narrows the list, and the
 * list stays open so the reader can pick on. A chosen row carries a check
 * and is pressed again to drop it; Backspace in the empty input drops the
 * last entry. For values the reader makes up, such as addresses, use
 * `TokenField`.
 */
export function MultiComboBox({
  id,
  label,
  options,
  values,
  onChange,
  toggleLabel,
  emptyLabel,
  removeLabel,
  hint = "",
  hintTone = "neutral",
  labelTrack = "record",
  placeholder,
  disabled = false,
  className,
}: {
  id: string;
  label: string;
  options: readonly MultiComboBoxOption[];
  /** The chosen options' values, in the order they were chosen. */
  values: readonly string[];
  onChange: (values: string[]) => void;
  /** The button that opens the list, e.g. "Show members". */
  toggleLabel: string;
  /** Shown when nothing matches what was typed. */
  emptyLabel: string;
  /** The remove button's name for one entry, e.g. (name) => `Remove ${name}`. */
  removeLabel: (label: string) => string;
  hint?: string;
  hintTone?: HintTone;
  labelTrack?: LabelTrack;
  /** Shown while nothing is chosen. */
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const { contains } = Combobox.useFilter({ sensitivity: "base" });
  const root = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { host, update } = useOverlayHost(root, open);
  const byValue = new Map(options.map((o) => [o.value, o]));
  const chosen = values.filter((v) => byValue.has(v));
  const shown = options.filter((o) => contains(o.label, query.trim())).map((o) => o.value);
  const invalid = hint !== "" && hintTone === "error";

  const show = () => {
    if (disabled) return;
    update();
    setOpen(true);
  };
  const toggle = useListToggle(input, () => (open ? setOpen(false) : show()));
  const set = (next: string[]) => {
    onChange(next);
    setQuery("");
  };
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && query === "" && chosen.length > 0) set(chosen.slice(0, -1));
  };
  // A press on the field's empty space puts the reader in its input.
  const pressControl = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === control.current) input.current?.focus();
  };

  return (
    <div ref={root} className={cx("di-field", "di-combobox", "di-multicombo", className)}>
      <Combobox.Root
        id={id}
        multiple
        items={options.map((o) => o.value)}
        filteredItems={shown}
        value={chosen}
        onValueChange={(next) => set([...next])}
        inputValue={query}
        onInputValueChange={(next, details) => {
          if (details.reason === "input-change") setQuery(next);
        }}
        itemToStringLabel={(value: string) => byValue.get(value)?.label ?? value}
        open={open && !disabled}
        onOpenChange={(next, details) => {
          if (details.reason === "item-press") return;
          if (next) show();
          else setOpen(false);
        }}
        disabled={disabled}
      >
        <div className="di-field-row">
          <label id={`${id}-label`} className={cx("di-field-label", `di-field-label-${labelTrack}`)} htmlFor={id}>
            {label}
          </label>
        </div>
        <div
          ref={control}
          className={cx("di-token-field", "di-multicombo-control", invalid && "is-invalid", disabled && "is-disabled")}
          onMouseDown={pressControl}
        >
          <ul className="di-token-list">
            {chosen.map((value) => {
              const name = byValue.get(value)!.label;
              return (
                <li key={value} className="di-token">
                  <span className="di-token-text">{name}</span>
                  {/* Pointer only: the page around the open list is hidden from
                      assistive technology, and a keyboard drops an entry in the
                      list or with Backspace. */}
                  <button
                    type="button"
                    tabIndex={-1}
                    className="di-token-remove"
                    aria-label={removeLabel(name)}
                    disabled={disabled}
                    onClick={() => set(chosen.filter((v) => v !== value))}
                  >
                    <X aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
          <Combobox.Input
            ref={input}
            className="di-token-input"
            placeholder={chosen.length === 0 ? placeholder : ""}
            aria-labelledby={`${id}-label`}
            aria-invalid={invalid || undefined}
            aria-describedby={hint === "" ? undefined : `${id}-hint`}
            onFocus={show}
            onKeyDown={keyDown}
          />
          <button {...toggle} className="di-multicombo-toggle" aria-label={toggleLabel} disabled={disabled}>
            <ChevronDown aria-hidden />
          </button>
        </div>
        <FieldHint id={`${id}-hint`} tone={hintTone}>
          {hint}
        </FieldHint>
        {/* Unmounted in the render that closes it, so the page behind is readable again at once. */}
        {open && !disabled ? (
          <Combobox.Portal container={host.container}>
            <Combobox.Positioner
              anchor={control}
              data-theme={host.theme}
              side="bottom"
              align="start"
              sideOffset={4}
              style={{ zIndex: 100 }}
            >
              <Combobox.Popup className="di-combobox-popover">
                {shown.length === 0 ? <p className="di-combobox-empty">{emptyLabel}</p> : null}
                <Combobox.List className="di-combobox-list" aria-labelledby={`${id}-label`}>
                  {(value: string) => (
                    <Combobox.Item key={value} value={value} className="di-combobox-option di-multicombo-option">
                      <span className="di-multicombo-check" aria-hidden>
                        {chosen.includes(value) ? <Check /> : null}
                      </span>
                      <span className="di-combobox-label">{byValue.get(value)!.label}</span>
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
