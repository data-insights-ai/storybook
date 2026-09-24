import {
  Database,
  LockKeyhole,
  Network,
  Radar,
  Share2,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Button } from "../components/Button";
import { Console } from "../components/AppShell";
import { sampleChrome } from "../sample/chrome";
import { PageHeader } from "../components/Heading";
import { Grid, Numbered, Stack } from "../components/Layout";
import { Metric } from "../components/Metric";
import { Stage, StageIcon, StageTrack } from "../components/Stage";
import { Notice, NoticeAction, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "../components/Notice";
import { StatusPill } from "../components/StatusPill";
import { KeyValue, KeyValues } from "../components/KeyValues";
import { SectionTitle } from "../components/SectionTitle";

const stages = [
  {
    id: "capture",
    step: "Stage 1",
    title: "Collection",
    body: "Isolated connections to the connected sources.",
    foot: "9 source nodes",
    icon: <Radar aria-hidden />,
    current: false,
  },
  {
    id: "process",
    step: "Stage 2",
    title: "Processing",
    body: "Workers. Normalisation, filtering, and unpacking of raw records.",
    foot: "Payload Decoder",
    icon: <Workflow aria-hidden />,
    current: false,
  },
  {
    id: "store",
    step: "Stage 3",
    title: "Secure database",
    body: "PostgreSQL. An append-only primary ledger and a transaction log.",
    foot: "Audit-proof Storage",
    icon: <Database aria-hidden />,
    current: true,
  },
  {
    id: "graph",
    step: "Stage 4",
    title: "Correlation graph",
    body: "Links between records, references, and timelines.",
    foot: "Graph engine active",
    icon: <Share2 aria-hidden />,
    current: false,
  },
  {
    id: "workspace",
    step: "Stage 5",
    title: "Analyst workspace",
    body: "Review, search, and editing in the workspace.",
    foot: "Read-only client",
    icon: <LockKeyhole aria-hidden />,
    current: false,
  },
];

export function ArchitectureScreen() {
  return (
    <Console
      title="Architecture"
      crumb={["Operate", "Architecture"]}
      active="architecture"
      chrome={sampleChrome}
    >
      <PageHeader
        eyebrow="System overview / infrastructure and pipeline"
        title="System architecture and data flow"
        lede="Intake, processing stages, and storage."
      >
        <StatusPill tone="ok">All services ready</StatusPill>
      </PageHeader>

      <Stack>
        <Notice>
          <NoticeIcon>
            <ShieldCheck aria-hidden />
          </NoticeIcon>
          <NoticeText>
            <NoticeTitle>Administrative access</NoticeTitle>
            <NoticeBody>
              Traffic between interfaces is encrypted and signed. It runs through isolated nodes with role-based access.
            </NoticeBody>
          </NoticeText>
        </Notice>

        <Numbered index="01">
          <SectionTitle title="Five-stage pipeline" lede="End-to-end data flow">
            Sync active
          </SectionTitle>
          <StageTrack>
            {stages.map((stage) => (
              <Stage
                key={stage.id}
                step={stage.step}
                title={stage.title}
                body={stage.body}
                foot={stage.foot}
                current={stage.current}
              >
                <StageIcon>{stage.icon}</StageIcon>
              </Stage>
            ))}
          </StageTrack>
          <Notice>
            <NoticeText>
              <NoticeTitle>Security boundary</NoticeTitle>
              <NoticeBody>
                Web clients do not reach collectors or graph stores directly. They talk only to authenticated API gateways, with tight rate limits.
              </NoticeBody>
            </NoticeText>
          </Notice>
        </Numbered>

        <Numbered index="02">
          <SectionTitle title="System status and performance" lede="Component monitoring">
            Updated: today, 08:37 CEST
          </SectionTitle>
          <Grid min="220px">
            <Metric label="API and service status" figure="Version 4.18" note="Node 22 LTS">
              <KeyValues>
                <KeyValue term="Uptime" value="99.98%" />
                <KeyValue term="Protocol" value="HTTPS / TLS 1.3" />
                <KeyValue term="Cluster" value="West-1 · active" />
              </KeyValues>
            </Metric>
            <Metric label="Indexing and queue" figure="0 waiting" note="No backlog">
              <KeyValues>
                <KeyValue term="Events today" value="19 processed" />
                <KeyValue term="Queue status" value="Optimal" />
                <KeyValue term="Sync" value="No errors" />
              </KeyValues>
            </Metric>
            <Metric label="Latency and performance" figure="Response 2 ms" note="Normal (12%)">
              <KeyValues>
                <KeyValue term="Memory" value="1.4 GB / 8 GB" />
                <KeyValue term="State" value="Stable" />
                <KeyValue term="24h average" value="3 ms" />
              </KeyValues>
            </Metric>
          </Grid>
          <Notice>
            <NoticeText>
              <NoticeBody>Every diagnostic check passed.</NoticeBody>
            </NoticeText>
            <NoticeAction>
              <Button size="dense">
                <Network aria-hidden />
                Run diagnostics
              </Button>
            </NoticeAction>
          </Notice>
        </Numbered>
      </Stack>
    </Console>
  );
}



