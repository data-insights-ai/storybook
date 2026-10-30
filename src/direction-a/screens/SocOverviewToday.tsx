import { Settings } from "lucide-react";
import {
  Button,
  Distribution,
  Fact,
  FactList,
  Grid,
  PageHeader,
  PageHeaderAside,
  PageHeaderStatus,
  PageHeaderTitle,
  Panel,
  PanelFooter,
  Stack,
  StatTile,
  StatTileDelta,
  StatusPill,
  TextLink,
  TrendChart,
} from "../../index";
import { ProductShell } from "./ProductShell";
import { activity, backlog, coverage, devices, failingSources, kpis } from "./soc.sample";

/** The SOC workspace overview as the product composes it today. */
export function SocOverviewToday() {
  return (
    <ProductShell product="soc" active="overview" crumbs={["Example Security GmbH", "Production"]}>
      <PageHeader
        eyebrow="Workspace"
        lede="What is open and new, whether data still arrives, and which devices keep coming back. Every figure opens the list it counts."
      >
        <PageHeaderTitle>Production</PageHeaderTitle>
        <PageHeaderStatus>
          <StatusPill tone="danger" dot>
            needs attention
          </StatusPill>
        </PageHeaderStatus>
        <PageHeaderAside>
          <Button variant="secondary">
            <Settings aria-hidden /> Settings
          </Button>
        </PageHeaderAside>
      </PageHeader>
      <Grid min="200px">
        <StatTile label="Open cases" value={String(kpis.open)} tone="danger">
          <StatTileDelta tone="danger">1 critical · 1 high</StatTileDelta>
        </StatTile>
        <StatTile label="New in 24 h" value={String(kpis.new24h)}>
          <StatTileDelta tone="warn">1 escalated</StatTileDelta>
        </StatTile>
        <StatTile label="Assigned to me" value={String(kpis.mine)}>
          <StatTileDelta tone="warn">2 unassigned</StatTileDelta>
        </StatTile>
        <StatTile label="Resolved in 7 days" value={String(kpis.resolved7d)} />
      </Grid>
      <Grid min="420px">
        <Panel title="Detection activity, 7 days">
          <Stack>
            <TrendChart
              label="Detections per 6 hours"
              data={activity}
              series={[{ key: "detections", label: "Detections", kind: "area" }]}
              formatX={(v) => v.slice(0, 6)}
            />
            <FactList layout="columns">
              <Fact label="Time to acknowledge (median, 7 d)">{kpis.mtta}</Fact>
              <Fact label="Time to resolve (median, 7 d)">{kpis.mttr}</Fact>
            </FactList>
          </Stack>
        </Panel>
        <Panel title="Backlog by age and severity">
          <Stack>
            <Distribution
              rows={backlog.map((b) => ({ label: b.label, value: String(b.value), percent: (b.value / 3) * 100, tone: b.value > 1 ? "warn" : "neutral" }))}
              totalLabel="Open cases"
              totalValue="3"
            />
            <Distribution
              rows={[
                { label: "Critical", value: "1", percent: 33, tone: "danger" },
                { label: "High", value: "1", percent: 33, tone: "danger" },
                { label: "Medium", value: "1", percent: 33, tone: "warn" },
                { label: "Low", value: "0", percent: 0 },
                { label: "Info", value: "0", percent: 0 },
              ]}
              totalLabel="Open cases"
              totalValue="3"
            />
          </Stack>
        </Panel>
        <Panel title="Most affected devices">
          <Distribution
            rows={devices.map((d) => ({ label: `${d.name} · ${d.criticality}`, value: `${d.cases} case`, percent: 100, tone: d.severity === "critical" ? "danger" : "warn" }))}
            totalLabel="Highest severity"
            totalValue="Critical"
          />
          <PanelFooter>
            <TextLink href="#assets">View all assets</TextLink>
          </PanelFooter>
        </Panel>
        <Panel title="Sources">
          <Stack gap={12}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <StatusPill tone="ok" dot>11 collecting</StatusPill>
              <StatusPill tone="danger" dot>2 failing</StatusPill>
              <StatusPill tone="neutral" dot>1 paused</StatusPill>
            </div>
            <FactList>
              {failingSources.map((s) => (
                <Fact key={s.name} label={s.name}>
                  {s.reason} · last data {s.last}
                </Fact>
              ))}
            </FactList>
          </Stack>
          <PanelFooter>
            <TextLink href="#sources">View all sources</TextLink>
          </PanelFooter>
        </Panel>
      </Grid>
      <Panel title="Data coverage">
        <Stack gap={12}>
          <p>3 tables the AI SOC reads do not arrive or fell silent; the detections that need them cannot be made.</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {coverage.map((c) => (
              <StatusPill key={c.table} tone={c.state === "missing" ? "danger" : c.state === "silent" ? "warn" : "ok"} dot>
                {c.table} · {c.state === "missing" ? "not delivered" : c.state === "silent" ? "silent for a day" : "arriving"}
              </StatusPill>
            ))}
          </div>
        </Stack>
      </Panel>
      <Grid min="280px">
        <Panel title="Notifications">
          <FactList layout="inline">
            <Fact label="Destinations">2</Fact>
            <Fact label="Active">2</Fact>
            <Fact label="Failing">0</Fact>
          </FactList>
        </Panel>
        <Panel title="SIEM exports">
          <FactList layout="inline">
            <Fact label="Destinations">2</Fact>
            <Fact label="Active">2</Fact>
            <Fact label="Failing">1</Fact>
          </FactList>
        </Panel>
        <Panel title="Access">
          <FactList layout="inline">
            <Fact label="With access">8</Fact>
          </FactList>
        </Panel>
      </Grid>
    </ProductShell>
  );
}
