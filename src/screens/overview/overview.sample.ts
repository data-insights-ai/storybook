/*
 * Sample data for the security overview, at a fixed clock (12 Oct, 10:00).
 * Names, hosts and accounts are invented; addresses come from the
 * documentation ranges.
 */
import type { Severity } from "../../index";

const days = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
const counts = [10, 4, 2, 1, 4, 16, 0, 1, 4, 10, 3, 0, 12, 20, 8, 2, 7, 9, 1, 0, 8, 7, 4, 2, 9, 15, 4, 1];

export const detections = counts.map((value, i) => ({
  at: `${days[Math.floor(i / 4)]} ${String((i % 4) * 6).padStart(2, "0")}h`,
  detections: value,
}));

export const figures = { open: 3, new24h: 1, unassigned: 2, acknowledge: "2.9 h", resolve: "1 d" };

export const devices: Array<{ name: string; criticality: string; severity: Severity; word: string }> = [
  { name: "srv-dc-01", criticality: "Crown jewel", severity: "critical", word: "Critical" },
  { name: "srv-fs-02", criticality: "High", severity: "critical", word: "Critical" },
  { name: "ws-fin-014", criticality: "Medium", severity: "critical", word: "Critical" },
  { name: "ws-dev-031", criticality: "Low", severity: "medium", word: "Medium" },
];

export const coverage: Array<{ table: string; state: "silent" | "missing"; since: string }> = [
  { table: "File certificates", state: "missing", since: "never delivered" },
  { table: "Account details", state: "missing", since: "never delivered" },
  { table: "Image loads", state: "silent", since: "silent for 26 h" },
];

export const delivery: Array<{ label: string; value: string; note: string; tone: "neutral" | "warn" }> = [
  { label: "Notifications", value: "2 / 2", note: "channels active", tone: "neutral" },
  { label: "SIEM exports", value: "1 / 2", note: "delivering", tone: "warn" },
  { label: "Access", value: "8", note: "people and service accounts", tone: "neutral" },
];
