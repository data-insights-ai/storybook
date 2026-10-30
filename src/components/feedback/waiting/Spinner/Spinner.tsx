import { Loading } from "../Loading";

/**
 * A wait too short to count, with its word.
 *
 * @deprecated Removed in 0.12: use `Loading` (its default `shape="inline"`),
 * which also holds the ring back for the first 150 ms.
 */
export function Spinner({ label, className }: { label: string; className?: string }) {
  return <Loading label={label} className={className} delay={0} />;
}
