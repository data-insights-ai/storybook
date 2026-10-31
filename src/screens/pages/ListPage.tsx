import { useRef, useState } from "react";
import { Download, UserPlus } from "lucide-react";
import {
  NoticeText,
  EmptyStateAction,
  EmptyState,
  Button,
  CellStack,
  ConfirmDialog,
  DataTable,
  DetailSection,
  DetailSectionForm,
  Dialog,
  DialogFooter,
  Fact,
  FactList,
  Loading,
  Notice,
  NoticeAction,
  NoticeBody,
  NoticeIcon,
  NoticeTitle,
  Page,
  PageHeader,
  PageHeaderAside,
  PageHeaderMeta,
  PageHeaderTitle,
  Pagination,
  Panel,
  SearchField,
  Select,
  StatusPill,
  TableBody,
  TableCell,
  TableColumn,
  TableFooter,
  TableHead,
  TableRow,
  Toolbar,
  ToolbarAction,
  ToolbarEnd,
  useShortcut,
} from "../..";
import { listWords, members, type Member, type Role } from "./members.sample";

const pageSize = 6;

/**
 * A list page: the header orients and holds the one primary action, the
 * search toolbar narrows the list, the table sits on a panel with its count
 * and pages under it, and a row opens its member beside the list. While the
 * list loads it keeps its shape; when it fails it says so in its place.
 */
