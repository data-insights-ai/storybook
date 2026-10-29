import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { ComboBox as AriaComboBox, useFilter } from "react-aria-components/ComboBox";
import { Button as AriaButton } from "react-aria-components/Button";
import { Input } from "react-aria-components/Input";
import { Label } from "react-aria-components/Label";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { Popover } from "react-aria-components/Popover";
import { cx } from "../../../../cx";
import type { LabelTrack } from "../../field/Field";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import { useOverlayHost } from "../../../../internal/useOverlayHost";
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
  const { contains } = useFilter({ sensitivity: "base" });
  const root = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState<number>();
  const { host, update } = useOverlayHost(root, open);
  const byValue = new Map(options.map((o) => [o.value, o]));
  const chosen = values.filter((v) => byValue.has(v));
  const invalid = hint !== "" && hintTone === "error";

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
    <AriaComboBox
      ref={root}
      id={id}
      className={cx("di-field", "di-combobox", "di-multicombo", className)}
      selectionMode="multiple"
      value={chosen}
      onChange={(keys) => set(keys.map(String))}
      inputValue={query}
      onInputChange={setQuery}
      defaultItems={options}
      defaultFilter={(text, typed) => contains(text, typed)}
      allowsEmptyCollection
      menuTrigger="focus"
      isDisabled={disabled}
      isInvalid={invalid}
      onOpenChange={(next) => {
        if (next) {
          update();
          setWidth(control.current?.offsetWidth);
        }
        setOpen(next);
      }}
    >
      <div className="di-field-row">
        <Label className={cx("di-field-label", `di-field-label-${labelTrack}`)}>{label}</Label>
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
                {/* Pointer only: React Aria hides everything but the input and
                    the list while it is open, and a keyboard drops an entry in
                    the list or with Backspace. */}
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
        <Input
          ref={input}
          className="di-token-input"
          placeholder={chosen.length === 0 ? placeholder : ""}
          aria-describedby={hint === "" ? undefined : `${id}-hint`}
          onKeyDown={keyDown}
        />
        <AriaButton className="di-multicombo-toggle" aria-label={toggleLabel}>
          <ChevronDown aria-hidden />
        </AriaButton>
      </div>
      <FieldHint id={`${id}-hint`} tone={hintTone}>
        {hint}
      </FieldHint>
      <Popover
        className="di-combobox-popover"
        triggerRef={control}
        style={width ? { width } : undefined}
        data-theme={host.theme}
        UNSTABLE_portalContainer={host.container}
        placement="bottom start"
        offset={4}
      >
        <ListBox
          className="di-combobox-list"
          renderEmptyState={() => <p className="di-combobox-empty">{emptyLabel}</p>}
        >
          {(option: MultiComboBoxOption) => (
            <ListBoxItem id={option.value} textValue={option.label} className="di-combobox-option di-multicombo-option">
              {({ isSelected }) => (
                <>
                  <span className="di-multicombo-check" aria-hidden>
                    {isSelected ? <Check /> : null}
                  </span>
                  <span className="di-combobox-label">{option.label}</span>
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}
