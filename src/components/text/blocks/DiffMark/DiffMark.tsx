import type { ReactNode } from "react";
import "./DiffMark.css";

/**
 * A change marked in text: what was removed, struck through on the danger
 * wash, and what was added, on the ok wash. An underline would read as a
 * link, so the added side has none.
 *
 * **When to use:** a field's old and new value, the words a revision
 * replaced, the items a list gained or lost, a suggested edit before it is
 * accepted. **When not to:** a state (`StatusPill`); a search match
 * (`Highlight`).
 *
 * **Anatomy:** `change="removed"` is a `del`, `"added"` an `ins`, inline in
 * the line it changes. `sign` sets a − or + in front, for an item of a list
 * on a line of its own. `layout="block"` sets a whole passage apart on its
 * wash, without the strike, for a paragraph that is
 * replaced as one.
 *
 * **Accessibility:** the strike and the washes are not read, so `label`
 * ("Removed", "Added") is said before the text, and the end of the change is
 * marked for a screen reader too.
 */
export function DiffMark({
  change,
  label,
  sign = false,
  layout = "inline",
  children,
}: {
  change: "removed" | "added";
  /** What the change is called aloud: "Removed", "Added text". */
  label: string;
  /** A − or + before it, for an item on a line of its own. */
  sign?: boolean;
  /** `inline` marks words in a line; `block` sets a passage apart. */
  layout?: "inline" | "block";
  children: ReactNode;
}) {
  const Mark = change === "removed" ? "del" : "ins";
  const mark = (
    <Mark className={`di-diff-mark is-${change} is-${layout}`}>
      <span className="di-sr">[{label}: </span>
      {children}
      <span className="di-sr">]</span>
    </Mark>
  );
  if (!sign) return mark;
  return (
    <span className="di-diff-line">
      <span className="di-diff-sign" aria-hidden>
        {change === "removed" ? "−" : "+"}
      </span>
      {mark}
    </span>
  );
}
