import { useState } from "react";
import { Download, RotateCw } from "lucide-react";
import {
  Button,
  CellStack,
  DataTable,
  Figure,
  FigureNote,
  FigureRow,
  Loading,
  Notice,
  NoticeAction,
  NoticeBody,
  NoticeTitle,
  Page,
  PageHeader,
  PageHeaderMeta,
  PageHeaderStatus,
  PageHeaderTitle,
  Panel,
  SearchField,
  StatusPill,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
  Tag,
  Toolbar,
  ToolbarEnd,
} from "../..";
import { ProductShell } from "../shell/ProductShell";
import { tables, type Arrival } from "./coverage.sample";

const tone = { arriving: "ok", silent: "warn", missing: "danger" } as const;
export type CoverageState = "ready" | "loading";

/**
 * Coverage: which of the tables the detections read are arriving, and what
 * goes blind when one is not. The header orients, the tables that stopped
 * are the first thing in the list, and the figures say what that costs.
 */
export function CoverageScreen({ state = "ready" }: { state?: CoverageState }) {
  const [query, setQuery] = useState("");
  const [onlyGaps, setOnlyGaps] = useState(true);
  const shown = tables.filter(
    (row) =>
      (!onlyGaps || row.arrival !== "arriving") &&
      `${row.table} ${row.source}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const toolbar = (
    <Toolbar label="Filter the tables" role="search">
      <SearchField
        id="coverage-search"
        label="Search tables"
        placeholder="Table or source"
        size="sm"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {onlyGaps ? (
        <Tag pressed onRemove={() => setOnlyGaps(false)} removeLabel="Show every table">
          Not arriving ({tables.filter((row) => row.arrival !== "arriving").length})
        </Tag>
      ) : (
        <Tag onClick={() => setOnlyGaps(true)}>Not arriving</Tag>
      )}
      <ToolbarEnd>
        <Button variant="secondary" size="sm">
          <Download aria-hidden />
          Export
        </Button>
      </ToolbarEnd>
    </Toolbar>
  );

  return (
    <ProductShell area="workspace" active="coverage" crumbs={["Example Security GmbH", "Production", "Coverage"]}>
      <Page width="list">
        <PageHeader>
          <PageHeaderTitle>Coverage</PageHeaderTitle>
          <PageHeaderStatus>
            <StatusPill tone="danger">3 tables not arriving</StatusPill>
          </PageHeaderStatus>
          <PageHeaderMeta>{["As of 12 Oct, 10:00", "12 tables", "updates live"]}</PageHeaderMeta>
        </PageHeader>

        <FigureRow label="What the detections can see" variant="strip">
          <Figure label="Tables arriving" value="9 of 12">
            <FigureNote tone="danger">2 never delivered</FigureNote>
          </Figure>
          <Figure label="Detection rules ready" value="214 of 260" tone="warn">
            <FigureNote tone="warn">46 wait for a missing table</FigureNote>
          </Figure>
          <Figure label="Events today" value="18.4 M">
            <FigureNote>within 4% of last week</FigureNote>
          </Figure>
        </FigureRow>

        {state === "loading" ? (
          <Loading shape="table" label="Loading the tables" rows={6}>
            {toolbar}
          </Loading>
        ) : (
          <Panel padded={false}>
            <DataTable caption="Tables the detections read" indexed={false}>
              {toolbar}
              <TableHead>
                <TableColumn width="fill">Table</TableColumn>
                <TableColumn>Arrival</TableColumn>
                <TableColumn align="end">Last event</TableColumn>
                <TableColumn align="end">Rules waiting</TableColumn>
              </TableHead>
              <TableBody>
                {shown.map((row) => (
                  <TableRow key={row.table}>
                    <TableCell>
                      <CellStack primary={row.table} secondary={row.source} />
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={tone[row.arrival]}>{arrivalWord(row.arrival)}</StatusPill>
                    </TableCell>
                    <TableCell align="end" mono>
                      {row.last}
                    </TableCell>
                    <TableCell align="end" mono>
                      {row.rules}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
            {shown.length === 0 ? (
              <Notice variant="empty">
                <NoticeTitle>No table matches “{query}”.</NoticeTitle>
                <NoticeBody>Search by the table’s name or by the source that sends it.</NoticeBody>
                <NoticeAction>
                  <Button variant="secondary" onClick={() => (setQuery(""), setOnlyGaps(false))}>
                    <RotateCw aria-hidden />
                    Show every table
                  </Button>
                </NoticeAction>
              </Notice>
            ) : null}
          </Panel>
        )}
      </Page>
    </ProductShell>
  );
}

function arrivalWord(arrival: Arrival) {
  return { arriving: "arriving", silent: "silent", missing: "never delivered" }[arrival];
}
