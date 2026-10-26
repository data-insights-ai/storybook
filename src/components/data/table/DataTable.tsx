import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import { cx } from "../../../cx";
import "./DataTable.css";

/**
 * The table is a frame. Header, rows and cells are children, so the
 * caller owns the copy and anything that sits in a cell. There is no
 * `rows` prop: the data belongs to the product, not to the table.
 *
 * The grid drops to the one cold surface in the system, so a dense
 * field of mono values reads as an extract from the record. Ordinals
 * run down the index column on the left.
 *
 * In a narrow frame the grid scrolls sideways, and a `pinned` column — the
 * row's name — stays at the left edge while the others pass under it.
 * `narrow="stack"` lays each row out as a card instead: unlabelled cells run
 * on and wrap like words, a cell with a `label` takes a line of its own with
 * its column's name in front, and the ordinal keeps the left edge.
 */
export function DataTable({
  caption,
  indexed = true,
  narrow = "scroll",
  layout = "auto",
  rowCount,
  className,
  children,
}: {
  /** The accessible name. Always present, visually hidden. */
  caption: string;
  /** The ordinal column. Off for a table that is not a register extract. */
  indexed?: boolean;
  /**
   * What a frame under 600px does. `scroll` keeps the grid and scrolls it;
   * `stack` turns each row into a block, for a table read row by row — a
   * log, a list of events — rather than compared column by column.
   */
  narrow?: "scroll" | "stack";
  /**
   * `measured` takes the column widths from the head and the first rows
   * drawn and keeps them, so a register whose rows come and go while it
   * scrolls (a virtualized list) does not shift its columns with every
   * row rendered. Measured again when the frame changes width.
   */
  layout?: "auto" | "measured";
  /**
   * How many rows the whole list has, when only some of them are rendered
   * (a virtualized register). A screen reader then hears the full size, and
   * each `TableRow` states its place with `rowIndex`.
   */
  rowCount?: number;
  className?: string;
  /** `TableToolbar`, the grid's `TableHead` and `TableBody`, and `TableFooter`. */
  children: ReactNode;
}) {
  /*
   * The one slot that cannot be placed by CSS: a `<div>` is not allowed
   * inside a `<table>`, so the frame has to pull the toolbar and the
   * footer out of the children and render them around the grid itself.
   */
  const toolbar: ReactNode[] = [];
  const grid: ReactNode[] = [];
  const foot: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return void grid.push(child);
    if (child.type === TableToolbar) return void toolbar.push(child);
    if (child.type === TableFooter) return void foot.push(child);
    grid.push(child);
  });

  const stack = narrow === "stack";
  const scroll = useRef<HTMLDivElement>(null);
  const overflowing = useOverflowing(scroll);
  const widths = useMeasuredColumns(scroll, layout === "measured");
  return (
    <div className={cx("di-table-wrap", stack && "is-stackable", overflowing && "is-overflowing", className)}>
      {toolbar}
      {/*
        The frame scrolls, not the page. A scrollable region has to be
        reachable from the keyboard, so it takes a tab stop and a name.
      */}
      <div ref={scroll} className="di-table-scroll" tabIndex={0} role="region" aria-label={caption}>
        {/* A stacked row is no longer laid out as a table, so it says what it is. */}
        <table
          className={cx("di-table", indexed && "is-indexed", widths && "is-measured")}
          role={stack ? "table" : undefined}
          aria-rowcount={rowCount === undefined ? undefined : rowCount + 1}
        >
          <caption className="di-sr">{caption}</caption>
          {widths ? (
            <colgroup>
              {widths.map((width, i) => (
                <col key={i} style={{ width }} />
              ))}
            </colgroup>
          ) : null}
          <StackContext.Provider value={stack}>
            <MeasuredContext.Provider value={widths !== undefined}>{grid}</MeasuredContext.Provider>
          </StackContext.Provider>
        </table>
      </div>
      {foot}
    </div>
  );
}

const StackContext = createContext(false);
const MeasuredContext = createContext(false);

/*
 * Whether the grid is wider than its frame. A frame that keeps its head in
 * view clips instead of scrolling; once the columns no longer fit, it hands
 * the sticky head back for a sideways scroll, so no column is cut off.
 */
