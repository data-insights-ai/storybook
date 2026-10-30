import { useState } from "react";
import {
  Button,
  CellStack,
  ChoiceGroup,
  DataTable,
  Figure,
  FigureRow,
  MetaLine,
  Notice,
  NoticeBody,
  NoticeTitle,
  Numbered,
  PageHeader,
  PageHeaderMeta,
  PageHeaderStatus,
  PageHeaderTitle,
  Panel,
  PanelLead,
  PanelMeta,
  PanelNote,
  SeverityMark,
  Split,
  SplitBack,
  SplitList,
  SplitListHead,
  SplitListItem,
  SplitListItems,
  SplitMain,
  Stack,
  StatusPill,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableIndex,
  TableRow,
  TextLink,
  Toolbar,
} from "../../index";
import { ProductShell } from "../shell/ProductShell";
import { caseFour, cases, severityWords, type CaseRow } from "./cases.sample";

const rank = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

/**
 * Cases as a permanent split: the list stays on the left as its own pane,
 * sorted by severity; the open case is on the right. The case's header
 * only orients (name, severity, state). Its first block is the verdict,
 * the one gold object, with the action it asks for and the proof; then
 * the figures on a strip, the story, the evidence and the next steps.
 */
export function CaseTriage({ showing: initial = "list" }: { showing?: "list" | "detail" }) {
  const [filter, setFilter] = useState("open");
  const [open, setOpen] = useState(4);
  const [showing, setShowing] = useState<"list" | "detail">(initial);
  const list = cases
    .filter((c) => (filter === "open" ? c.status !== "Resolved" : true))
    .sort((a, b) => rank[a.severity] - rank[b.severity]);
  const record = cases.find((c) => c.n === open) ?? cases[0];
  return (
    <ProductShell area="workspace" active="cases" crumbs={["Production", "Cases"]}>
      <PageHeader>
        <PageHeaderTitle>Cases</PageHeaderTitle>
        <PageHeaderMeta>5 open · 1 resolved this week · updates live</PageHeaderMeta>
      </PageHeader>
      <Split variant="list" showing={showing}>
        <SplitList label="Cases">
          <SplitListHead>
            <ChoiceGroup
              appearance="segments"
              hideLegend
              name="case-filter"
              legend="Show"
              options={[
                { value: "open", label: "Open" },
                { value: "all", label: "All" },
              ]}
              value={filter}
              onChange={setFilter}
            />
          </SplitListHead>
          <SplitListItems>
            {list.map((c) => (
              <SplitListItem
                key={c.n}
                title={c.title}
                meta={`Case ${c.n} · ${c.assignee ?? "unassigned"} · ${c.updated}`}
                selected={c.n === open}
                onSelect={() => {
                  setOpen(c.n);
                  setShowing("detail");
                }}
              >
                <SeverityMark level={c.severity} label={severityWords[c.severity]} />
                {c.status === "Open" ? null : <StatusPill tone="neutral">{c.status}</StatusPill>}
              </SplitListItem>
            ))}
          </SplitListItems>
        </SplitList>
        <SplitMain label={`Case ${record.n}`}>
          <SplitBack label="All cases" onBack={() => setShowing("list")} />
          {record.n === 4 ? <CaseFour record={record} /> : <CaseWithoutVerdict record={record} />}
        </SplitMain>
      </Split>
    </ProductShell>
  );
}

function CaseHeader({ record }: { record: CaseRow }) {
  return (
    <PageHeader>
      <PageHeaderTitle level={2}>{`Case ${record.n} · ${record.title}`}</PageHeaderTitle>
      <PageHeaderStatus>
        <SeverityMark
          level={record.severity}
          label={severityWords[record.severity]}
          variant={record.severity === "critical" ? "chip" : "mark"}
        />
        <StatusPill tone="neutral">
          {record.assignee ? `${record.status} · ${record.assignee}` : record.status}
        </StatusPill>
      </PageHeaderStatus>
      <PageHeaderMeta>{`Opened ${record.opened} · ${record.signals.toLocaleString("en")} signals · updates live`}</PageHeaderMeta>
    </PageHeader>
  );
}

