import { Loading } from "../Loading";

/** @deprecated Removed in 0.12: the `shape` of `Loading`. */
export type SkeletonPageVariant = "list" | "detail" | "form";

/**
 * A page that is still loading, in the shape it will have.
 *
 * @deprecated Removed in 0.12: use `Loading shape="list" | "detail" | "form"`;
 * `variant` becomes `shape`, the other props are the same.
 */
export function SkeletonPage({
  variant,
  ...props
}: {
  variant: SkeletonPageVariant;
  label: string;
  heading?: boolean;
  rows?: number;
  delay?: number;
  className?: string;
}) {
  return <Loading shape={variant} index {...props} />;
}
