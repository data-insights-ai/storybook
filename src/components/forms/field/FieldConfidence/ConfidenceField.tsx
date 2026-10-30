import { TextField } from "../../text/TextField";

/**
 * @deprecated Use `<TextField readOnly value={…} confidence={{ value, label, level, whyLabel, onWhy }}>`:
 * the label then names the value, and the reading sits under it as a meter
 * and a line. Removed in 0.12.
 */
export function ConfidenceField({
  id,
  label,
  confidence,
  confidenceLabel,
  level = "high",
  whyLabel = "",
  onWhy,
  className,
  children,
}: {
  id: string;
  label: string;
  confidence: number;
  confidenceLabel: string;
  level?: "high" | "review";
  whyLabel?: string;
  onWhy?: () => void;
  className?: string;
  /** The value the model filled in. */
  children: string;
}) {
  return (
    <TextField
      id={id}
      label={label}
      className={className}
      readOnly
      value={children}
      confidence={{ value: confidence, label: confidenceLabel, level, whyLabel, onWhy }}
    />
  );
}
