import type { HintTone } from "../../field/FieldHint";
import type { LabelTrack } from "../../field/Field";
import { MultiComboBox } from "./MultiComboBox";

/**
 * @deprecated Use `<MultiComboBox freeEntry validate={isValid} …>`: the same
 * field, with suggestions when there are some. Removed in 0.12.
 */
export function TokenField({
  isValid,
  ...props
}: {
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  isValid?: (value: string) => boolean;
  invalidLabel?: string;
  removeLabel: (value: string) => string;
  hint?: string;
  hintTone?: HintTone;
  labelTrack?: LabelTrack;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
}) {
  return <MultiComboBox freeEntry validate={isValid} {...props} />;
}
