import type { ConsoleChrome } from "../components/AppShell";

/** English sample chrome. A product replaces this with its own strings. */
export const sampleChrome: ConsoleChrome = {
  lang: "en",
  workspace: "Workspace",
  workspaceId: "WS-01",
  operator: { initials: "NF", name: "Nora Feld", role: "Admin · Key valid" },
  accountLabel: "Account for Nora Feld",
  navLabel: "Sections",
  skipLabel: "Skip to content",
  groups: [
    {
      label: "Record",
      items: [
        { id: "overview", label: "Overview", code: "REG" },
        { id: "findings", label: "Findings", badge: "03", badgeTone: "alert" },
        { id: "watchlist", label: "Watchlist", badge: "08" },
        { id: "sources", label: "Sources", code: "ACT" },
        { id: "coverage", label: "Coverage", badge: "06", badgeTone: "gold" },
      ],
    },
    {
      label: "Operate",
      items: [
        { id: "architecture", label: "Architecture", code: "SYS" },
        { id: "settings", label: "Settings", code: "CFG" },
      ],
    },
  ],
  demoOff: "Demo data off",
  demoOn: "Demo data on",
  demoBanner: "Demo data is on. The records on this page are samples.",
  refresh: "Refresh",
  sealed: "Admin sealed",
  runtime: "Sealed runtime",
  version: "v4.18.2",
};
