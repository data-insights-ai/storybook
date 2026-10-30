/*
 * Sample data for the SOC screens, shaped after the product's mock build at
 * its fixture clock (12 Oct, 10:00). Names, hosts and accounts are invented;
 * addresses come from the documentation ranges.
 */
import type { Severity } from "../../index";

const days = ["6 Oct", "7 Oct", "8 Oct", "9 Oct", "10 Oct", "11 Oct", "12 Oct"];
const counts = [10, 4, 2, 1, 4, 16, 0, 1, 4, 10, 3, 0, 12, 20, 8, 2, 7, 9, 1, 0, 8, 7, 4, 2, 9, 15, 4, 1];
export const activity = counts.map((detections, i) => ({
  at: `${days[Math.floor(i / 4)]} ${String((i % 4) * 6).padStart(2, "0")}:00`,
  detections,
}));

export const kpis = {
  open: 3,
  bySeverity: { critical: 1, high: 1, medium: 1 },
  new24h: 1,
  escalated24h: 1,
  mine: 0,
  unassigned: 2,
  resolved7d: 1,
  mtta: "2.9 h",
  mttr: "1 d",
};

export const backlog = [
  { label: "Under 4 hours", value: 0 },
  { label: "Under 24 hours", value: 1 },
  { label: "Under 7 days", value: 2 },
  { label: "Over 7 days", value: 0 },
];

export const devices = [
  { name: "ws-fin-014", criticality: "Medium", cases: 1, severity: "critical" as Severity },
  { name: "srv-file-02", criticality: "High", cases: 1, severity: "critical" as Severity },
  { name: "srv-dc-01", criticality: "Crown jewel", cases: 1, severity: "critical" as Severity },
  { name: "ws-dev-031", criticality: "Low", cases: 1, severity: "medium" as Severity },
];

export const failingSources = [
  { name: "Identity sign-ins", reason: "no read permission", last: "7.2 h ago" },
  { name: "Mail audit", reason: "not set up in the tenant", last: "no data yet" },
];

export const coverage: { table: string; state: "arriving" | "silent" | "missing" }[] = [
  { table: "File certificates", state: "missing" },
  { table: "Account details", state: "missing" },
  { table: "Image loads", state: "silent" },
  { table: "Device events", state: "arriving" },
  { table: "File events", state: "arriving" },
  { table: "Device inventory", state: "arriving" },
  { table: "Sign-ins", state: "arriving" },
  { table: "Network connections", state: "arriving" },
  { table: "Network configuration", state: "arriving" },
  { table: "Processes", state: "arriving" },
  { table: "Registry changes", state: "arriving" },
  { table: "Identities", state: "arriving" },
];

export type CaseRow = {
  n: number;
  title: string;
  severity: Severity;
  status: "Open" | "In progress" | "Resolved";
  assignee?: string;
  opened: string;
  updated: string;
  signals: number;
  score?: number;
  tactic: string;
};

export const cases: CaseRow[] = [
  { n: 4, title: "Leaked VPN credentials used to move through the finance network", severity: "critical", status: "In progress", assignee: "Sam Analyst", opened: "7 h ago", updated: "1 h ago", signals: 1064, score: 98, tactic: "Lateral movement" },
  { n: 6, title: "Periodic beaconing from a finance workstation", severity: "high", status: "Open", opened: "13 h ago", updated: "1 h ago", signals: 744, score: 77, tactic: "Command and control" },
  { n: 2, title: "Defender exclusion on ws-hr-007", severity: "high", status: "Open", opened: "2 d ago", updated: "2 d ago", signals: 23, score: 78, tactic: "Defense evasion" },
  { n: 5, title: "Phishing link sent to finance after the credential leak", severity: "high", status: "Open", opened: "1 d ago", updated: "20 h ago", signals: 23, score: 78, tactic: "Initial access" },
  { n: 3, title: "Port scan from ws-dev-031", severity: "medium", status: "Open", opened: "1 d ago", updated: "1 d ago", signals: 9, score: 51, tactic: "Discovery" },
  { n: 1, title: "Exclusion and drop on srv-backup-01", severity: "high", status: "Resolved", assignee: "Sam Analyst", opened: "6 d ago", updated: "5 d ago", signals: 6, score: 44, tactic: "Defense evasion" },
];

export const caseFour = {
  verdict: "Leaked VPN credentials reached the file server and data is leaving it.",
  action: "Isolate srv-fs-02 and reset svc-backup.",
  reason:
    "The sign-in came from an address and a device n.feld has never used, the same day the credentials appeared in a combo list. The account owner confirmed it was not them.",
  proof: "Rule 14 · new path to a critical server",
  path: ["vpn-gw-01", "ws-fin-014", "srv-fs-02", "192.0.2.88"],
  phases: [
    { name: "Initial access", detail: "Credentials listed, then a VPN spray and a sign-in from a new country", signals: 82, severity: "high" as Severity },
    { name: "Execution and discovery", detail: "Encoded PowerShell and network discovery on srv-fs-02", signals: 99, severity: "high" as Severity },
    { name: "Credential access", detail: "LSASS read on srv-fs-02", signals: 9, severity: "critical" as Severity },
    { name: "Lateral movement", detail: "RDP, then an SMB spray across 36 finance hosts as svc-backup", signals: 634, severity: "critical" as Severity },
    { name: "Exfiltration", detail: "Archive, then chunked uploads to cloud storage at 192.0.2.88", signals: 228, severity: "critical" as Severity },
  ],
  signals: [
    { at: "12 Oct 03:38", severity: "critical" as Severity, source: "web proxy", text: "Large upload from srv-fs-02 to cloud storage at 192.0.2.88." },
    { at: "12 Oct 00:37", severity: "high" as Severity, source: "web proxy", text: "Chunked upload burst from srv-fs-02 to 192.0.2.88." },
    { at: "10 Oct 22:34", severity: "critical" as Severity, source: "edr", text: "Admin-share logon to ws-fin-025 as svc-backup, one of dozens within seconds." },
    { at: "10 Oct 09:41", severity: "high" as Severity, source: "edr", text: "Remote logon to srv-fs-02 as svc-backup from 10.20.4.14." },
    { at: "9 Oct 22:00", severity: "high" as Severity, source: "vpn gateway", text: "VPN sign-in for n.feld from 203.0.113.47, a location never seen for this account." },
  ],
  devices: "srv-fs-02 · ws-fin-014 · vpn-gw-01 · ws-fin-022 · srv-dc-01 · +34",
  accounts: "svc-backup · n.feld · t.brandl · a.lenz",
  steps: ["Isolate srv-fs-02 and ws-fin-014", "Reset the credentials of svc-backup and n.feld", "Revoke their sessions and tokens", "Check the 36 finance hosts for persistence"],
};
