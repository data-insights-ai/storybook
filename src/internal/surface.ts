import { cx } from "./cx";

/** `sheet` lifts a step from the ground, `inset` sinks a step inside a surface, `hero` is the navy zone. */
export type SurfacePlane = "sheet" | "inset" | "hero";
/** A named meaning on the edge, never a drawn border: `danger` for destructive actions, `one` for the one thing in the view. */
export type SurfaceEdge = "none" | "danger" | "one";

/**
 * The classes of the one surface (`styles/primitives.css`). Every
 * component that draws a plane takes them, so `--di-panel-*` reaches all
 * of them and a surface inside a surface sinks to the inset tone.
 */
export function surfaceClass({
  plane = "sheet",
  edge = "none",
  padded = true,
}: { plane?: SurfacePlane; edge?: SurfaceEdge; padded?: boolean } = {}): string {
  return cx(
    "di-surface",
    plane !== "sheet" && `di-surface-${plane}`,
    edge !== "none" && `di-surface-edge-${edge}`,
    padded && "di-surface-padded",
  );
}
