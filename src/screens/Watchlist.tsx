import { Building2, Globe, Mail, Plus, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "../components/actions/Button";
import { Console } from "../components/layout/shell/AppShell";
import { sampleChrome } from "../components/layout/shell/chrome.sample";
import { PageHeader, PageHeaderAside, PageHeaderTitle } from "../components/layout/PageHeader";
import { IconTile } from "../components/data/marks/IconTile";
import { Grid } from "../components/layout/Grid";
import { Stack } from "../components/layout/Stack";
import { Actions } from "../components/layout/Actions";
import { Notice, NoticeAction, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "../components/feedback/Notice";
import {
  RecordCard,
  RecordCount,
  RecordFooter,
  RecordLine,
  RecordLines,
  RecordMark,
  RecordStatus,
} from "../components/data/records/RecordCard";
import { Stat, StatRow } from "../components/data/figures/Stat";
import { StatusPill } from "../components/data/marks/StatusPill";
import { TextLink } from "../components/navigation/TextLink";
import {
  CellStack,
  DataTable,
  TableBody,
  TableCell,
  TableFooter,
  TableColumn,
  TableHead,
  TableRow,
} from "../components/data/table/DataTable";
import { SectionTitle, SectionTitleHeading, SectionTitleMeta } from "../components/layout/SectionTitle";

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
        lede="Manage the people, companies, domains, and email addresses under automatic watch."
      >
        <PageHeaderTitle>Watched identities</PageHeaderTitle>
        <PageHeaderAside>
          <StatRow>
            <Stat label="Active entries" value="08" suffix=" / 08" />
            <Stat label="System status">
              <StatusPill tone="ok" dot>
                Monitoring active
              </StatusPill>
            </Stat>
          </StatRow>
        </PageHeaderAside>
      </PageHeader>

      <Stack>
        <Grid min="200px">
          <RecordCard title="People">
            <RecordCount>4 entries watched</RecordCount>
            <RecordMark>
              <IconTile>
                <UserRound aria-hidden />
              </IconTile>
            </RecordMark>
            <RecordStatus>
              <StatusPill tone="ok">Active</StatusPill>
            </RecordStatus>
            <RecordLines>
              <RecordLine primary="Nora Feld" detail="Primary name" />
              <RecordLine primary="Dr. Nora Feld" detail="With academic title" />
              <RecordLine primary="Nora Feld-Kranz" detail="Double name" />
              <RecordLine primary="N. Feld" detail="Short form" />
            </RecordLines>
            <RecordFooter>
              <span>Status: Active</span>
              <TextLink>Valid</TextLink>
            </RecordFooter>
          </RecordCard>
          <RecordCard title="Companies">
            <RecordCount>2 entries watched</RecordCount>
            <RecordMark>
              <IconTile>
                <Building2 aria-hidden />
              </IconTile>
            </RecordMark>
            <RecordStatus>
              <StatusPill tone="ok">Active</StatusPill>
            </RecordStatus>
            <RecordLines>
              <RecordLine primary="Harthaus GmbH" detail="Full registered name" />
              <RecordLine primary="Harthaus" detail="Short form" />
            </RecordLines>
            <RecordFooter>
              <span>Status: Active</span>
              <TextLink>Valid</TextLink>
            </RecordFooter>
          </RecordCard>
          <RecordCard title="Domains">
            <RecordCount>1 entry watched</RecordCount>
            <RecordMark>
              <IconTile>
                <Globe aria-hidden />
              </IconTile>
            </RecordMark>
            <RecordStatus>
              <StatusPill tone="ok">Active</StatusPill>
            </RecordStatus>
            <RecordLines>
              <RecordLine primary="harthaus.example" detail="Primary domain" />
            </RecordLines>
            <RecordFooter>
              <span>Status: Active</span>
              <TextLink>Valid</TextLink>
            </RecordFooter>
          </RecordCard>
          <RecordCard title="Email addresses">
            <RecordCount>1 entry watched</RecordCount>
            <RecordMark>
              <IconTile>
                <Mail aria-hidden />
              </IconTile>
            </RecordMark>
            <RecordStatus>
              <StatusPill tone="ok">Active</StatusPill>
            </RecordStatus>
            <RecordLines>
              <RecordLine primary="nora.feld@data-insights.ai" detail="Verified mailbox" />
            </RecordLines>
            <RecordFooter>
              <span>Status: Active</span>
              <TextLink>Valid</TextLink>
            </RecordFooter>
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
          <SectionTitle lede="Name variants, domains, and identifiers currently under audit.">
            <SectionTitleHeading>Active watch rules</SectionTitleHeading>
            <SectionTitleMeta>8 entries active</SectionTitleMeta>
          </SectionTitle>
          <DataTable caption="Active watch rules">
            <TableFooter>
              <span>8 of 8 entries active · Last sync 5 minutes ago</span>
              <StatusPill tone="ok">Live monitoring active</StatusPill>
            </TableFooter>
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
