/* Sample data for the portal home, shaped after the portal's "owner" mock. Invented names. */
const day = (i: number) => {
  const d = new Date(Date.UTC(2026, 8, 13 + i));
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
};

export const seats = Array.from({ length: 30 }, (_, i) => ({ at: day(i), used: i < 9 ? 2 : i < 20 ? 3 : 4, capacity: 5 }));
export const credits = [
  220, 214, 208, 202, 196, 190, 184, 178, 172, 166, 160, 154, 148, 142, 136, 130, 124, 118, 112, 106, 100, 94, 88, 82, 76, 70, 300, 194.5, 188.5, 182.5,
].map((balance, i) => ({ at: day(i), balance }));
export const members = Array.from({ length: 30 }, (_, i) => ({ at: day(i), members: i < 5 ? 2 : i < 20 ? 3 : 4, invitations: i < 21 ? 0 : 1 }));
export const triage = [80, 70, 0, 0, 50, 40, 0, 0, 90, 80, 0, 0, 60, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((runs, i) => ({ at: day(i), runs }));

export const audit = [
  { when: "10 Oct, 08:56", who: "You", what: "The AI SOC emailed 3 members" },
  { when: "2 Oct, 09:56", who: "Sam Analyst", what: "Sam Analyst joined as Member" },
  { when: "18 Sep, 09:56", who: "You", what: "Changed the role of Robin Billing to Billing administrator" },
  { when: "17 Sep, 14:10", who: "Robin Billing", what: "Robin Billing joined as Member" },
  { when: "12 Sep, 11:02", who: "Kim Ops", what: "Kim Ops joined as Member" },
];

export const licenses = [
  { name: "AI SOC Professional", seats: 2, until: "30 Apr 2027", left: "200 days", tone: "ok" as const },
  { name: "AI SOC Team add-on", seats: 3, until: "23 Oct 2026", left: "11 days", tone: "warn" as const },
];

export const team = [
  { name: "Alex Admin", role: "Owner" },
  { name: "Kim Ops", role: "Administrator" },
  { name: "Robin Billing", role: "Billing administrator" },
  { name: "Sam Analyst", role: "Member" },
];

export const products = [
  { id: "soc", name: "AI SOC", owner: "Professional · 4 of 5 seats", member: "Workspaces Production and Staging" },
  { id: "reports", name: "Reports", owner: "Open to every member", member: "12 reports shared with you" },
];

/*
 * What can be due on an organization's home, ranked by how soon it bites:
 * a licence or add-on ending within 30 days, seats used up, a failed
 * payment, an expiring sign-in certificate. The page shows the first one
 * the viewer can act on as its one gold item and names it in the claim;
 * with none, it says that everything runs. "add‑on" is written with a
 * non-breaking hyphen, so it never splits across lines.
 */
export type Decision = {
  kind: "licence" | "seats" | "payment" | "certificate";
  daysLeft: number;
  claim: string;
  title: string;
  reason: string;
  meta: string;
  deadline: string;
  action: string;
};

export type PortalState = { licencesActive: number; nextRenewal: string; decisions: Decision[] };

export const allRunning: PortalState = { licencesActive: 3, nextRenewal: "12 March", decisions: [] };

export const decisionDue: PortalState = {
  licencesActive: 3,
  nextRenewal: "23 Oct",
  decisions: [
    {
      kind: "licence",
      daysLeft: 11,
      claim: "the Team add‑on ends in 11 days",
      title: "Renew the Team add‑on before 23 Oct",
      reason: "Three of your five seats end with it. Without it, 2 seats remain for 4 members.",
      meta: "AI SOC Team add‑on · 3 seats · 11 days left",
      deadline: "Decide by 23 Oct",
      action: "Renew the add‑on",
    },
  ],
};

/* The organization roles of the account platform, and what each may see and do on the home. */
export type Role = "owner" | "admin" | "billing" | "member";

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

export const firstDue = (state: PortalState, role: Role) =>
  state.decisions.filter((d) => actsOn[d.kind](role)).sort((a, b) => a.daysLeft - b.daysLeft)[0];

export const people: Record<Role, string> = { owner: "Alex Admin", admin: "Kim Ops", billing: "Robin Billing", member: "Sam Analyst" };

export const roleNames: Record<Role, string> = {
  owner: "you are the owner",
  admin: "you are an administrator",
  billing: "you are the billing administrator",
  member: "you are a member",
};
