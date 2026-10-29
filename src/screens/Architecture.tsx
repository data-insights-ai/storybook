import {
  Database,
  LockKeyhole,
  Network,
  Radar,
  Share2,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import {
  Button,
  Console,
  Grid,
  KeyValue,
  KeyValues,
  Metric,
  MetricNote,
  Notice,
  NoticeAction,
  NoticeBody,
  NoticeIcon,
  NoticeText,
  NoticeTitle,
  Numbered,
  PageHeader,
  PageHeaderAside,
  PageHeaderTitle,
  SectionTitle,
  SectionTitleHeading,
  SectionTitleMeta,
  Stack,
  Stage,
  StageFooter,
  StageIcon,
  StageTrack,
  StatusPill,
} from "..";
import { sampleChrome } from "../components/shell/chrome.sample";

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
        lede="Intake, processing stages, and storage."
      >
        <PageHeaderTitle>System architecture and data flow</PageHeaderTitle>
        <PageHeaderAside>
          <StatusPill tone="ok">All services ready</StatusPill>
        </PageHeaderAside>
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
          <SectionTitle lede="End-to-end data flow">
            <SectionTitleHeading>Five-stage pipeline</SectionTitleHeading>
            <SectionTitleMeta>Sync active</SectionTitleMeta>
          </SectionTitle>
          <StageTrack>
            {stages.map((stage) => (
              <Stage
                key={stage.id}
                step={stage.step}
                title={stage.title}
                body={stage.body}
                current={stage.current}
              >
                <StageIcon>{stage.icon}</StageIcon>
                <StageFooter>{stage.foot}</StageFooter>
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
          <SectionTitle lede="Component monitoring">
            <SectionTitleHeading>System status and performance</SectionTitleHeading>
            <SectionTitleMeta>Updated: today, 08:37 CEST</SectionTitleMeta>
          </SectionTitle>
          <Grid min="220px">
            <Metric label="API and service status" figure="Version 4.18">
              <MetricNote>Node 22 LTS</MetricNote>
              <KeyValues>
                <KeyValue term="Uptime" value="99.98%" />
                <KeyValue term="Protocol" value="HTTPS / TLS 1.3" />
                <KeyValue term="Cluster" value="West-1 · active" />
              </KeyValues>
            </Metric>
            <Metric label="Indexing and queue" figure="0 waiting">
              <MetricNote>No backlog</MetricNote>
              <KeyValues>
                <KeyValue term="Events today" value="19 processed" />
                <KeyValue term="Queue status" value="Optimal" />
                <KeyValue term="Sync" value="No errors" />
              </KeyValues>
            </Metric>
            <Metric label="Latency and performance" figure="Response 2 ms">
              <MetricNote>Normal (12%)</MetricNote>
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



