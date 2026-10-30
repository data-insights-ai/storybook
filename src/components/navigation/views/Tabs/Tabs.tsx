import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { useActiveInView } from "../../../../internal/useActiveInView";
import "./Tabs.css";

/**
 * Tabs switch views of one record. They never navigate away from it —
 * that is the rail's job.
 *
 * Controlled, with the arrow-key movement a tablist owes its user: the
 * strip holds one tab stop and the arrows move the selection within it.
 */
export function Tabs({
  label,
  value,
  onChange,
  items,
  className,
  idPrefix,
}: {
  /** Names the strip, e.g. "Entry views". */
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: { value: string; label: string; badge?: string; disabled?: boolean }[];
  className?: string;
  /** Share a unique prefix with this strip’s TabPanel when a page has multiple strips. */
  idPrefix?: string;
}) {
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const strip = useRef<HTMLDivElement>(null);
  useActiveInView(strip);
  const usable = items.filter((item) => !item.disabled);
  const tabStop = usable.some((item) => item.value === value) ? value : usable[0]?.value;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (usable.length === 0) return;
    const focused = usable.findIndex((item) => buttons.current.get(item.value) === document.activeElement);
    const at = focused < 0 ? usable.findIndex((item) => item.value === value) : focused;
    let next = -1;
    if (event.key === "ArrowRight") next = (at + 1) % usable.length;
    else if (event.key === "ArrowLeft") next = at < 0 ? usable.length - 1 : (at - 1 + usable.length) % usable.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = usable.length - 1;
    if (next === -1) return;
    event.preventDefault();
    const target = usable[next];
    onChange(target.value);
    buttons.current.get(target.value)?.focus();
  }

  return (
    <div ref={strip} role="tablist" aria-label={label} className={cx("di-tabs", className)} onKeyDown={onKeyDown}>
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            data-tab={item.value}
            ref={(node) => {
              if (node) buttons.current.set(item.value, node);
              else buttons.current.delete(item.value);
            }}
            id={tabId("tab", item.value, idPrefix)}
            aria-selected={selected}
            aria-controls={tabId("panel", item.value, idPrefix)}
            tabIndex={item.value === tabStop ? 0 : -1}
            disabled={item.disabled}
            className={cx("di-tab", selected && "is-active")}
            onClick={() => onChange(item.value)}
          >
            {item.label}
            {item.badge === undefined ? null : <span className="di-tab-badge">{item.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Values are encoded without selector interpolation, including unmatched UTF-16 surrogates. */
function tabId(kind: "tab" | "panel", value: string, prefix?: string) {
  const encode = (part: string) =>
    part.replace(/[^A-Za-z0-9_-]/g, (char) => `%${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
  return `${prefix === undefined ? "" : `${encode(prefix)}:`}${kind}-${encode(value)}`;
}

/**
 * The content of one tab in `Tabs`, shown while its tab is selected. `value`
 * matches its tab, and `idPrefix` matches the `Tabs` it belongs to when a page
 * holds more than one.
 */
export function TabPanel({ value, idPrefix, children }: { value: string; idPrefix?: string; children: ReactNode }) {
  return (
    <div
      role="tabpanel"
      id={tabId("panel", value, idPrefix)}
      aria-labelledby={tabId("tab", value, idPrefix)}
      tabIndex={0}
      className="di-tabpanel"
    >
      {children}
    </div>
  );
}
