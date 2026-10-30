import { useState } from "react";
import { AlertTriangle, Globe, MoreVertical, Plus, RotateCw, Server, Stamp } from "lucide-react";
import {
  Button,
  CellIcon,
  CellLead,
  CellStack,
  DataTable,
  Dialog,
  DialogFooter,
  Fact,
  FactList,
  Figure,
  FigureNote,
  FigureRow,
  Loading,
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
  Pagination,
  Panel,
  SealValue,
  SearchField,
  StatusPill,
  TableBody,
  TableCell,
  TableColumn,
  TableFooter,
  TableHead,
  TableIndex,
  TableRow,
  Tag,
  Toolbar,
  ToolbarEnd,
} from "../..";
import { ProductShell } from "../shell/ProductShell";
import type { Lang } from "../shell/shell.sample";
import { registerWords, sources, type Source } from "./register.sample";

type Words = (typeof registerWords)["en"];
export type RegisterState = "ready" | "empty" | "loading" | "error";

/**
 * The source register: every host the workspace reads from, one row each,
 * with the manifest that vouches for what it sent. The header orients, the
 * expiring key is the one thing that needs the reader, the figures sit on a
 * strip, and the register itself is the page. A row opens its detail in a
 * side dialog that names the source.
 */
export function RegisterScreen({ state = "ready", lang = "en" }: { state?: RegisterState; lang?: Lang }) {
  const words = registerWords[lang];
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const selected = sources.find((source) => source.ordinal === open) ?? null;

  return (
    <ProductShell area="workspace" active="sources" crumbs={words.crumbs} lang={lang}>
      <Page width="list">
        <PageHeader>
          <PageHeaderTitle>{words.title}</PageHeaderTitle>
          {state === "ready" ? (
            <PageHeaderStatus>
              <StatusPill tone="danger">{words.status}</StatusPill>
            </PageHeaderStatus>
          ) : null}
          {state === "ready" ? <PageHeaderMeta>{words.meta}</PageHeaderMeta> : null}
          <PageHeaderAside>
            <Button variant="primary" shortcut="n">
              <Plus aria-hidden />
              {words.connect}
            </Button>
          </PageHeaderAside>
        </PageHeader>

        {state === "ready" ? (
          <Ready
            words={words}
            page={page}
            setPage={setPage}
            open={open}
            setOpen={setOpen}
            menu={menu}
            setMenu={setMenu}
          />
        ) : null}

        {state === "empty" ? (
          <Notice variant="empty">
            <NoticeTitle>{words.emptyTitle}</NoticeTitle>
            <NoticeBody>{words.emptyBody}</NoticeBody>
            <NoticeAction>
              <Button variant="secondary">
                <Plus aria-hidden />
                {words.connect}
              </Button>
            </NoticeAction>
          </Notice>
        ) : null}

        {state === "loading" ? (
          <Loading shape="table" label={words.loading} rows={6} index>
            {registerToolbar(words, menu, setMenu)}
          </Loading>
        ) : null}

        {state === "error" ? (
          <Notice variant="empty" tone="danger">
            <NoticeTitle>{words.errorTitle}</NoticeTitle>
            <NoticeBody>{words.errorBody}</NoticeBody>
            <NoticeAction>
              <Button variant="secondary">
                <RotateCw aria-hidden />
                {words.retry}
              </Button>
            </NoticeAction>
          </Notice>
        ) : null}
      </Page>

      <Dialog
        open={selected !== null}
        onClose={() => setOpen(null)}
        eyebrow={words.detailEyebrow}
        title={selected?.host ?? ""}
        closeLabel={words.close(selected?.host ?? "")}
      >
        {selected ? <SourceFacts source={selected} words={words} /> : null}
        <DialogFooter>
          <Button variant="secondary">{words.openLog}</Button>
          <Button variant="primary">{selected?.state === "ok" ? words.sealSource : words.resume}</Button>
        </DialogFooter>
      </Dialog>
    </ProductShell>
  );
}

