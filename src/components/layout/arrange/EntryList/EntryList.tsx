import type { ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { takeSlot } from "../../../../internal/slots";
import "./EntryList.css";

/**
 * A short list read row by row: each entry on a ruled line, what it is at
 * the start, what qualifies it at the end, a detail under both.
 *
 * **When to use:** a record's short lists: the products a flaw affects and
 * their versions, the watchlists that match it, the pages it cites, a few
 * items an import skipped. **When not to:** many rows to scan, sort or
 * filter (`DataTable`); terms and their values (`FactList`); numbered
 * sources behind citations (`SourceList`); ranked items that need the
 * person (`AttentionList`).
 *
 * **Anatomy:** an `Entry` is a row under a hairline. Its children lead; an
 * `EntryEnd` sits at the line's end, in the muted hint size (`mono` for a
 * machine value such as a version range), and drops under the lead when
 * the line is too narrow for both; an `EntryDetail` runs under them, for a
 * second line or the marks of the entry. Slots may be written in any order.
 *
 * **Accessibility:** a list, so a screen reader hears how many entries there
 * are; `label` names it when no heading above does.
 */
export function EntryList({ label, children }: { label?: string; children: ReactNode }) {
  return (
    // role="list": Safari drops the list role from a <ul> whose markers are styled away.
    <ul className="di-entries" role="list" aria-label={label}>
      {children}
    </ul>
  );
}

/** One entry: what it is as the children, with an optional `EntryEnd` and `EntryDetail`. */
export function Entry({ children }: { children: ReactNode }) {
  const [end, withoutEnd] = takeSlot(children, EntryEnd);
  const [detail, lead] = takeSlot(withoutEnd, EntryDetail);
  return (
    <li className="di-entry">
      <span className="di-entry-lead">{lead}</span>
      {end}
      {detail}
    </li>
  );
}

/** What qualifies the entry, at the line's end: a version range, a host, why it matches. */
export function EntryEnd({ mono = false, children }: { mono?: boolean; children: ReactNode }) {
  return <span className={cx("di-entry-end", mono && "di-mono")}>{children}</span>;
}

/** Under the entry: a second line, or its marks (a `Tag`, a `StatusPill`). */
export function EntryDetail({ children }: { children: ReactNode }) {
  return <span className="di-entry-detail">{children}</span>;
}
