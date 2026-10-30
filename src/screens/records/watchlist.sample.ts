/* What a workspace watches for in leaked and public sources. Invented people, companies and domains. */
export type Identity = { id: string; name: string; detail: string; kind: string; match: string; paused?: boolean };

export const identities: Identity[] = [
  { id: "d1", name: "harthaus.example", detail: "Primary web domain", kind: "Domain", match: "today, 09:52" },
  { id: "e1", name: "n.feld@harthaus.example", detail: "Verified mailbox", kind: "Mailbox", match: "3 Oct" },
  { id: "c1", name: "Harthaus GmbH", detail: "Registered name", kind: "Company", match: "28 Sep" },
  { id: "c2", name: "Harthaus", detail: "Short form", kind: "Company", match: "28 Sep" },
  { id: "p1", name: "Nora Feld", detail: "Full name", kind: "Person", match: "none" },
  { id: "p2", name: "Dr. Nora Feld", detail: "With academic title", kind: "Person", match: "none" },
  { id: "p3", name: "Nora Feld-Kranz", detail: "Double name", kind: "Person", match: "none" },
  { id: "p4", name: "N. Feld", detail: "Short form", kind: "Person", match: "none", paused: true },
];
