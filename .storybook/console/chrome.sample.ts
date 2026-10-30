import { createElement } from "react";
import { Activity, Boxes, FileSearch, Radar, Settings2, ShieldAlert, Waypoints } from "lucide-react";
import type { ConsoleChrome } from "./Console";

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
        { id: "overview", label: "Overview", icon: createElement(FileSearch), code: "REG" },
        {
          id: "findings",
          label: "Findings",
          icon: createElement(ShieldAlert),
          badge: "3",
          badgeTone: "alert",
        },
        { id: "watchlist", label: "Watchlist", icon: createElement(Radar), badge: "8" },
        { id: "sources", label: "Sources", icon: createElement(Boxes), code: "ACT" },
        {
          id: "coverage",
          label: "Coverage",
          icon: createElement(Activity),
          badge: "6",
          badgeTone: "seal",
          sealed: true,
        },
      ],
    },
    {
      label: "Operate",
      items: [
        { id: "architecture", label: "Architecture", icon: createElement(Waypoints), code: "SYS" },
        { id: "settings", label: "Settings", icon: createElement(Settings2), code: "CFG" },
      ],
    },
  ],
  demoOff: "Demo data off",
  demoOn: "Demo data on",
  demoBanner: "Demo data is on. The records on this page are samples.",
  refresh: "Refresh",
  sealed: "Admin sealed",
  sealedMark: "Sealed",
  runtime: "Sealed runtime",
  version: "v4.18.2",
};
