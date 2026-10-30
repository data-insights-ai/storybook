import {
  CellStack,
  DataTable,
  ListToolbar,
  PageHeader,
  PageHeaderTitle,
  SearchField,
  StatusPill,
  TableBody,
  TableCell,
  TableColumn,
  TableFooter,
  TableHead,
  TableIndex,
  TableRow,
  TextLink,
} from "../../index";
import { ProductShell } from "./ProductShell";
import { cases } from "./soc.sample";

const tone = { critical: "danger", high: "danger", medium: "warn", low: "neutral", info: "neutral" } as const;

/** The SOC case list as the product composes it today: a framed table; each case opens its own page. */
export function SocCasesToday() {
  const open = cases.filter((c) => c.status !== "Resolved");
  return (
    <ProductShell product="soc" active="cases" crumbs={["Production", "Cases"]}>
      <PageHeader
        eyebrow="Production"
        lede="One row per case, filtered as you choose. The upper bar is the AI SOC's severity score now; the thin bar beneath is the score at the comparison point."
      >
        <PageHeaderTitle>Cases</PageHeaderTitle>
      </PageHeader>
      <ListToolbar label="Filter cases">
        <SearchField label="Search cases" />
      </ListToolbar>
      <DataTable caption="Cases">
        <TableHead>
          <TableColumn index>No.</TableColumn>
          <TableColumn width="fill">Case</TableColumn>
          <TableColumn>Severity</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Assignee</TableColumn>
          <TableColumn align="end">Score</TableColumn>
          <TableColumn align="end">Updated</TableColumn>
        </TableHead>
        <TableBody>
          {open.map((c, i) => (
            <TableRow key={c.n}>
              <TableIndex>{String(i + 1).padStart(2, "0")}</TableIndex>
              <TableCell>
                <CellStack secondary={`Case ${c.n}`}>
                  <TextLink href={`#case-${c.n}`}>{c.title}</TextLink>
                </CellStack>
              </TableCell>
              <TableCell label="Severity">
                <StatusPill tone={tone[c.severity]} dot>
                  {c.severity[0].toUpperCase() + c.severity.slice(1)}
                </StatusPill>
              </TableCell>
              <TableCell label="Status">{c.status}</TableCell>
              <TableCell label="Assignee">{c.assignee ?? "—"}</TableCell>
              <TableCell label="Score" align="end" mono>
                {String(c.score ?? "—")}
              </TableCell>
              <TableCell label="Updated" align="end" mono>
                {c.updated}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>{open.length} cases</TableFooter>
      </DataTable>
    </ProductShell>
  );
}
