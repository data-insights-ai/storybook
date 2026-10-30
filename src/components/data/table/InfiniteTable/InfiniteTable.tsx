import { useWindowVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { DataTable, TableBody, TableFooter, TableSpacer, TableToolbar } from "../DataTable";
import { NewEntries } from "../../records/NewEntries";
import { Spinner } from "../../../feedback/waiting/Spinner";
import "./InfiniteTable.css";

/** What a row needs to be measured and placed: spread it onto its `TableRow`. */
export type InfiniteRowPlace = { key: string; rowIndex: number; ref: (row: HTMLTableRowElement | null) => void };

/**
 * A register that grows as the reader scrolls: only the rows near the
 * viewport are rendered, the next page is asked for while the end is still
 * below the fold, and a newest-first register keeps the reader's place when
 * entries arrive above — it holds them back and says how many with
 * `NewEntries`, until the reader returns to the top or presses it.
 *
 * The table holds no data. The caller says how many rows are loaded, names
 * each by `rowKey`, renders one `TableRow` per index with `renderRow`, and
 * fetches when `onLoadMore` is called. Its `TableToolbar` and `TableHead`
 * are children, as in `DataTable`. The page scrolls, not the table, and
 * the head stays in view under the app bar (`--di-sticky-top`) and under a
 * sticky `ListToolbar` above the table.
 */
export function InfiniteTable({
  caption,
  count,
  rowKey,
  renderRow,
  hasMore,
  loadingMore,
  onLoadMore,
  order = "sorted",
  newEntriesLabel,
  footerLabel,
  loadingLabel,
  memoryKey,
  estimateRowHeight = 44,
  indexed = false,
  narrow = "scroll",
  layout = "measured",
  children,
}: {
  caption: string;
  /** Rows loaded so far. */
  count: number;
  /** A stable key for the row at this index. */
  rowKey: (index: number) => string;
  /** One `TableRow` for the row at this index, with `place` spread onto it. */
  renderRow: (index: number, place: InfiniteRowPlace) => ReactNode;
  /** More rows exist beyond those loaded. */
  hasMore: boolean;
  /** A page is being fetched. */
  loadingMore: boolean;
  onLoadMore: () => void;
  /** `newest-first` holds back rows that arrive above while the reader is further down. */
  order?: "newest-first" | "sorted";
  /** "3 new entries", for the held rows. */
  newEntriesLabel: (held: number) => string;
  /** The footer line for the rows shown, e.g. "120 loaded" or "All 132 entries". */
  footerLabel: (shown: number, hasMore: boolean) => string;
  /** Said while the next page loads. */
  loadingLabel: string;
  /** Names the register, so its measured rows are kept when it is shown again (back from a detail page). */
  memoryKey?: string;
  estimateRowHeight?: number;
  indexed?: boolean;
  narrow?: "scroll" | "stack";
  /** Column widths are measured once and kept while rows come and go; `auto` lets each render size them. */
  layout?: "auto" | "measured";
  /** `TableToolbar` and `TableHead`. */
  children: ReactNode;
}) {
  const top = useRef<HTMLTableRowElement>(null);
  const start = useListStart(top);
  const keys = Array.from({ length: count }, (_, i) => rowKey(i));
  const held = useHeld(keys, order === "newest-first", top, start);
  const shown = count - held.count;

  const virtualizer = useWindowVirtualizer({
    count: shown,
    estimateSize: () => estimateRowHeight,
    overscan: 12,
    scrollMargin: start,
    getItemKey: (index) => keys[index + held.count],
    initialMeasurementsCache: memoryKey ? measured.get(memoryKey) : undefined,
  });
  useEffect(
    () => () => {
      if (memoryKey) remember(memoryKey, virtualizer.measurementsCache);
    },
    [memoryKey, virtualizer],
  );
  const end = useNearEnd({ hasMore, loadingMore, loaded: count, onLoadMore });

  const toolbar: ReactNode[] = [];
  const head: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === TableToolbar) toolbar.push(child);
    else head.push(child);
  });
  const rows = virtualizer.getVirtualItems();
  const { before, after } = gaps(rows, virtualizer.getTotalSize(), start);

  return (
    <div className="di-infinite">
      {held.count > 0 ? <NewEntries label={newEntriesLabel(held.count)} onShow={held.show} /> : null}
      <DataTable caption={caption} rowCount={shown} indexed={indexed} narrow={narrow} layout={layout}>
        {toolbar}
        {head}
        <TableBody>
          <TableSpacer ref={top} height={before} />
          {rows.map((r) =>
            renderRow(r.index + held.count, { key: String(r.key), rowIndex: r.index, ref: virtualizer.measureElement }),
          )}
          <TableSpacer height={after} />
        </TableBody>
        <TableFooter>
          <span ref={end}>{loadingMore ? <Spinner label={loadingLabel} /> : footerLabel(shown, hasMore)}</span>
        </TableFooter>
      </DataTable>
    </div>
  );
}

