import { useState } from "react";
import { AlertTriangle, Download, Globe, MoreVertical, Plus, Server, Stamp } from "lucide-react";
import {
  Button,
  CellIcon,
  CellLead,
  CellStack,
  Chip,
  DataTable,
  Fact,
  FactList,
  Grid,
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
  PageHeaderTitle,
  Pagination,
  SealValue,
  SearchField,
  Sheet,
  SheetFooter,
  StatTile,
  StatTileDelta,
  StatusPill,
  TableBody,
  TableCell,
  TableColumn,
  TableFooter,
  TableHead,
  TableIndex,
  TableRow,
  TableToolbar,
} from "..";

type Source = {
  ordinal: string;
  host: string;
  kind: string;
  hash: string;
  seen: string;
  entries: string;
  state: "ok" | "warn" | "danger";
  stateLabel: string;
  reason: string;
};

const sources: Source[] = [
  {
    ordinal: "01",
    host: "registry.example.org",
    kind: "Registry",
    hash: "a4f9c21e",
    seen: "09:12:04Z",
    entries: "1,842",
    state: "ok",
    stateLabel: "running",
    reason: "Ingesting on schedule",
  },
  {
    ordinal: "02",
    host: "mirror.example.net",
    kind: "Mirror",
    hash: "7f3a99e0",
    seen: "09:11:52Z",
    entries: "1,109",
    state: "ok",
    stateLabel: "running",
    reason: "Ingesting on schedule",
  },
  {
    ordinal: "03",
    host: "feed.example.io",
    kind: "Feed",
    hash: "c18b70d4",
    seen: "08:47:11Z",
    entries: "744",
    state: "warn",
    stateLabel: "paused",
    reason: "Rate limit from the upstream host",
  },
  {
    ordinal: "04",
    host: "archive.example.com",
    kind: "Archive",
    hash: "",
    seen: "08:44:03Z",
    entries: "487",
    state: "danger",
    stateLabel: "failed",
    reason: "Connection reset after 2 of 14 batches",
  },
  {
    ordinal: "05",
    host: "index.example.dev",
    kind: "Index",
    hash: "b207ff6c",
    seen: "09:09:38Z",
    entries: "612",
    state: "ok",
    stateLabel: "running",
    reason: "Ingesting on schedule",
  },
  {
    ordinal: "06",
    host: "cache.example.co",
    kind: "Mirror",
    hash: "3d91a07b",
    seen: "09:10:20Z",
    entries: "388",
    state: "ok",
    stateLabel: "running",
    reason: "Ingesting on schedule",
  },
];

/**
 * The flagship view: a register extract with its ordinals, the tiles that
 * measure it, and the sheet that opens one row beside the list.
 */
