import { X } from "lucide-react";
import { type DragEvent, useId, useRef, useState } from "react";
import { cx } from "../cx";
import { Button } from "./Button";
import { FieldHint, type HintTone } from "./FieldHint";
import type { LabelTrack } from "./Field";
import { Icon } from "./Icon";
import "./Field.css";
import "./FileField.css";

/**
 * A field that takes one file: label above, the control, one line under it.
 * The control is a field-height frame with a button that opens the picker
 * and the chosen file's name in the mono track. A file can also be dropped
 * on the frame. The value is controlled: pass `file` and update it from
 * `onFileChange`, which also receives `undefined` when the file is cleared.
 */
export function FileField({
  id,
  label,
  file,
  onFileChange,
  accept,
  chooseLabel = "Choose file",
  emptyLabel = "No file chosen",
  clearLabel = "Remove file",
  hint = "",
  hintTone = "neutral",
  labelTrack = "record",
  disabled = false,
  required = false,
  className,
}: {
  id: string;
  label: string;
  file: File | undefined;
  onFileChange: (file: File | undefined) => void;
  /** Same as the input's `accept`: extensions or media types. */
  accept?: string;
  chooseLabel?: string;
  emptyLabel?: string;
  clearLabel?: string;
  /** The line under the field. Empty means none. */
  hint?: string;
  /** What that line is. `error` also marks the control invalid. */
  hintTone?: HintTone;
  labelTrack?: LabelTrack;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const labelId = useId();
  const nameId = useId();
  const buttonId = useId();
  const invalid = hint !== "" && hintTone === "error";

  const choose = (next: File | undefined) => {
    if (input.current) {
      input.current.value = "";
    }
    onFileChange(next);
  };

  const drop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled) {
      choose(event.dataTransfer.files[0]);
    }
  };

  return (
    <div className={cx("di-field", className)}>
      <div className="di-field-row">
        <label id={labelId} className={cx("di-field-label", `di-field-label-${labelTrack}`)} htmlFor={id}>
          {label}
        </label>
      </div>
      <div
        className={cx("di-control", "di-file", dragging && "is-dragging", disabled && "is-disabled")}
        aria-invalid={invalid || undefined}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(!disabled);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
      >
        <input
          ref={input}
          id={id}
          className="di-sr"
          type="file"
          tabIndex={-1}
          accept={accept}
          disabled={disabled}
          required={required && !file}
          onChange={(event) => choose(event.target.files?.[0])}
        />
        <Button
          type="button"
          variant="secondary"
          size="dense"
          disabled={disabled}
          id={buttonId}
          aria-labelledby={`${buttonId} ${labelId} ${nameId}`}
          aria-describedby={hint === "" ? undefined : `${id}-hint`}
          onClick={() => input.current?.click()}
        >
          {chooseLabel}
        </Button>
        <span id={nameId} className={cx("di-file-name", !file && "is-empty")}>
          {file ? file.name : emptyLabel}
        </span>
        {file && !disabled && (
          <Button type="button" variant="ghost" size="dense" iconOnly aria-label={clearLabel} onClick={() => choose(undefined)}>
            <Icon size={16}>
              <X />
            </Icon>
          </Button>
        )}
      </div>
      <FieldHint id={`${id}-hint`} tone={hintTone}>
        {hint}
      </FieldHint>
    </div>
  );
}
