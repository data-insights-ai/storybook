import { Loading } from "../Loading";

/**
 * The application starting: the mark with its dots breathing.
 *
 * @deprecated Removed in 0.12: use `Loading shape="app"`; the props are the same.
 */
export function AppLoader({ label, delay, className }: { label: string; delay?: number; className?: string }) {
  return <Loading shape="app" label={label} delay={delay} className={className} />;
}
