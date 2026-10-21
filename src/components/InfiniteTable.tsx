import { Children, isValidElement, useEffect, useRef, type ReactNode } from "react";
import { useWindowVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import { DataTable, TableBody, TableFooter, TableHead, TableSpacer, TableToolbar } from "./DataTable";
import { EmptyState } from "./EmptyState";
import { NewEntries } from "./NewEntries";
import { SkeletonTable } from "./SkeletonTable";
import { Spinner } from "./Spinner";
import { remember, remembered } from "./infinite/measurements";
import { useHeldEntries } from "./infinite/useHeldEntries";
import { useListStart } from "./infinite/useListStart";
import { useLoadNearEnd } from "./infinite/useLoadNearEnd";
import "./InfiniteTable.css";

/** What a row needs to be measured and placed: spread onto its `TableRow`. */
export type InfiniteRowPlace = { key: string; rowIndex: number; ref: (row: HTMLTableRowElement | null) => void };

/**
 * A list that can grow without end, read page by page from the server.
 * Only the rows near the viewport are rendered; the page scrolls, not a
 * box, and the head stays in view under the app bar (and under a sticky
 * `ListToolbar`). The next page loads before the reader reaches the end.
 *
 * Search and filters belong to the server: the caller passes the rows it
 * has loaded for the current query, `hasMore`, and `onLoadMore`.
 *
 * Entries pushed in realtime: in a `newest-first` list, rows that arrive
 * above while the reader is further down are held back behind a "n new"
 * notice, so nothing on screen moves; a `sorted` list shows them in place.
 * `memoryKey` keeps the measured rows, so coming back to the list restores
 * its height and the router can restore the scroll position.
 *
 * Children: the `TableHead`, optionally a `TableToolbar`, and the
 * `EmptyState` shown instead of the table when nothing matches.
 */
export function InfiniteTable<T>({
  caption,
  items,
  rowKey,
  row,
  loading,
  hasMore,
  loadingMore,
  onLoadMore,
  order,
  memoryKey,
  loadingLabel,
  loadingMoreLabel,
  footerLabel,
  newEntriesLabel,
  indexed = false,
  narrow = "scroll",
  estimateRowHeight = 44,
  children,
}: {
  caption: string;
  /** The rows loaded so far, in the list's order. */
  items: T[];
  rowKey: (item: T) => string;
  /** One `TableRow` per item, with the place spread onto it. */
  row: (item: T, place: InfiniteRowPlace) => ReactNode;
  /** The first page is on its way: a skeleton stands in. */
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  /** `newest-first` holds back entries that arrive above; `sorted` shows them in place. */
  order: "newest-first" | "sorted";
  /** Identifies the list (and its query) for restoring its measured rows. */
  memoryKey: string;
  loadingLabel: string;
  loadingMoreLabel: string;
  /** Under the rows, e.g. "120 shown" or "All 120 shown". */
  footerLabel: string;
  /** The held-back notice, e.g. (3) => "3 new entries". */
  newEntriesLabel: (count: number) => string;
  indexed?: boolean;
  narrow?: "scroll" | "stack";
  estimateRowHeight?: number;
  /** `TableHead`, optionally `TableToolbar` and an `EmptyState`. */
  children: ReactNode;
}) {
  const head: ReactNode[] = [];
  const toolbar: ReactNode[] = [];
  const empty: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === TableHead) head.push(child);
    else if (child.type === TableToolbar) toolbar.push(child);
    else if (child.type === EmptyState) empty.push(child);
  });

  const top = useRef<HTMLTableRowElement>(null);
  const start = useListStart(top);
  const keys = items.map(rowKey);
  const held = useHeldEntries(keys, order === "newest-first", top, start);
  const shown = held.count > 0 ? items.slice(held.count) : items;

  const virtualizer = useWindowVirtualizer({
    count: shown.length,
    estimateSize: () => estimateRowHeight,
    overscan: 12,
    scrollMargin: start,
    getItemKey: (index) => rowKey(shown[index]),
    initialMeasurementsCache: remembered(memoryKey),
  });
  useEffect(() => () => remember(memoryKey, virtualizer.measurementsCache), [memoryKey, virtualizer]);
  const end = useLoadNearEnd({ hasMore, loadingMore, loaded: items.length, load: onLoadMore });

  if (loading) {
    return <SkeletonTable label={loadingLabel} rows={6} />;
  }
  if (items.length === 0) {
    return <>{empty}</>;
  }
  const rows = virtualizer.getVirtualItems();
  const { before, after } = gaps(rows, virtualizer.getTotalSize(), start);

  return (
    <div className="di-infinite">
      {held.count > 0 ? <NewEntries label={newEntriesLabel(held.count)} onShow={held.show} /> : null}
      <DataTable caption={caption} rowCount={shown.length} indexed={indexed} narrow={narrow}>
        {toolbar}
        {head}
        <TableBody>
          <TableSpacer ref={top} height={before} />
          {rows.map((r) => row(shown[r.index], { key: String(r.key), rowIndex: r.index, ref: virtualizer.measureElement }))}
          <TableSpacer height={after} />
        </TableBody>
        <TableFooter>
          <span ref={end} className="di-infinite-foot">
            {loadingMore ? <Spinner label={loadingMoreLabel} /> : footerLabel}
          </span>
        </TableFooter>
      </DataTable>
    </div>
  );
}

function gaps(rows: VirtualItem[], total: number, start: number) {
  if (rows.length === 0) return { before: 0, after: 0 };
  return { before: rows[0].start - start, after: total - (rows[rows.length - 1].end - start) };
}
