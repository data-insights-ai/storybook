import {
  AttentionItem,
  AttentionList,
  Button,
  Figure,
  FigureRow,
  Grid,
  KeyValue,
  KeyValues,
  PageHeader,
  PageHeaderMeta,
  PageHeaderStatus,
  PageHeaderTitle,
  Panel,
  PanelMeta,
  PanelNote,
  MetaLine,
  Notice,
  NoticeBody,
  NoticeTitle,
  StatusPill,
  TextLink,
  TrendChart,
} from "../../index";
import { ProductShell } from "../shell/ProductShell";
import type { Role } from "../shell/shell.sample";
import {
  allRunning,
  audit,
  can,
  credits,
  firstDue,
  people,
  products,
  roleNames,
  team,
  type OrganizationState,
} from "./home.sample";

/**
 * An organization's home, ordered by why people come. The header orients;
 * the first block is the point: the one decision the viewer can act on, as
 * the gold item, or one quiet line that everything runs. Then the products
 * to open, then cost, then the team and recent changes. What shows follows
 * the viewer's role: cost for those who manage billing, the team for those
 * who may see members, changes for those who may read the audit log. A
 * member sees the line and their products.
 */
export function OrganizationHome({ role = "owner", state = allRunning }: { role?: Role; state?: OrganizationState }) {
  const due = firstDue(state, role);
  const user = people[role];
  return (
    <ProductShell
      area="organization"
      active="overview"
      crumbs={["Example Security GmbH", "Overview"]}
      role={role}
      user={user}
    >
      <PageHeader>
        <PageHeaderTitle>Example Security GmbH</PageHeaderTitle>
        {due ? (
          <PageHeaderStatus>
            <StatusPill tone="warn" dot={true}>
              Decision due
            </StatusPill>
          </PageHeaderStatus>
        ) : null}
        <PageHeaderMeta>{["As of 12 Oct, 10:00", roleNames[role]]}</PageHeaderMeta>
      </PageHeader>

      {due ? (
        <AttentionList label="Due" title="1 decision is due">
          <AttentionItem
            rank="01"
            emphasis
            emphasisLabel={due.deadline}
            title={due.title}
            reason={due.reason}
            meta={due.meta}
          >
            <Button>{due.action}</Button>
          </AttentionItem>
        </AttentionList>
      ) : (
        <Notice variant="line" tone="ok">
          <NoticeTitle>Everything is running</NoticeTitle>
          <NoticeBody>
            <MetaLine items={calm(role, state)} />
          </NoticeBody>
        </Notice>
      )}

      <Panel label="Your products" title="Open a product" heading={2}>
        <Grid min="260px">
          {products.map((product) => (
            <Panel key={product.id} surface="inset" title={product.name} heading={3}>
              {can.billing(role) ? product.owner : product.member}
              <PanelNote>
                <TextLink href={`#${product.id}`}>{`Open ${product.name}`}</TextLink>
              </PanelNote>
            </Panel>
          ))}
        </Grid>
      </Panel>

      {can.billing(role) ? (
        <Panel label="Credit" title="Enough for about three months" heading={2}>
          <PanelMeta>
            <TextLink href="#credits">Credits</TextLink>
          </PanelMeta>
          <Grid min="300px">
            <FigureRow label="Credit and use">
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
            <TrendChart
              label="Credit balance, last 30 days"
              height="sm"
              data={credits}
              series={[{ key: "balance", label: "Balance", kind: "area" }]}
            />
          </Grid>
        </Panel>
      ) : null}

      {can.team(role) || can.audit(role) ? (
        <Grid min="320px">
          {can.team(role) ? (
            <Panel label="Team" title={`${team.length} members`} heading={2}>
              {can.manageTeam(role) ? (
                <PanelMeta>
                  <TextLink href="#members">Members</TextLink>
                </PanelMeta>
              ) : null}
              <KeyValues>
                {team.map((member) => (
                  <KeyValue
                    key={member.name}
                    term={member.name === user ? `${member.name} (you)` : member.name}
                    value={member.role}
                  />
                ))}
              </KeyValues>
              {can.manageTeam(role) ? <PanelNote>1 invitation is open.</PanelNote> : null}
            </Panel>
          ) : null}
          {can.audit(role) ? (
            <Panel label="Recent changes" title="Last change 2 days ago" heading={2}>
              <PanelMeta>
                <TextLink href="#audit">Audit log</TextLink>
              </PanelMeta>
              <KeyValues>
                {audit.map((change) => (
                  <KeyValue key={change.when} term={change.when} value={change.what} />
                ))}
              </KeyValues>
            </Panel>
          ) : null}
        </Grid>
      ) : null}
    </ProductShell>
  );
}

function calm(role: Role, state: OrganizationState) {
  if (can.billing(role))
    return `${state.licencesActive} licences active · nothing to decide before ${state.nextRenewal}`;
  if (can.manageTeam(role)) return "1 invitation still open";
  return "your products are ready";
}
