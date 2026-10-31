import type { CSSProperties } from "react";
import "./Swatch.css";

/**
 * How a colour token is drawn: `fill` paints the swatch, `ink` sets "Aa" in
 * it on `ground`, `line` frames a box in it, `edge` draws the selection edge,
 * `status` sets a state word in the tone's ink on the tone's ground.
 */
export type Paint = "fill" | "ink" | "line" | "edge" | "status";

/** One token drawn twice, light on the left and dark on the right, each in its own theme. */
export function Swatch({
  token,
  paint = "fill",
  ground = "--di-bg-surface",
  word,
}: {
  token: string;
  paint?: Paint;
  ground?: string;
  word?: string;
}) {
  const style = {
    "--di-swatch": `var(${token})`,
    "--di-swatch-ground": `var(${ground})`,
    "--di-swatch-ink": `var(${token.replace(/-bg$/, "-fg")})`,
    "--di-swatch-dot": `var(${token.replace(/-bg$/, "-dot")})`,
  } as CSSProperties;
  const half = (theme: "light" | "dark") => (
    <span data-theme={theme} className={`di-swatch-half is-${paint}`} style={style}>
      {paint === "ink" ? "Aa" : null}
      {paint === "line" || paint === "edge" ? <i /> : null}
      {paint === "status" ? (
        <b>
          <i />
          {word}
        </b>
      ) : null}
    </span>
  );
  return (
    <span className="di-swatch" aria-hidden>
      {half("light")}
      {half("dark")}
    </span>
  );
}