export function RegisterScreen() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);

  const selected = sources.find((source) => source.ordinal === open) ?? null;

  return (
    <Page width="list">
      <PageHeader
        eyebrow="02 — Sources"
        lede="Every host the workspace reads from, with the manifest that vouches for what it sent."
      >
        <PageHeaderTitle>Source register</PageHeaderTitle>
        <PageHeaderAside>
          <Button variant="primary" size="dense">
            <Plus aria-hidden />
            Connect a source
          </Button>
        </PageHeaderAside>
      </PageHeader>

      <Notice tone="warn">
        <NoticeIcon>
          <AlertTriangle aria-hidden />
        </NoticeIcon>
        <NoticeText>
          <div>
            <NoticeTitle>The signing key expires in six days.</NoticeTitle>
            <NoticeBody>After 2026-09-29 no new entry can be sealed with it.</NoticeBody>
          </div>
          <NoticeAction>
            <Button variant="seal" size="dense">
              <Stamp aria-hidden />
              Rotate key
            </Button>
          </NoticeAction>
        </NoticeText>
      </Notice>

      <Grid>
        <StatTile index="01" label="Entries sealed" value="4,182" ruled={true}>
          <StatTileDelta>+112 since 09:00Z</StatTileDelta>
        </StatTile>
        <StatTile index="02" label="Coverage" value="86.4%" ruled={true}>
          <StatTileDelta tone="warn">down 2.1 points</StatTileDelta>
        </StatTile>
        <StatTile index="03" label="Unsealed" value="1,284" tone="danger" ruled={true}>
          <StatTileDelta tone="danger">up 940 since 08:00Z</StatTileDelta>
        </StatTile>
        <StatTile index="04" label="Sources" value="24" ruled={true}>
          <StatTileDelta tone="warn">4 paused, 1 failed</StatTileDelta>
        </StatTile>
      </Grid>

      <DataTable caption="Sources on record">
        <TableToolbar>
          <div style={{ width: 240 }}>
            <SearchField
              id="register-search"
              label="Search the register"
              placeholder="host, hash or operator"
              dense={true}
              shortcut="⌘K"
            />
          </div>
          <Chip active={true} removeLabel="Remove the workspace filter">
            workspace: WS-01
          </Chip>
          <Chip active={false} removeLabel="Add a state filter">
            <Plus aria-hidden />
            state
          </Chip>
          <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <Button variant="secondary" size="dense">
              <Download aria-hidden />
              Export
            </Button>
            <Menu
              open={menu}
              onOpenChange={setMenu}
              label="Register actions"
              trigger={(props) => (
                <Button {...props} variant="secondary" size="dense" iconOnly={true} aria-label="Register actions">
                  <MoreVertical aria-hidden />
                </Button>
              )}
            >
              <MenuItem onSelect={() => setMenu(false)}>Seal the register now</MenuItem>
              <MenuItem onSelect={() => setMenu(false)}>Verify every manifest</MenuItem>
              <MenuDivider />
              <MenuItem onSelect={() => setMenu(false)} tone="danger">
                Revoke stale sources
              </MenuItem>
            </Menu>
          </span>
        </TableToolbar>
        <TableFooter>
          <span>1–6 of 24 sources</span>
          <Pagination
            page={page}
            pages={4}
            onPageChange={setPage}
            label="Register pages"
            previousLabel="Previous page"
            nextLabel="Next page"
            pageLabel="Page"
          />
        </TableFooter>
        <TableHead>
          <TableColumn index={true}>Ordinal</TableColumn>
          <TableColumn sort="ascending">Host</TableColumn>
          <TableColumn>Manifest</TableColumn>
          <TableColumn align="end">Entries</TableColumn>
          <TableColumn align="end">Last seen</TableColumn>
          <TableColumn align="end">State</TableColumn>
        </TableHead>
        <TableBody>
          {sources.map((source) => (
            <TableRow
              key={source.ordinal}
              onSelect={() => setOpen(source.ordinal)}
              active={source.ordinal === open}
              tone={source.state === "danger" ? "danger" : "neutral"}
            >
              <TableIndex>{source.ordinal}</TableIndex>
              <TableCell>
                <CellLead>
                  <CellIcon>{source.kind === "Registry" ? <Server aria-hidden /> : <Globe aria-hidden />}</CellIcon>
                  <CellStack primary={source.host} secondary={source.kind.toLowerCase()} />
                </CellLead>
              </TableCell>
              <TableCell>
                <SealValue
                  state={source.hash === "" ? "absent" : "sealed"}
                  stateLabel={source.hash === "" ? "Not recorded" : "Sealed"}
                >
                  {source.hash === "" ? "none" : source.hash}
                </SealValue>
              </TableCell>
              <TableCell align="end" mono={true}>
                {source.entries}
              </TableCell>
              <TableCell align="end" mono={true}>
                {source.seen}
              </TableCell>
              <TableCell align="end">
                <StatusPill tone={source.state}>{source.stateLabel}</StatusPill>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
      <Sheet
        open={selected !== null}
        onClose={() => setOpen(null)}
        index={selected?.ordinal}
        eyebrow="Source · WS-01"
        title={selected?.host ?? ""}
        closeLabel={`Close the detail for ${selected?.host ?? "the source"}`}
      >
        {selected ? <SourceFacts source={selected} /> : null}
        <SheetFooter>
          <Button variant="secondary">Open log</Button>
          <Button variant="primary">{selected?.state === "ok" ? "Seal now" : "Resume"}</Button>
        </SheetFooter>
      </Sheet>
    </Page>
  );
}

function SourceFacts({ source }: { source: Source }) {
  return (
    <FactList>
      <Fact label="Kind">{source.kind}</Fact>
      <Fact label="Manifest">
        <SealValue
          state={source.hash === "" ? "absent" : "sealed"}
          stateLabel={source.hash === "" ? "Not recorded" : "Sealed"}
        >
          {source.hash === "" ? "none" : source.hash}
        </SealValue>
      </Fact>
      <Fact label="Entries">{source.entries}</Fact>
      <Fact label="Last seen">{source.seen}</Fact>
      <Fact label="State">
        <StatusPill tone={source.state}>{source.stateLabel}</StatusPill>
      </Fact>
      <Fact label="Reason">{source.reason}</Fact>
    </FactList>
  );
}
