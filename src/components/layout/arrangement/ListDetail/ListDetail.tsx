import { Children, isValidElement, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import "./ListDetail.css";

/**
 * The permanent split for work through many records: the list on the left,
 * the open record on the right, both on screen while the reader triages.
 * The record never opens over the list and never replaces the page.
 *
 * Narrower than about 900px the two take turns: `showing` says which one
 * is on screen, and the record carries a `ListDetailBack` to the list.
 * Up and Down move between the items of the list; Enter or Space open one.
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
  return (
    <div className="di-list-detail" data-showing={showing}>
      <div className="di-ld-grid">{children}</div>
    </div>
  );
}

/** The list half: a heading line (`ListDetailHead`) and `ListDetailItem`s. */
export function ListDetailList({ label, children }: { label: string; children: ReactNode }) {
  const list = useRef<HTMLUListElement>(null);
  const head: ReactNode[] = [];
  const items: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === ListDetailHead) head.push(child);
    else items.push(child);
  });
  const move = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") return;
    const buttons = Array.from(list.current?.querySelectorAll<HTMLButtonElement>(".di-ld-item") ?? []);
    const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (at === -1) return;
    event.preventDefault();
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : event.key === "ArrowDown" ? Math.min(at + 1, buttons.length - 1) : Math.max(at - 1, 0);
    buttons[next]?.focus();
  };
  return (
    <section className="di-ld-list" aria-label={label}>
      {head}
      <ul ref={list} className="di-ld-items" onKeyDown={move}>
        {items}
      </ul>
    </section>
  );
}

/** Above the items: a count, a filter, a sort. */
export function ListDetailHead({ children }: { children: ReactNode }) {
  return <div className="di-ld-head">{children}</div>;
}

/**
 * One record in the list. The selected one is marked in cornflower — the
 * selection colour — and announced as current. Its marks (a `SeverityMark`,
 * a `StatusPill`) are the child.
 */
export function ListDetailItem({
  title,
  meta,
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
      <button type="button" className={cx("di-ld-item", selected && "is-selected")} aria-current={selected ? "true" : undefined} onClick={onSelect}>
        <span className="di-ld-item-marks">{children}</span>
        <span className="di-ld-item-title">{title}</span>
        {meta ? <span className="di-ld-item-meta">{meta}</span> : null}
      </button>
    </li>
  );
}

/** The open record. It keeps its place while the list scrolls. */
export function ListDetailPane({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="di-ld-pane" aria-label={label}>
      {children}
    </section>
  );
}

/** On a narrow screen, the way from the record back to the list. */
export function ListDetailBack({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <button type="button" className="di-ld-back" onClick={onBack}>
      <span aria-hidden>←</span> {label}
    </button>
  );
}
