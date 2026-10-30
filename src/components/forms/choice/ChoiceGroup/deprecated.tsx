import type { ReactNode } from "react";
import { ChoiceGroup, type ChoiceOption, type ChoicePlanned } from "./ChoiceGroup";

/** @deprecated Use `ChoiceOption`. Removed in 0.12. */
export type ChoiceCard = ChoiceOption;
/** @deprecated Use `ChoicePlanned`. Removed in 0.12. */
export type ChoiceCardsPlanned = ChoicePlanned;
/** @deprecated Use `ChoiceOption`. Removed in 0.12. */
export type ToggleOption = ChoiceOption;

/**
 * @deprecated Use `<ChoiceGroup appearance="segments" hideLegend name legend options value onChange />`.
 * Removed in 0.12.
 */
export function SegmentedControl({
  name,
  legend,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: {
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <ChoiceGroup
      appearance="segments"
      hideLegend
      name={name}
      legend={legend}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
    />
  );
}

/**
 * @deprecated Use `<ChoiceGroup appearance="toggles" multiple name legend options value onChange />`;
 * the options' `name` stays the accessible name. Removed in 0.12.
 */
export function ToggleGroup({
  legend,
  hideLegend = false,
  options,
  value,
  onChange,
  disabled = false,
  className,
}: {
  legend: string;
  hideLegend?: boolean;
  options: readonly ChoiceOption[];
  value: readonly string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <ChoiceGroup
      appearance="toggles"
      multiple
      name={legend}
      legend={legend}
      hideLegend={hideLegend}
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
    />
  );
}

/**
 * @deprecated Use `<ChoiceGroup appearance="cards" name legend options value onChange planned>{detail}</ChoiceGroup>`.
 * Removed in 0.12.
 */
export function ChoiceCards({
  name,
  legend,
  hideLegend = false,
  options,
  value,
  onChange,
  planned,
  className,
  children,
}: {
  name: string;
  legend: string;
  hideLegend?: boolean;
  options: ChoiceOption[];
  value: string;
  onChange: (value: string) => void;
  planned?: ChoicePlanned;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <ChoiceGroup
      appearance="cards"
      name={name}
      legend={legend}
      hideLegend={hideLegend}
      options={options}
      value={value}
      onChange={onChange}
      planned={planned}
      className={className}
    >
      {children}
    </ChoiceGroup>
  );
}
