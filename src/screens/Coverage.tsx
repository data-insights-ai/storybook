import { useState } from "react";
import {
  Bug,
  Download,
  Globe,
  MessageSquare,
  Radar,
  RefreshCw,
  Rss,
  SlidersHorizontal,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../components/actions/Button";
import { Grid } from "../components/layout/arrangement/Grid";
import { Stack } from "../components/layout/arrangement/Stack";
import { Toolbar, ToolbarEnd } from "../components/layout/arrangement/Toolbar";
import { Card } from "../components/data/records/Card";
import { Chip } from "../components/data/marks/Chip";
import { Console } from "../components/layout/shell/AppShell";
import { sampleChrome } from "../components/layout/shell/chrome.sample";
import {
  CellIcon,
  CellLead,
  CellStack,
  DataTable,
  TableBody,
  TableCell,
  TableFooter,
  TableColumn,
  TableHead,
  TableRow,
} from "../components/data/table/DataTable";
import { Notice, NoticeAction, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "../components/feedback/Notice";
import { Pagination } from "../components/navigation/Pagination";
import { SearchField } from "../components/forms/text/SearchField";
import { StatusPill, type StatusTone } from "../components/data/marks/StatusPill";
import { SectionTitle, SectionTitleHeading } from "../components/layout/page/SectionTitle";

type Source = {
  id: string;
  name: string;
  detail: string;
  icon: ReactNode;
  type: string;
  method: string;
  status: string;
  tone: StatusTone;
  checked: string;
  checkedDetail: string;
  hits: string;
};

const sources: Source[] = [
  {
    id: "register",
    icon: <Radar aria-hidden />,
    name: "Company register",
    detail: "Register API",
    type: "Register",
    method: "Scheduled fetch",
    status: "Active",
    tone: "ok",
    checked: "6 min ago",
    checkedDetail: "Synced",
    hits: "12 hits",
  },
  {
    id: "archive",
    icon: <Bug aria-hidden />,
    name: "Gazette archive",
    detail: "Document index",
    type: "Archive",
    method: "Automatic sync",
    status: "Active",
    tone: "ok",
    checked: "12 min ago",
    checkedDetail: "Synced",
    hits: "84 hits",
  },
  {
    id: "partner",
    icon: <Rss aria-hidden />,
    name: "Partner feed",
    detail: "File import",
    type: "Import",
    method: "Daily batch",
    status: "Paused",
    tone: "warn",
    checked: "3 hours ago",
    checkedDetail: "Scheduled maintenance",
    hits: "3 hits",
  },
  {
    id: "press",
    icon: <Globe aria-hidden />,
    name: "Press index",
    detail: "Public sources",
    type: "Index",
    method: "Scheduled run",
    status: "Paused",
    tone: "warn",
    checked: "5 hours ago",
    checkedDetail: "Next run at 18:00",
    hits: "0 hits",
  },
  {
    id: "contracts",
    icon: <Radar aria-hidden />,
    name: "Contract archive",
    detail: "Internal holdings",
    type: "Archive",
    method: "Fetched on request",
    status: "On request",
    tone: "warn",
    checked: "Yesterday",
    checkedDetail: "Manual check",
    hits: "5 hits",
  },
  {
    id: "messages",
    icon: <MessageSquare aria-hidden />,
    name: "Message channel",
    detail: "Webhook intake",
    type: "Channel",
    method: "Incoming events",
    status: "Active",
    tone: "ok",
    checked: "2 min ago",
    checkedDetail: "Continuous stream",
    hits: "19 hits",
  },
];

const pageSize = 3;

export function CoverageScreen() {
  const [showAll, setShowAll] = useState(true);
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(sources.length / pageSize));
  const start = (page - 1) * pageSize;
  const visible = sources.slice(start, start + pageSize);

  return (
    <Console title="Coverage" crumb={["Monitor", "Coverage"]} active="coverage" chrome={sampleChrome}>
      <h1 className="di-sr">Coverage</h1>
      <Stack>
        <Notice tone="ok">
          <NoticeIcon>
            <RefreshCw aria-hidden />
          </NoticeIcon>
          <NoticeText>
            <NoticeTitle>
              Live monitoring is running <StatusPill tone="ok">Online</StatusPill>
            </NoticeTitle>
            <NoticeBody>Configured sources sync in the background. Hits are checked as they arrive.</NoticeBody>
          </NoticeText>
          <NoticeAction>
            <span className="di-quiet">Interval: 15 min</span>
          </NoticeAction>
        </Notice>

        <Toolbar>
          <SearchField label="Search sources" placeholder="Search sources, platforms, or types…" />
          {showAll ? (
            <Chip onRemove={() => setShowAll(false)} removeLabel="Remove status filter">
              Status: All (6)
            </Chip>
          ) : null}
          <ToolbarEnd>
            <Button variant="secondary" size="dense">
              <SlidersHorizontal aria-hidden />
              Filter
            </Button>
            <Button variant="secondary" size="dense">
              <Download aria-hidden />
              Export
            </Button>
          </ToolbarEnd>
        </Toolbar>

        <DataTable caption="Connected sources">
          <TableFooter>
            <span>
              {start + 1}–{start + visible.length} of {sources.length} sources
            </span>
            <Pagination
              page={page}
              pages={pages}
              onPageChange={setPage}
              label="Source list pages"
              previousLabel="Previous page"
              nextLabel="Next page"
              pageLabel="Page"
            />
          </TableFooter>
          <TableHead>
            <TableColumn>Source / platform</TableColumn>
            <TableColumn>Type / method</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Last check</TableColumn>
            <TableColumn align="end">Hits found</TableColumn>
          </TableHead>
          <TableBody>
            {visible.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <CellLead>
                    <CellIcon>{row.icon}</CellIcon>
                    <CellStack primary={row.name} secondary={row.detail} />
                  </CellLead>
                </TableCell>
                <TableCell>
                  <CellStack primary={row.type} secondary={row.method} />
                </TableCell>
                <TableCell>
                  <StatusPill tone={row.tone}>{row.status}</StatusPill>
                </TableCell>
                <TableCell>
                  <CellStack primary={row.checked} secondary={row.checkedDetail} />
                </TableCell>
                <TableCell align="end">{row.hits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>

        <section>
          <SectionTitle lede="How sources are handled">
            <SectionTitleHeading>Method and collection</SectionTitleHeading>
          </SectionTitle>
          <Grid min="220px">
            <Card>
              <SectionTitle>
                <SectionTitleHeading>Full history</SectionTitleHeading>
              </SectionTitle>
              <p>Archive data is kept in full, so older entries stay traceable.</p>
            </Card>
            <Card>
              <SectionTitle>
                <SectionTitleHeading>Automatic matching</SectionTitleHeading>
              </SectionTitle>
              <p>New finds are matched against the watchlist — terms, domains, and identities — and reported.</p>
            </Card>
            <Card>
              <SectionTitle>
                <SectionTitleHeading>Privacy</SectionTitleHeading>
              </SectionTitle>
              <p>Records are held under the applicable privacy rules. Review uses encrypted logs.</p>
            </Card>
          </Grid>
        </section>
      </Stack>
    </Console>
  );
}

