import {
  defaultRangeExtractor,
  useVirtualizer,
  useWindowVirtualizer,
  type Range,
  type VirtualItem,
} from "@tanstack/react-virtual";
import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useInsertionEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Button } from "../../actions/Button";
import { Toolbar } from "../../actions/Toolbar";
import { DataTable, TableBody, TableFooter, TableGroupRow, TableSpacer } from "../DataTable";
import { NewEntries } from "../NewEntries";
import { Loading } from "../../feedback/Loading";
import { useHeldHead } from "./heldHead";
import "./InfiniteTable.css";

/** What a row needs to be measured and placed: spread it onto its `TableRow`. */
export type InfiniteRowPlace = { key: string; rowIndex: number; ref: (row: HTMLTableRowElement | null) => void };

/**
 * A register too long for one page, read by scrolling: an audit log, the
 * events of a source, every run of a collector.
 *
 * **When to use:** hundreds to millions of rows, loaded page by page, or
 * a live register that gains rows while it is read. **Not** for a list
 * that fits on a few pages (`DataTable` with `Pagination`), nor where
 * the reader must reach a known page by number.
 *
 * **Anatomy:** `Toolbar` and `TableHead` as children, then the
 * rendered rows between two spacers, then a footer that counts the rows
 * or says the next page is loading; `NewEntries` floats under the app
 * bar while rows are held back.
 *
 * **States:** loading more (the footer's inline `Loading`), all loaded
 * (`footerLabel` with `hasMore` false), a page that did not arrive (the
 * footer's `retryLabel` button), entries held back (`order="newest-first"`).
 *
 * **Accessibility:** `aria-rowcount` gives the whole size and each row
 * its `aria-rowindex`, so a screen reader hears where it is although
 * only some rows exist in the page.
 *
 * A register that grows as the reader scrolls: only the rows near the
 * viewport are rendered, the next page is asked for while the end is still
 * below the fold, and a newest-first register keeps the reader's place when
 * entries arrive above — it holds them back and says how many with
 * `NewEntries`, until the reader returns to the top or presses it.
 *
 * The table holds no data. The caller says how many rows are loaded, names
 * each by `rowKey`, renders one `TableRow` per index with `renderRow`, and
 * fetches when `onLoadMore` is called. A fetch that ends (`loadingMore` back
 * to false) without a row more while `hasMore` holds is a page that did not
 * arrive: the table asks no more until the reader presses `retryLabel` or
 * `count`, `hasMore` or `memoryKey` change, so a failing server is not
 * asked again and again. Rows not rendered are held by space as
 * tall as the rendered rows measure, so the scroll height follows the
 * density and the fonts instead of a fixed guess. Its `Toolbar` and `TableHead`
 * are children, as in `DataTable`.
 *
 * **Where it scrolls:** when the register is the page (an audit log, a
 * source's events) the page scrolls, not the table, and the head stays in
 * view under the app bar (`--di-sticky-top`) and under a sticky
 * `Toolbar` above it, also while a grid wider than the page scrolls
 * sideways; with `groupOf`, the row of the group in view stays under it. When the register is one block among others (in
 * a `Panel`, beside a record, in a `Dialog`) give it `maxRows`: it then
 * scrolls in a frame about that many rows tall, its head held at the
 * frame's top and its count under it, so the page around it stays short.
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
  retryLabel,
  memoryKey,
  estimateRowHeight,
  indexed = false,
  narrow = "scroll",
  layout = "measured",
  maxRows,
  groupOf,
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
  /** The footer's button after a page did not arrive, e.g. "Try again"; it asks for the page once more. */
  retryLabel: string;
  /** Names the register, so its measured rows are kept when it is shown again (back from a detail page). */
  memoryKey?: string;
  /** The height of a row not yet rendered, until the first rows are measured; after that, their mean. */
  estimateRowHeight?: number;
  indexed?: boolean;
  narrow?: "scroll" | "stack";
  /** Column widths are measured once and kept while rows come and go; `auto` lets each render size them. */
  layout?: "auto" | "measured";
  /** Scrolls in a frame about this many rows tall instead of with the page. Leave it out when the register is the page. */
  maxRows?: number;
  /**
   * The label of the group the row at this index belongs to. A `TableGroupRow` heads each run of rows with one
   * label, so the rows come in the order they are grouped by, and a group with no rows loaded has no row.
   */
  groupOf?: (index: number) => string;
  /** `Toolbar` and `TableHead`. */
  children: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLTableRowElement>(null);
  const framed = maxRows !== undefined;
  const frame = useFrame(host, framed);
  const start = useListStart(top, frame);
  const keys = Array.from({ length: count }, (_, i) => rowKey(i));
  const held = useHeld(keys, order === "newest-first", top, start, frame);
  const shown = count - held.count;
  const entries = entriesOf(held.count, count, keys, groupOf);

  const sized = useRef<Map<unknown, number>>(undefined);
  const mean = useRef<Mean>({ of: 0, size: 0 });
  const common = {
    count: entries.length,
    estimateSize: () => meanSize(sized.current, mean.current) ?? estimateRowHeight ?? fallbackRowHeight,
    overscan: 12,
    scrollMargin: start,
    getItemKey: (index: number) => entries[index].key,
    rangeExtractor: groupOf ? (range: Range) => withOpenGroup(range, entries) : defaultRangeExtractor,
    initialMeasurementsCache: memoryKey ? measured.get(memoryKey) : undefined,
  };
  // Both hooks run every render, as hooks must; the one that does not fit the register stays disabled.
  const onPage = useWindowVirtualizer<HTMLTableRowElement>({ ...common, enabled: !framed });
  // eslint-disable-next-line react-hooks/incompatible-library -- the component reads the virtualizer afresh each render and memoizes nothing from it
  const inFrame = useVirtualizer<HTMLElement, HTMLTableRowElement>({
    ...common,
    enabled: framed && frame !== null,
    getScrollElement: () => frame,
  });
  const virtualizer = framed ? inFrame : onPage;
  useLayoutEffect(() => {
    sized.current = virtualizer.itemSizeCache;
  }, [virtualizer]);
  useEffect(
    () => () => {
      if (memoryKey) remember(memoryKey, virtualizer.measurementsCache);
    },
    [memoryKey, virtualizer],
  );
  const end = useNearEnd({ hasMore, loadingMore, loaded: count, onLoadMore, frame, memoryKey });
  useHeldHead(host, !framed);

  const toolbar: ReactNode[] = [];
  const head: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Toolbar) toolbar.push(child);
    else head.push(child);
  });
  const items = virtualizer.getVirtualItems();
  const pinned = detached(items);
  const { before, after } = gaps(pinned ? items.slice(1) : items, virtualizer.getTotalSize(), start);

  return (
    <div ref={host} className={framed ? "di-infinite is-framed" : "di-infinite"}>
      {held.count > 0 ? <NewEntries label={newEntriesLabel(held.count)} onShow={held.show} /> : null}
      <DataTable
        caption={caption}
        rowCount={entries.length}
        indexed={indexed}
        narrow={narrow}
        layout={layout}
        maxRows={maxRows}
      >
        {toolbar}
        {head}
        <TableBody>
          {/* The open group's row, far above the rendered ones, takes its height from the space before them. */}
          <TableSpacer ref={top} height={before - (pinned?.size ?? 0)} />
          {items.map((r) => {
            const entry = entries[r.index];
            const place = { key: String(r.key), rowIndex: r.index, ref: virtualizer.measureElement };
            return entry.group === undefined ? (
              renderRow(entry.row, place)
            ) : (
              <TableGroupRow key={place.key} label={entry.group} rowIndex={place.rowIndex} ref={place.ref} />
            );
          })}
          {/* A frame clips what is past its edge, so the end is watched inside it: the spacer after the rows. */}
          <TableSpacer height={after} ref={framed ? end.target : undefined} />
        </TableBody>
        <TableFooter>
          <span ref={framed ? undefined : end.target}>
            {loadingMore ? <Loading shape="inline" label={loadingLabel} delay={0} /> : footerLabel(shown, hasMore)}
          </span>
          {end.stalled && !loadingMore ? (
            <Button variant="secondary" size="sm" onClick={end.retry}>
              {retryLabel}
            </Button>
          ) : null}
        </TableFooter>
      </DataTable>
    </div>
  );
}

