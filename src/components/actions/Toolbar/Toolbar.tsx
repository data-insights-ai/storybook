import { Children, isValidElement, useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { cx } from "../../../internal/cx";
import { takeSlot } from "../../../internal/slots";
import { ToolbarEnd, ToolbarNote, ToolbarSelection } from "./ToolbarParts";
import "./Toolbar.css";

export type ToolbarRole = "group" | "search" | "region";

export type ToolbarProps = {
  /** Names the toolbar for assistive technology: "Filter members", "Actions on the selected assets", "Unsaved changes". */
  label?: string;
  /**
   * `search` for the search and filters above a list, `region` for a bar a
   * reader should find again (unsaved changes), `group` otherwise. A label
   * without a role makes a `group`.
   */
  role?: ToolbarRole;
  /**
   * `top` stays under the app bar while the list under it scrolls, and tells
   * the list's sticky head how tall it is; `bottom` stays at the foot of the
   * view while a long form scrolls.
   */
  sticky?: "top" | "bottom";
  /** `bar` draws the row on its own plane: a selection's actions, unsaved changes. */
  frame?: "none" | "bar";
  /**
   * Sets every control at one end: `end` for the buttons that close a form or
   * a block, `start` for the actions a block leads with. On a phone they
   * stack at full width.
   */
  align?: "start" | "end";
  /**
   * `row` is a table row's quick actions in its last cell: a tighter gap,
   * the frequent ones shown while the row is hovered or holds focus, the
   * last one (the row's menu) always.
   */
  variant?: "default" | "row";
  /** A one-line add form: the first field takes the free width; the row stacks when the toolbar is narrower than 600px. */
  fillFirst?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * A row of controls: the search and filters above a list, the actions on a
 * selection, unsaved changes, the buttons that close a form, a one-line
 * form, a row's quick actions. One row that wraps, one gap, the trailing
 * group in `ToolbarEnd`.
 *
 * **When to use:** controls that belong together on one line.
 * **When not to:** a stack of fields → `Stack variant="form"`; places to go
 * → `Tabs` or `TabNav`; one choice among options → `ChoiceGroup`; a row's
 * full set of actions → `Menu` (beside the quick ones here).
 *
 * **Anatomy:** `ToolbarStatus` (what is selected or unsaved, announced) ·
 * `ToolbarSelection` (select all, clear; Escape clears) · the controls ·
 * `ToolbarEnd` (the trailing group, wherever it is written; `ToolbarAction`
 * is an action there that folds to its icon on a phone) · `ToolbarNote`
 * (one muted line under the row).
 *
 * **Variants:**
 * - list toolbar: `label role="search" sticky="top"`; a filter names itself
 *   in its first option, so field labels are read, not shown, and a search
 *   field takes the free width. On a phone it is two rows: the search,
 *   then the filters sharing the width with `ToolbarEnd` at their end
 *   (write its actions as `ToolbarAction`, so they fold to an icon);
 * - selection bar: `label frame="bar" sticky="top"` with `ToolbarStatus`,
 *   `ToolbarSelection` and the actions in `ToolbarEnd`; it takes the list
 *   toolbar's place at the same height, so nothing moves;
 * - unsaved changes: `label role="region" frame="bar" sticky="bottom"` with
 *   `ToolbarStatus` and Discard, Save in `ToolbarEnd`; render it only while
 *   there are changes;
 * - form end: `align="end"`; a row's quick actions: `variant="row"`;
 * - one-line form: fields and a button; `fillFirst` lets the first field grow.
 *   Fields and their button share the control row, so a button lines up with
 *   the input and an error line under a field does not move it.
 *
 * **Content:** buttons in a toolbar are `sm` beside other `sm` controls and
 * `md` beside fields; one primary at most, the action asked for.
 *
 * **Accessibility:** a `group` (or `search`, `region`) named by `label`.
 * Every control is its own tab stop: it is not an ARIA `toolbar`, which
 * would promise arrow keys between them. The status is a polite live region.
 */
export function Toolbar({
  label,
  role,
  sticky,
  frame = "none",
  align,
  variant = "default",
  fillFirst = false,
  className,
  children,
}: ToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);
  useListToolbarHeight(ref, sticky === "top");
  const [end, withoutEnd] = takeSlot(children, ToolbarEnd);
  const [note, rest] = takeSlot(withoutEnd, ToolbarNote);
  const selecting = Children.toArray(rest).some((child) => isValidElement(child) && child.type === ToolbarSelection);
  const list = role === "search" || sticky === "top" || selecting;
  const row = (
    <div
      ref={ref}
      role={role ?? (label ? "group" : undefined)}
      aria-label={label}
      data-sticky={sticky}
      className={cx(
        "di-toolbar",
        list && "is-list",
        frame === "bar" && "di-surface di-toolbar-bar",
        align && `is-align-${align}`,
        variant === "row" && "is-row",
        fillFirst && "is-fill-first",
        className,
      )}
    >
      {rest}
      {end}
      {note}
    </div>
  );
  return fillFirst ? <div className="di-toolbar-frame">{row}</div> : row;
}

/* The list under a sticky toolbar keeps its own sticky head under it, so it needs the toolbar's height. */
function useListToolbarHeight(ref: RefObject<HTMLDivElement | null>, on: boolean) {
  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent || !on) return;
    const set = () => parent.style.setProperty("--di-list-toolbar-h", `${el.offsetHeight}px`);
    set();
    const observer = new ResizeObserver(set);
    observer.observe(el);
    return () => {
      observer.disconnect();
      parent.style.removeProperty("--di-list-toolbar-h");
    };
  }, [ref, on]);
}