function useOverflowing(frame: { current: HTMLDivElement | null }) {
  const [overflowing, setOverflowing] = useState(false);
  useLayoutEffect(() => {
    const el = frame.current;
    const table = el?.firstElementChild;
    if (!el || !table || typeof ResizeObserver === "undefined") return;
    const measure = () => setOverflowing(table.scrollWidth > el.clientWidth + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    observer.observe(table);
    measure();
    return () => observer.disconnect();
  }, [frame]);
  return overflowing;
}

/*
 * The widths the head and the first rows settle on, locked until the frame
 * changes width: a column measured by content would otherwise widen and
 * narrow with the rows a virtualized register happens to render. Nothing is
 * measured while the rows are stacked, where there are no columns.
 */
function useMeasuredColumns(frame: { current: HTMLDivElement | null }, enabled: boolean) {
  const [widths, setWidths] = useState<number[]>();
  useLayoutEffect(() => {
    const el = frame.current;
    const table = el?.querySelector("table");
    if (!enabled || !el || !table || widths) return;
    const heads = table.tHead?.rows[0]?.cells;
    const row = table.tBodies[0]?.querySelector("tr:not(.di-table-spacer)");
    if (!heads || !row || getComputedStyle(table).display !== "table") return;
    setWidths(Array.from(heads, (th) => th.getBoundingClientRect().width));
  });
  useLayoutEffect(() => {
    const el = frame.current;
    if (!enabled || !el || typeof ResizeObserver === "undefined") return;
    let width = el.clientWidth;
    const observer = new ResizeObserver(() => {
      if (Math.abs(el.clientWidth - width) > 1) {
        width = el.clientWidth;
        setWidths(undefined);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [frame, enabled]);
  return enabled ? widths : undefined;
}

function useRole(role: string) {
  return useContext(StackContext) ? role : undefined;
}

/** A filter row above the grid, inside the same frame. */
export function TableToolbar({ children }: { children: ReactNode }) {
  return <div className="di-table-toolbar">{children}</div>;
}

/** Under the grid: a count, a pagination control. */
export function TableFooter({ children }: { children: ReactNode }) {
  return <div className="di-table-foot">{children}</div>;
}

export function TableHead({ children }: { children: ReactNode }) {
  const group = useRole("rowgroup");
  const row = useRole("row");
  return (
    <thead role={group}>
      <tr role={row}>{children}</tr>
    </thead>
  );
}

/**
 * `sort` is the column the register is currently ordered by. It shows an
 * arrow and sets `aria-sort`, so the order is announced and not only drawn.
 */
/**
 * A head cell. `sort` states the order the rows are in; `onSort` makes the
 * header the control that changes it. The table never sorts: the caller
 * owns the order, because it also owns which rows are loaded.
 */
export function TableColumn({
  children,
  align = "start",
  index = false,
  sort = "none",
  onSort,
  width = "auto",
  pinned = false,
}: {
  children?: ReactNode;
  align?: "start" | "end";
  /** Stays at the left edge while the grid scrolls sideways. Set it on the column's cells too. */
  pinned?: boolean;
  /** `fill` hands this column whatever width the others leave — for a bar or a meter. */
  width?: "auto" | "fill";
  /** The empty head cell above the ordinal column. */
  index?: boolean;
  sort?: "none" | "ascending" | "descending";
  /** Called when the header is pressed. Present, the column offers itself as sortable. */
  onSort?: () => void;
}) {
  const role = useRole("columnheader");
  if (index) {
    return <th scope="col" role={role} className="di-table-index"><span className="di-sr">{children}</span></th>;
  }
  // A sortable column that is not the sorted one still says so, quietly: a
  // header that only reveals it is a control once pressed is a guess.
  const mark = sort === "ascending" ? "↑" : sort === "descending" ? "↓" : onSort ? "↕" : null;
  const arrow = mark ? (
    <span className={cx("di-table-sort", sort === "none" && "is-idle")} aria-hidden>
      {mark}
    </span>
  ) : null;
  return (
    <th
      scope="col"
      role={role}
      className={cx(
        align === "end" && "is-end",
        sort !== "none" && "is-sorted",
        width === "fill" && "is-fill",
        pinned && "is-pinned",
      )}
      aria-sort={sort === "none" ? undefined : sort}
    >
      {onSort ? (
        <button type="button" className="di-table-sort-btn" onClick={onSort}>
          {children}
          {arrow}
        </button>
      ) : (
        <>
          {children}
          {arrow}
        </>
      )}
    </th>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody role={useRole("rowgroup")}>{children}</tbody>;
}

/**
 * `active` marks the row an open drawer or detail pane is showing.
 *
 * `onSelect` makes the whole row the pointer target for that pane. A row is
 * not a control a keyboard can reach, so the row still carries one — a
 * `TextLink` on its identifier — that selects it too; the row only widens
 * where a pointer can press. A click on any control inside the row is left
 * to that control.
 */
export function TableRow({
  children,
  active = false,
  tone = "neutral",
  onSelect,
  rowIndex,
  ref,
}: {
  children: ReactNode;
  active?: boolean;
  /** `danger` tints the ordinal, for a row that failed. */
  tone?: "neutral" | "danger";
  onSelect?: () => void;
  /**
   * The row's place in the whole list, from 0, when the table renders only
   * part of it. It sets `aria-rowindex` and the `data-index` a virtualizer
   * measures the row by.
   */
  rowIndex?: number;
  /** The row element, for a virtualizer that measures rendered rows. */
  ref?: Ref<HTMLTableRowElement>;
}) {
  const role = useRole("row");
  return (
    <tr
      ref={ref}
      role={role}
      data-index={rowIndex}
      aria-rowindex={rowIndex === undefined ? undefined : rowIndex + 2}
      className={cx(active && "is-active", tone === "danger" && "is-danger", onSelect && "is-selectable")}
      onClick={
        onSelect
          ? (event) => {
              if ((event.target as Element).closest("a, button, input, select, textarea, label")) return;
              onSelect();
            }
          : undefined
      }
    >
      {children}
    </tr>
  );
}

/**
 * Stands in for the rows a virtualized register does not render, above or
 * below the ones on screen, so the scroll height stays that of the whole
 * list. It is hidden from assistive technology; `ref` lets the caller watch
 * it, for example to load the next page as the reader nears the end.
 */
export function TableSpacer({ height, ref }: { height: number; ref?: Ref<HTMLTableRowElement> }) {
  const style = { "--di-table-spacer": `${Math.max(0, height)}px` } as CSSProperties;
  return (
    <tr ref={ref} className={cx("di-table-spacer", height <= 0 && "is-empty")} aria-hidden style={style}>
      <td colSpan={1000} />
    </tr>
  );
}

/** The ordinal cell. Mono, quiet, and the row's handle in conversation. */
export function TableIndex({ children }: { children: ReactNode }) {
  return <td role={useRole("cell")} className="di-table-index">{children}</td>;
}

export function TableCell({
  children,
  align = "start",
  mono = false,
  label,
  pinned = false,
}: {
  children: ReactNode;
  align?: "start" | "end";
  /** Identifiers, timestamps and measured values run in the mono track. */
  mono?: boolean;
  /**
   * The column's name, said in front of the value when the row is stacked
   * as a card (`narrow="stack"` in a narrow frame). Leave it off for the
   * row's name and its actions: they head and close the card unlabelled.
   */
  label?: string;
  /** Stays at the left edge while the grid scrolls sideways, with its `TableColumn`. */
  pinned?: boolean;
}) {
  const measured = useContext(MeasuredContext);
  return (
    <td
      role={useRole("cell")}
      data-label={label}
      className={cx(align === "end" && "is-end", mono && "di-mono", pinned && "is-pinned", label && "is-labelled")}
      /* A value cut by a measured column shows whole in its tooltip. */
      onMouseEnter={measured ? revealCut : undefined}
    >
      {children}
    </td>
  );
}

function revealCut(event: { currentTarget: HTMLTableCellElement }) {
  const el = event.currentTarget;
  const cut = el.scrollWidth > el.clientWidth + 1;
  if (cut && !el.title) el.title = el.textContent?.trim() ?? "";
  else if (!cut && el.title) el.removeAttribute("title");
}

/**
 * A value with what qualifies it underneath. `secondary` is one line, or
 * several short ones that each keep their own line — a unit price, then
 * what a quantity buys, then its total — so a narrow frame stacks them
 * instead of cutting one long line.
 */
export function CellStack({
  primary = "",
  secondary = "",
  prose = false,
  children,
}: {
  primary?: string;
  secondary?: string | readonly string[];
  /** The lines underneath are prose (an email, a description), not machine values. */
  prose?: boolean;
  /** The value as an element instead of `primary`: a `TextLink` when the row opens a record. */
  children?: ReactNode;
}) {
  const lines = (typeof secondary === "string" ? [secondary] : secondary).filter((line) => line !== "");
  return (
    <span className="di-cell">
      <span className="di-cell-primary">{children ?? primary}</span>
      {lines.map((line, i) => (
        <span key={i} className={prose ? "di-cell-secondary is-prose" : "di-cell-secondary"}>
          {line}
        </span>
      ))}
    </span>
  );
}

export function CellIcon({ children }: { children: ReactNode }) {
  return <span className="di-cell-icon">{children}</span>;
}

export function CellLead({ children }: { children: ReactNode }) {
  return <span className="di-cell-lead">{children}</span>;
}
