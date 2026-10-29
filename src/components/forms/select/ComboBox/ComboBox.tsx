import { useEffect, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Autocomplete } from "@base-ui/react/autocomplete";
import { cx } from "../../../../internal/cx";
import type { LabelTrack } from "../../field/Field";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import { useOverlayHost } from "../../../../internal/useOverlayHost";
import { useListToggle } from "../../../../internal/useListToggle";
import "../../field/Field/Field.css";
import "./ComboBox.css";

export type ComboBoxSuggestion = {
  /** Unique, exact value delivered to the caller and submitted by the input. */
  value: string;
  /** Human-readable search aid; never substitutes for the value. */
  label: string;
};

/** Editable text with suggestions. Base UI's autocomplete owns keyboard, IME,
 * focus and popup behavior. The caller owns every value and validation rule.
 * The input always shows the exact value, including custom text. Labels appear
 * only in the suggestion list, so selection, blur and form submission cannot
 * silently replace a canonical value with its human-readable label. */
export function ComboBox({
  id,
  label,
  value,
  onValueChange,
  suggestions,
  toggleLabel,
  emptyLabel,
  hint = "",
  hintTone = "neutral",
  labelTrack = "record",
  hideLabel = false,
  mono = false,
  disabled = false,
  readOnly = false,
  required = false,
  className,
  children,
  name,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  suggestions: readonly ComboBoxSuggestion[];
  toggleLabel: string;
  emptyLabel: string;
  hint?: string;
  hintTone?: HintTone;
  labelTrack?: LabelTrack;
  /** Keeps the label for assistive technology only, e.g. a filter in a list toolbar. */
  hideLabel?: boolean;
  mono?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;
  /** Slot beside the label. */
  children?: ReactNode;
} & Pick<InputHTMLAttributes<HTMLInputElement>, "name" | "placeholder" | "autoComplete">) {
  const { contains } = Autocomplete.useFilter({ sensitivity: "base" });
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(false);
  const { host: overlay, update: updateOverlay } = useOverlayHost(root, open);
  const locked = readOnly || disabled;
  const invalid = hint !== "" && hintTone === "error";
  const matches = (item: ComboBoxSuggestion) =>
    contains(item.value, value.trim()) || contains(item.label, value.trim());
  const show = (filtered: boolean) => {
    if (locked) return;
    updateOverlay();
    setTyped(filtered);
    setOpen(true);
  };
  const shown = typed ? suggestions.filter(matches) : suggestions;
  const control = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const toggle = useListToggle(input, () => (open ? setOpen(false) : show(false)));
  const arrowOpened = useRef<string | null>(null);
  // An arrow that opens the list also highlights its first or last suggestion;
  // Base UI's autocomplete would wait for a second press.
  useEffect(() => {
    const key = arrowOpened.current;
    arrowOpened.current = null;
    if (!open || key === null) return;
    const frame = requestAnimationFrame(() =>
      input.current?.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true })),
    );
    return () => cancelAnimationFrame(frame);
  }, [open]);
  return (
    <div ref={root} className={cx("di-field", "di-combobox", className)}>
      <Autocomplete.Root
        id={id}
        name={name}
        items={suggestions}
        filteredItems={shown}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        open={open && !locked}
        openOnInputClick={false}
        onOpenChange={(next, details) => {
          if (next) show(details.reason === "input-change");
          else setOpen(false);
        }}
        onValueChange={(next, details) => {
          if (locked) return;
          if (details.reason === "input-change") setTyped(true);
          onValueChange(next);
        }}
        itemToStringValue={(item: ComboBoxSuggestion) => item.value}
      >
        <div className={cx("di-field-row", hideLabel && "di-sr")}>
          <label id={`${id}-label`} className={cx("di-field-label", `di-field-label-${labelTrack}`)} htmlFor={id}>
            {label}
          </label>
          {children}
        </div>
        <Autocomplete.InputGroup ref={control} className="di-combobox-control">
          <Autocomplete.Input
            ref={input}
            className={cx("di-control", mono && "di-control-mono")}
            placeholder={placeholder}
            autoComplete={autoComplete ?? "off"}
            aria-labelledby={`${id}-label`}
            aria-invalid={invalid || undefined}
            aria-describedby={hint === "" ? undefined : `${id}-hint`}
            onKeyDown={(event) => {
              if (!open && !locked && (event.key === "ArrowDown" || event.key === "ArrowUp"))
                arrowOpened.current = event.key;
            }}
          />
          <button {...toggle} className="di-combobox-toggle" aria-label={toggleLabel} disabled={locked}>
            <ChevronDown aria-hidden />
          </button>
        </Autocomplete.InputGroup>
        <FieldHint id={`${id}-hint`} tone={hintTone}>
          {hint}
        </FieldHint>
        {/* Unmounted in the render that closes it, so the page behind is readable again at once. */}
        {open && !locked ? (
          <Autocomplete.Portal container={overlay.container}>
            <Autocomplete.Positioner
              anchor={control}
              data-theme={overlay.theme}
              side="bottom"
              align="start"
              sideOffset={4}
              style={{ zIndex: 100 }}
            >
              <Autocomplete.Popup className="di-combobox-popover">
                {shown.length === 0 ? <p className="di-combobox-empty">{emptyLabel}</p> : null}
                <Autocomplete.List className="di-combobox-list" aria-labelledby={`${id}-label`}>
                  {(item: ComboBoxSuggestion) => (
                    <Autocomplete.Item key={item.value} value={item} className="di-combobox-option">
                      <span className="di-combobox-label">{item.label}</span>
                      {item.value === item.label ? null : <span className="di-combobox-value">{item.value}</span>}
                    </Autocomplete.Item>
                  )}
                </Autocomplete.List>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
        ) : null}
      </Autocomplete.Root>
    </div>
  );
}
