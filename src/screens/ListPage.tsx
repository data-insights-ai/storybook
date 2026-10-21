import { useRef, useState } from "react";
import { Download, MoreHorizontal, UserPlus } from "lucide-react";
import { Console } from "../components/AppShell";
import { Button } from "../components/Button";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { TableCell, TableColumn, TableHead, TableRow } from "../components/DataTable";
import { DangerAction, DangerZone } from "../components/DangerZone";
import { DetailSection, DetailSectionForm } from "../components/DetailSection";
import { EmptyState, EmptyStateAction } from "../components/EmptyState";
import { Fact, FactList } from "../components/FactList";
import { PageHeader, PageHeaderAside, PageHeaderTitle } from "../components/Heading";
import { InfiniteTable, type InfiniteRowPlace } from "../components/InfiniteTable";
import { ListToolbar, ListToolbarEnd } from "../components/ListToolbar";
import { Menu, MenuItem } from "../components/Menu";
import { Page } from "../components/Page";
import { RowActions } from "../components/RowActions";
import { SearchField } from "../components/SearchField";
import { Select } from "../components/Select";
import { Sheet } from "../components/Sheet";
import { StatusPill } from "../components/StatusPill";
import { TextLink } from "../components/TextLink";
import { useShortcut } from "../components/useShortcut";
import { sampleChrome } from "../sample/chrome";

type Member = { id: string; name: string; email: string; role: "Owner" | "Administrator" | "Member"; seat: boolean };

const members: Member[] = [
  ["Nora Feld", "Owner", true],
  ["Jonas Brandt", "Administrator", true],
  ["Mira Kern", "Member", true],
  ["Tomas Vogt", "Member", false],
  ["Lea Lind", "Member", true],
  ["Arne Roth", "Member", false],
  ["Ines Hart", "Administrator", true],
  ["Paul Weber", "Member", true],
].map(([name, role, seat], i) => ({
  id: `m${i}`,
  name: name as string,
  email: `${(name as string).toLowerCase().replace(" ", ".")}@data-insights.ai`,
  role: role as Member["role"],
  seat: seat as boolean,
}));

function MemberRow({ member, place, onOpen }: { member: Member; place: InfiniteRowPlace; onOpen: () => void }) {
  const [menu, setMenu] = useState(false);
  return (
    <TableRow rowIndex={place.rowIndex} ref={place.ref} onSelect={onOpen}>
      <TableCell>
        <TextLink onClick={onOpen}>{member.name}</TextLink>
      </TableCell>
      <TableCell mono>{member.email}</TableCell>
      <TableCell>{member.role}</TableCell>
      <TableCell>
        <StatusPill tone={member.seat ? "ok" : "neutral"}>{member.seat ? "Seat" : "No seat"}</StatusPill>
      </TableCell>
      <TableCell align="end">
        <RowActions>
          <Menu
            open={menu}
            onOpenChange={setMenu}
            label={`Actions for ${member.name}`}
            trigger={(props) => (
              <Button {...props} variant="ghost" size="dense" iconOnly aria-label={`Actions for ${member.name}`}>
                <MoreHorizontal aria-hidden />
              </Button>
            )}
          >
            <MenuItem onSelect={onOpen}>Open</MenuItem>
            <MenuItem onSelect={onOpen}>Change role</MenuItem>
          </Menu>
        </RowActions>
      </TableCell>
    </TableRow>
  );
}

/** A list page: header with the primary action, a sticky toolbar, the list, the record in a sheet. */
export function ListPageScreen() {
  const search = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [open, setOpen] = useState<Member>();
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  useShortcut("/", () => search.current?.focus());

  const shown = members.filter(
    (m) => (q === "" || `${m.name} ${m.email}`.toLowerCase().includes(q.toLowerCase())) && (role === "" || m.role === role),
  );

  return (
    <Console title="Members" crumb={["Organization", "Members"]} active="overview" chrome={sampleChrome}>
      <Page width="list">
        <PageHeader lede="People in this organization and the role each one has.">
          <PageHeaderTitle>Members</PageHeaderTitle>
          <PageHeaderAside>
            <Button>
              <UserPlus aria-hidden />
              Invite people
            </Button>
          </PageHeaderAside>
        </PageHeader>
        <ListToolbar label="Filter members">
          <SearchField
            ref={search}
            id="screen-members-search"
            label="Search members"
            placeholder="Name or email"
            shortcut="/"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select id="screen-members-role" label="Role" hideLabel mono={false} value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All roles</option>
            <option value="Owner">Owners</option>
            <option value="Administrator">Administrators</option>
            <option value="Member">Members</option>
          </Select>
          <ListToolbarEnd>
            <Button variant="secondary">
              <Download aria-hidden />
              Export CSV
            </Button>
          </ListToolbarEnd>
        </ListToolbar>
        {shown.length === 0 ? (
          <EmptyState title="No member matches." body="Try another name, or show all roles.">
            <EmptyStateAction>
              <Button variant="secondary" onClick={() => (setQ(""), setRole(""))}>
                Clear filters
              </Button>
            </EmptyStateAction>
          </EmptyState>
        ) : (
          <InfiniteTable
            caption="Members"
            count={shown.length}
            rowKey={(i) => shown[i].id}
            hasMore={false}
            loadingMore={false}
            onLoadMore={() => {}}
            order="sorted"
            memoryKey={`screen-members-${q}-${role}`}
            loadingLabel="Loading more members"
            footerLabel={(n) => `All ${n} shown`}
            newEntriesLabel={(n) => `${n} new members`}
            renderRow={(i, place) => <MemberRow key={place.key} member={shown[i]} place={place} onOpen={() => setOpen(shown[i])} />}
          >
            <TableHead>
              <TableColumn width="fill">Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Role</TableColumn>
              <TableColumn>Seat</TableColumn>
              <TableColumn align="end">Actions</TableColumn>
            </TableHead>
          </InfiniteTable>
        )}
      </Page>
      <Sheet
        open={open !== undefined}
        onClose={() => (setOpen(undefined), setEditing(false))}
        title={open?.name ?? ""}
        lede={open?.email}
        closeLabel="Close"
      >
        <DetailSection title="Role" editLabel="Change role" editing={editing} onEdit={() => setEditing(true)}>
          <FactList layout="columns">
            <Fact label="Role">{open?.role}</Fact>
            <Fact label="Seat">{open?.seat ? "Assigned" : "None"}</Fact>
          </FactList>
          <DetailSectionForm saveLabel="Save" cancelLabel="Cancel" onSubmit={() => setEditing(false)} onCancel={() => setEditing(false)}>
            <Select id="screen-member-role" label="Role" mono={false} defaultValue={open?.role}>
              <option>Owner</option>
              <option>Administrator</option>
              <option>Member</option>
            </Select>
          </DetailSectionForm>
        </DetailSection>
        <DangerZone title="Danger zone">
          <DangerAction title="Remove from organization" body="They lose access to the organization and its products at once.">
            <Button variant="danger" onClick={() => setConfirm(true)}>
              Remove
            </Button>
          </DangerAction>
        </DangerZone>
      </Sheet>
      <ConfirmDialog
        open={confirm}
        title={`Remove ${open?.name ?? ""}?`}
        body="They lose access at once. You can invite them again later."
        confirmLabel="Remove member"
        cancelLabel="Cancel"
        onConfirm={() => (setConfirm(false), setOpen(undefined))}
        onClose={() => setConfirm(false)}
      />
    </Console>
  );
}
