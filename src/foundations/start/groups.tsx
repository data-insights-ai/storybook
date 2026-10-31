import type { ReactNode } from "react";
import { Copy, Download } from "lucide-react";
import {
  Breadcrumb,
  Button,
  DataTable,
  Fact,
  FactList,
  Figure,
  Kbd,
  MetaLine,
  Notice,
  NoticeBody,
  NoticeIcon,
  NoticeText,
  Panel,
  PeriodTimeline,
  SeverityMark,
  StatusPill,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  TrendChart,
} from "../../index";

/** One sidebar group: the question it answers, a live example of its main component, and where it opens. */
export type Group = { group: string; question: string; path: string; example: ReactNode };

const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((at, i) => ({
  at,
  events: [1210, 1380, 1290, 1520, 1842, 640, 590][i],
}));

export const groups: Group[] = [
  {
    group: "Actions",
    question: "Let someone do something.",
    path: "docs/actions-button--docs",
    example: (
      <Toolbar>
        <Button variant="secondary">Export</Button>
        <Button>Rotate key</Button>
      </Toolbar>
    ),
  },
  {
    group: "Forms",
    question: "Let someone enter or choose.",
    path: "docs/forms-text-textfield--docs",
    example: <TextField id="start-collector" label="Collector" placeholder="edge-gw-01" />,
  },
  {
    group: "Tables",
    question: "Many rows to scan, sort and filter.",
    path: "docs/tables-datatable--docs",
    example: (
      <DataTable caption="Collectors" indexed={false}>
        <TableHead>
          <TableColumn width="fill">Collector</TableColumn>
          <TableColumn>State</TableColumn>
        </TableHead>
        <TableBody>
          {[
            ["edge-gw-01", "ok", "running"],
            ["edge-gw-02", "warn", "late"],
          ].map(([name, tone, state]) => (
            <TableRow key={name}>
              <TableCell mono>{name}</TableCell>
              <TableCell>
                <StatusPill tone={tone as "ok" | "warn"}>{state}</StatusPill>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    ),
  },
  {
    group: "Records",
    question: "One record, or a short list of them.",
    path: "docs/records-factlist--docs",
    example: (
      <FactList layout="columns">
        <Fact label="Received" mono>
          09:12:04Z
        </Fact>
        <Fact label="Key" mono>
          a4f9c21e
        </Fact>
      </FactList>
    ),
  },
  {
    group: "Figures",
    question: "Show a number.",
    path: "docs/figures-figure--docs",
    example: <Figure label="Events today" value="1,842" size="compact" />,
  },
  {
    group: "Text",
    question: "Set text.",
    path: "docs/text-metaline--docs",
    example: (
      <>
        <MetaLine items={["As of 09:12", "14 sources"]} />
        <p className="di-start-line">
          Press <Kbd>⌘K</Kbd> for commands.
        </p>
      </>
    ),
  },
  {
    group: "Status",
    question: "The state of a thing, inline.",
    path: "docs/status-statuspill--docs",
    example: (
      <Toolbar>
        <StatusPill tone="ok">running</StatusPill>
        <StatusPill tone="warn">expiring</StatusPill>
        <SeverityMark level="high" label="High" />
      </Toolbar>
    ),
  },
  {
    group: "Feedback",
    question: "What happened, or is happening.",
    path: "docs/feedback-notice--docs",
    example: (
      <Notice tone="ok">
        <NoticeIcon />
        <NoticeText>
          <NoticeBody>Sealed through 2026-10-30.</NoticeBody>
        </NoticeText>
      </Notice>
    ),
  },
  {
    group: "Charts",
    question: "Plot data on a scale.",
    path: "docs/charts-trendchart--docs",
    example: (
      <TrendChart
        label="Events by day this week"
        data={week}
        series={[{ key: "events", label: "Events", kind: "area" }]}
        height="sm"
      />
    ),
  },
  {
    group: "Timelines",
    question: "Events and periods over time.",
    path: "docs/timelines-periodtimeline--docs",
    example: (
      <PeriodTimeline
        label="Licences"
        rows={[
          { id: "soc", label: "SOC", spans: [{ start: "2026-01-01", end: "2026-12-31", tone: "ok" }] },
          { id: "api", label: "API", spans: [{ start: "2026-03-01", end: "2026-11-15", tone: "warn" }] },
        ]}
        marker={{ at: "2026-10-31", label: "Today" }}
        formatDate={(iso) =>
          new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })
        }
        summary="SOC runs to the end of the year; the API licence ends in two weeks."
      />
    ),
  },
  {
    group: "Layout",
    question: "Arrange a page.",
    path: "docs/layout-page-panel--docs",
    example: (
      <Panel surface="inset" title="Last delivery">
        <MetaLine items={["09:12:04Z", "1,842 events"]} />
      </Panel>
    ),
  },
  {
    group: "Navigation",
    question: "Move between places.",
    path: "docs/navigation-breadcrumb--docs",
    example: (
      <Breadcrumb
        label="Breadcrumb"
        items={[
          { label: "Workspace", href: "#start-workspace" },
          { label: "Sources", href: "#start-sources" },
          { label: "edge-gw-02" },
        ]}
      />
    ),
  },
  {
    group: "Overlays",
    question: "Something above the page.",
    path: "docs/overlays-tooltip--docs",
    example: (
      <Toolbar>
        <Tooltip label="Copy the key">
          <Button variant="secondary" iconOnly aria-label="Copy the key">
            <Copy />
          </Button>
        </Tooltip>
        <Tooltip label="Download the log">
          <Button variant="secondary" iconOnly aria-label="Download the log">
            <Download />
          </Button>
        </Tooltip>
      </Toolbar>
    ),
  },
  {
    group: "Shell",
    question: "The app frame, its theme and density.",
    path: "story/shell-appshellbar--product",
    example: (
      <div className="di-start-theme" data-theme="dark">
        <Button variant="secondary">After dark</Button>
      </div>
    ),
  },
];
