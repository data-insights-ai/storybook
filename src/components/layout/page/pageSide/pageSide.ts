import { createContext } from "react";

/**
 * The side column of the page a component sits in, while the page is wide
 * enough to show it; `null` on a narrower page or outside a `Page`. A
 * `Sheet` docks there instead of covering the page.
 */
export const PageSide = createContext<HTMLElement | null>(null);
