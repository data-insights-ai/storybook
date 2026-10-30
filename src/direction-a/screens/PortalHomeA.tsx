import { ArrowUpRight } from "lucide-react";
import {
  Briefing,
  BriefingAside,
  BriefingMark,
  BriefingMeta,
  Button,
  Figure,
  FigureRow,
  HeroFigure,
  StatusPill,
  Surface,
  SurfaceAside,
  SurfaceTakeaway,
  TextLink,
  TrendChart,
} from "../../index";
import { ProductShell } from "./ProductShell";
import { audit, credits, licenses } from "./portal.sample";
import "./screens.css";

/**
 * The organization's home in Direction A: one sentence on whether anything
 * needs the owner, the products to open as the first thing to reach, the
 * one decision in gold, then the figures that support it.
 */
export function PortalHomeA() {
  return (
    <ProductShell product="portal" active="overview" crumbs={["Example Security GmbH", "Overview"]}>
      <div className="dir-a-page">
        <Briefing context="Organization" title="Example Security GmbH" ruled>
          Everything runs. One decision this month: <BriefingMark>the Team add-on ends in 11 days</BriefingMark>, and
          three of your five seats with it.
          <BriefingMeta>Company · you are the owner · 4 members · as of 12 Oct</BriefingMeta>
          <BriefingAside>
            <Button>Renew the add-on</Button>
          </BriefingAside>
        </Briefing>

        <div className="dir-a-two">
          <Surface label="Your products" title="Open a product">
            <ul className="dir-a-products">
              <li>
                <a href="#soc" className="dir-a-product">
                  <span>
                    <span className="dir-a-product-name">AI SOC</span>
                    <span className="dir-a-muted">Professional · 4 of 5 seats</span>
                  </span>
                  <ArrowUpRight aria-hidden />
                </a>
              </li>
              <li>
                <a href="#reports" className="dir-a-product">
                  <span>
                    <span className="dir-a-product-name">Reports</span>
                    <span className="dir-a-muted">Open to every member</span>
                  </span>
                  <ArrowUpRight aria-hidden />
                </a>
              </li>
            </ul>
          </Surface>
          <Surface emphasis label="Decide by 23 Oct" title="Licenses">
            <SurfaceAside>
              <TextLink href="#licenses">Products & licenses</TextLink>
            </SurfaceAside>
            <ul className="dir-a-rows">
              {licenses.map((l) => (
                <li key={l.name}>
                  <span>
                    {l.name} <span className="dir-a-muted">· {l.seats} seats</span>
                  </span>
                  <StatusPill tone={l.tone} dot>
                    {l.left} left
                  </StatusPill>
                </li>
              ))}
            </ul>
            <SurfaceTakeaway>Without the add-on, 2 seats remain for 4 members.</SurfaceTakeaway>
          </Surface>
        </div>

        <FigureRow label="The last 30 days">
          <Figure label="Seats in use" value="4 of 5">
            3 end on 23 Oct
          </Figure>
          <Figure label="Members" value="4">
            1 invitation open
          </Figure>
          <Figure label="AI triage runs" value="520">
            last 30 days
          </Figure>
          <Figure label="Ingested" value="270 GB">
            last 30 days
          </Figure>
        </FigureRow>

        <div className="dir-a-two">
          <Surface label="Credit" title="Enough for about three months">
            <SurfaceAside>
              <TextLink href="#credits">Credits</TextLink>
            </SurfaceAside>
            <HeroFigure label="Balance" value="182.5" unit="credits">
              About 2 credits a day · topped up on 8 Oct
            </HeroFigure>
            <TrendChart label="Credit balance, last 30 days" height="sm" data={credits} series={[{ key: "balance", label: "Balance", kind: "area" }]} />
          </Surface>
          <Surface label="Audit log" title="Recent changes">
            <SurfaceAside>
              <TextLink href="#audit">Audit log</TextLink>
            </SurfaceAside>
            <ul className="dir-a-rows">
              {audit.map((a) => (
                <li key={a.when}>
                  <span>{a.what}</span>
                  <span className="dir-a-mono dir-a-muted">{a.when}</span>
                </li>
              ))}
            </ul>
          </Surface>
        </div>
      </div>
    </ProductShell>
  );
}
