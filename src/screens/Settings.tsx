import { LogOut, Mail, ShieldCheck, Webhook } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Console } from "../components/AppShell";
import { sampleChrome } from "../sample/chrome";
import { PageHeader } from "../components/Heading";
import { Grid, Numbered, Stack } from "../components/Layout";
import { Metric, MetricNote } from "../components/Metric";
import { Bars } from "../components/Bars";
import { Channel, ChannelSpecs, ChannelStatus, ChannelValue } from "../components/Channel";
import { Session, SessionDetail, SessionAction, SessionMark, SessionTag } from "../components/Session";
import { IconTile } from "../components/IconTile";
import { Notice, NoticeAction, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "../components/Notice";
import { StatusPill } from "../components/StatusPill";
import { SectionTitle } from "../components/SectionTitle";

const days = [46, 62, 70, 80, 58, 90, 84, 76, 88, 64, 72, 86, 91, 77, 69, 95, 100, 82, 74, 88, 93, 70, 81, 96, 85, 78, 90, 87, 73, 92];

export function SettingsScreen() {
  return (
    <Console title="Settings" crumb={["Operate", "Settings"]} active="settings" chrome={sampleChrome}>
      <PageHeader
        eyebrow="Session"
        title="Settings and session"
        lede="The signed-in session, notification channels, and security checks."
      >
        <StatusPill tone="ok">Company environment active</StatusPill>
      </PageHeader>

      <Stack>
        <Numbered index="01">
          <Session name="Nora Feld">
<SessionDetail>nora.feld@data-insights.ai · Valid until 22 Sep 2026</SessionDetail>
            <SessionMark>
              <IconTile variant="inverse">
                <span aria-hidden>NF</span>
              </IconTile>
            </SessionMark>
            <SessionTag>
              <StatusPill tone="neutral" dot={false}>
                Administrator
              </StatusPill>
            </SessionTag>
            <SessionAction>
              <Button variant="secondary" size="dense">
                <LogOut aria-hidden />
                Sign out
              </Button>
            </SessionAction>
          </Session>
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
          <SectionTitle title="Notification channels" lede="Active endpoints for security events">
            Synced
          </SectionTitle>
          <Grid min="240px">
            <Channel title="Email notifications">
              <ChannelStatus>
                <StatusPill tone="ok">Enabled</StatusPill>
              </ChannelStatus>
              <ChannelValue>
                <Mail aria-hidden />
                n****@data-insights.ai
              </ChannelValue>
              <ChannelSpecs>
                <span>Routing: primary inbox</span>
                <span>TLS 1.3 encrypted</span>
              </ChannelSpecs>
            </Channel>
            <Channel title="Webhook">
              <ChannelStatus>
                <StatusPill tone="ok">Enabled</StatusPill>
              </ChannelStatus>
              <ChannelValue>
                <Webhook aria-hidden />
                https://hooks.data-insights.ai/events
              </ChannelValue>
              <ChannelSpecs>
                <span>Format: JSON</span>
                <span>HMAC-SHA256 signed</span>
              </ChannelSpecs>
            </Channel>
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

          <SectionTitle
            title="Recent security events"
            lede="New hit on a domain · medium · email sent · webhook received"
          >
            10 Sep 2026, 14:37 CEST
          </SectionTitle>
          <SectionTitle title="Security report created" lede="High · email sent · webhook received">
            10 Sep 2026, 14:30 CEST
          </SectionTitle>
        </Numbered>

        <Card>
          <Grid min="220px">
            <Metric label="Notification availability" figure="99.98%">
              <MetricNote>
                Availability of the notification service over the last 30 days, across every
                configured channel.
              </MetricNote>
            </Metric>
            <Bars
              values={days}
              highlight={16}
              startLabel="30 days ago"
              midLabel="Full operation"
              endLabel="Today"
            />
          </Grid>
        </Card>

        <SectionTitle title="Security status: checked">ISO/IEC 27001 · privacy rules applied</SectionTitle>
      </Stack>
    </Console>
  );
}
