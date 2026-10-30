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
