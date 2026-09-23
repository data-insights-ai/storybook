import { Building2, Globe, Mail, Plus, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "../components/Button";
import { Console } from "../components/AppShell";
import { sampleChrome } from "../sample/chrome";
import { PageHeader, SectionTitle } from "../components/Heading";
import { IconTile } from "../components/IconTile";
import { Grid, Stack, Actions } from "../components/Layout";
import { Notice, NoticeAction, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "../components/Notice";
import { RecordCard, RecordLine } from "../components/RecordCard";
import { Stat, StatRow } from "../components/Stat";
import { StatusPill } from "../components/StatusPill";
import { TextLink } from "../components/TextLink";
import {
  CellStack,
  DataTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableRow,
} from "../components/DataTable";

type Identity = {
  id: string;
  name: string;
  detail: string;
  category: string;
  added: string;
};

const identities: Identity[] = [
  { id: "p1", name: "nora feld", detail: "Normalized full name", category: "Person", added: "12 Jan 2024" },
  { id: "p2", name: "dr. nora feld", detail: "Title prefix", category: "Person", added: "12 Jan 2024" },
  { id: "p3", name: "nora feld-kranz", detail: "Double name", category: "Person", added: "14 Jan 2024" },
  { id: "p4", name: "n. feld", detail: "Short form", category: "Person", added: "14 Jan 2024" },
  { id: "c1", name: "harthaus gmbh", detail: "Registered legal form", category: "Company", added: "18 Jan 2024" },
  { id: "c2", name: "harthaus", detail: "Short form", category: "Company", added: "18 Jan 2024" },
  { id: "d1", name: "harthaus.example", detail: "Primary web domain", category: "Domain", added: "20 Jan 2024" },
  { id: "e1", name: "nora.feld@data-insights.ai", detail: "Verified mailbox", category: "Email", added: "22 Jan 2024" },
];

export function WatchlistScreen() {
  return (
    <Console title="Watchlist" crumb={["Monitor", "Watchlist"]} active="watchlist" chrome={sampleChrome}>
      <PageHeader
        eyebrow="Watchlist"
        title="Watched identities"
        lede="Manage the people, companies, domains, and email addresses under automatic watch."
      >
        <StatRow>
          <Stat label="Active entries" value="08" suffix=" / 08" />
          <Stat label="System status">
            <StatusPill tone="ok" dot>
              Monitoring active
            </StatusPill>
          </Stat>
        </StatRow>
      </PageHeader>

      <Stack>
        <Grid min="200px">
          <RecordCard
            title="People"
            count="4 entries watched"
            mark={
              <IconTile>
                <UserRound aria-hidden />
              </IconTile>
            }
            status={<StatusPill tone="ok">Active</StatusPill>}
            footer={
              <>
                <span>Status: Active</span>
                <TextLink>Valid</TextLink>
              </>
            }
          >
            <RecordLine primary="Nora Feld" detail="Primary name" />
            <RecordLine primary="Dr. Nora Feld" detail="With academic title" />
            <RecordLine primary="Nora Feld-Kranz" detail="Double name" />
            <RecordLine primary="N. Feld" detail="Short form" />
          </RecordCard>
          <RecordCard
            title="Companies"
            count="2 entries watched"
            mark={
              <IconTile>
                <Building2 aria-hidden />
              </IconTile>
            }
            status={<StatusPill tone="ok">Active</StatusPill>}
            footer={
              <>
                <span>Status: Active</span>
                <TextLink>Valid</TextLink>
              </>
            }
          >
            <RecordLine primary="Harthaus GmbH" detail="Full registered name" />
            <RecordLine primary="Harthaus" detail="Short form" />
          </RecordCard>
          <RecordCard
            title="Domains"
            count="1 entry watched"
            mark={
              <IconTile>
                <Globe aria-hidden />
              </IconTile>
            }
            status={<StatusPill tone="ok">Active</StatusPill>}
            footer={
              <>
                <span>Status: Active</span>
                <TextLink>Valid</TextLink>
              </>
            }
          >
            <RecordLine primary="harthaus.example" detail="Primary domain" />
          </RecordCard>
          <RecordCard
            title="Email addresses"
            count="1 entry watched"
            mark={
              <IconTile>
                <Mail aria-hidden />
              </IconTile>
            }
            status={<StatusPill tone="ok">Active</StatusPill>}
            footer={
              <>
                <span>Status: Active</span>
                <TextLink>Valid</TextLink>
              </>
            }
          >
            <RecordLine primary="nora.feld@data-insights.ai" detail="Verified mailbox" />
          </RecordCard>
        </Grid>

        <Notice tone="ok">
          <NoticeIcon>
            <ShieldCheck aria-hidden />
          </NoticeIcon>
          <NoticeText>
            <NoticeTitle>Protection is active</NoticeTitle>
            <NoticeBody>Watched entries are checked continuously against the connected sources.</NoticeBody>
          </NoticeText>
          <NoticeAction>
            <Button>
              <Plus aria-hidden />
              Add entry
            </Button>
          </NoticeAction>
        </Notice>

        <section>
          <SectionTitle
            title="Active watch rules"
            lede="Name variants, domains, and identifiers currently under audit."
          >
            8 entries active
          </SectionTitle>
          <DataTable
            caption="Active watch rules"
            footer={
              <>
                <span>8 of 8 entries active · Last sync 5 minutes ago</span>
                <StatusPill tone="ok">Live monitoring active</StatusPill>
              </>
            }
          >
            <TableHead>
              <TableColumn>Identity / query</TableColumn>
              <TableColumn>Category</TableColumn>
              <TableColumn>Added</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn align="end">Actions</TableColumn>
            </TableHead>
            <TableBody>
              {identities.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <CellStack primary={row.name} secondary={row.detail} />
                  </TableCell>
                  <TableCell>
                    <StatusPill tone="neutral" dot={false}>
                      {row.category}
                    </StatusPill>
                  </TableCell>
                  <TableCell>{row.added}</TableCell>
                  <TableCell>
                    <StatusPill tone="ok">Active</StatusPill>
                  </TableCell>
                  <TableCell align="end">
                    <Actions>
                      <Button size="dense" variant="secondary">
                        Pause
                      </Button>
                      <Button size="dense" variant="danger" aria-label={`Remove ${row.name}`}>
                        Remove
                      </Button>
                    </Actions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </section>

        <Notice>
          <NoticeText>
            <NoticeTitle>Administration and access</NoticeTitle>
            <NoticeBody>
              Adding or changing a watched identity requires an administrator. Changes are written to the audit log.
            </NoticeBody>
          </NoticeText>
        </Notice>
      </Stack>
    </Console>
  );
}
