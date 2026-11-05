import { createContext } from "react";

/**
 * The side column of the page a component sits in, while the page is wide
 * enough to show it; `null` on a narrower page or outside a `Page`. A
 * side `Dialog` docks there instead of covering the page.
 */
export const PageSide = createContext<HTMLElement | null>(null);

/** On the table a docked `Dialog` was opened from, while it is open: the side column stands level with it. */
export const SIDE_LIST = "data-page-side-list";
