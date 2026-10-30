import type { KeyboardEvent, ReactNode } from "react";
import { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { cx } from "../../../../internal/cx";
import { takeSlot } from "../../../../internal/slots";

/** The list half of a `Split variant="list"`, a step above the ground: an optional `SplitListHead`, then `SplitListItems`. */
export function SplitList({ label, children }: { label: string; children: ReactNode }) {
  const [head, rest] = takeSlot(children, SplitListHead);
  return (
    <section className="di-split-list" aria-label={label}>
      {head}
      {rest}
    </section>
  );
}

/** Above the items: a count, a filter, a sort. */
export function SplitListHead({ children }: { children: ReactNode }) {
  return <div className="di-split-list-head">{children}</div>;
}

/** The records, as `SplitListItem`s. Up and Down move between them, Home and End to the first and the last. */
export function SplitListItems({ children }: { children: ReactNode }) {
  const list = useRef<HTMLUListElement>(null);
  const move = (event: KeyboardEvent<HTMLUListElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const buttons = Array.from(list.current?.querySelectorAll<HTMLButtonElement>(".di-split-item") ?? []);
    const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (at === -1) return;
    event.preventDefault();
    const last = buttons.length - 1;
    const next =
      { Home: 0, End: last, ArrowDown: Math.min(at + 1, last), ArrowUp: Math.max(at - 1, 0) }[event.key] ?? at;
    buttons[next]?.focus();
  };
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- the arrow keys move focus between the row buttons inside
    <ul ref={list} className="di-split-items" onKeyDown={move}>
      {children}
    </ul>
  );
}

/**
 * One record in the list. The selected one takes the current-row tint and
 * the cornflower edge, and is announced as current. Its marks — a
 * `SeverityMark`, a `StatusPill` — are the child.
 */
export function SplitListItem({
  title,
  meta = "",
  selected = false,
  onSelect,
  children,
}: {
  title: string;
  /** Id, owner, age: mono, under the title. */
  meta?: string;
  selected?: boolean;
  onSelect?: () => void;
  children?: ReactNode;
}) {
  return (
    <li>
      <button
        type="button"
        className={cx("di-split-item", "di-row", selected && "di-row-current")}
        aria-current={selected ? "true" : undefined}
        onClick={onSelect}
      >
        {children ? <span className="di-split-item-marks">{children}</span> : null}
        <span className="di-split-item-title">{title}</span>
        {meta ? <span className="di-split-item-meta">{meta}</span> : null}
      </button>
    </li>
  );
}

/** On a narrow screen, the way from the record back to the list. Hidden once both show. */
export function SplitBack({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <button type="button" className="di-split-back" onClick={onBack}>
      <ArrowLeft aria-hidden />
      {label}
    </button>
  );
}
