import { Loading } from "../Loading";

/**
 * A table that is still loading: its frame, head and rules, bars for the values.
 *
 * @deprecated Removed in 0.12: use `Loading shape="table"`; add `index` when
 * the table has a `TableIndex` column.
 */
export function SkeletonTable(props: { rows?: number; label: string; delay?: number; className?: string }) {
  return <Loading shape="table" index {...props} />;
}