function gaps(rows: VirtualItem[], total: number, start: number) {
  if (rows.length === 0) return { before: 0, after: 0 };
  return { before: rows[0].start - start, after: total - (rows[rows.length - 1].end - start) };
}

/* Measured heights per register: shown again, it has its real height at once, so a restored scroll position fits. */
const measured = new Map<string, VirtualItem[]>();
function remember(key: string, items: VirtualItem[]) {
  measured.delete(key);
  measured.set(key, items);
  if (measured.size > 20) measured.delete(measured.keys().next().value as string);
}

/* Where the first row starts in the document; content above the register can move it. */
function useListStart(top: RefObject<Element | null>) {
  const [start, setStart] = useState(0);
  useLayoutEffect(() => {
    const el = top.current;
    if (!el) return;
    const at = Math.round(el.getBoundingClientRect().top + window.scrollY);
    if (Math.abs(at - start) > 1) setStart(at);
  });
  return start;
}

/* The next page is asked for while the end of the loaded rows is this far below the viewport. */
const ahead = "0px 0px 800px 0px";

function useNearEnd({
  hasMore,
  loadingMore,
  loaded,
  onLoadMore,
}: {
  hasMore: boolean;
  loadingMore: boolean;
  loaded: number;
  onLoadMore: () => void;
}) {
  const [target, setTarget] = useState<Element | null>(null);
  const [near, setNear] = useState(false);
  const load = useRef(onLoadMore);
  load.current = onLoadMore;
  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: ahead });
    observer.observe(target);
    return () => observer.disconnect();
  }, [target]);
  // An observer reports changes only; a short page can leave the end in reach, so each page checks again.
  useEffect(() => {
    if (near && hasMore && !loadingMore) load.current();
  }, [near, hasMore, loadingMore, loaded]);
  return setTarget;
}

/* The sticky app bar's room, from `--di-sticky-top`: the register's top counts as seen below it. */
function stickyTop(el: Element | null) {
  const value = el ? parseFloat(getComputedStyle(el).getPropertyValue("--di-sticky-top")) : NaN;
  return Number.isFinite(value) ? value : 64;
}

/** How many of `keys` arrived above the row the reader's view is anchored to. */
export function heldCount(keys: string[], anchor: string | undefined) {
  if (anchor === undefined) return 0;
  const at = keys.indexOf(anchor);
  return at < 0 ? 0 : at;
}

function useHeld(keys: string[], enabled: boolean, top: RefObject<Element | null>, start: number) {
  const [anchor, setAnchor] = useState<string>();
  const [atTop, setAtTop] = useState(true);
  const first = keys[0];
  useEffect(() => {
    if (!enabled) return;
    const check = () => {
      const edge = stickyTop(top.current);
      setAtTop((top.current?.getBoundingClientRect().top ?? edge) >= edge);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [enabled, top]);
  useEffect(() => {
    if (atTop) setAnchor(undefined);
    else setAnchor((a) => a ?? first);
  }, [atTop, first]);
  const show = useCallback(() => {
    setAnchor(undefined);
    window.scrollTo({ top: Math.max(0, start - stickyTop(top.current) - 24), behavior: "smooth" });
  }, [start]);
  return { count: enabled ? heldCount(keys, anchor) : 0, show };
}
