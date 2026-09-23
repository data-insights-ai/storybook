import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../cx";
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
}: {
  /** Names the strip, e.g. "Entry views". */
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: { value: string; label: string; badge?: string; disabled?: boolean }[];
  className?: string;
}) {
  const strip = useRef<HTMLDivElement>(null);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const usable = items.filter((item) => !item.disabled);
    const at = usable.findIndex((item) => item.value === value);
    let next = -1;
    if (event.key === "ArrowRight") next = (at + 1) % usable.length;
    else if (event.key === "ArrowLeft") next = (at - 1 + usable.length) % usable.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = usable.length - 1;
    if (next === -1) return;
    event.preventDefault();
    const target = usable[next];
    onChange(target.value);
    strip.current?.querySelector<HTMLButtonElement>(`[data-tab="${target.value}"]`)?.focus();
  }

  return (
    <div
      ref={strip}
      role="tablist"
      aria-label={label}
      className={cx("di-tabs", className)}
      onKeyDown={onKeyDown}
    >
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            data-tab={item.value}
            id={`tab-${item.value}`}
            aria-selected={selected}
            aria-controls={`panel-${item.value}`}
            tabIndex={selected ? 0 : -1}
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

export function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  return (
    <div role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`} tabIndex={0} className="di-tabpanel">
      {children}
    </div>
  );
}

/**
 * Where am I. Mono, lowercase, and it truncates with one ellipsis
 * segment rather than naming every ancestor.
 */
export function Breadcrumb({
  label,
  items,
  className,
}: {
  label: string;
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label={label} className={cx("di-breadcrumb", className)}>
      <ol className="di-breadcrumb-list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="di-breadcrumb-item">
              {i > 0 ? <span className="di-breadcrumb-sep" aria-hidden>/</span> : null}
              {last ? (
                <span className="di-breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a className="di-breadcrumb-link" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span className="di-breadcrumb-link">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * A bounded process, and only that. A stepper never stands in for the
 * rail or the breadcrumb. The state is a word for a screen reader, not
 * only a filled bullet.
 */
export function Stepper({
  label,
  steps,
  stateLabels,
  className,
}: {
  label: string;
  steps: { label: string; state: "done" | "current" | "upcoming" }[];
  /** The word each state is announced as. */
  stateLabels: { done: string; current: string; upcoming: string };
  className?: string;
}) {
  return (
    <ol className={cx("di-stepper", className)} aria-label={label}>
      {steps.map((step, i) => (
        <li key={step.label} className="di-step" aria-current={step.state === "current" ? "step" : undefined}>
          {i > 0 ? <span className="di-step-connector" aria-hidden /> : null}
          <span className={cx("di-step-bullet", `is-${step.state}`)} aria-hidden>
            {i + 1}
          </span>
          <span className={cx("di-step-label", `is-${step.state}`)}>{step.label}</span>
          <span className="di-sr">{stateLabels[step.state]}</span>
        </li>
      ))}
    </ol>
  );
}
