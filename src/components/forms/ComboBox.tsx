import { useContext, useLayoutEffect, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { ComboBox as AriaComboBox, ComboBoxStateContext, useFilter } from "react-aria-components/ComboBox";
import { Button as AriaButton } from "react-aria-components/Button";
import { Input } from "react-aria-components/Input";
import { Label } from "react-aria-components/Label";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { Popover } from "react-aria-components/Popover";
import { cx } from "../../cx";
import type { LabelTrack } from "./Field";
import { FieldHint, type HintTone } from "./FieldHint";
import "./Field.css";
import "./ComboBox.css";

export type ComboBoxSuggestion = {
  /** Unique, exact value delivered to the caller and submitted by the input. */
  value: string;
  /** Human-readable search aid; never substitutes for the value. */
  label: string;
};

// A controlled refresh may lock an already focused/open field. Close only the
// maintained overlay state; close()/commit() would also commit a draft value.
function CloseUnavailablePopup({ unavailable }: { unavailable: boolean }) {
  const state = useContext(ComboBoxStateContext);
  useLayoutEffect(() => {
    if (unavailable && state?.isOpen) state.setOpen(false);
  }, [unavailable, state]);
  return null;
}

/** Editable text with suggestions. React Aria owns collection, keyboard, IME,
 * focus and popup behavior. The caller owns every value and validation rule.
 * The input always shows the exact value, including custom text. Labels appear
 * only in the suggestion list, so selection, blur and form submission cannot
 * silently replace a canonical value with its human-readable label. */
export function ComboBox({
  id, label, value, onValueChange, suggestions, toggleLabel, emptyLabel,
  hint = "", hintTone = "neutral", labelTrack = "record", hideLabel = false, mono = false,
  disabled = false, readOnly = false, required = false, className, children,
  name, placeholder, autoComplete,
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
  const { contains } = useFilter({ sensitivity: "base" });
  const byValue = new Map(suggestions.map((item) => [item.value, item]));
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [overlay, setOverlay] = useState<{ theme?: string; container?: HTMLElement }>({});
  function updateOverlay() {
    const element = root.current;
    if (!element) return;
    const theme = element.closest<HTMLElement>("[data-theme]")?.dataset.theme;
    const container = element.closest("dialog") ?? undefined;
    setOverlay((old) => old.theme === theme && old.container === container ? old : { theme, container });
  }
  // Portals must retain a nested theme and stay inside a native modal's inert
  // boundary. This bridges presentation only; React Aria still owns the popup.
  useLayoutEffect(() => {
    if (!open || !root.current) return;
    const element = root.current;
    updateOverlay();
    const observer = new MutationObserver(updateOverlay);
    observer.observe(element.ownerDocument.documentElement, { attributes: true, subtree: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [open]);
  const invalid = hint !== "" && hintTone === "error";
  return <AriaComboBox ref={root} id={id} className={cx("di-field", "di-combobox", className)}
    inputValue={value} value={byValue.has(value) ? value : null} defaultItems={suggestions}
    allowsCustomValue allowsEmptyCollection isDisabled={disabled} isReadOnly={readOnly} isRequired={required} isInvalid={invalid}
    menuTrigger={readOnly || disabled ? "manual" : "input"}
    validationBehavior="native" name={name} onOpenChange={(next) => { if (next) updateOverlay(); setOpen(next); }}
    onInputChange={onValueChange}
    onChange={(key) => { if (typeof key === "string" && byValue.has(key)) onValueChange(key); }}
    defaultFilter={(text, query) => contains(text, query) || contains(byValue.get(text)?.label ?? "", query)}>
    <CloseUnavailablePopup unavailable={readOnly || disabled} />
    <div className={cx("di-field-row", hideLabel && "di-sr")}>
      <Label className={cx("di-field-label", `di-field-label-${labelTrack}`)}>{label}</Label>
      {children}
    </div>
    <div className="di-combobox-control">
      <Input className={cx("di-control", mono && "di-control-mono")} placeholder={placeholder} autoComplete={autoComplete}
        aria-describedby={hint === "" ? undefined : `${id}-hint`} />
      <AriaButton className="di-combobox-toggle" aria-label={toggleLabel}><ChevronDown aria-hidden /></AriaButton>
    </div>
    <FieldHint id={`${id}-hint`} tone={hintTone}>{hint}</FieldHint>
    <Popover className="di-combobox-popover" data-theme={overlay.theme} UNSTABLE_portalContainer={overlay.container} placement="bottom start" offset={4}>
      <ListBox className="di-combobox-list" renderEmptyState={() => <p className="di-combobox-empty">{emptyLabel}</p>}>
        {(item: ComboBoxSuggestion) => <ListBoxItem id={item.value} textValue={item.value} className="di-combobox-option">
          <span className="di-combobox-label">{item.label}</span>
          {item.value === item.label ? null : <span className="di-combobox-value">{item.value}</span>}
        </ListBoxItem>}
      </ListBox>
    </Popover>
  </AriaComboBox>;
}
