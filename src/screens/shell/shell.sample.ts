/* The navigation and bar words the pattern screens share: a security workspace and an organization's home. Invented names. */
export type Role = "owner" | "admin" | "billing" | "member";
export type Lang = "en" | "de";

export type NavEntry = { id: string; label: string; badge?: string; roles?: Role[] };

export const workspaceNav: Record<Lang, NavEntry[]> = {
  en: [
    { id: "overview", label: "Overview" },
    { id: "cases", label: "Cases", badge: "5" },
    { id: "actors", label: "Threat actors" },
    { id: "assets", label: "Assets" },
    { id: "reports", label: "Reports" },
    { id: "sources", label: "Sources" },
    { id: "coverage", label: "Coverage" },
    { id: "notifications", label: "Notifications" },
    { id: "siem", label: "SIEM export" },
    { id: "access", label: "Access" },
    { id: "settings", label: "Settings" },
  ],
  de: [
    { id: "overview", label: "Übersicht" },
    { id: "cases", label: "Fälle", badge: "5" },
    { id: "actors", label: "Bedrohungsakteure" },
    { id: "assets", label: "Geräte" },
    { id: "reports", label: "Berichte" },
    { id: "sources", label: "Datenquellen" },
    { id: "coverage", label: "Abdeckung" },
    { id: "notifications", label: "Benachrichtigungen" },
    { id: "siem", label: "SIEM-Export" },
    { id: "access", label: "Zugriff" },
    { id: "settings", label: "Einstellungen" },
  ],
};

/* Each organization role sees only what its permissions open. */
export const organizationNav: Record<Lang, NavEntry[]> = {
  en: [
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
  ],
  de: [
    { id: "overview", label: "Übersicht" },
    { id: "products", label: "Produkte", roles: ["member"] },
    { id: "members", label: "Mitglieder", roles: ["owner", "admin", "billing"] },
    { id: "invitations", label: "Einladungen", roles: ["owner", "admin"] },
    { id: "products", label: "Produkte und Lizenzen", roles: ["owner", "admin", "billing"] },
    { id: "credits", label: "Guthaben", roles: ["owner", "billing"] },
    { id: "billing", label: "Abrechnung", roles: ["owner", "billing"] },
    { id: "signin", label: "Anmeldung", roles: ["owner", "admin"] },
    { id: "audit", label: "Prüfprotokoll", roles: ["owner", "admin"] },
    { id: "settings", label: "Einstellungen", roles: ["owner", "admin"] },
  ],
};

/* The words of the frame itself: the sidebar, the bar and its end. */
export const chromeWords = {
  en: {
    skip: "Skip to content",
    sections: "Sections",
    close: "Close navigation",
    toggle: "Toggle navigation",
    breadcrumb: "Breadcrumb",
    organization: "Example Security GmbH",
    back: "Back to the organization",
    workspace: "Production",
    organizationGroup: "Organization",
    signOut: "Sign out",
    more: "More",
    demo: "Demo data off",
    refresh: "Refresh",
    sealed: "Admin sealed",
    notifications: "Notifications",
    unread: (n: number) => `${n} unread`,
  },
  de: {
    skip: "Zum Inhalt springen",
    sections: "Bereiche",
    close: "Navigation schließen",
    toggle: "Navigation ein- oder ausblenden",
    breadcrumb: "Brotkrümelpfad",
    organization: "Example Security GmbH",
    back: "Zurück zur Organisation",
    workspace: "Produktion",
    organizationGroup: "Organisation",
    signOut: "Abmelden",
    more: "Weitere",
    demo: "Demodaten ausgeschaltet",
    refresh: "Aktualisieren",
    sealed: "Verwaltung versiegelt",
    notifications: "Benachrichtigungen",
    unread: (n: number) => `${n} ungelesen`,
  },
} satisfies Record<Lang, Record<string, string | ((n: number) => string)>>;
