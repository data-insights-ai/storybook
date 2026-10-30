/*
 * Sample data for case triage, at a fixed clock (12 Oct, 10:00). Names,
 * hosts and accounts are invented; addresses come from the documentation
 * ranges.
 */
import type { Severity } from "../../index";

export const severityWords: Record<Severity, string> = { critical: "Critical", high: "High", medium: "Medium", low: "Low", info: "Info" };

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
  { n: 2, title: "Antivirus exclusion on ws-hr-007", severity: "high", status: "Open", opened: "2 d ago", updated: "2 d ago", signals: 23, score: 78, tactic: "Defense evasion" },
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