/* Rows not yet rendered are as tall as the rendered ones: density, fonts and wrapping set the real height, not a constant. */
const fallbackRowHeight = 44;
type Mean = { of: number; size: number };
function meanSize(sizes: Map<unknown, number> | undefined, mean: Mean) {
  if (!sizes || sizes.size === 0) return undefined;
  if (mean.of !== sizes.size) {
    let sum = 0;
    for (const size of sizes.values()) sum += size;
    mean.of = sizes.size;
    mean.size = sum / sizes.size;
  }
  return mean.size;
}

/*
 * What the virtualizer places: the rows shown, each run of one group headed by its group row. A group row is
 * keyed by its label and how often that label has started a run, so it keeps its key while rows arrive above.
 */
type Entry = { key: string; row: number; group?: string };
function entriesOf(
  from: number,
  count: number,
  keys: string[],
  groupOf: ((index: number) => string) | undefined,
): Entry[] {
  const entries: Entry[] = [];
  const runs = new Map<string, number>();
  let last: string | undefined;
  for (let row = from; row < count; row++) {
    const group = groupOf?.(row);
    if (group !== undefined && group !== last) {
      const run = runs.get(group) ?? 0;
      runs.set(group, run + 1);
      entries.push({ key: `group:${run}:${group}`, row, group });
    }
    last = group;
    entries.push({ key: keys[row], row });
  }
  return entries;
}

