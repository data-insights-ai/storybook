import { useState } from "react";
import {
  Briefing,
  BriefingMeta,
  BriefingStatus,
  Button,
  CellStack,
  DataTable,
  Figure,
  FigureRow,
  ListDetail,
  ListDetailBack,
  ListDetailHead,
  ListDetailItem,
  ListDetailList,
  ListDetailPane,
  SegmentedControl,
  SeverityMark,
  StatusPill,
  Surface,
  SurfaceAside,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
  TextLink,
} from "../../index";
import { ProductShell } from "./ProductShell";
import { caseFour, cases } from "./soc.sample";
import "./screens.css";

const words = { critical: "Critical", high: "High", medium: "Medium", low: "Low", info: "Info" } as const;

/**
 * Cases in Direction A: the permanent split. The list stays on the left,
 * sorted by severity; the open case is on the right. Its head only orients
 * (name, severity, state); the first block is the AI SOC's verdict with the
 * action it asks for and the proof, then the figures, then the evidence.
 */
export function SocCasesA({ showing: initial = "list" }: { showing?: "list" | "detail" }) {
  const [filter, setFilter] = useState("open");
  const [open, setOpen] = useState(4);
  const [showing, setShowing] = useState<"list" | "detail">(initial);
  const rank = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  const list = cases
    .filter((c) => (filter === "open" ? c.status !== "Resolved" : true))
    .sort((a, b) => rank[a.severity] - rank[b.severity]);
  const record = cases.find((c) => c.n === open)!;
  return (
    <ProductShell product="soc" active="cases" crumbs={["Production", "Cases"]}>
      <h1 className="di-sr">Cases</h1>
      <ListDetail showing={showing}>
        <ListDetailList label="Cases">
          <ListDetailHead>
            <p className="dir-a-label">Cases · {list.length}</p>
            <SegmentedControl
              name="case-filter"
              legend="Show"
              options={[
                { value: "open", label: "Open" },
                { value: "all", label: "All" },
              ]}
              value={filter}
              onChange={setFilter}
            />
          </ListDetailHead>
          {list.map((c) => (
            <ListDetailItem
              key={c.n}
              title={c.title}
              meta={`Case ${c.n} · ${c.assignee ?? "unassigned"} · ${c.updated}`}
              selected={c.n === open}
              onSelect={() => {
                setOpen(c.n);
                setShowing("detail");
              }}
            >
              <SeverityMark level={c.severity} label={words[c.severity]} />
              {c.status === "Open" ? null : <StatusPill tone="neutral">{c.status}</StatusPill>}
            </ListDetailItem>
          ))}
        </ListDetailList>

        <ListDetailPane label={`Case ${record.n}`}>
          <ListDetailBack label="All cases" onBack={() => setShowing("list")} />
          {record.n === 4 ? <CaseFour /> : <OtherCase n={record.n} title={record.title} />}
        </ListDetailPane>
      </ListDetail>
    </ProductShell>
  );
}

function CaseFour() {
  return (
    <>
      <Briefing heading={2} title="Case 4 · leaked VPN credentials used to move through the finance network">
        <BriefingStatus>
          <SeverityMark level="critical" label="Critical" variant="chip" />
          <StatusPill tone="neutral">In progress · Sam Analyst</StatusPill>
        </BriefingStatus>
        <BriefingMeta>Opened 7 h ago · 1,064 signals · updates live</BriefingMeta>
      </Briefing>

      <Surface emphasis heading={3} label="Verdict of the AI SOC · proved by rule 14" title={caseFour.verdict}>
        <p className="dir-a-ask">
          <span className="dir-a-one-words">{keepIdentifiers(caseFour.action)}</span>
        </p>
        <div className="dir-a-actions">
          <Button>Isolate srv-fs-02</Button>
          <Button variant="secondary">Reset svc-backup</Button>
          <Button variant="ghost">Set a verdict</Button>
        </div>
        <ol className="dir-a-path" aria-label="Path">
          {caseFour.path.map((hop) => (
            <li key={hop}>{hop}</li>
          ))}
        </ol>
        <p className="dir-a-muted">{caseFour.reason}</p>
      </Surface>

      <FigureRow label="Case figures" variant="strip">
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

      <Surface label="Story" title="Five phases in three days, from a leaked password to data leaving">
        <SurfaceAside>
          <TextLink href="#graph">Attack graph</TextLink>
        </SurfaceAside>
        <ol className="dir-a-phases">
          {caseFour.phases.map((p, i) => (
            <li key={p.name}>
              <span className="dir-a-phase-n" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="dir-a-phase-name">{p.name}</p>
                <p className="dir-a-muted">{p.detail}</p>
              </div>
              <span className="dir-a-phase-meta">
                <SeverityMark level={p.severity} label={words[p.severity]} />
                <span className="dir-a-mono dir-a-muted">{p.signals} signals</span>
              </span>
            </li>
          ))}
        </ol>
      </Surface>

      <Surface label="Evidence" title="Latest signals" padded={false}>
        <SurfaceAside>
          <TextLink href="#signals">All 1,064</TextLink>
        </SurfaceAside>
        <DataTable caption="Latest signals of case 4" indexed={false} narrow="stack">
          <TableHead>
            <TableColumn>Time</TableColumn>
            <TableColumn>Severity</TableColumn>
            <TableColumn>What happened</TableColumn>
          </TableHead>
          <TableBody>
            {caseFour.signals.map((s) => (
              <TableRow key={s.at}>
                <TableCell mono>{s.at}</TableCell>
                <TableCell label="Severity">
                  <SeverityMark level={s.severity} label={words[s.severity]} />
                </TableCell>
                <TableCell label="What happened">
                  <CellStack primary={s.text} secondary={s.source} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </Surface>

      <Surface label="Next steps" title="What the playbook asks for">
        <ol className="dir-a-steps">
          {caseFour.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </Surface>
    </>
  );
}

function OtherCase({ n, title }: { n: number; title: string }) {
  return (
    <>
      <Briefing heading={2} title={`Case ${n} · ${title}`} />
      <p className="dir-a-calm">
        <span>No verdict yet</span>
        <span className="dir-a-calm-meta">Open the signals to triage it by hand.</span>
      </p>
    </>
  );
}

/** Host and account names such as srv-fs-02 never break at their hyphens. */
function keepIdentifiers(text: string) {
  return text.split(/(\S*\w-\w\S*)/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="dir-a-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
