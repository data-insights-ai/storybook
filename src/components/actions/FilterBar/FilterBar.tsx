import { Children, isValidElement, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cx } from "../../../internal/cx";
import { takeSlot } from "../../../internal/slots";
import { Dialog, DialogFooter } from "../../overlays/Dialog";
import { Stack } from "../../layout/arrange/Stack";
import { Badge } from "../../status/Badge";
import { Button } from "../Button";
import { fit, phoneWidth, restoreSlack } from "./fit";
import "./FilterBar.css";

/** Where an item is drawn: inline in the bar, or as a field in the sheet. */
export type FilterPlace = "bar" | "sheet";

export type FilterBarItemProps = {
  /** Unique in its bar; it keys the measured width. */
  name: string;
  /** Stays in the bar at every width: the search. */
  keep?: boolean;
  /** Takes the free width, down to `--di-filter-bar-grow-min`: the search. */
  grow?: boolean;
  /** Higher stays longer. Among equals the last written leaves first. */
  priority?: number;
  /** Set to something other than its default; counted on the trigger while it is in the sheet. */
  active?: boolean;
  /**
   * Draws the control for its place, with the page's own state: in the bar
   * it reads its label, in the sheet it shows it. Ids must differ between
   * the two, because the bar's copy stays mounted behind the sheet. Return
   * `null` for the sheet to leave it out there.
   */
  children: (place: FilterPlace) => ReactNode;
};

export type FilterBarProps = {
  /** Names the bar for assistive technology: "Filter records". */
  label: string;
  /** `search` for the filters of a list (a landmark), `group` for a row of display settings, such as a chart's. */
  role?: "search" | "group";
  /** The trigger and the sheet's title: "Filters". */
  filtersLabel: string;
  /** The trigger's name with a count, such as "Filters, 2 set". */
  countLabel: (count: number) => string;
  /** The sheet's close button. */
  closeLabel: string;
  /** The sheet's one action: "Done", "Show results". */
  doneLabel: string;
  /** The sheet's reset, shown with `onClear`: "Clear all". */
  clearLabel?: string;
  /** Filters set in the sheet's own fields (`FilterBarSheet`); folded items that are `active` are added. */
  count?: number;
  /**
   * `complete` draws every item in the sheet, so the sheet alone shows and
   * changes the whole filter; `overflow` draws only the folded ones.
   */
  sheet?: "complete" | "overflow";
  /** Before the sheet opens: copy the page's state into a draft for its own fields. */
  onOpen?: () => void;
  /** The done action: apply that draft. Items apply as they change and need nothing here. */
  onApply?: () => void;
  onClear?: () => void;
  className?: string;
  /** `FilterBarItem`s in the order they read, an optional `FilterBarSheet` and `FilterBarEnd`. */
  children: ReactNode;
};

/**
 * One control in a `FilterBar`. It draws nothing itself: the bar reads its
 * props and draws `children` in the bar or in the sheet.
 */
export function FilterBarItem(props: FilterBarItemProps): ReactNode {
  return props.children("bar");
}

