import { useState } from "react";
import { MoreVertical, Plus, Search } from "lucide-react";
import {
  Button,
  CellStack,
  DataTable,
  Menu,
  MenuDivider,
  MenuItem,
  Notice,
  NoticeAction,
  NoticeBody,
  NoticeIcon,
  NoticeText,
  NoticeTitle,
  Page,
  PageHeader,
  PageHeaderAside,
  PageHeaderMeta,
  PageHeaderStatus,
  PageHeaderTitle,
  Panel,
  SearchField,
  StatusPill,
  TableBody,
  TableCell,
  TableColumn,
  TableFooter,
  TableHead,
  TableRow,
  Tag,
  Toolbar,
} from "../..";
import { ProductShell } from "../shell/ProductShell";
import { identities, type Identity } from "./watchlist.sample";

export type WatchlistState = "ready" | "empty";

/**
 * The watchlist: the people, companies, domains and mailboxes the
 * workspace watches for in leaked and public sources. The new matches are
 * the one thing that needs the reader; the list below is the record of
 * what is watched, each entry with its last match and its actions in one
 * menu (pausing and removing are audited and need an administrator).
 */
export function WatchlistScreen({ state = "ready" }: { state?: WatchlistState }) {
  return (
    <ProductShell area="workspace" active="assets" crumbs={["Example Security GmbH", "Production", "Watchlist"]}>
      <Page width="list">
        <PageHeader>
          <PageHeaderTitle>Watchlist</PageHeaderTitle>
          <PageHeaderStatus>
            {state === "ready" ? (
              <StatusPill tone="warn">2 new matches</StatusPill>
            ) : (
              <StatusPill tone="neutral">Nothing watched</StatusPill>
            )}
          </PageHeaderStatus>
          {state === "ready" ? (
            <PageHeaderMeta>{["8 entries", "last check 5 min ago", "updates live"]}</PageHeaderMeta>
          ) : null}
          <PageHeaderAside>
            <Button variant="primary" shortcut="n">
              <Plus aria-hidden />
              Add entry
            </Button>
          </PageHeaderAside>
        </PageHeader>
        {state === "ready" ? (
          <Watched />
        ) : (
          <Notice variant="empty">
            <NoticeTitle>Nothing is watched yet</NoticeTitle>
            <NoticeBody>
              Add a name, a company, a domain or a mailbox. New mentions in the connected sources are matched as they
              arrive.
            </NoticeBody>
            <NoticeAction>
              <Button variant="secondary">
                <Plus aria-hidden />
                Add entry
              </Button>
            </NoticeAction>
          </Notice>
        )}
      </Page>
    </ProductShell>
  );
}

function Watched() {
  const [query, setQuery] = useState("");
  const shown = identities.filter((row) => row.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <>
      <Notice tone="warn">
        <NoticeIcon>
          <Search aria-hidden />
        </NoticeIcon>
        <NoticeText>
          <NoticeTitle>harthaus.example was named in two new paste dumps.</NoticeTitle>
          <NoticeBody>Both list addresses on the domain with passwords. Found at 09:41 and 09:52 today.</NoticeBody>
        </NoticeText>
        <NoticeAction>
          <Button variant="secondary" size="sm">
            Review the matches
          </Button>
        </NoticeAction>
      </Notice>

      <Panel padded={false}>
        <DataTable caption="Watched entries" indexed={false}>
          <Toolbar label="Filter the watchlist" role="search">
            <SearchField
              id="watchlist-search"
              label="Search the watchlist"
              placeholder="Name, domain or address"
              size="sm"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </Toolbar>
          <TableFooter>
            <span>
              {shown.length} of {identities.length} entries
            </span>
          </TableFooter>
          <TableHead>
            <TableColumn width="fill">Entry</TableColumn>
            <TableColumn>Kind</TableColumn>
            <TableColumn align="end">Last match</TableColumn>
            <TableColumn align="end">State</TableColumn>
            <TableColumn align="end">
              <span className="di-sr">Actions</span>
            </TableColumn>
          </TableHead>
          <TableBody>
            {shown.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <CellStack primary={row.name} secondary={row.detail} />
                </TableCell>
                <TableCell>
                  <Tag>{row.kind}</Tag>
                </TableCell>
                <TableCell align="end" mono>
                  {row.match}
                </TableCell>
                <TableCell align="end">
                  <StatusPill tone={row.paused ? "neutral" : "ok"}>{row.paused ? "paused" : "watching"}</StatusPill>
                </TableCell>
                <TableCell align="end">
                  <EntryMenu row={row} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
        {shown.length === 0 ? (
          <Notice variant="empty">
            <NoticeTitle>No entry matches “{query}”.</NoticeTitle>
            <NoticeBody>Search by the name, the domain or the address as it was added.</NoticeBody>
          </Notice>
        ) : null}
      </Panel>
    </>
  );
}

function EntryMenu({ row }: { row: Identity }) {
  const [open, setOpen] = useState(false);
  return (
    <Menu
      open={open}
      onOpenChange={setOpen}
      label={`Actions for ${row.name}`}
      align="end"
      trigger={(props) => (
        <Button {...props} variant="ghost" size="sm" iconOnly aria-label={`Actions for ${row.name}`}>
          <MoreVertical aria-hidden />
        </Button>
      )}
    >
      <MenuItem onSelect={() => setOpen(false)}>{row.paused ? "Resume watching" : "Pause watching"}</MenuItem>
      <MenuDivider />
      <MenuItem onSelect={() => setOpen(false)} tone="danger">
        Remove from the watchlist
      </MenuItem>
    </Menu>
  );
}
