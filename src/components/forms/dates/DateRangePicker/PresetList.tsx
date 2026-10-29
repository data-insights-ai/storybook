import { useId, useRef, type KeyboardEvent } from "react";

/**
 * A single-select list of periods (WAI-ARIA listbox): one option in the tab
 * order, arrows, Home and End move between them, Enter, Space or a click
 * chooses. Choosing the current option again still acts on it.
 */
export function PresetList<Key extends string>({
  label,
  options,
  selected,
  onChoose,
}: {
  label: string;
  options: { key: Key; label: string }[];
  selected: Key;
  onChoose: (key: Key) => void;
}) {
  const baseId = useId();
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const tabStop = options.some((option) => option.key === selected) ? selected : options[0]?.key;
  const onKeyDown = (index: number) => (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowUp: index - 1,
      Home: 0,
      End: options.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      items.current[Math.min(Math.max(moves[event.key], 0), options.length - 1)]?.focus();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChoose(options[index].key);
    }
  };
  return (
    <div className="di-date-range-presets" role="listbox" aria-label={label} aria-orientation="vertical">
      {options.map((option, index) => (
        <div
          key={option.key}
          ref={(element) => {
            items.current[index] = element;
          }}
          id={`${baseId}-${option.key}`}
          role="option"
          aria-selected={option.key === selected}
          tabIndex={option.key === tabStop ? 0 : -1}
          className="di-date-range-preset"
          data-selected={option.key === selected || undefined}
          onClick={() => onChoose(option.key)}
          onKeyDown={onKeyDown(index)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
}
