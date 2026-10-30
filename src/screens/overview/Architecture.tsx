import { Database, LockKeyhole, Network, Radar, Share2, Workflow, AlertTriangle } from "lucide-react";
import {
  Button,
  Fact,
  FactList,
  Grid,
  Notice,
  NoticeAction,
  NoticeBody,
  NoticeIcon,
  NoticeText,
  NoticeTitle,
  Page,
  PageHeader,
  PageHeaderMeta,
  PageHeaderStatus,
  PageHeaderTitle,
  Panel,
  PanelStatus,
  Stack,
  StatusPill,
  Step,
  StepFooter,
  StepIcon,
  Steps,
} from "../..";
import { ProductShell } from "../shell/ProductShell";

export type ArchitectureState = "running" | "backlog";

const stages = [
  {
    id: "capture",
    title: "Collection",
    body: "Isolated connections to the connected sources.",
    foot: "9 collectors",
    icon: <Radar aria-hidden />,
  },
  {
    id: "process",
    title: "Processing",
    body: "Normalising, filtering and unpacking raw records.",
    foot: "4 workers",
    icon: <Workflow aria-hidden />,
  },
  {
    id: "store",
    title: "Ledger",
    body: "An append-only ledger with its transaction log.",
    foot: "PostgreSQL 17",
    icon: <Database aria-hidden />,
  },
  {
    id: "graph",
    title: "Correlation",
    body: "Links between records, references and timelines.",
    foot: "Graph engine",
    icon: <Share2 aria-hidden />,
  },
  {
    id: "workspace",
    title: "Workspace",
    body: "Review, search and editing by analysts.",
    foot: "Read-only client",
    icon: <LockKeyhole aria-hidden />,
  },
];

/**
 * Architecture: how a record travels from a source to the analyst, and how
 * each part of the pipeline is doing. The pipeline is the page's argument;
 * when one stage falls behind it becomes the current step and the first
 * block says what it costs.
 */
export function ArchitectureScreen({ state = "running" }: { state?: ArchitectureState }) {
  const backlog = state === "backlog";
  return (
    <ProductShell area="workspace" active="settings" crumbs={["Example Security GmbH", "Production", "Architecture"]}>
      <Page width="full">
        <PageHeader>
          <PageHeaderTitle>Architecture</PageHeaderTitle>
          <PageHeaderStatus>
            {backlog ? (
              <StatusPill tone="warn">Processing behind</StatusPill>
            ) : (
              <StatusPill tone="ok">All services ready</StatusPill>
            )}
          </PageHeaderStatus>
          <PageHeaderMeta>{["Updated 08:37 CEST", "cluster West-1"]}</PageHeaderMeta>
        </PageHeader>

        {backlog ? (
          <Notice tone="warn">
            <NoticeIcon>
              <AlertTriangle aria-hidden />
            </NoticeIcon>
            <NoticeText>
              <NoticeTitle>Processing is 41 minutes behind.</NoticeTitle>
              <NoticeBody>
                12,480 records wait for a worker; detections on them run late until the queue drains.
              </NoticeBody>
            </NoticeText>
            <NoticeAction>
              <Button variant="secondary" size="sm">
                Add a worker
              </Button>
            </NoticeAction>
          </Notice>
        ) : null}

        <Stack gap={16}>
          <PageHeader
            level={2}
            lede="A record passes every stage in order; no client reaches a collector or the ledger."
          >
            <PageHeaderTitle>Pipeline</PageHeaderTitle>
          </PageHeader>
          <Steps variant="cards" label="Pipeline stages">
            {stages.map((stage) => (
              <Step
                key={stage.id}
                title={stage.title}
                state={backlog && stage.id === "process" ? "current" : undefined}
              >
                <StepIcon>{stage.icon}</StepIcon>
                {stage.body}
                <StepFooter>{backlog && stage.id === "process" ? "12,480 waiting" : stage.foot}</StepFooter>
              </Step>
            ))}
          </Steps>
        </Stack>

        <Stack gap={16}>
          <PageHeader level={2}>
            <PageHeaderTitle>Services</PageHeaderTitle>
          </PageHeader>
          <Grid min="280px">
            <Panel title="API" heading={3}>
              <PanelStatus>
                <StatusPill tone="ok">ready</StatusPill>
              </PanelStatus>
              <FactList layout="pairs">
                <Fact label="Version">4.18.2</Fact>
                <Fact label="Uptime, 30 days">99.98%</Fact>
                <Fact label="Protocol">HTTPS, TLS 1.3</Fact>
                <Fact label="Response, median">2 ms</Fact>
              </FactList>
            </Panel>
            <Panel title="Queue" heading={3}>
              <PanelStatus>
                {backlog ? <StatusPill tone="warn">behind</StatusPill> : <StatusPill tone="ok">ready</StatusPill>}
              </PanelStatus>
              <FactList layout="pairs">
                <Fact label="Waiting">{backlog ? "12,480" : "0"}</Fact>
                <Fact label="Oldest record">{backlog ? "41 min" : "none"}</Fact>
                <Fact label="Processed today">1.9 M</Fact>
                <Fact label="Workers">4 of 4 busy</Fact>
              </FactList>
            </Panel>
            <Panel title="Ledger" heading={3}>
              <PanelStatus>
                <StatusPill tone="ok">ready</StatusPill>
              </PanelStatus>
              <FactList layout="pairs">
                <Fact label="Load">12%</Fact>
                <Fact label="Memory">1.4 of 8 GB</Fact>
                <Fact label="Last seal">08:36:58</Fact>
                <Fact label="Replicas">2 in sync</Fact>
                <Fact label="Diagnostics">passed at 08:30</Fact>
              </FactList>
            </Panel>
          </Grid>
          <div>
            <Button variant="secondary">
              <Network aria-hidden />
              Run diagnostics
            </Button>
          </div>
        </Stack>
      </Page>
    </ProductShell>
  );
}
