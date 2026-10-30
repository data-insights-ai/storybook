import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cx } from "../../../../internal/cx";
import { takeSlot } from "../../../../internal/slots";
import "./ListDetail.css";

/**
 * The permanent split for work through many records: the list on the left
 * as its own full-height pane, the open record on the right, both on screen
 * while the reader triages. The record never opens over the list and never
 * replaces the page.
 *
 * Narrower than about 900px the two take turns: `showing` says which one
 * is on screen, and the record carries a `ListDetailBack` to the list.
 * When they swap, focus follows: to the record when it opens, back to the
 * selected item when the list returns. Browser history (a back gesture, a
 * URL per record) is the product's job, not this component's.
 */
export function ListDetail({
  showing = "list",
  children,
}: {
  /** Which half a narrow screen shows. Both show from about 900px. */
  showing?: "list" | "detail";
  /** `ListDetailList`, then `ListDetailPane`. */
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const shown = useRef(showing);
  useEffect(() => {
    if (shown.current === showing) return;
    shown.current = showing;
    const el = root.current;
    const list = el?.querySelector<HTMLElement>(".di-ld-list");
    const pane = el?.querySelector<HTMLElement>(".di-ld-pane");
    /* Only when the halves take turns: side by side, focus stays where the reader put it. */
    if (!list || !pane || (list.offsetParent !== null && pane.offsetParent !== null)) return;
    if (showing === "detail") pane.focus();
    else list.querySelector<HTMLElement>('[aria-current="true"]')?.focus();
  }, [showing]);
  return (
    <div ref={root} className="di-list-detail" data-showing={showing}>
      <div className="di-ld-grid">{children}</div>
    </div>
  );
}

/** The list half, a step above the ground: an optional `ListDetailHead`, then `ListDetailItems`. */
export function ListDetailList({ label, children }: { label: string; children: ReactNode }) {
  const [head, rest] = takeSlot(children, ListDetailHead);
  return (
    <section className="di-ld-list" aria-label={label}>
      {head}
      {rest}
    </section>
  );
}

/** Above the items: a count, a filter, a sort. */
export function ListDetailHead({ children }: { children: ReactNode }) {
  return <div className="di-ld-head">{children}</div>;
}

/** The records, as `ListDetailItem`s. Up and Down move between them, Home and End to the first and the last. */
export function ListDetailItems({ children }: { children: ReactNode }) {
  const list = useRef<HTMLUListElement>(null);
  const move = (event: KeyboardEvent<HTMLUListElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const buttons = Array.from(list.current?.querySelectorAll<HTMLButtonElement>(".di-ld-item") ?? []);
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
    <ul ref={list} className="di-ld-items" onKeyDown={move}>
      {children}
    </ul>
  );
}

/**
 * One record in the list. The selected one is lifted a step and marked
 * with the cornflower edge, and announced as current. Its marks — a
 * `SeverityMark`, a `StatusPill` — are the child.
 */
export function ListDetailItem({
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
        className={cx("di-ld-item", "di-row", selected && "di-row-current")}
        aria-current={selected ? "true" : undefined}
        onClick={onSelect}
      >
        {children ? <span className="di-ld-item-marks">{children}</span> : null}
        <span className="di-ld-item-title">{title}</span>
        {meta ? <span className="di-ld-item-meta">{meta}</span> : null}
      </button>
    </li>
  );
}

/** The open record. It keeps its place while the list scrolls. */
export function ListDetailPane({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="di-ld-pane" aria-label={label} tabIndex={-1}>
      {children}
    </section>
  );
}

/** On a narrow screen, the way from the record back to the list. Hidden once both show. */
export function ListDetailBack({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <button type="button" className="di-ld-back" onClick={onBack}>
      <ArrowLeft aria-hidden />
      {label}
    </button>
  );
}
