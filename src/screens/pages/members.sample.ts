/* The members of an invented organization and the words of the list page, in English and German. */
export type Role = "owner" | "admin" | "member";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  seat: boolean;
  lastSeen: string;
  invited?: boolean;
};

export const members: Member[] = (
  [
    { id: "m01", name: "Nora Feld", role: "owner", seat: true, lastSeen: "2026-10-30 09:12" },
    { id: "m02", name: "Jonas Brandt", role: "admin", seat: true, lastSeen: "2026-10-30 08:47" },
    { id: "m03", name: "Mira Kern", role: "member", seat: true, lastSeen: "2026-10-29 17:03" },
    { id: "m04", name: "Tomas Vogt", role: "member", seat: false, lastSeen: "2026-10-12 11:20" },
    { id: "m05", name: "Lea Lind", role: "member", seat: true, lastSeen: "2026-10-30 07:58" },
    { id: "m06", name: "Arne Roth", role: "member", seat: false, lastSeen: "", invited: true },
    { id: "m07", name: "Ines Hart", role: "admin", seat: true, lastSeen: "2026-10-28 14:31" },
    { id: "m08", name: "Paul Weber", role: "member", seat: true, lastSeen: "2026-10-30 09:05" },
  ] as Omit<Member, "email">[]
).map((m) => ({ ...m, email: `${m.name.toLowerCase().replace(" ", ".")}@data-insights.ai` }));

const en = {
  title: "Members",
  lede: "People in this organization, their role and whether they hold a seat.",
  meta: ["8 members", "6 of 25 seats used"],
  invite: "Invite people",
  filter: "Filter members",
  search: "Search members",
  searchHint: "Name or email",
  role: "Role",
  allRoles: "All roles",
  roles: { owner: "Owner", admin: "Administrator", member: "Member" },
  roleFilter: { owner: "Owners", admin: "Administrators", member: "Members" },
  export: "Export CSV",
  caption: "Members of Example Security GmbH",
  columns: { name: "Name", role: "Role", seat: "Seat", seen: "Last sign-in" },
  seat: "Seat",
  noSeat: "No seat",
  invited: "Invitation sent",
  never: "never",
  remove: "Remove from organization",
  shown: (from: number, to: number, total: number) => `${from}–${to} of ${total} members`,
  pages: "Member pages",
  previous: "Previous page",
  next: "Next page",
  page: "Page",
  emptyTitle: "No member matches.",
  emptyBody: "Try another name or email, or show every role.",
  clear: "Clear filters",
  loading: "Loading members",
  errorTitle: "The members could not be loaded.",
  errorBody: "The account service did not answer within 10 seconds. Nothing was changed.",
  retry: "Try again",
  close: "Close",
  roleSection: "Role and seat",
  edit: "Edit",
  save: "Save",
  cancel: "Cancel",
  seatFact: "Seat",
  assigned: "Assigned",
  none: "None",
  confirmTitle: (name: string) => `Remove ${name}?`,
  confirmBody: "They lose access at once. You can invite them again later.",
  confirmLabel: "Remove member",
};

export type ListWords = typeof en;

const de: ListWords = {
  title: "Mitglieder",
  lede: "Personen in dieser Organisation, ihre Rolle und ob sie einen Arbeitsplatz belegen.",
  meta: ["8 Mitglieder", "6 von 25 Arbeitsplätzen belegt"],
  invite: "Personen einladen",
  filter: "Mitglieder filtern",
  search: "Mitglieder durchsuchen",
  searchHint: "Name oder E-Mail-Adresse",
  role: "Rolle",
  allRoles: "Alle Rollen",
  roles: { owner: "Inhaber", admin: "Administrator", member: "Mitglied" },
  roleFilter: { owner: "Inhaber", admin: "Administratoren", member: "Mitglieder" },
  export: "Als CSV exportieren",
  caption: "Mitglieder von Example Security GmbH",
  columns: { name: "Name", role: "Rolle", seat: "Arbeitsplatz", seen: "Letzte Anmeldung" },
  seat: "Arbeitsplatz",
  noSeat: "Kein Arbeitsplatz",
  invited: "Einladung verschickt",
  never: "nie",
  remove: "Aus der Organisation entfernen",
  shown: (from: number, to: number, total: number) => `${from}–${to} von ${total} Mitgliedern`,
  pages: "Mitgliederseiten",
  previous: "Vorherige Seite",
  next: "Nächste Seite",
  page: "Seite",
  emptyTitle: "Kein Mitglied passt zu Ihrer Suche.",
  emptyBody: "Versuchen Sie einen anderen Namen oder zeigen Sie alle Rollen.",
  clear: "Filter zurücksetzen",
  loading: "Mitglieder werden geladen",
  errorTitle: "Die Mitglieder konnten nicht geladen werden.",
  errorBody: "Der Kontodienst hat nicht innerhalb von 10 Sekunden geantwortet. Es wurde nichts geändert.",
  retry: "Erneut versuchen",
  close: "Schließen",
  roleSection: "Rolle und Arbeitsplatz",
  edit: "Bearbeiten",
  save: "Speichern",
  cancel: "Abbrechen",
  seatFact: "Arbeitsplatz",
  assigned: "Zugewiesen",
  none: "Keiner",
  confirmTitle: (name: string) => `${name} entfernen?`,
  confirmBody: "Der Zugriff endet sofort. Sie können die Person später erneut einladen.",
  confirmLabel: "Mitglied entfernen",
};

export const listWords = { en, de };
