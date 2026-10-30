import { LogOut, Mail, ShieldCheck, Webhook } from "lucide-react";
import {
  Bars,
  Button,
  Channel,
  ChannelSpecs,
  ChannelStatus,
  ChannelValue,
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
  Panel,
  Session,
  SessionAction,
  SessionDetail,
  SessionMark,
  SessionTag,
  Stack,
  StatTile,
  StatusPill,
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
              <Button variant="secondary" size="sm">
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
          <PageHeader level={2} lede="Active endpoints for security events">
            <PageHeaderTitle>Notification channels</PageHeaderTitle>
            <PageHeaderMeta>Synced</PageHeaderMeta>
          </PageHeader>
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
            <StatTile label="Notification availability, last 30 days, every channel" value="99.98%" />
            <Bars values={days} highlight={16} startLabel="30 days ago" midLabel="Full operation" endLabel="Today" />
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
