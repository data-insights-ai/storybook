import { FileText, Upload, X } from "lucide-react";
import { type DragEvent, useId, useRef, useState } from "react";
import { cx } from "../../../../internal/cx";
import { Button } from "../../../actions/Button";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import type { LabelTrack } from "../../field/Field";
import { Icon } from "../../../marks/Icon";
import "../../field/Field/Field.css";
import "./FileField.css";

/**
 * A field that takes one file: label above, a dashed drop area, one line
 * under it. The area says "Drop the file here or choose a file"; the link
 * opens the picker, the native input stays hidden. A chosen file shows as
 * a row with its name, size and a remove button.
 *
 * `accept` and `maxBytes` are checked on the way in: a file that fails is
 * not passed on, and the line under the field says why. The value is
 * controlled: pass `file` and update it from `onFileChange`, which also
 * receives `undefined` when the file is removed. Every string is a prop.
 */
export function FileField({
  id,
  label,
  file,
  onFileChange,
  accept,
  maxBytes,
  dropLabel = "Drop the file here or",
  chooseLabel = "choose a file",
  emptyLabel = "No file chosen",
  clearLabel = "Remove file",
  wrongTypeLabel = "This kind of file is not accepted here.",
  tooLargeLabel = "This file is too large.",
  formatSize = defaultSize,
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
  /** Same as the input's `accept`: extensions or media types. Also checked for a dropped file. */
  accept?: string;
  /** The largest file taken, in bytes. */
  maxBytes?: number;
  /** The words before the link in the drop area. */
  dropLabel?: string;
  /** The link that opens the picker. */
  chooseLabel?: string;
  /** What a screen reader hears while no file is chosen. */
  emptyLabel?: string;
  clearLabel?: string;
  /** The line under the field for a file `accept` refuses. */
  wrongTypeLabel?: string;
  /** The line under the field for a file over `maxBytes`. */
  tooLargeLabel?: string;
  /** A size as people read it; the default writes kB and MB in the browser's language. */
  formatSize?: (bytes: number) => string;
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
  const [refused, setRefused] = useState("");
  const labelId = useId();
  const statusId = useId();
  const line = refused || hint;
  const tone: HintTone = refused ? "error" : hintTone;
  const invalid = line !== "" && tone === "error";
  const describedBy = line === "" ? undefined : `${id}-hint`;

  const choose = (next: File | undefined) => {
    if (input.current) {
      input.current.value = "";
    }
    if (next && !accepts(accept, next)) {
      setRefused(wrongTypeLabel);
      return;
    }
    if (next && maxBytes !== undefined && next.size > maxBytes) {
      setRefused(tooLargeLabel);
      return;
    }
    setRefused("");
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
      {file ? (
        <div className={cx("di-file-row", disabled && "is-disabled")} aria-invalid={invalid || undefined}>
          <Icon size={16}>
            <FileText />
          </Icon>
          <span className="di-file-name">{file.name}</span>
          <span className="di-file-size">{formatSize(file.size)}</span>
          {!disabled && (
            <Button
              type="button"
              variant="ghost"
              size="dense"
              iconOnly
              aria-label={`${clearLabel}: ${file.name}`}
              aria-describedby={describedBy}
              onClick={() => choose(undefined)}
            >
              <Icon size={16}>
                <X />
              </Icon>
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cx("di-file-drop", dragging && "is-dragging", disabled && "is-disabled")}
          aria-invalid={invalid || undefined}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(!disabled);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={drop}
        >
          <Icon size={24}>
            <Upload />
          </Icon>
          <span className="di-file-prompt">
            {dropLabel}{" "}
            <button
              type="button"
              className="di-file-choose"
              disabled={disabled}
              aria-labelledby={`${labelId} ${statusId}`}
              aria-describedby={describedBy}
              onClick={() => input.current?.click()}
            >
              {chooseLabel}
            </button>
          </span>
          <span id={statusId} className="di-sr">
            {chooseLabel}, {emptyLabel}
          </span>
        </div>
      )}
      <FieldHint id={`${id}-hint`} tone={tone}>
        {line}
      </FieldHint>
    </div>
  );
}

/* The input's accept list, checked again for a file that was dropped or chosen anyway. */
function accepts(accept: string | undefined, file: File): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .some((a) =>
      a.startsWith(".") ? name.endsWith(a) : a.endsWith("/*") ? type.startsWith(a.slice(0, -1)) : type === a,
    );
}

function defaultSize(bytes: number): string {
  const [value, unit] = bytes < 1000 ? [bytes, "byte"] : bytes < 1_000_000 ? [bytes / 1000, "kilobyte"] : [bytes / 1_000_000, "megabyte"];
  return new Intl.NumberFormat(undefined, { style: "unit", unit, unitDisplay: "short", maximumFractionDigits: 1 }).format(value);
}
