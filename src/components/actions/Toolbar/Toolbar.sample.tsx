import { Download, MoreHorizontal, RotateCw } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../Button";
import { Checkbox } from "../../forms/choice/Checkbox";
import { SearchField } from "../../forms/text/SearchField";
import { Select } from "../../forms/select/Select";
import { CellStack, DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../tables/DataTable";
import { useShortcut } from "../../../internal/useShortcut";
import { Toolbar, type ToolbarProps } from "./Toolbar";
import { ToolbarAction, ToolbarEnd } from "./ToolbarParts";

export const words = {
  en: {
    filter: "Filter members",
    search: "Search members",
    placeholder: "Name or email",
    name: "Name",
    role: "Role",
    allRoles: "All roles",
    owners: "Owners",
    admins: "Administrators",
    seat: "Seat",
    anySeat: "Any seat",
    withSeat: "With a seat",
    export: "Export CSV",
    bulk: "Actions on the selected members",
    selected: (n: number) => `${n} selected`,
    selectAll: "Select all 140 matching",
    clear: "Clear",
    setRole: "Change role",
    remove: "Remove from workspace",
    members: "Members",
    selectPage: "Select every member on this page",
    actions: "Actions",
    select: (name: string) => `Select ${name}`,
  },
  de: {
    filter: "Mitglieder filtern",
    search: "Mitglieder durchsuchen",
    placeholder: "Name oder E-Mail-Adresse",
    name: "Name",
    role: "Rolle",
    allRoles: "Alle Rollen",
    owners: "Inhaberinnen und Inhaber",
    admins: "Administratorinnen und Administratoren",
    seat: "Arbeitsplatz",
    anySeat: "Mit oder ohne Arbeitsplatzlizenz",
    withSeat: "Mit Arbeitsplatzlizenz",
    export: "Als CSV-Datei exportieren",
    bulk: "Aktionen für die ausgewählten Mitglieder",
    selected: (n: number) => `${n} ausgewählt`,
    selectAll: "Alle 140 Treffer auswählen",
    clear: "Auswahl aufheben",
    setRole: "Rolle ändern",
    remove: "Aus dem Arbeitsbereich entfernen",
    members: "Mitglieder",
    selectPage: "Alle Mitglieder auf dieser Seite auswählen",
    actions: "Aktionen",
    select: (name: string) => `${name} auswählen`,
  },
};

export type Words = (typeof words)["en"];

export const members = [
  { id: "m1", name: "Nora Feld", email: "nora.feld@northwind.example", role: "Owner" },
  { id: "m2", name: "Jonas Brandt", email: "jonas.brandt@northwind.example", role: "Administrator" },
  { id: "m3", name: "Mira Kern", email: "mira.kern@northwind.example", role: "Member" },
  { id: "m4", name: "Tariq Haddad", email: "tariq.haddad@northwind.example", role: "Member" },
];

/** The search and filters above the members list; `/` focuses the search. */
export function MembersFilter({ w = words.en, sticky }: { w?: Words; sticky?: ToolbarProps["sticky"] }) {
  const search = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  useShortcut("/", () => search.current?.focus());
  return (
    <Toolbar label={w.filter} role="search" sticky={sticky}>
      <SearchField
        ref={search}
        id="tb-members-search"
        label={w.search}
        placeholder={w.placeholder}
        shortcut="/"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <Select id="tb-members-role" label={w.role} hideLabel mono={false} defaultValue="">
        <option value="">{w.allRoles}</option>
        <option value="owner">{w.owners}</option>
        <option value="admin">{w.admins}</option>
      </Select>
      <Select id="tb-members-seat" label={w.seat} hideLabel mono={false} defaultValue="">
        <option value="">{w.anySeat}</option>
        <option value="assigned">{w.withSeat}</option>
      </Select>
      <ToolbarEnd>
        <ToolbarAction icon={<Download aria-hidden />} label={w.export} />
      </ToolbarEnd>
    </Toolbar>
  );
}

export function MembersTable({
  w = words.en,
  chosen,
  onChoose,
}: {
  w?: Words;
  chosen?: string[];
  onChoose?: (ids: string[]) => void;
}) {
  return (
    <DataTable caption={w.members} indexed={false}>
      <TableHead>
        {chosen ? (
          <TableColumn>
            <Checkbox
              id="tb-choose-all"
              label={w.selectPage}
              hideLabel
              checked={chosen.length === members.length}
              indeterminate={chosen.length > 0 && chosen.length < members.length}
              onChange={(e) => onChoose?.(e.target.checked ? members.map((m) => m.id) : [])}
            />
          </TableColumn>
        ) : null}
        <TableColumn width="fill">{w.name}</TableColumn>
        <TableColumn>{w.role}</TableColumn>
        <TableColumn align="end">{w.actions}</TableColumn>
      </TableHead>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.id}>
            {chosen ? (
              <TableCell>
                <Checkbox
                  id={`tb-choose-${m.id}`}
                  label={w.select(m.name)}
                  hideLabel
                  checked={chosen.includes(m.id)}
                  onChange={(e) =>
                    onChoose?.(e.target.checked ? [...chosen, m.id] : chosen.filter((id) => id !== m.id))
                  }
                />
              </TableCell>
            ) : null}
            <TableCell>
              <CellStack primary={m.name} secondary={m.email} prose />
            </TableCell>
            <TableCell>{m.role}</TableCell>
            <TableCell align="end">
              <Toolbar variant="row" label={`Actions for ${m.name}`}>
                <Button variant="ghost" size="sm" iconOnly aria-label={`Resend the invitation to ${m.name}`}>
                  <RotateCw aria-hidden />
                </Button>
                <Button variant="ghost" size="sm" iconOnly aria-label={`More actions for ${m.name}`}>
                  <MoreHorizontal aria-hidden />
                </Button>
              </Toolbar>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
}
