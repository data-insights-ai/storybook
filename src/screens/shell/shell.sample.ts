/* The navigation the pattern screens share: a security workspace and an organization's home. Invented names. */
export type Role = "owner" | "admin" | "billing" | "member";

export type NavEntry = { id: string; label: string; badge?: string; roles?: Role[] };

export const workspaceNav: NavEntry[] = [
  { id: "overview", label: "Overview" },
  { id: "cases", label: "Cases", badge: "5" },
  { id: "actors", label: "Threat actors" },
  { id: "assets", label: "Assets" },
  { id: "reports", label: "Reports" },
  { id: "sources", label: "Sources" },
  { id: "notifications", label: "Notifications" },
  { id: "siem", label: "SIEM export" },
  { id: "access", label: "Access" },
  { id: "settings", label: "Settings" },
];

/* Each organization role sees only what its permissions open. */
export const organizationNav: NavEntry[] = [
  { id: "overview", label: "Overview" },
  { id: "products", label: "Products", roles: ["member"] },
  { id: "members", label: "Members", roles: ["owner", "admin", "billing"] },
  { id: "invitations", label: "Invitations", roles: ["owner", "admin"] },
  { id: "products", label: "Products and licences", roles: ["owner", "admin", "billing"] },
  { id: "credits", label: "Credits", roles: ["owner", "billing"] },
  { id: "billing", label: "Billing", roles: ["owner", "billing"] },
  { id: "signin", label: "Sign-in", roles: ["owner", "admin"] },
  { id: "audit", label: "Audit log", roles: ["owner", "admin"] },
  { id: "settings", label: "Settings", roles: ["owner", "admin"] },
];