export function ListPageScreen({
  lang = "en",
  state = "ready",
  query = "",
}: {
  lang?: "en" | "de";
  state?: "ready" | "loading" | "error";
  query?: string;
}) {
  const w = listWords[lang];
  const search = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState(query);
  const [role, setRole] = useState<Role | "">("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Member>();
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  useShortcut("/", () => search.current?.focus());

  const shown = members.filter(
    (m) =>
      (q === "" || `${m.name} ${m.email}`.toLowerCase().includes(q.toLowerCase())) && (role === "" || m.role === role),
  );
  const pages = Math.max(1, Math.ceil(shown.length / pageSize));
  const current = Math.min(page, pages);
  const rows = shown.slice((current - 1) * pageSize, current * pageSize);

  return (
    <>
      <Page width="list">
        <PageHeader lede={w.lede}>
          <PageHeaderTitle>{w.title}</PageHeaderTitle>
          {state === "ready" ? <PageHeaderMeta>{w.meta.join(" · ")}</PageHeaderMeta> : null}
          <PageHeaderAside>
            <Button shortcut="n">
              <UserPlus aria-hidden />
              {w.invite}
            </Button>
          </PageHeaderAside>
        </PageHeader>

        <Toolbar label={w.filter} role="search">
          <SearchField
            ref={search}
            id="screen-members-search"
            label={w.search}
            placeholder={w.searchHint}
            shortcut="/"
            value={q}
            onChange={(e) => (setQ(e.target.value), setPage(1))}
          />
          <Select
            id="screen-members-role"
            label={w.role}
            hideLabel
            mono={false}
            value={role}
            onChange={(e) => (setRole(e.target.value as Role | ""), setPage(1))}
          >
            <option value="">{w.allRoles}</option>
            <option value="owner">{w.roleFilter.owner}</option>
            <option value="admin">{w.roleFilter.admin}</option>
            <option value="member">{w.roleFilter.member}</option>
          </Select>
          <ToolbarEnd>
            <ToolbarAction icon={<Download aria-hidden />} label={w.export} />
          </ToolbarEnd>
        </Toolbar>

        {state === "loading" ? (
          <Loading label={w.loading} shape="table" rows={pageSize} delay={0} />
        ) : state === "error" ? (
          <Notice tone="danger">
            <NoticeIcon />
            <NoticeText>
              <NoticeTitle>{w.errorTitle}</NoticeTitle>
              <NoticeBody>{w.errorBody}</NoticeBody>
            </NoticeText>
            <NoticeAction>
              <Button variant="secondary">{w.retry}</Button>
            </NoticeAction>
          </Notice>
        ) : shown.length === 0 ? (
          <Panel>
            <EmptyState title={w.emptyTitle} body={w.emptyBody}>
              <EmptyStateAction>
                <Button variant="secondary" onClick={() => (setQ(""), setRole(""))}>
                  {w.clear}
                </Button>
              </EmptyStateAction>
            </EmptyState>
          </Panel>
        ) : (
          <Panel padded={false}>
            <DataTable caption={w.caption} narrow="stack">
              <TableHead>
                <TableColumn width="fill" pinned>
                  {w.columns.name}
                </TableColumn>
                <TableColumn>{w.columns.role}</TableColumn>
                <TableColumn>{w.columns.seat}</TableColumn>
                <TableColumn align="end">{w.columns.seen}</TableColumn>
              </TableHead>
              <TableBody>
                {rows.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    lang={lang}
                    active={open?.id === member.id}
                    onOpen={() => setOpen(member)}
                  />
                ))}
              </TableBody>
              <TableFooter>
                <span>
                  {w.shown((current - 1) * pageSize + 1, (current - 1) * pageSize + rows.length, shown.length)}
                </span>
                {pages > 1 ? (
                  <Pagination
                    page={current}
                    pages={pages}
                    onPageChange={setPage}
                    label={w.pages}
                    previousLabel={w.previous}
                    nextLabel={w.next}
                    pageLabel={w.page}
                  />
                ) : null}
              </TableFooter>
            </DataTable>
          </Panel>
        )}

        <Dialog
          open={open !== undefined}
          onClose={() => (setOpen(undefined), setEditing(false))}
          eyebrow={open ? w.roles[open.role] : ""}
          title={open?.name ?? ""}
          lede={open?.email}
          closeLabel={w.close}
        >
          <DetailSection title={w.roleSection} editLabel={w.edit} editing={editing} onEdit={() => setEditing(true)}>
            <FactList layout="columns">
              <Fact label={w.role}>{open ? w.roles[open.role] : ""}</Fact>
              <Fact label={w.seatFact}>{open?.seat ? w.assigned : w.none}</Fact>
            </FactList>
            <DetailSectionForm
              saveLabel={w.save}
              cancelLabel={w.cancel}
              onSubmit={() => setEditing(false)}
              onCancel={() => setEditing(false)}
            >
              <Select id="screen-member-role" label={w.role} mono={false} defaultValue={open?.role}>
                <option value="owner">{w.roles.owner}</option>
                <option value="admin">{w.roles.admin}</option>
                <option value="member">{w.roles.member}</option>
              </Select>
            </DetailSectionForm>
          </DetailSection>
          <DialogFooter>
            <Button variant="danger" onClick={() => setConfirm(true)}>
              {w.remove}
            </Button>
          </DialogFooter>
        </Dialog>
      </Page>
      <ConfirmDialog
        open={confirm}
        tone="danger"
        title={w.confirmTitle(open?.name ?? "")}
        body={w.confirmBody}
        confirmLabel={w.confirmLabel}
        cancelLabel={w.cancel}
        onConfirm={() => (setConfirm(false), setOpen(undefined))}
        onClose={() => setConfirm(false)}
      />
    </>
  );
}

function MemberRow({
  member,
  lang,
  active,
  onOpen,
}: {
  member: Member;
  lang: "en" | "de";
  active: boolean;
  onOpen: () => void;
}) {
  const w = listWords[lang];
  return (
    <TableRow active={active} onSelect={onOpen}>
      <TableCell pinned>
        <CellStack primary={member.name} secondary={member.email} prose />
      </TableCell>
      <TableCell label={w.columns.role}>{w.roles[member.role]}</TableCell>
      <TableCell label={w.columns.seat}>
        {member.invited ? (
          <StatusPill tone="warn">{w.invited}</StatusPill>
        ) : (
          <StatusPill tone={member.seat ? "ok" : "neutral"}>{member.seat ? w.seat : w.noSeat}</StatusPill>
        )}
      </TableCell>
      <TableCell label={w.columns.seen} align="end" mono>
        {member.lastSeen === "" ? w.never : member.lastSeen}
      </TableCell>
    </TableRow>
  );
}
