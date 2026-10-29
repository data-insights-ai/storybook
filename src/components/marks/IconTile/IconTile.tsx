import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import "./IconTile.css";

/**
 * One icon on a small square tile, the lead of a row or a card. `variant` is
 * the tile's look: `neutral` on the surface, `inverse` on navy, `ok` for
 * something healthy. The icon inside is decorative; the text beside the tile
 * carries the meaning.
 */
export function IconTile({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  /** Which of the three tile looks. */
  variant?: "neutral" | "inverse" | "ok";
}) {
  return <span className={cx("di-tile", `di-tile-${variant}`)}>{children}</span>;
}
