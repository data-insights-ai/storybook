import { useState } from "react";
import { Globe, Server } from "lucide-react";
import { CellIcon, CellLead, CellStack, DataTable, TableBody, TableCell, TableColumn, TableHead, TableIndex, TableRow } from "./DataTable";
import { SealValue } from "../../../marks/status/SealValue";
import { StatusPill } from "../../../marks/status/StatusPill";
import { TextLink } from "../../../navigation/TextLink";

export type Source = {
  ordinal: string;
  host: string;
  kind: string;
  hash: string;
  seen: string;
  state: "ok" | "warn" | "danger";
  stateLabel: string;
};

export const sources: Source[] = [
  { ordinal: "01", host: "registry.example.org", kind: "Registry", hash: "a4f9c21e", seen: "09:12:04Z", state: "ok", stateLabel: "running" },
  { ordinal: "02", host: "mirror.example.net", kind: "Mirror", hash: "7f3a99e0", seen: "09:11:52Z", state: "ok", stateLabel: "running" },
  { ordinal: "03", host: "feed.example.io", kind: "Feed", hash: "c18b70d4", seen: "08:47:11Z", state: "warn", stateLabel: "paused" },
  { ordinal: "04", host: "archive.example.com", kind: "Archive", hash: "5e0d3a91", seen: "08:44:03Z", state: "danger", stateLabel: "failed" },
  { ordinal: "05", host: "index.example.dev", kind: "Index", hash: "b207ff6c", seen: "09:09:38Z", state: "ok", stateLabel: "running" },
];

/*
 * The rows, abbreviated to one tag for the variants below, whose subject is
 * the toolbar, the footer or the active state rather than the composition.
 * `Default` writes the same tree out in full, because Show code prints a
 * helper as `<SourceRows />` and that is the one snippet which has to teach
 * this table's only API rule: the caller maps its own data into the frame.
 */
export function SourceRows({ rows = sources, active = "" }: { rows?: Source[]; active?: string }) {
  return (
    <>
      <TableHead>
        <TableColumn index={true}>Ordinal</TableColumn>
        <TableColumn sort="ascending">Host</TableColumn>
        <TableColumn>Kind</TableColumn>
        <TableColumn>Manifest</TableColumn>
        <TableColumn align="end">Last seen</TableColumn>
        <TableColumn align="end">State</TableColumn>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.ordinal}
            active={row.ordinal === active}
            tone={row.state === "danger" ? "danger" : "neutral"}
          >
            <TableIndex>{row.ordinal}</TableIndex>
            <TableCell>
              <CellLead>
                <CellIcon>{row.kind === "Registry" ? <Server aria-hidden /> : <Globe aria-hidden />}</CellIcon>
                <CellStack primary={row.host} secondary={`WS-01 · ${row.kind.toLowerCase()}`} />
              </CellLead>
            </TableCell>
            <TableCell>{row.kind}</TableCell>
            <TableCell>
              <SealValue state={row.state === "danger" ? "absent" : "sealed"} stateLabel={row.state === "danger" ? "Not recorded" : "Sealed"}>
                {row.hash}
              </SealValue>
            </TableCell>
            <TableCell align="end" mono={true}>
              {row.seen}
            </TableCell>
            <TableCell align="end">
              <StatusPill tone={row.state}>{row.stateLabel}</StatusPill>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

type SortKey = "host" | "seen";

type SortOrder = "ascending" | "descending";

/*
 * The caller owns the order. In a product it is part of the query that
 * fetches the page, so the server sorts every row rather than the slice
 * in hand; here the five sample rows stand in for that query.
 */
export function SortableSources({ caption, indexed }: { caption: string; indexed: boolean }) {
  const [by, setBy] = useState<SortKey>("seen");
  const [order, setOrder] = useState<SortOrder>("descending");
  const sortOn = (key: SortKey) => () => {
    setOrder(key === by && order === "descending" ? "ascending" : "descending");
    setBy(key);
  };
  const rows = [...sources].sort((a, b) => a[by].localeCompare(b[by]) * (order === "ascending" ? 1 : -1));
  const state = (key: SortKey) => (key === by ? order : "none");

  return (
    <DataTable caption={caption} indexed={indexed}>
      <TableHead>
        <TableColumn index={true}>Ordinal</TableColumn>
        <TableColumn sort={state("host")} onSort={sortOn("host")}>
          Host
        </TableColumn>
        <TableColumn>Kind</TableColumn>
        <TableColumn align="end" sort={state("seen")} onSort={sortOn("seen")}>
          Last seen
        </TableColumn>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.ordinal}>
            <TableIndex>{row.ordinal}</TableIndex>
            <TableCell>{row.host}</TableCell>
            <TableCell>{row.kind}</TableCell>
            <TableCell align="end" mono={true}>
              {row.seen}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
}

export function SelectableSources() {
  const rows = ["registry.example.org", "feed.example.io", "archive.example.com"];
  const [active, setActive] = useState(rows[0]);
  return (
    <DataTable caption="Sources on record">
      <TableHead>
        <TableColumn index>No.</TableColumn>
        <TableColumn>Host</TableColumn>
        <TableColumn>Kind</TableColumn>
      </TableHead>
      <TableBody>
        {rows.map((host, i) => (
          <TableRow key={host} active={host === active} onSelect={() => setActive(host)}>
            <TableIndex>{String(i + 1).padStart(2, "0")}</TableIndex>
            <TableCell mono>
              <TextLink quiet aria-pressed={host === active} onClick={() => setActive(host)}>
                {host}
              </TextLink>
            </TableCell>
            <TableCell>Registry</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
}

export const people = [
  { id: "nora", name: "Nora Feld", email: "nora.feld@data-insights.ai", role: "operator" },
  { id: "jon", name: "Jon Arlt", email: "jon.arlt@data-insights.ai", role: "auditor" },
];

export const events = [
  { ordinal: "03", at: "2026-10-19 09:12:04", state: "danger", stateLabel: "failed", text: "archive.example.com stopped answering; the last manifest on record is a4f9c21e." },
  { ordinal: "02", at: "2026-10-19 08:47:11", state: "warn", stateLabel: "paused", text: "Nora Feld paused feed.example.io while its signing key is rotated." },
  { ordinal: "01", at: "2026-10-19 08:44:03", state: "ok", stateLabel: "running", text: "registry.example.org sealed manifest 7f3a99e0." },
] as const;

export const devices = [
  { name: "srv-vie-212.example.com", criticality: "High", owner: "Nora Feld", unit: "Finance", seen: "4 min ago", source: "Endpoint agent" },
  { name: "ws-hr-007.example.com", criticality: "Low", owner: "Jonas Wirt", unit: "People", seen: "2 h ago", source: "Directory" },
] as const;

/*
 * A register too long to render: the product's virtualizer decides which
 * rows are on screen, the spacers stand in for the rest, and `rowCount`
 * with each row's `rowIndex` tells a screen reader where it is.
 */
export const windowed = Array.from({ length: 20 }, (_, i) => 40 + i);
