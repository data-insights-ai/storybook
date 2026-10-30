import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cx } from "../../../../internal/cx";
import { Toolbar } from "../../../actions/Toolbar";
import "./DataTable.css";

/**
 * Many records of one kind, in rows to scan, sort and compare column by
 * column.
 *
 * **When to use:** a register (sources, members, events) of a few to a few
 * hundred rows on one page. **Not** for one record's facts (`FactList`),
 * for a few records read as cards (`RecordCard`), for a list that grows
 * as the reader scrolls (`InfiniteTable`), or for a list beside the record
 * it opens (`ListDetail`).
 *
 * **Anatomy:** `Toolbar` (optional) · `TableHead` with one
 * `TableColumn` per column · `TableBody` with `TableRow`s of
 * `TableIndex` and `TableCell`s (`CellLead`, `CellIcon`, `CellStack`
 * inside), or `TableEmpty` when nothing matches · `TableFooter`
 * (count, pages).
 *
 * **States:** empty (`TableEmpty` keeps the head; the footer goes, it would only count nothing), the
 * row an open pane shows (`TableRow active`, the only state on a row's
 * leading edge), a failed row (its State column says so, like any other
 * state), loading (`Loading shape="table"` in its
 * place).
 *
 * **Content:** a column head is one or two words; identifiers, times and
 * measured values are `mono`; one link per row, on its name.
 *
 * **Accessibility:** a native `table` with a visually hidden `caption`;
 * sortable heads are buttons with `aria-sort`; Up and Down move between
 * the rows' links.
 *
 * The table is a frame. Header, rows and cells are children, so the
 * caller owns the copy and anything that sits in a cell. There is no
 * `rows` prop: the data belongs to the product, not to the table.
 *
 * The table is its own surface, a step above the ground, with no frame
 * of its own: its head and foot sit in the inset tone, its head names
 * each column in mono capitals. Ordinals run down the index column on the
 * left.
 *
 * On another surface (a `Panel`, a `Dialog`, a `RecordCard`, a
 * `Disclosure`, the `SignIn` card) the table drops its own ground and keeps
 * to that surface's content edge, like a button or a field beside it: the
 * head band, rules and row fills start and end there, and the text sits
 * inside them at the cell inset. To run it to the surface's edges instead,
 * all the way, place it in `Panel padded={false}`.
 * A table never reaches part of the way past the content edge.
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
  maxRows,
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
   * How many rows the whole list has, when only some of them are rendered.
   * `InfiniteTable` sets it; a screen reader then hears the full size, and
   * each `TableRow` states its place with `rowIndex`.
   */
  rowCount?: number;
  /**
   * Holds the grid in a frame about this many rows tall that scrolls on its
   * own, with the head kept at its top and the footer under it. For a long
   * register inside a page that has more below it (a panel, a dialog); a
   * register that is the page itself lets the page scroll instead.
   */
  maxRows?: number;
  className?: string;
  /** A `Toolbar`, the grid's `TableHead` and `TableBody`, and `TableFooter`. */
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
    if (child.type === TableToolbar || child.type === Toolbar) return void toolbar.push(child);
    if (child.type === TableFooter) return void foot.push(child);
    grid.push(child);
  });

  const fill = fillColumn(grid);
  const indexColumn = hasIndexColumn(grid);
  const empty = holdsEmpty(grid);
  const framed = maxRows !== undefined;
  const stack = narrow === "stack";
  const scroll = useRef<HTMLDivElement>(null);
  const overflowing = useOverflowing(scroll);
  const widths = useMeasuredColumns(scroll, layout === "measured");
  return (
    <div
      className={cx(
        "di-table-wrap",
        stack && "is-stackable",
        overflowing && "is-overflowing",
        framed && "is-framed",
        className,
      )}
      style={framed ? ({ "--di-table-frame-rows": maxRows } as CSSProperties) : undefined}
    >
      {toolbar.length > 0 ? <div className="di-table-toolbar">{toolbar}</div> : null}
      {/*
        The frame scrolls, not the page. A region that scrolls has to be
        reachable from the keyboard, so it takes a tab stop then, and only
        then: a frame that fits would be a stop that does nothing. A framed
        register always scrolls, so it is always a stop.
      */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- the frame takes the arrow keys for the rows inside it */}
      <div
        ref={scroll}
        className="di-table-scroll"
        tabIndex={overflowing || framed ? 0 : undefined}
        role="region"
        aria-label={caption}
        onKeyDown={moveBetweenRows}
      >
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
            <MeasuredContext.Provider value={widths !== undefined}>
              <IndexColumnContext.Provider value={indexColumn}>
                <FillColumnContext.Provider value={fill}>{grid}</FillColumnContext.Provider>
              </IndexColumnContext.Provider>
            </MeasuredContext.Provider>
          </StackContext.Provider>
        </table>
      </div>
      {empty ? null : foot}
    </div>
  );
}

