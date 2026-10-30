import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { DataTable, Panel, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../index";
import "./Tokens.css";

export type TokenRow = { token: string; use: string; sample?: ReactNode };

/** The value a token resolves to where the table is painted, so the dark theme shows its own. */
function useResolved(tokens: string[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  // eslint-disable-next-line react-hooks/exhaustive-deps -- after every render: the theme or density may have changed on an ancestor
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const style = getComputedStyle(node);
    const next = Object.fromEntries(tokens.map((t) => [t, style.getPropertyValue(t).trim()]));
    if (tokens.some((t) => next[t] !== values[t])) setValues(next);
  });
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
                <TableCell label="Token">
                  <span className="di-tokens-mono">{row.token}</span>
                </TableCell>
                <TableCell label="Value">
                  <span className="di-tokens-mono">{values[row.token] || "—"}</span>
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