function CaseFour({ record }: { record: CaseRow }) {
  return (
    <>
      <CaseHeader record={record} />

      <Panel emphasis label="Verdict · proved by rule 14" title={caseFour.verdict} heading={3}>
        <Stack gap={16}>
          <PanelLead>{caseFour.asks}</PanelLead>
          <MetaLine items={caseFour.path} separator="arrow" />
          <Toolbar align="start">
            <Button>Isolate srv-fs-02</Button>
            <Button variant="secondary">Reset svc-backup</Button>
            <Button variant="ghost">Set a verdict</Button>
          </Toolbar>
        </Stack>
        <PanelNote>{caseFour.reason}</PanelNote>
      </Panel>

      <FigureRow label="Case figures">
        <Figure label="Signals" value="1,064">
          12 rules
        </Figure>
        <Figure label="Hosts" value="39" tone="danger">
          36 in finance
        </Figure>
        <Figure label="Accounts" value="4">
          svc-backup most active
        </Figure>
        <Figure label="Score" value="98">
          of 100
        </Figure>
      </FigureRow>

      <Panel
        label="Story"
        title="Five phases in three days, from a leaked password to data leaving"
        heading={3}
        padded={false}
      >
        <PanelMeta>
          <TextLink href="#graph" trail="arrow">
            Attack graph
          </TextLink>
        </PanelMeta>
        <DataTable caption="Phases of case 4" narrow="stack">
          <TableHead>
            <TableColumn index>No.</TableColumn>
            <TableColumn width="fill">Phase</TableColumn>
            <TableColumn>Severity</TableColumn>
            <TableColumn align="end">Signals</TableColumn>
          </TableHead>
          <TableBody>
            {caseFour.phases.map((phase, i) => (
              <TableRow key={phase.name}>
                <TableIndex>{String(i + 1).padStart(2, "0")}</TableIndex>
                <TableCell>
                  <CellStack primary={phase.name} secondary={phase.detail} prose />
                </TableCell>
                <TableCell label="Severity">
                  <SeverityMark level={phase.severity} label={severityWords[phase.severity]} />
                </TableCell>
                <TableCell label="Signals" align="end" mono>
                  {String(phase.signals)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </Panel>

      <Panel label="Evidence" title="Latest signals" heading={3} padded={false}>
        <PanelMeta>
          <TextLink href="#signals" trail="arrow">
            All 1,064
          </TextLink>
        </PanelMeta>
        <DataTable caption="Latest signals of case 4" indexed={false} narrow="stack">
          <TableHead>
            <TableColumn>Time</TableColumn>
            <TableColumn>Severity</TableColumn>
            <TableColumn width="fill">What happened</TableColumn>
          </TableHead>
          <TableBody>
            {caseFour.signals.map((signal) => (
              <TableRow key={signal.at}>
                <TableCell mono>{signal.at}</TableCell>
                <TableCell label="Severity">
                  <SeverityMark level={signal.severity} label={severityWords[signal.severity]} />
                </TableCell>
                <TableCell>
                  <CellStack primary={signal.text} secondary={signal.source} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </Panel>

      <Panel label="Next steps" title="What the playbook asks for" heading={3}>
        <div>
          {caseFour.steps.map((step, i) => (
            <Numbered key={step} index={String(i + 1).padStart(2, "0")} variant="row">
              {step}
            </Numbered>
          ))}
        </div>
      </Panel>
    </>
  );
}

function CaseWithoutVerdict({ record }: { record: CaseRow }) {
  return (
    <>
      <CaseHeader record={record} />
      <Notice variant="empty">
        <NoticeTitle>No verdict yet</NoticeTitle>
        <NoticeBody>The analysis has not concluded on this case. Open its signals to triage it by hand.</NoticeBody>
      </Notice>
    </>
  );
}
