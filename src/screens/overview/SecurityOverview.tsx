import {
  AttentionItem,
  AttentionList,
  Button,
  DataTable,
  Figure,
  FigureRow,
  Grid,
  HeroFigure,
  PageHeader,
  PageHeaderMeta,
  PageHeaderStatus,
  PageHeaderTitle,
  Panel,
  PanelActions,
  PanelFigure,
  PanelFooter,
  PanelMeta,
  PanelNote,
  PanelVisual,
  SeverityMark,
  StatusPill,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
  TextLink,
  TrendChart,
} from "../../index";
import { ProductShell } from "../shell/ProductShell";
import { coverage, delivery, detections, devices, figures } from "./overview.sample";

/**
 * A workspace's overview. The header only orients: the name, its state, as
 * of when. The first block is the point — what needs the reader, ranked,
 * the first item carrying the page's one button. Then the one hero, the
 * detections chart, closed by the figures that support it. Then the two
 * lists behind the attention items, and delivery as one quiet line.
 */
export function SecurityOverview() {
  return (
    <ProductShell area="workspace" active="overview" crumbs={["Example Security GmbH", "Production"]}>
      <PageHeader>
        <PageHeaderTitle>Production</PageHeaderTitle>
        <PageHeaderStatus>
          <StatusPill tone="danger" dot={true}>
            Needs attention
          </StatusPill>
        </PageHeaderStatus>
        <PageHeaderMeta>As of 12 Oct, 10:00 · 14 sources · updates live</PageHeaderMeta>
      </PageHeader>

      <AttentionList label="What needs you, most urgent first" title="3 things need you">
        <AttentionItem
          rank="01"
          emphasis
          emphasisLabel="Start here"
          severity="critical"
          severityLabel="Critical"
          title="Case 4 · leaked VPN credentials, moving through finance"
          reason="Data is leaving srv-fs-02 for cloud storage. The case is in progress, but nobody has acknowledged the last escalation."
          meta="Opened 7 h ago · 1,064 signals · 39 hosts"
        >
          <Button href="#case-4">Open case 4</Button>
        </AttentionItem>
        <AttentionItem
          rank="02"
          severity="high"
          severityLabel="High"
          title="Two sources stopped delivering"
          reason="Identity sign-ins lost its read permission and mail audit was never set up, so sign-in detections are blind."
          meta="Last data 7.2 h ago"
        >
          <TextLink href="#sources">Fix the sources</TextLink>
        </AttentionItem>
        <AttentionItem
          rank="03"
          severity="medium"
          severityLabel="Medium"
          title="One SIEM export is failing"
          reason="The forwarder rejects the token; 3,412 findings wait to be delivered."
          meta="14 failures since 06:10"
        >
          <TextLink href="#siem">Open SIEM export</TextLink>
        </AttentionItem>
      </AttentionList>

      <Panel
        surface="hero"
        heading={2}
        label="Detections · last 7 days"
        title="Three bursts this week, the largest on Friday"
      >
        <PanelActions>
          <TextLink href="#cases">All cases</TextLink>
        </PanelActions>
        <PanelFigure>
          <HeroFigure label="Open cases" value={String(figures.open)}>
            <SeverityMark level="critical" label="1 critical" />
            <SeverityMark level="high" label="1 high" />
            <SeverityMark level="medium" label="1 medium" />
          </HeroFigure>
        </PanelFigure>
        <PanelVisual>
          <TrendChart
            label="Detections per 6 hours, last 7 days"
            height="lg"
            data={detections}
            series={[{ key: "detections", label: "Detections", kind: "bar" }]}
          />
        </PanelVisual>
        <PanelFooter>
          <FigureRow label="Supporting figures" variant="footer">
            <Figure label="New in 24 h" value={String(figures.new24h)}>
              1 escalated
            </Figure>
            <Figure label="Unassigned" value={String(figures.unassigned)} tone="warn">
              of 3 open
            </Figure>
            <Figure label="Time to acknowledge" value={figures.acknowledge}>
              median · 7 days
            </Figure>
            <Figure label="Time to resolve" value={figures.resolve}>
              median · 7 days
            </Figure>
          </FigureRow>
        </PanelFooter>
      </Panel>

      <Grid min="360px">
        <Panel label="Devices" title="Three of the four devices with cases are critical" heading={2} padded={false}>
          <PanelMeta>
            <TextLink href="#assets">All assets</TextLink>
          </PanelMeta>
          <DataTable caption="Devices with open cases" indexed={false}>
            <TableHead>
              <TableColumn>Device</TableColumn>
              <TableColumn>Criticality</TableColumn>
              <TableColumn width="fill">Severity</TableColumn>
            </TableHead>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.name}>
                  <TableCell mono>{device.name}</TableCell>
                  <TableCell>{device.criticality}</TableCell>
                  <TableCell>
                    <SeverityMark level={device.severity} label={device.word} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </Panel>
        <Panel label="Coverage" title="3 of 12 tables are not arriving" heading={2} padded={false}>
          <PanelMeta>
            <TextLink href="#sources">Sources</TextLink>
          </PanelMeta>
          <DataTable caption="Tables that are not arriving" indexed={false}>
            <TableHead>
              <TableColumn width="fill">Table</TableColumn>
              <TableColumn>State</TableColumn>
            </TableHead>
            <TableBody>
              {coverage.map((row) => (
                <TableRow key={row.table}>
                  <TableCell>{row.table}</TableCell>
                  <TableCell>
                    <StatusPill tone={row.state === "missing" ? "danger" : "warn"} dot={true}>
                      {row.since}
                    </StatusPill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
          <PanelNote>Without them, certificate and account detections cannot fire.</PanelNote>
        </Panel>
      </Grid>

      <FigureRow label="Delivery" variant="strip" size="compact">
        {delivery.map((figure) => (
          <Figure key={figure.label} label={figure.label} value={figure.value} tone={figure.tone} />
        ))}
      </FigureRow>
    </ProductShell>
  );
}
