import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { DataTable, Panel, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../index";
import "./Tokens.css";

export type TokenRow = { token: string; use: string; sample?: ReactNode };

/** The value a token resolves to where the table is painted, so the dark theme shows its own. */
function useResolved(tokens: string[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const key = tokens.join(" ");
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const read = () => {
      const style = getComputedStyle(node);
      setValues(Object.fromEntries(key.split(" ").map((t) => [t, style.getPropertyValue(t).trim()])));
    };
    read();
    // The theme and the density are set on the root by a decorator, after this table has rendered.
    const watch = new MutationObserver(read);
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-density"] });
    return () => watch.disconnect();
  }, [key]);
  return { ref, values };
}

/** A panel of tokens: the swatch painted from the token, its name, what it resolves to here, and its job. */
export function TokenTable({
  title,
  caption,
  rows,
  draw,
}: {
  title: string;
  caption: string;
  rows: TokenRow[];
  draw?: (token: string) => ReactNode;
}) {
  const { ref, values } = useResolved(rows.map((r) => r.token));
  return (
    <div ref={ref} className="di-tokens">
      <Panel title={title} heading={3} padded={false}>
        <DataTable caption={caption} indexed={false} narrow="stack">
          <TableHead>
            <TableColumn>Sample</TableColumn>
            <TableColumn>Token</TableColumn>
            <TableColumn>Value</TableColumn>
            <TableColumn width="fill">Use</TableColumn>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.token}>
                <TableCell label="Sample">
                  <span className="di-tokens-sample">{row.sample ?? draw?.(row.token)}</span>
                </TableCell>
                <TableCell label="Token" mono>
                  {row.token}
                </TableCell>
                <TableCell label="Value" mono>
                  {values[row.token] || "—"}
                </TableCell>
                <TableCell label="Use">{row.use}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </Panel>
    </div>
  );
}

export const fill = (token: string) => (
  <i className="di-tokens-chip" style={{ background: `var(${token})` }} aria-hidden />
);

export const ink = (token: string) => (
  <i className="di-tokens-chip is-ink" style={{ color: `var(${token})` }} aria-hidden>
    Aa
  </i>
);

export const length = (token: string) => (
  <i className="di-tokens-bar" style={{ inlineSize: `var(${token})` }} aria-hidden />
);

export const corner = (token: string) => (
  <i className="di-tokens-corner" style={{ borderStartStartRadius: `var(${token})` }} aria-hidden />
);

/**
 * The token and value cells that run over more than one line. A name or a value is one token; on a phone, where
 * the rows stack, only a value may wrap, and only between its parts.
 */
export function brokenTokenCells(root: HTMLElement) {
  const stacked = window.innerWidth < 600;
  const cells = Array.from(root.querySelectorAll<HTMLElement>(".di-tokens td.di-mono"));
  return cells
    .filter((cell) => !stacked || cell.dataset.label === "Token")
    .filter((cell) => {
      const range = document.createRange();
      range.selectNodeContents(cell);
      return new Set(Array.from(range.getClientRects(), (line) => Math.round(line.top))).size > 1;
    })
    .map((cell) => cell.textContent);
}