/** Fields only the sheet holds, after the items: what a list needs now and then. */
export function FilterBarSheet({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/** Quiet actions at the bar's end that never fold: a "…" menu, Export. */
export function FilterBarEnd({ children }: { children: ReactNode }) {
  return <div className="di-filter-bar-end">{children}</div>;
}

type Layout = { folded: string[]; phone: boolean };

const sameLayout = (a: Layout, b: Layout) =>
  a.phone === b.phone && a.folded.length === b.folded.length && a.folded.every((name, i) => name === b.folded[i]);

/**
 * The filters above a list, on one row at every width. As the bar's own
 * width shrinks, its items fold one by one into the sheet behind the
 * Filters trigger — the lowest `priority` first, among equals the last
 * written — and come back in reverse as it grows. Those left keep their
 * order. Below 480px of bar only the kept items (the search), the trigger
 * and `FilterBarEnd` stay.
 *
 * **When to use:** search, scope, period, quick views and filters above a
 * list or a chart. **When not to:** a selection's actions, a form's
 * buttons → `Toolbar`.
 *
 * **Anatomy:** `FilterBarItem`s (each draws its control for the bar and the
 * sheet from the page's state, so there is one source of truth), the
 * trigger with the count of set filters that are not in view, then
 * `FilterBarEnd`. The sheet is a side `Dialog`: the items, then
 * `FilterBarSheet`, then done and clear.
 *
 * **Behaviour:** the widths are measured in the bar, before the first paint
 * and whenever the bar or an item changes size; a folded item returns only
 * with 16px to spare, so a bar on the edge does not flicker. When the
 * focused control folds, focus moves to the trigger.
 *
 * **Accessibility:** a `search` landmark (or a `group`) named by `label`. The sheet is
 * modal, so a reader meets one copy of a control at a time.
 */
export function FilterBar({
  label,
  role = "search",
  filtersLabel,
  countLabel,
  closeLabel,
  doneLabel,
  clearLabel,
  count = 0,
  sheet = "complete",
  onOpen,
  onApply,
  onClear,
  className,
  children,
}: FilterBarProps) {
  const [end, withoutEnd] = takeSlot(children, FilterBarEnd);
  const [fields, rest] = takeSlot(withoutEnd, FilterBarSheet);
  // The items are read by type rather than drawn as children: the bar draws each in a measured cell, or in the sheet.
  const items = Children.toArray(rest).filter(
    (child): child is ReactElement<FilterBarItemProps> => isValidElement(child) && child.type === FilterBarItem,
  );
  const hasFields = fields.length > 0;
  const bar = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLDivElement>(null);
  const widths = useRef(new Map<string, number>());
  const triggerWidth = useRef(0);
  const refocus = useRef<"trigger" | "bar" | null>(null);
  const [layout, setLayout] = useState<Layout>({ folded: [], phone: false });
  const [open, setOpen] = useState(false);
  const latest = useRef({ items, hasFields, layout });
  useLayoutEffect(() => {
    latest.current = { items, hasFields, layout };
  });

  const measure = () => {
    const element = bar.current;
    if (!element) return;
    const style = getComputedStyle(element);
    const room = element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    if (room <= 0) return;
    const { items, hasFields, layout } = latest.current;
    for (const cell of element.querySelectorAll<HTMLElement>(":scope > [data-filter-item]")) {
      const name = cell.dataset.filterItem!;
      widths.current.set(
        name,
        cell.dataset.grow === "true" ? parseFloat(getComputedStyle(cell).minWidth) || 0 : cell.offsetWidth,
      );
    }
    if (trigger.current) triggerWidth.current = trigger.current.offsetWidth;
    const endCell = element.querySelector<HTMLElement>(":scope > .di-filter-bar-end");
    const phone = room < phoneWidth;
    const folded = fit({
      room,
      gap: parseFloat(style.columnGap) || 0,
      items: items.map(({ props }) => ({
        name: props.name,
        width: widths.current.get(props.name) ?? 0,
        keep: props.keep ?? false,
        priority: props.priority ?? 0,
      })),
      trigger: triggerWidth.current,
      end: endCell?.offsetWidth ?? 0,
      triggerAlways: hasFields,
      folded: layout.folded,
      phone,
      slack: restoreSlack,
    });
    const next = { folded, phone };
    if (sameLayout(layout, next)) return;
    const active = document.activeElement;
    const leaving = folded.some((name) =>
      element.querySelector(`:scope > [data-filter-item="${CSS.escape(name)}"]`)?.contains(active),
    );
    if (leaving) refocus.current = "trigger";
    else if (trigger.current?.contains(active) && !folded.length && !hasFields) refocus.current = "bar";
    setLayout(next);
  };

  useLayoutEffect(() => {
    const element = bar.current;
    if (!element) return;
    if (refocus.current === "trigger") trigger.current?.querySelector("button")?.focus();
    if (refocus.current === "bar")
      element.querySelector<HTMLElement>("[data-filter-item] :is(input, select, button, a[href], textarea)")?.focus();
    refocus.current = null;
    measure();
    // Measured in the next frame, not inside the callback: a fold changes heights the page's own observers watch.
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    observer.observe(element);
    for (const child of element.children) observer.observe(child);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  });

  const folded = new Set(layout.folded);
  const shown = items.filter(({ props }) => !folded.has(props.name));
  const inSheet = sheet === "complete" ? items : items.filter(({ props }) => folded.has(props.name));
  const total = count + items.filter(({ props }) => props.active && folded.has(props.name)).length;
  const needed = hasFields || folded.size > 0;
  const name = total ? countLabel(total) : filtersLabel;
  const close = () => setOpen(false);

  return (
    <>
      <div ref={bar} role={role} aria-label={label} className={cx("di-filter-bar", className)}>
        {shown.map(({ props }) => (
          <div
            key={props.name}
            className="di-filter-bar-item"
            data-filter-item={props.name}
            data-grow={props.grow ? "true" : undefined}
          >
            {props.children("bar")}
          </div>
        ))}
        {needed ? (
          <div ref={trigger} className="di-filter-bar-trigger">
            <Button
              variant="secondary"
              size="sm"
              iconOnly={layout.phone}
              aria-label={name}
              title={layout.phone ? name : undefined}
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => {
                onOpen?.();
                setOpen(true);
              }}
            >
              <SlidersHorizontal aria-hidden />
              {layout.phone ? null : filtersLabel}
              {total ? <Badge tone="neutral">{String(total)}</Badge> : null}
            </Button>
          </div>
        ) : null}
        {end}
      </div>
      <Dialog
        open={open}
        onClose={close}
        title={filtersLabel}
        closeLabel={closeLabel}
        size="sm"
        onSubmit={(event) => {
          event.preventDefault();
          onApply?.();
          close();
        }}
      >
        <Stack variant="form">
          {inSheet.map(({ props }) => {
            const field = props.children("sheet");
            return field === null ? null : (
              <div key={props.name} className="di-filter-bar-field" data-filter-field={props.name}>
                {field}
              </div>
            );
          })}
          {fields}
        </Stack>
        <DialogFooter>
          {onClear && clearLabel ? (
            <Button variant="secondary" onClick={onClear}>
              {clearLabel}
            </Button>
          ) : null}
          <Button type="submit">{doneLabel}</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
