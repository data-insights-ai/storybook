import { LogOut, Mail, ShieldCheck, Webhook } from "lucide-react";
import {
  Sparkline,
  Button,
  Fact,
  FactList,
  Grid,
  IconTile,
  Notice,
  NoticeAction,
  NoticeBody,
  NoticeIcon,
  NoticeText,
  NoticeTitle,
  Numbered,
  PageHeader,
  PageHeaderAside,
  PageHeaderMeta,
  PageHeaderTitle,
  RecordActions,
  RecordCard,
  RecordDetail,
  RecordMark,
  RecordStatus,
  RecordValue,
  Stack,
  StatusPill,
  Panel,
  Figure,
} from "../..";

const days = [
  46, 62, 70, 80, 58, 90, 84, 76, 88, 64, 72, 86, 91, 77, 69, 95, 100, 82, 74, 88, 93, 70, 81, 96, 85, 78, 90, 87, 73,
  92,
];

export function SettingsScreen() {
  return (
    <>
      <PageHeader eyebrow="Session" lede="The signed-in session, notification channels, and security checks.">
        <PageHeaderTitle>Settings and session</PageHeaderTitle>
        <PageHeaderAside>
          <StatusPill tone="ok">Company environment active</StatusPill>
        </PageHeaderAside>
      </PageHeader>

      <Stack>
        <Numbered index="01">
          <RecordCard title="Nora Feld" layout="row" heading={false}>
            <RecordDetail>nora.feld@data-insights.ai · Valid until 22 Sep 2026</RecordDetail>
            <RecordMark>
              <IconTile variant="inverse">
                <span aria-hidden>NF</span>
              </IconTile>
            </RecordMark>
            <RecordStatus>
              <StatusPill tone="neutral" dot={false}>
                Administrator
              </StatusPill>
            </RecordStatus>
            <RecordActions>
              <Button variant="secondary" size="sm">
                <LogOut aria-hidden />
                Sign out
              </Button>
            </RecordActions>
          </RecordCard>
          <Notice>
            <NoticeText>
              <NoticeBody>Two-factor authentication active · hardware token confirmed</NoticeBody>
            </NoticeText>
            <NoticeAction>
              <StatusPill tone="ok">Conformity checked</StatusPill>
            </NoticeAction>
          </Notice>
        </Numbered>

        <Numbered index="02">
          <PageHeader level={2} lede="Active endpoints for security events">
            <PageHeaderTitle>Notification channels</PageHeaderTitle>
            <PageHeaderMeta>Synced</PageHeaderMeta>
          </PageHeader>
          <Grid min="240px">
            <RecordCard title="Email notifications">
              <RecordStatus>
                <StatusPill tone="ok">Enabled</StatusPill>
              </RecordStatus>
              <RecordValue>
                <Mail aria-hidden />
                n****@data-insights.ai
              </RecordValue>
              <FactList layout="pairs">
                <Fact label="Routing">Primary inbox</Fact>
                <Fact label="Transport">TLS 1.3</Fact>
              </FactList>
            </RecordCard>
            <RecordCard title="Webhook">
              <RecordStatus>
                <StatusPill tone="ok">Enabled</StatusPill>
              </RecordStatus>
              <RecordValue>
                <Webhook aria-hidden />
                https://hooks.data-insights.ai/events
              </RecordValue>
              <FactList layout="pairs">
                <Fact label="Format">JSON</Fact>
                <Fact label="Signature" mono>
                  HMAC-SHA256
                </Fact>
              </FactList>
            </RecordCard>
          </Grid>

          <Notice tone="warn">
            <NoticeIcon>
              <ShieldCheck aria-hidden />
            </NoticeIcon>
            <NoticeText>
              <NoticeTitle>Centrally managed policy</NoticeTitle>
              <NoticeBody>
                Webhook endpoints are changed in the company security portal. Local editing is off for this tenant.
              </NoticeBody>
            </NoticeText>
          </Notice>

          <PageHeader level={2} lede="New hit on a domain · medium · email sent · webhook received">
            <PageHeaderTitle>Recent security events</PageHeaderTitle>
            <PageHeaderMeta>10 Sep 2026, 14:37 CEST</PageHeaderMeta>
          </PageHeader>
          <PageHeader level={2} lede="High · email sent · webhook received">
            <PageHeaderTitle>Security report created</PageHeaderTitle>
            <PageHeaderMeta>10 Sep 2026, 14:30 CEST</PageHeaderMeta>
          </PageHeader>
        </Numbered>

        <Panel>
          <Grid min="220px">
            <Figure label="Notification availability, last 30 days, every channel" value="99.98%" />
            <Sparkline
              values={days}
              highlight={16}
              width="fill"
              height="md"
              captions={["30 days ago", "Full operation", "Today"]}
              label="Notification availability per day over the last 30 days, one dip 16 days ago."
            />
          </Grid>
        </Panel>

        <PageHeader level={2}>
          <PageHeaderTitle>Security status: checked</PageHeaderTitle>
          <PageHeaderMeta>ISO/IEC 27001 · privacy rules applied</PageHeaderMeta>
        </PageHeader>
      </Stack>
    </>
  );
}
