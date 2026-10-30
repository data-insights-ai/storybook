import {
  AttentionItem,
  AttentionList,
  Briefing,
  BriefingAside,
  BriefingMark,
  BriefingMeta,
  BriefingStatus,
  Button,
  Figure,
  FigureRow,
  HeroFigure,
  SeverityMark,
  StatusPill,
  Surface,
  SurfaceAside,
  SurfaceFooter,
  SurfaceTakeaway,
  TextLink,
  TrendChart,
} from "../../index";
import { ProductShell } from "./ProductShell";
import { activity, coverage, devices, kpis } from "./soc.sample";
import "./screens.css";

/**
 * The same overview in Direction A: a head that only orients (the name,
 * its state, as of when), then the point itself — what needs the reader,
 * ranked under "3 things need you", the first item carrying the action —
 * then the one hero (detections on the navy zone) with the figures that
 * support it as its footer, then health in one quiet row.
 *
 * For comparison, `header="claim"` puts a claim sentence and the action in
 * the head (variants H-a and H-b), and `figures="strip"` sets the figures
 * on a tonal band of their own under the hero.
 */
export function SocOverviewA({ header = "orientation", figures = "hero" }: { header?: "orientation" | "claim"; figures?: "hero" | "strip" }) {
  const claimed = header === "claim";
  const missing = coverage.filter((c) => c.state !== "arriving");
  const figureRow = (
    <FigureRow label="Supporting figures" variant={figures === "strip" ? "strip" : "plain"}>
      <Figure label="New in 24 h" value={String(kpis.new24h)}>
        1 escalated
      </Figure>
      <Figure label="Unassigned" value={String(kpis.unassigned)} tone="warn">
        of 3 open
      </Figure>
      <Figure label="Time to acknowledge" value={kpis.mtta}>
        median · 7 days
      </Figure>
      <Figure label="Time to resolve" value={kpis.mttr}>
        median · 7 days
      </Figure>
    </FigureRow>
  );
  return (
    <ProductShell product="soc" active="overview" crumbs={["Example Security GmbH", "Production"]}>
      <div className="dir-a-page">
        {claimed ? (
          <Briefing context="Workspace" title="Production" ruled>
            Two things need you: <BriefingMark>a critical case nobody has taken</BriefingMark>, and two sources stopped
            delivering.
            <BriefingStatus>
              <StatusPill tone="danger" dot>
                Needs attention
              </StatusPill>
            </BriefingStatus>
            <BriefingMeta>As of 12 Oct, 10:00 · 14 sources · 3 open cases · updates live</BriefingMeta>
            <BriefingAside>
              <Button>Open case 4</Button>
            </BriefingAside>
          </Briefing>
        ) : (
          <Briefing title="Production">
            <BriefingStatus>
              <StatusPill tone="danger" dot>
                Needs attention
              </StatusPill>
            </BriefingStatus>
            <BriefingMeta>As of 12 Oct, 10:00 · 14 sources · updates live</BriefingMeta>
          </Briefing>
        )}

        <AttentionList label="What needs you, most urgent first" title={claimed ? undefined : "3 things need you"}>
          <AttentionItem
            rank="01"
            emphasis
            emphasisLabel="Start here"
            severity="critical"
            severityLabel="Critical"
            title="Case 4 · leaked VPN credentials, moving through finance"
            reason="Data is leaving srv-fs-02 for cloud storage. The case is in progress but nobody has acknowledged the last escalation."
            meta="Opened 7 h ago · 1,064 signals · 39 hosts"
          >
            {claimed ? <TextLink href="#case-4">Open the case</TextLink> : <Button href="#case-4">Open case 4</Button>}
          </AttentionItem>
          <AttentionItem
            rank="02"
            severity="high"
            severityLabel="High"
            title="Two sources stopped delivering"
            reason="Identity sign-ins lost its read permission; mail audit was never set up. Sign-in detections are blind."
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

        <Surface level="hero" label="Detections · last 7 days" title="Three bursts this week, the largest on 9 October">
          <SurfaceAside>
            <TextLink href="#cases">All cases</TextLink>
          </SurfaceAside>
          <div className="dir-a-hero">
            <div className="dir-a-hero-figures">
              <HeroFigure label="Open cases" value={String(kpis.open)}>
                <span className="dir-a-sevline">
                  <SeverityMark level="critical" label="1 critical" />
                  <SeverityMark level="high" label="1 high" />
                  <SeverityMark level="medium" label="1 medium" />
                </span>
              </HeroFigure>
            </div>
            <div className="dir-a-hero-chart">
              <TrendChart
                label="Detections per 6 hours, last 7 days"
                height="lg"
                data={activity}
                series={[{ key: "detections", label: "Detections", kind: "bar" }]}
                formatX={(v) => v.replace(":00", "h").replace(/ (\d\d)h$/, " $1h")}
              />
            </div>
          </div>
          {figures === "hero" ? <SurfaceFooter>{figureRow}</SurfaceFooter> : null}
        </Surface>

        {figures === "strip" ? figureRow : null}

        <div className="dir-a-two">
          <Surface label="Devices" title="Three of the four devices with cases are critical">
            <SurfaceAside>
              <TextLink href="#assets">All assets</TextLink>
            </SurfaceAside>
            <ul className="dir-a-rows">
              {devices.map((d) => (
                <li key={d.name}>
                  <span className="dir-a-mono">{d.name}</span>
                  <span className="dir-a-muted">{d.criticality}</span>
                  <SeverityMark level={d.severity} label={d.severity === "critical" ? "Critical" : "Medium"} />
                </li>
              ))}
            </ul>
          </Surface>
          <Surface label="Coverage" title={`${missing.length} of ${coverage.length} tables are not arriving`}>
            <SurfaceAside>
              <TextLink href="#sources">Sources</TextLink>
            </SurfaceAside>
            <ul className="dir-a-rows">
              {missing.map((c) => (
                <li key={c.table}>
                  <span>{c.table}</span>
                  <StatusPill tone={c.state === "missing" ? "danger" : "warn"} dot>
                    {c.state === "missing" ? "Not delivered" : "Silent for a day"}
                  </StatusPill>
                </li>
              ))}
            </ul>
            <SurfaceTakeaway>Without them, certificate and account detections cannot fire.</SurfaceTakeaway>
          </Surface>
        </div>

        <section className="dir-a-health" aria-label="Health">
          <p className="dir-a-label">Delivery</p>
          <p>
            Notifications <strong>2 of 2</strong> active
          </p>
          <p>
            SIEM exports <strong>1 of 2</strong> delivering
          </p>
          <p>
            Access <strong>8</strong> people and service accounts
          </p>
        </section>
      </div>
    </ProductShell>
  );
}
