import { ArrowUpRight } from "lucide-react";
import {
  AttentionItem,
  AttentionList,
  Briefing,
  BriefingMeta,
  BriefingStatus,
  Button,
  Figure,
  FigureRow,
  MetaLine,
  StatusPill,
  Surface,
  SurfaceAside,
  TextLink,
  TrendChart,
} from "../../index";
import { ProductShell } from "./ProductShell";
import { allRunning, audit, can, credits, firstDue, people, products, roleNames, team, type PortalState, type Role } from "./portal.sample";
import "./screens.css";

/**
 * The organization's home in Direction A, ordered by why people come. The
 * head only orients; the point is the first block: a due decision the
 * viewer can act on, as the one gold item under "1 decision is due", or
 * else one quiet line that everything runs. Then the
 * products to open, then cost, then the team and recent changes as quiet
 * lists. What shows follows the viewer's permissions: licences and cost
 * for those who manage billing, the team for those who may see members,
 * recent changes for those who may read the audit log. A plain member
 * sees the claim and their products.
 */
export function PortalHomeA({ role = "owner", state = allRunning }: { role?: Role; state?: PortalState }) {
  const due = firstDue(state, role);
  const user = people[role];
  return (
    <ProductShell product="portal" active="overview" crumbs={["Example Security GmbH", "Overview"]} role={role} user={user}>
      <div className="dir-a-page">
        <Briefing title="Example Security GmbH">
          {due ? (
            <BriefingStatus>
              <StatusPill tone="warn" dot>
                Decision due
              </StatusPill>
            </BriefingStatus>
          ) : null}
          <BriefingMeta>{`As of 12 Oct, 10:00 · ${roleNames[role]}`}</BriefingMeta>
        </Briefing>

        {due ? null : (
          <p className="dir-a-calm">
            <span>Everything is running</span>
            <MetaLine className="dir-a-calm-meta" items={runningNote(role, state)} />
          </p>
        )}

        {due ? (
          <AttentionList label="Due" title="1 decision is due">
            <AttentionItem rank="01" emphasis emphasisLabel={due.deadline} title={due.title} reason={due.reason} meta={due.meta}>
              <Button>{due.action}</Button>
            </AttentionItem>
          </AttentionList>
        ) : null}

        <Surface label="Your products" title="Open a product">
          <ul className="dir-a-products">
            {products.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`} className="dir-a-product">
                  <span>
                    <span className="dir-a-product-name">{p.name}</span>
                    <span className="dir-a-muted">{can.billing(role) ? p.owner : p.member}</span>
                  </span>
                  <ArrowUpRight aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </Surface>

        {can.billing(role) ? (
          <section className="dir-a-health" aria-label="Licences">
            <p className="dir-a-label">Licences</p>
            <p>
              <strong>{state.licencesActive}</strong> active
            </p>
            <p>
              next renewal <strong>{state.nextRenewal}</strong>
            </p>
            <TextLink href="#licences">Products & licences</TextLink>
          </section>
        ) : null}

        {can.billing(role) ? (
          <Surface label="Credit" title="Enough for about three months">
            <SurfaceAside>
              <TextLink href="#credits">Credits</TextLink>
            </SurfaceAside>
            <div className="dir-a-cost">
              <FigureRow label="Credit and use" variant="strip">
                <Figure label="Balance" value="182.5">
                  credits · topped up 8 Oct
                </Figure>
                <Figure label="Use per day" value="2">
                  credits · last 30 days
                </Figure>
                <Figure label="Ingested" value="270 GB">
                  last 30 days
                </Figure>
              </FigureRow>
              <TrendChart label="Credit balance, last 30 days" height="sm" data={credits} series={[{ key: "balance", label: "Balance", kind: "area" }]} />
            </div>
          </Surface>
        ) : null}

        {can.team(role) || can.audit(role) ? (
          <div className="dir-a-two">
            {can.team(role) ? (
              <section className="dir-a-quiet" aria-labelledby="dir-a-team">
                <div className="dir-a-quiet-head">
                  <h2 id="dir-a-team" className="dir-a-quiet-title">
                    Team
                  </h2>
                  {can.manageTeam(role) ? <TextLink href="#members">Members</TextLink> : null}
                </div>
                <ul className="dir-a-rows">
                  {team.map((m) => (
                    <li key={m.name}>
                      <span>
                        {m.name}
                        {m.name === user ? <span className="dir-a-muted"> · you</span> : null}
                      </span>
                      <span className="dir-a-muted">{m.role}</span>
                    </li>
                  ))}
                </ul>
                {can.manageTeam(role) ? <p className="dir-a-muted">1 invitation open</p> : null}
              </section>
            ) : null}
            {can.audit(role) ? (
              <section className="dir-a-quiet" aria-labelledby="dir-a-changes">
                <div className="dir-a-quiet-head">
                  <h2 id="dir-a-changes" className="dir-a-quiet-title">
                    Recent changes
                  </h2>
                  <TextLink href="#audit">Audit log</TextLink>
                </div>
                <ul className="dir-a-rows">
                  {audit.slice(0, 4).map((a) => (
                    <li key={a.when}>
                      <span>{a.what}</span>
                      <span className="dir-a-mono dir-a-muted">{a.when}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </ProductShell>
  );
}

function runningNote(role: Role, state: PortalState) {
  if (can.billing(role)) return ["nothing to decide before " + state.nextRenewal];
  if (can.manageTeam(role)) return ["1 invitation still open"];
  return ["your products are ready"];
}
