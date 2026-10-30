import { ExternalLink, Pencil } from "lucide-react";
import {
  Button,
  Fact,
  FactList,
  Grid,
  PageHeader,
  PageHeaderStatus,
  PageHeaderTitle,
  Panel,
  PanelMeta,
  SectionTitle,
  SectionTitleHeading,
  Stack,
  StatusPill,
  TextLink,
  TrendChart,
} from "../../index";
import { ProductShell } from "./ProductShell";
import { audit, credits, licenses, members, seats, triage } from "./portal.sample";

/** The organization's home in the account portal as it is composed today. */
export function PortalHomeToday() {
  return (
    <ProductShell product="portal" active="overview" crumbs={["Example Security GmbH", "Overview"]}>
      <PageHeader lede="What needs attention in Example Security GmbH: its people, seats, credit and subscription, and the products to open.">
        <PageHeaderTitle>Example Security GmbH</PageHeaderTitle>
        <PageHeaderStatus>
          <StatusPill tone="neutral">Company</StatusPill>
          <StatusPill tone="recorded">You: Owner</StatusPill>
        </PageHeaderStatus>
      </PageHeader>
      <Panel title="Your products">
        <PanelMeta>
          <TextLink href="#products">Manage products</TextLink>
        </PanelMeta>
        <Stack gap={12}>
          <p>Open the products this organization uses.</p>
          <div>
            <Button variant="secondary">
              AI SOC <ExternalLink aria-hidden />
            </Button>
          </div>
        </Stack>
      </Panel>
      <SectionTitle lede="The last 30 days. Each card links to the page where you change it.">
        <SectionTitleHeading>At a glance</SectionTitleHeading>
      </SectionTitle>
      <Grid min="300px">
        <Panel title="Seats · 4 of 5 in use">
          <TrendChart label="Seats in use" height="sm" data={seats} series={[{ key: "used", label: "AI SOC" }, { key: "capacity", label: "Seats", tone: "warn", dashed: true }]} />
        </Panel>
        <Panel title="Balance · 182.5 credits">
          <TrendChart label="Credit balance" height="sm" data={credits} series={[{ key: "balance", label: "Balance", kind: "area" }]} />
        </Panel>
        <Panel title="Members · 4 members">
          <TrendChart label="Members" height="sm" data={members} series={[{ key: "members", label: "Members" }, { key: "invitations", label: "Open invitations", tone: "compare" }]} />
        </Panel>
        <Panel title="AI triage · 520">
          <TrendChart label="AI triage runs" height="sm" data={triage} series={[{ key: "runs", label: "Runs", kind: "bar" }]} />
        </Panel>
      </Grid>
      <Panel title="Licenses and subscription">
        <FactList>
          {licenses.map((l) => (
            <Fact key={l.name} label={l.name}>
              valid until {l.until}
            </Fact>
          ))}
          <Fact label="Subscription: AI SOC S">renews on 23 Oct 2026</Fact>
        </FactList>
      </Panel>
      <Panel title="Recent changes">
        <FactList>
          {audit.map((a) => (
            <Fact key={a.when} label={`${a.when} · ${a.who}`}>
              {a.what}
            </Fact>
          ))}
        </FactList>
      </Panel>
      <Panel title="General">
        <PanelMeta>
          <Button variant="secondary" size="dense">
            <Pencil aria-hidden /> Edit
          </Button>
        </PanelMeta>
        <FactList layout="columns">
          <Fact label="Name">Example Security GmbH</Fact>
          <Fact label="Kind">Company</Fact>
          <Fact label="Your role">Owner</Fact>
          <Fact label="Created">2 Sep 2026</Fact>
        </FactList>
      </Panel>
    </ProductShell>
  );
}