function Ready({
  words,
  page,
  setPage,
  open,
  setOpen,
  menu,
  setMenu,
}: {
  words: Words;
  page: number;
  setPage: (page: number) => void;
  open: string | null;
  setOpen: (ordinal: string) => void;
  menu: boolean;
  setMenu: (open: boolean) => void;
}) {
  const { sealed, coverage, unsealed, sources: count } = words.figures;
  return (
    <>
      <Notice tone="warn">
        <NoticeIcon>
          <AlertTriangle aria-hidden />
        </NoticeIcon>
        <NoticeText>
          <NoticeTitle>{words.keyTitle}</NoticeTitle>
          <NoticeBody>{words.keyBody}</NoticeBody>
        </NoticeText>
        <NoticeAction>
          <Button variant="secondary" size="sm">
            <Stamp aria-hidden />
            {words.rotate}
          </Button>
        </NoticeAction>
      </Notice>

      <FigureRow label={words.figuresLabel} variant="strip">
        <Figure label={sealed[0]} value={sealed[1]}>
          <FigureNote>{sealed[2]}</FigureNote>
        </Figure>
        <Figure label={coverage[0]} value={coverage[1]}>
          <FigureNote tone="warn">{coverage[2]}</FigureNote>
        </Figure>
        <Figure label={unsealed[0]} value={unsealed[1]} tone="danger">
          <FigureNote tone="danger">{unsealed[2]}</FigureNote>
        </Figure>
        <Figure label={count[0]} value={count[1]}>
          <FigureNote tone="warn">{count[2]}</FigureNote>
        </Figure>
      </FigureRow>

      <Panel padded={false}>
        <DataTable caption={words.caption}>
          {registerToolbar(words, menu, setMenu)}
          <TableFooter>
            <span>{words.range}</span>
            <Pagination
              page={page}
              pages={4}
              onPageChange={setPage}
              label={words.pages}
              previousLabel={words.previous}
              nextLabel={words.next}
              pageLabel={words.page}
            />
          </TableFooter>
          <TableHead>
            <TableColumn index={true}>{words.columns.ordinal}</TableColumn>
            <TableColumn sort="ascending">{words.columns.host}</TableColumn>
            <TableColumn>{words.columns.manifest}</TableColumn>
            <TableColumn align="end">{words.columns.entries}</TableColumn>
            <TableColumn align="end">{words.columns.seen}</TableColumn>
            <TableColumn align="end">{words.columns.state}</TableColumn>
          </TableHead>
          <TableBody>
            {sources.map((source) => (
              <TableRow key={source.ordinal} onSelect={() => setOpen(source.ordinal)} active={source.ordinal === open}>
                <TableIndex>{source.ordinal}</TableIndex>
                <TableCell>
                  <CellLead>
                    <CellIcon>{source.kind === "registry" ? <Server aria-hidden /> : <Globe aria-hidden />}</CellIcon>
                    <CellStack primary={source.host} secondary={words.kinds[source.kind]} />
                  </CellLead>
                </TableCell>
                <TableCell>
                  <Manifest source={source} words={words} />
                </TableCell>
                <TableCell align="end" mono={true}>
                  {source.entries}
                </TableCell>
                <TableCell align="end" mono={true}>
                  {source.seen}
                </TableCell>
                <TableCell align="end">
                  <StatusPill tone={source.state}>{words.states[source.state]}</StatusPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </Panel>
    </>
  );
}

function Manifest({ source, words }: { source: Source; words: Words }) {
  return (
    <SealValue
      state={source.hash === "" ? "absent" : "sealed"}
      stateLabel={source.hash === "" ? words.notRecorded : words.sealed}
    >
      {source.hash === "" ? words.none : source.hash}
    </SealValue>
  );
}

function SourceFacts({ source, words }: { source: Source; words: Words }) {
  return (
    <FactList>
      <Fact label={words.facts.kind}>{words.kinds[source.kind]}</Fact>
      <Fact label={words.facts.manifest}>
        <Manifest source={source} words={words} />
      </Fact>
      <Fact label={words.facts.entries}>{source.entries}</Fact>
      <Fact label={words.facts.seen}>{source.seen}</Fact>
      <Fact label={words.facts.state}>
        <StatusPill tone={source.state}>{words.states[source.state]}</StatusPill>
      </Fact>
      <Fact label={words.facts.reason}>{words.reasons[source.state]}</Fact>
    </FactList>
  );
}

/** The list toolbar, the same while the register loads as when it holds rows: a `Toolbar` element, so the table takes it into its head. */
function registerToolbar(words: Words, menu: boolean, setMenu: (open: boolean) => void) {
  return (
    <Toolbar label={words.filterLabel} role="search">
      <SearchField id="register-search" label={words.search} placeholder={words.placeholder} size="sm" />
      <Tag mono pressed onRemove={() => undefined} removeLabel={words.removeFilter}>
        {words.workspaceFilter}
      </Tag>
      <Tag mono onClick={() => undefined}>
        <Plus aria-hidden />
        {words.addState}
      </Tag>
      <ToolbarEnd>
        <Menu
          open={menu}
          onOpenChange={setMenu}
          label={words.actions}
          trigger={(props) => (
            <Button {...props} variant="secondary" size="sm" iconOnly={true} aria-label={words.actions}>
              <MoreVertical aria-hidden />
            </Button>
          )}
        >
          <MenuItem onSelect={() => setMenu(false)}>{words.export}</MenuItem>
          <MenuItem onSelect={() => setMenu(false)}>{words.sealNow}</MenuItem>
          <MenuItem onSelect={() => setMenu(false)}>{words.verify}</MenuItem>
          <MenuDivider />
          <MenuItem onSelect={() => setMenu(false)} tone="danger">
            {words.revoke}
          </MenuItem>
        </Menu>
      </ToolbarEnd>
    </Toolbar>
  );
}