/**
 * Up and Down move between rows, Home and End to the first and the last,
 * keeping the column: focus goes to the control in the same place in the
 * next row (its identifier link, its menu), so a register reads with the
 * arrows and Enter opens the row. Fields and open menus keep their keys.
 */
function moveBetweenRows(event: KeyboardEvent<HTMLDivElement>) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const target = event.target as HTMLElement;
  if (target.closest("input, textarea, select, [contenteditable], [role=menu], [role=listbox]")) return;
  const row = target.closest("tbody tr");
  if (!row) return;
  const rows = Array.from(event.currentTarget.querySelectorAll("tbody tr")).filter((r) => controls(r).length > 0);
  const at = rows.indexOf(row);
  const next =
    event.key === "Home"
      ? rows[0]
      : event.key === "End"
        ? rows[rows.length - 1]
        : rows[at + (event.key === "ArrowDown" ? 1 : -1)];
  if (!next || next === row) return;
  event.preventDefault();
  const column = Math.max(0, controls(row).indexOf(target));
  const into = controls(next);
  const focus = into[Math.min(column, into.length - 1)];
  focus.focus();
  focus.scrollIntoView?.({ block: "nearest" });
}

function controls(row: Element) {
  return Array.from(row.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), summary, [tabindex="0"]'));
}

const StackContext = createContext(false);
const MeasuredContext = createContext(false);
/* Which column fills, and which column a cell is in: the filling column's cells wrap, every other cell keeps its line. */
const FillColumnContext = createContext(-1);
const ColumnContext = createContext(-1);
/* Whether the head opens with the index column, so a row that spans the grid can start on the first data column. */
const IndexColumnContext = createContext(false);

function headColumns(grid: ReactNode[]) {
  const head = grid.find((child) => isValidElement(child) && child.type === TableHead);
  return isValidElement<{ children?: ReactNode }>(head) ? Children.toArray(head.props.children) : [];
}

function hasIndexColumn(grid: ReactNode[]) {
  const first = headColumns(grid)[0];
  return isValidElement<{ index?: boolean }>(first) && first.props.index === true;
}

function holdsEmpty(grid: ReactNode[]) {
  return grid.some(
    (child) =>
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === TableBody &&
      Children.toArray(child.props.children).some((row) => isValidElement(row) && row.type === TableEmpty),
  );
}

