/* The tables a security workspace reads, at a fixed clock (12 Oct, 10:00). Invented sources. */
export type Arrival = "arriving" | "silent" | "missing";

export type CoverageRow = { table: string; source: string; arrival: Arrival; last: string; rules: string };

export const tables: CoverageRow[] = [
  { table: "File certificates", source: "Endpoint agent", arrival: "missing", last: "never", rules: "18" },
  { table: "Account details", source: "Directory sync", arrival: "missing", last: "never", rules: "21" },
  { table: "Image loads", source: "Endpoint agent", arrival: "silent", last: "11 Oct, 08:02", rules: "7" },
  { table: "Process events", source: "Endpoint agent", arrival: "arriving", last: "10:00:12", rules: "0" },
  { table: "Network connections", source: "Endpoint agent", arrival: "arriving", last: "10:00:09", rules: "0" },
  { table: "Sign-in events", source: "Identity provider", arrival: "arriving", last: "09:59:58", rules: "0" },
  { table: "Mail flow", source: "Mail gateway", arrival: "arriving", last: "09:59:41", rules: "0" },
  { table: "Firewall sessions", source: "Edge firewall", arrival: "arriving", last: "10:00:03", rules: "0" },
  { table: "DNS queries", source: "Resolver", arrival: "arriving", last: "10:00:11", rules: "0" },
  { table: "File events", source: "Endpoint agent", arrival: "arriving", last: "10:00:07", rules: "0" },
  { table: "Registry events", source: "Endpoint agent", arrival: "arriving", last: "10:00:05", rules: "0" },
  { table: "Audit log", source: "Directory sync", arrival: "arriving", last: "09:58:30", rules: "0" },
];
