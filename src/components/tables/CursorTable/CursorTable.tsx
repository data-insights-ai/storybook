import { Children, isValidElement, type ReactNode } from "react";
import { Loading } from "../../feedback/Loading";
import { Panel } from "../../layout/page/Panel";
import { TableEmpty } from "../DataTable";
import { InfiniteTable, type InfiniteRowPlace } from "../InfiniteTable";

/** What a list read page by page from a server cursor tells the table. */
export type CursorTableList<T> = {
  items: readonly T[];
  isPending: boolean;
  isError?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export type CursorTableLabels = {
  loading: string;
  loadingMore: string;
  retry: string;
  /** How many entries arrived above while the reader was further down. */
  newEntries: (count: number) => string;
  /** The footer: entries loaded so far, or all of them once nothing is left. */
  footer: (count: number, hasMore: boolean) => string;
};

/** Shown on a surface instead of the table when the list never held a row: an `EmptyState`. */
export function CursorTableEmpty({ children }: { children: ReactNode }) {
  return children;
}

/** Shown instead of the table when the list could not be read: a `LoadError`. */
export function CursorTableFailed({ children }: { children: ReactNode }) {
  return children;
}

/**
 * An `InfiniteTable` fed by a cursor list, with the states around it: a
 * skeleton while the first page loads, `CursorTableFailed` in place of a
 * list that could not be read (never the empty state), `CursorTableEmpty` on a
 * surface when the list never held a row. While a filter or a search is
 * set, pass a `TableEmpty` child: a list it empties keeps the table and its
 * head, with that line in its body.
 *
 * **Anatomy:** children as `InfiniteTable` takes them (`Toolbar`,
 * `TableHead`, a `TableEmpty`), plus `CursorTableEmpty` and
 * `CursorTableFailed`.
 */
export function CursorTable<T>({
  caption,
  list,
  rowKey,
  row,
  groupOf,
  isEntry,
  onSurface = false,
  labels,
  order = "sorted",
  memoryKey,
  indexed,
  narrow,
  estimateRowHeight,
  maxRows,
  children,
}: {
  caption: string;
  list: CursorTableList<T>;
  rowKey: (item: T) => string;
  /** One `TableRow` per item, with the place spread onto it. */
  row: (item: T, place: InfiniteRowPlace) => ReactNode;
  /** The label of the item's group; a group row heads each run, so it follows the list's order. */
  groupOf?: (item: T) => string;
  /** Which rows are entries when some are not (separators); only those are counted. */
  isEntry?: (item: T) => boolean;
  /** Already on a surface (a detail section), so the empty state needs no panel of its own. */
  onSurface?: boolean;
  labels: CursorTableLabels;
  /** Newest-first lists hold back entries that arrive above while the reader is further down. */
  order?: "newest-first" | "sorted";
  /** Identifies the list and its query, for restoring its measured rows after back. */
  memoryKey?: string;
  indexed?: boolean;
  narrow?: "scroll" | "stack";
  estimateRowHeight?: number;
  maxRows?: number;
  children: ReactNode;
}) {
  const { items } = list;
  const parts = Children.toArray(children);
  const slot = (type: unknown) => parts.find((child) => isValidElement(child) && child.type === type);
  const empty = slot(CursorTableEmpty);
  const failed = slot(CursorTableFailed);
  const table = parts.filter((child) => child !== empty && child !== failed);
  const entries = (rows: readonly T[]) => (isEntry ? rows.filter(isEntry).length : rows.length);
  if (list.isError && items.length === 0) {
    return failed ?? null;
  }
  if (list.isPending) {
    return <Loading shape="table" label={labels.loading} rows={6} />;
  }
  if (items.length === 0 && !slot(TableEmpty)) {
    return onSurface ? (empty ?? null) : empty ? <Panel>{empty}</Panel> : null;
  }
  return (
    <InfiniteTable
      caption={caption}
      count={items.length}
      rowKey={(i) => rowKey(items[i])}
      groupOf={groupOf && ((i) => groupOf(items[i]))}
      renderRow={(i, place) => row(items[i], place)}
      hasMore={list.hasNextPage}
      loadingMore={list.isFetchingNextPage}
      onLoadMore={list.fetchNextPage}
      order={order}
      memoryKey={memoryKey}
      indexed={indexed}
      narrow={narrow}
      estimateRowHeight={estimateRowHeight}
      maxRows={maxRows}
      newEntriesLabel={(held) => labels.newEntries(entries(items.slice(0, held)))}
      footerLabel={(shown, more) => labels.footer(entries(items.slice(items.length - shown)), more)}
      loadingLabel={labels.loadingMore}
      retryLabel={labels.retry}
    >
      {table}
    </InfiniteTable>
  );
}