/*
 * The group row of the group the view starts in is rendered with the rows on screen, however far above them it is,
 * so it can stay under the head while the reader is in its group.
 */
function withOpenGroup(range: Range, entries: Entry[]) {
  const indexes = defaultRangeExtractor(range);
  let open = Math.min(range.startIndex, entries.length - 1);
  while (open >= 0 && entries[open].group === undefined) open--;
  return open < 0 || indexes.includes(open) ? indexes : [open, ...indexes];
}

/* The open group's row when it is rendered apart from the rows after it. */
function detached(items: VirtualItem[]) {
  return items.length > 1 && items[1].index > items[0].index + 1 ? items[0] : undefined;
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

/* The frame a framed register scrolls in: the table's own scroll region. */
function useFrame(host: RefObject<HTMLElement | null>, framed: boolean) {
  const [frame, setFrame] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const el = framed ? (host.current?.querySelector<HTMLElement>(".di-table-scroll") ?? null) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the frame exists only once the table is laid out
    setFrame(el);
  }, [host, framed]);
  return frame;
}

/*
 * Where the first row starts in what scrolls: the document, or the frame
 * (under the head held at its top). Content above the register can move it.
 */
function useListStart(top: RefObject<Element | null>, frame: HTMLElement | null) {
  const [start, setStart] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- content above the register can move it on any render; an unchanged start does not render again
  useLayoutEffect(() => {
    const el = top.current;
    if (!el) return;
    const at = Math.round(
      frame
        ? el.getBoundingClientRect().top - frame.getBoundingClientRect().top + frame.scrollTop
        : el.getBoundingClientRect().top + window.scrollY,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the start is read from layout before paint
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
  frame,
  memoryKey,
}: {
  hasMore: boolean;
  loadingMore: boolean;
  loaded: number;
  onLoadMore: () => void;
  frame: HTMLElement | null;
  memoryKey: string | undefined;
}) {
  const [target, setTarget] = useState<Element | null>(null);
  const [near, setNear] = useState(false);
  const load = useRef(onLoadMore);
  useInsertionEffect(() => {
    load.current = onLoadMore;
  });
  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      root: frame,
      rootMargin: ahead,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [target, frame]);
  /* The register as it was when a page was asked for, and when one did not arrive: a stall holds while nothing changed. */
  const asked = useRef<number | null>(null);
  const [stall, setStall] = useState<Stall | null>(null);
  const stalled =
    stall !== null && stall.loaded === loaded && stall.hasMore === hasMore && stall.memoryKey === memoryKey;
  // An observer reports changes only; a short page can leave the end in reach, so each page checks again.
  useEffect(() => {
    if (loadingMore) return;
    if (asked.current !== null) {
      const arrived = loaded > asked.current;
      asked.current = null;
      if (!arrived && hasMore) {
        setStall({ loaded, hasMore, memoryKey });
        return;
      }
    }
    if (near && hasMore && !stalled) {
      asked.current = loaded;
      load.current();
    }
  }, [near, hasMore, loadingMore, loaded, stalled, memoryKey]);
  const retry = () => {
    asked.current = loaded;
    setStall(null);
    load.current();
  };
  return { target: setTarget, stalled, retry };
}

type Stall = { loaded: number; hasMore: boolean; memoryKey: string | undefined };

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

function useHeld(
  keys: string[],
  enabled: boolean,
  top: RefObject<Element | null>,
  start: number,
  frame: HTMLElement | null,
) {
  const [anchor, setAnchor] = useState<string>();
  const [atTop, setAtTop] = useState(true);
  const first = keys[0];
  useEffect(() => {
    if (!enabled) return;
    const check = () => {
      if (frame) return setAtTop(frame.scrollTop <= 0);
      const edge = stickyTop(top.current);
      setAtTop((top.current?.getBoundingClientRect().top ?? edge) >= edge);
    };
    check();
    const scroller = frame ?? window;
    scroller.addEventListener("scroll", check, { passive: true });
    return () => scroller.removeEventListener("scroll", check);
  }, [enabled, top, frame]);
  const [seen, setSeen] = useState({ atTop, first });
  if (seen.atTop !== atTop || seen.first !== first) {
    setSeen({ atTop, first });
    setAnchor((a) => (atTop ? undefined : (a ?? first)));
  }
  const show = useCallback(() => {
    setAnchor(undefined);
    if (frame) frame.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: Math.max(0, start - stickyTop(top.current) - 24), behavior: "smooth" });
  }, [start, top, frame]);
  return { count: enabled ? heldCount(keys, anchor) : 0, show };
}
