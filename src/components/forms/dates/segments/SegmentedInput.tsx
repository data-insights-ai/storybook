import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { type FieldKind, type SegmentType, segmentLayout } from "./segmentLayout";
import {
  type SegmentValues,
  digitsOf,
  eraseDigit,
  limitsOf,
  shownOf,
  startOf,
  step,
  textOf,
  typeDigit,
  valuesOf,
  withShown,
  without,
} from "./segmentModel";
import { emptySegmentLabels } from "./emptySegmentLabels";

const pageSteps: Record<SegmentType, number> = { year: 5, month: 2, day: 7, hour: 2, minute: 15, dayPeriod: 1 };

/**
 * A day or a time typed in segments, each a spinbutton in the order the
 * `locale` writes them: digits type and move on when a segment is full,
 * arrows step and wrap, Backspace takes digits off, Left and Right move
 * between segments. The value is an ISO day or `HH:MM`, or empty while a
 * segment is; a hidden input carries it to a native form.
 */
export function SegmentedInput({
  kind,
  locale,
  value,
  onChange,
  labelledBy,
  describedBy,
  id,
  name,
  group = false,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
  emptyLabel = emptySegmentLabels.en,
  className,
}: {
  kind: FieldKind;
  locale: string;
  value: string;
  onChange: (value: string) => void;
  /** The label's id; each segment is read as its field name and this label. */
  labelledBy: string;
  describedBy?: string;
  id?: string;
  name?: string;
  /** The segments are a group of their own, named by the label. */
  group?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  emptyLabel?: string;
  className?: string;
}) {
  const layout = useMemo(() => segmentLayout(locale, kind), [locale, kind]);
  const baseId = useId();
  const [values, setValues] = useState(() => valuesOf(kind, value));
  const [seen, setSeen] = useState(value);
  const emitted = useRef(value);
  if (value !== seen) {
    setSeen(value);
    emitted.current = value;
    setValues(valuesOf(kind, value));
  }
  const latest = useRef(values);
  latest.current = values;
  const buffer = useRef("");
  const segments = useRef<(HTMLSpanElement | null)[]>([]);
  const container = useRef<HTMLDivElement>(null);
  const types = layout.parts.flatMap((part) => (part.type === "literal" ? [] : [part.type]));

  const update = (next: SegmentValues) => {
    latest.current = next;
    setValues(next);
    const text = textOf(kind, next);
    if (text === emitted.current) return;
    emitted.current = text;
    setSeen(text);
    onChange(text);
  };
  const focusAt = (index: number) => segments.current[index]?.focus();
  const set = (type: SegmentType, shown: number) => update(withShown(type, shown, latest.current, layout.hour12));

  const input = (index: number, key: string) => {
    const type = types[index];
    if (type === "dayPeriod") {
      const typed = key.toLocaleLowerCase(locale);
      const period = layout.dayPeriods.findIndex((text) => text.toLocaleLowerCase(locale).startsWith(typed));
      if (period < 0) return;
      set(type, period);
      focusAt(index + 1);
      return;
    }
    if (!/^\d$/.test(key)) return;
    const typed = typeDigit(buffer.current, key, limitsOf(type, latest.current, layout.hour12));
    buffer.current = typed.buffer;
    if (typed.shown !== undefined) set(type, typed.shown);
    if (typed.advance) focusAt(index + 1);
  };

  const erase = (index: number) => {
    const type = types[index];
    const shown = shownOf(type, latest.current, layout.hour12);
    if (shown === undefined) {
      focusAt(index - 1);
      return;
    }
    const erased = type === "dayPeriod" ? { buffer: "" } : eraseDigit(digitsOf(type, shown));
    buffer.current = erased.buffer;
    update(
      erased.shown === undefined
        ? without(type, latest.current)
        : withShown(type, erased.shown, latest.current, layout.hour12),
    );
  };

  const stepBy = (index: number, by: number | "min" | "max") => {
    const type = types[index];
    const limits = limitsOf(type, latest.current, layout.hour12);
    const shown = shownOf(type, latest.current, layout.hour12);
    buffer.current = "";
    if (by === "min" || by === "max") set(type, limits[by]);
    else set(type, step(shown, by, limits, startOf(type, new Date(), layout.hour12)));
  };

  const handlers = useRef({ input, erase });
  handlers.current = { input, erase };
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    // Touch keyboards send beforeinput without a usable keydown.
    const onBeforeInput = (event: InputEvent) => {
      const index = segments.current.indexOf(event.target as HTMLSpanElement);
      if (index < 0) return;
      event.preventDefault();
      if (readOnly || disabled) return;
      if (event.inputType.startsWith("delete")) {
        handlers.current.erase(index);
        return;
      }
      let at = index;
      for (const key of event.data ?? "") {
        handlers.current.input(at, key);
        at = Math.max(segments.current.indexOf(element.ownerDocument.activeElement as HTMLSpanElement), at);
      }
    };
    element.addEventListener("beforeinput", onBeforeInput);
    return () => element.removeEventListener("beforeinput", onBeforeInput);
  }, [readOnly, disabled]);

  const onKeyDown = (index: number) => (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const moves: Record<string, number | "min" | "max"> = {
      ArrowUp: 1,
      ArrowDown: -1,
      PageUp: pageSteps[types[index]],
      PageDown: -pageSteps[types[index]],
      Home: "min",
      End: "max",
    };
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      focusAt(index + (event.key === "ArrowLeft" ? -1 : 1));
    } else if (event.key in moves) {
      event.preventDefault();
      if (!readOnly) stepBy(index, moves[event.key]);
    } else if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      if (!readOnly) erase(index);
    } else if (event.key.length === 1) {
      event.preventDefault();
      if (!readOnly) input(index, event.key);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.target !== event.currentTarget) return;
    event.preventDefault();
    const empty = types.findIndex((type) => shownOf(type, latest.current, layout.hour12) === undefined);
    focusAt(empty < 0 ? 0 : empty);
  };

  let index = -1;
  return (
    <div
      ref={container}
      id={id}
      className={className}
      role={group ? "group" : undefined}
      aria-labelledby={group ? labelledBy : undefined}
      aria-describedby={group ? describedBy : undefined}
      aria-disabled={group && disabled ? true : undefined}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      onPointerDown={onPointerDown}
    >
      {layout.parts.map((part, position) => {
        if (part.type === "literal") {
          return (
            <span key={position} aria-hidden className="di-date-segment" data-type="literal">
              {part.text}
            </span>
          );
        }
        index += 1;
        const at = index;
        const type = part.type;
        const shown = shownOf(type, values, layout.hour12);
        const limits = limitsOf(type, values, layout.hour12);
        const empty = shown === undefined;
        const text = empty
          ? layout.placeholders[type]
          : type === "dayPeriod"
            ? layout.dayPeriods[shown]
            : digitsOf(type, shown);
        const valueText = empty
          ? emptyLabel
          : type === "month"
            ? `${shown} – ${layout.monthName(shown)}`
            : type === "hour" && layout.hour12
              ? layout.hourText(values.hour ?? 0)
              : text;
        const segmentId = `${baseId}-${type}`;
        return (
          <span
            key={position}
            ref={(element) => {
              segments.current[at] = element;
            }}
            id={segmentId}
            role="spinbutton"
            aria-label={layout.names[type]}
            aria-labelledby={`${segmentId} ${labelledBy}`}
            aria-describedby={at === 0 ? describedBy : undefined}
            aria-valuenow={shown}
            aria-valuetext={valueText}
            aria-valuemin={limits.min}
            aria-valuemax={limits.max}
            aria-invalid={invalid || undefined}
            aria-required={required || undefined}
            aria-readonly={readOnly || undefined}
            aria-disabled={disabled || undefined}
            contentEditable={!disabled}
            suppressContentEditableWarning
            spellCheck={false}
            autoCorrect="off"
            enterKeyHint={at === types.length - 1 ? "done" : "next"}
            inputMode={type === "dayPeriod" ? "text" : "numeric"}
            tabIndex={disabled ? undefined : 0}
            className="di-date-segment"
            data-type={type}
            data-placeholder={empty || undefined}
            data-disabled={disabled || undefined}
            data-invalid={invalid || undefined}
            onKeyDown={onKeyDown(at)}
            onFocus={() => {
              buffer.current = "";
            }}
          >
            {text}
          </span>
        );
      })}
      <input type="hidden" name={name} value={textOf(kind, values)} />
    </div>
  );
}