function fillColumn(grid: ReactNode[]) {
  return headColumns(grid).findIndex(
    (column) => isValidElement<{ width?: string }>(column) && column.props.width === "fill",
  );
}

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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- measures after every render until the head and a first row exist; once set it stops
  useLayoutEffect(() => {
    const el = frame.current;
    const table = el?.querySelector("table");
    if (!enabled || !el || !table || widths) return;
    const heads = table.tHead?.rows[0]?.cells;
    const row = table.tBodies[0]?.querySelector("tr:not(.di-table-spacer)");
    if (!heads || !row || getComputedStyle(table).display !== "table") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- column widths are read from the laid-out table before paint
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

/**
 * A filter row above the grid, inside the same frame.
 *
 * @deprecated Removed in 0.12: put a `Toolbar` in the `DataTable`; the
 * table draws its frame (inset, rule, head tone) around it.
 */
export function TableToolbar({ children }: { children: ReactNode }) {
  return <Toolbar>{children}</Toolbar>;
}

/** Under the grid: a count, a pagination control. */
export function TableFooter({ children }: { children: ReactNode }) {
  return <div className="di-table-foot">{children}</div>;
}

/**
 * The header row of a `DataTable`, holding one `TableColumn` per column.
 */
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
    return (
      <th scope="col" role={role} className="di-table-index">
        <span className="di-sr">{children}</span>
      </th>
    );
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

/**
 * The rows of a `DataTable`, each a `TableRow`.
 */
export function TableBody({ children }: { children: ReactNode }) {
  return <tbody role={useRole("rowgroup")}>{children}</tbody>;
}

/**
 * `active` marks the row an open drawer or detail pane is showing.
 *
 * `onSelect` makes the whole row the pointer target for that pane. A row is
 * not a control a keyboard can reach, so the row still carries one — a
 * `TextLink plain` on its identifier — that selects it too; the row only
 * widens where a pointer can press. Up and Down move between the rows'
 * controls, so Enter opens the next row without tabbing through every cell. A click on any control inside the row is left
 * to that control.
 */
export function TableRow({
  children,
  active = false,
  onSelect,
  rowIndex,
  ref,
}: {
  children: ReactNode;
  active?: boolean;
  /**
   * @deprecated Since 0.11 it draws nothing; removed in 0.12. A row's state is
   * its State column (`StatusPill` or `SeverityMark` with a word), the same for
   * every state; the leading edge is only the current row's.
   */
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
      className={cx(active && "is-active di-row-current", onSelect && "is-selectable")}
      onClick={
        onSelect
          ? (event) => {
              if ((event.target as Element).closest("a, button, input, select, textarea, label")) return;
              onSelect();
            }
          : undefined
      }
    >
      {Children.map(children, (cell, i) => (
        <ColumnContext.Provider value={i}>{cell}</ColumnContext.Provider>
      ))}
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
  return (
    <td role={useRole("cell")} className="di-table-index di-ordinal">
      {children}
    </td>
  );
}

/**
 * The body of a table with no rows: one row across every column that says
 * why it is empty (`message`) and, as `children`, the one way out — a
 * `Button variant="ghost"` that clears the filters. The head stays, so the
 * reader sees which list is empty, and the message starts on the first
 * data column's line, past the index column; the footer goes, since a count
 * of nothing repeats the message. Where the list has never held anything,
 * show a `Notice variant="empty"` instead of the table.
 */
export function TableEmpty({ message, children }: { message: string; children?: ReactNode }) {
  const indexColumn = useContext(IndexColumnContext);
  const cell = useRole("cell");
  return (
    <tr role={useRole("row")} className="di-table-empty">
      {indexColumn ? <td role={cell} className="di-table-index" /> : null}
      <td role={cell} colSpan={1000}>
        <span className="di-table-empty-body">
          <span className="di-table-empty-message">{message}</span>
          {children}
        </span>
      </td>
    </tr>
  );
}

/**
 * One value in a `TableRow`. `align="end"` for figures, `mono` for
 * identifiers, timestamps and measured values. `label` names the value when a
 * narrow table stacks its rows as cards, and `pinned` keeps it at the left
 * edge with its column.
 */
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
  const fill = useContext(FillColumnContext);
  const column = useContext(ColumnContext);
  const fills = fill !== -1 && fill === column;
  return (
    <td
      role={useRole("cell")}
      data-label={label}
      className={cx(
        align === "end" && "is-end",
        mono && "di-mono",
        pinned && "is-pinned",
        label && "is-labelled",
        fills && "is-fill",
      )}
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

/**
 * The icon in a `CellLead`: one lucide icon, hidden from assistive technology
 * by the icon itself, before the cell's text.
 */
export function CellIcon({ children }: { children: ReactNode }) {
  return <span className="di-cell-icon">{children}</span>;
}

/**
 * The leading content of a row's name cell: a `CellIcon` beside a `CellStack`,
 * kept on one baseline.
 */
export function CellLead({ children }: { children: ReactNode }) {
  return <span className="di-cell-lead">{children}</span>;
}
