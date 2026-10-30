import { FileText, Upload, X } from "lucide-react";
import { type DragEvent, useEffect, useId, useRef, useState } from "react";
import { cx } from "../../../../internal/cx";
import { Button } from "../../../actions/Button";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import type { LabelTrack } from "../../field/Field";
import { Icon } from "../../../marks/Icon";
import "../../field/Field/Field.css";
import "./FileField.css";

/**
 * A field that takes one file: label above, a dashed drop area, one line
 * under it. The area holds two things that stand alone: a line saying a
 * file can be dropped there, and a button that opens the picker, which is
 * also the way in from the keyboard. The native input stays hidden, also
 * from assistive technology. A chosen file shows as a row with its name,
 * size and a remove button. Focus that was in the field follows the swap:
 * to the remove button once a file is chosen, back to the choose button
 * once it is removed.
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
  dropLabel,
  chooseLabel,
  emptyLabel,
  clearLabel,
  wrongTypeLabel,
  tooLargeLabel,
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
  /** The line in the drop area, a sentence of its own, such as "Drop a file here". */
  dropLabel: string;
  /** The button that opens the picker, a button label such as "Choose file". */
  chooseLabel: string;
  /** What a screen reader hears after the button while no file is chosen. */
  emptyLabel: string;
  /** The remove button's name; the file's name follows it. */
  clearLabel: string;
  /** The line under the field for a file `accept` refuses. */
  wrongTypeLabel: string;
  /** The line under the field for a file over `maxBytes`. */
  tooLargeLabel: string;
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
  const chooseId = useId();
  const dropId = useId();
  const statusId = useId();
  const field = useRef<HTMLDivElement>(null);
  const chooseButton = useRef<HTMLButtonElement>(null);
  const clearButton = useRef<HTMLButtonElement>(null);
  const refocus = useRef(false);
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
    // Focus is taken only from this field, or from nowhere: some browsers hand it back only after the picker's change.
    const active = document.activeElement;
    refocus.current = !active || active === document.body || (field.current?.contains(active) ?? false);
    onFileChange(next);
  };

  // The button that had focus is unmounted with the swap; its counterpart takes it, a frame
  // later, after the browser has handed focus back from the file picker.
  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    const frame = requestAnimationFrame(() => (file ? clearButton : chooseButton).current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [file]);

  const drop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled) {
      choose(event.dataTransfer.files[0]);
    }
  };

  return (
    <div ref={field} className={cx("di-field", className)}>
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
        aria-hidden
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
              ref={clearButton}
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
          role="group"
          aria-labelledby={labelId}
          aria-describedby={dropId}
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
          <span id={dropId} className="di-file-drop-text">
            {dropLabel}
          </span>
          <Button
            ref={chooseButton}
            id={chooseId}
            type="button"
            variant="secondary"
            size="dense"
            disabled={disabled}
            aria-labelledby={`${chooseId} ${labelId}`}
            aria-describedby={describedBy ? `${statusId} ${describedBy}` : statusId}
            onClick={() => input.current?.click()}
          >
            {chooseLabel}
          </Button>
          <span id={statusId} className="di-sr">
            {emptyLabel}
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
