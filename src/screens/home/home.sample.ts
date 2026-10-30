/*
 * Sample data for an organization's home, at a fixed clock (12 Oct, 10:00).
 * Invented names. "add‑on" is written with a non-breaking hyphen, so it
 * never splits across lines.
 */
import type { Role } from "../shell/shell.sample";

const day = (i: number) => new Date(Date.UTC(2026, 8, 13 + i)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export const credits = [
  220, 214, 208, 202, 196, 190, 184, 178, 172, 166, 160, 154, 148, 142, 136, 130, 124, 118, 112, 106, 100, 94, 88, 82, 76, 70, 300, 194.5, 188.5, 182.5,
].map((balance, i) => ({ at: day(i), balance }));

export const audit = [
  { when: "10 Oct, 08:56", what: "3 members were notified about case 4" },
  { when: "2 Oct, 09:56", what: "Sam Analyst joined as member" },
  { when: "18 Sep, 09:56", what: "Robin Billing became billing administrator" },
  { when: "17 Sep, 14:10", what: "Robin Billing joined as member" },
];

export const team = [
  { name: "Nora Feld", role: "Owner" },
  { name: "Kim Ops", role: "Administrator" },
  { name: "Robin Billing", role: "Billing administrator" },
  { name: "Sam Analyst", role: "Member" },
];

export const products = [
  { id: "security", name: "Security operations", owner: "Professional · 4 of 5 seats", member: "Workspaces Production and Staging" },
  { id: "reports", name: "Reports", owner: "Open to every member", member: "12 reports shared with you" },
];

/*
 * What can be due on an organization's home, ranked by how soon it bites.
 * The page shows the first one the viewer can act on as its one gold item;
 * with none, it says that everything runs.
 */
export type Decision = {
  kind: "licence" | "seats" | "payment" | "certificate";
  daysLeft: number;
  title: string;
  reason: string;
  meta: string;
  deadline: string;
  action: string;
};

export type OrganizationState = { licencesActive: number; nextRenewal: string; decisions: Decision[] };

export const allRunning: OrganizationState = { licencesActive: 3, nextRenewal: "12 March", decisions: [] };

export const decisionDue: OrganizationState = {
  licencesActive: 3,
  nextRenewal: "23 Oct",
  decisions: [
    {
      kind: "licence",
      daysLeft: 11,
      title: "Renew the team add‑on before 23 Oct",
      reason: "Three of your five seats end with it. Without it, 2 seats remain for 4 members.",
      meta: "Team add‑on · 3 seats · 11 days left",
      deadline: "Decide by 23 Oct",
      action: "Renew the add‑on",
    },
  ],
};

export const can = {
  billing: (role: Role) => role === "owner" || role === "billing",
  signIn: (role: Role) => role === "owner",
  team: (role: Role) => role !== "member",
  manageTeam: (role: Role) => role === "owner" || role === "admin",
  audit: (role: Role) => role === "owner" || role === "admin",
};

const actsOn: Record<Decision["kind"], (role: Role) => boolean> = {
  licence: can.billing,
  seats: can.billing,
  payment: can.billing,
  certificate: can.signIn,
};

export const firstDue = (state: OrganizationState, role: Role) =>
  state.decisions.filter((d) => actsOn[d.kind](role)).sort((a, b) => a.daysLeft - b.daysLeft)[0];

export const people: Record<Role, string> = { owner: "Nora Feld", admin: "Kim Ops", billing: "Robin Billing", member: "Sam Analyst" };

export const roleNames: Record<Role, string> = {
  owner: "you are the owner",
  admin: "you are an administrator",
  billing: "you are the billing administrator",
  member: "you are a member",
};
