import { useState } from "react";
import { LogOut, Mail, ShieldCheck, Webhook } from "lucide-react";
import {
  Button,
  DetailSection,
  Fact,
  FactList,
  Grid,
  IconTile,
  Notice,
  NoticeBody,
  NoticeIcon,
  NoticeText,
  NoticeTitle,
  Page,
  PageHeader,
  PageHeaderMeta,
  PageHeaderTitle,
  RecordActions,
  RecordCard,
  RecordDetail,
  RecordMark,
  RecordStatus,
  RecordValue,
  Select,
  Stack,
  StatusPill,
  Switch,
  Toolbar,
  ToolbarEnd,
  ToolbarStatus,
} from "../..";

type Rules = { keep: string; purge: boolean };
const stored: Rules = { keep: "90", purge: true };

/**
 * A workspace's settings: what it keeps, where it reports, and who is
 * signed in. A changed rule is held until Save in the bar at the window's
 * foot; channels a company policy manages say so in their own section.
 */
export function SettingsScreen({ changed = false }: { changed?: boolean }) {
  const [saved, setSaved] = useState<Rules>(stored);
  const [rules, setRules] = useState<Rules>(changed ? { ...stored, keep: "180" } : stored);
  const dirty = rules.keep !== saved.keep || rules.purge !== saved.purge;

  return (
    <Page width="detail">
      <PageHeader lede="What this workspace keeps, where it reports, and who is signed in.">
        <PageHeaderTitle>Settings</PageHeaderTitle>
        <PageHeaderMeta>Last changed 28 Oct, 14:02 by Jonas Brandt</PageHeaderMeta>
      </PageHeader>

      <DetailSection title="Data retention" lede="How long the workspace keeps what its sources send.">
        <Stack variant="form">
          <Select
            id="screen-keep"
            label="Keep raw events for"
            hint="Cases keep the events they cite for as long as the case exists."
            mono={false}
            value={rules.keep}
            onChange={(e) => setRules({ ...rules, keep: e.target.value })}
          >
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="180">180 days</option>
          </Select>
        </Stack>
        <Switch
          id="screen-purge"
          layout="row"
          title="Delete closed cases after one year"
          description="The audit log keeps that they existed and who closed them."
          on={rules.purge}
          onToggle={(purge) => setRules({ ...rules, purge })}
        />
      </DetailSection>

      <DetailSection title="Notification channels" lede="Where security events are sent as they happen.">
        <Grid min="260px">
          <RecordCard title="Email" heading={3}>
            <RecordStatus>
              <StatusPill tone="ok">Delivering</StatusPill>
            </RecordStatus>
            <RecordValue>
              <Mail aria-hidden />
              soc-team@data-insights.ai
            </RecordValue>
            <FactList layout="pairs">
              <Fact label="Severity">High and above</Fact>
              <Fact label="Last sent">Today, 09:12</Fact>
            </FactList>
          </RecordCard>
          <RecordCard title="Webhook" heading={3}>
            <RecordStatus>
              <StatusPill tone="ok">Delivering</StatusPill>
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
        <Notice>
          <NoticeIcon>
            <ShieldCheck aria-hidden />
          </NoticeIcon>
          <NoticeText>
            <NoticeTitle>Managed by your company&apos;s security policy</NoticeTitle>
            <NoticeBody>Channels are added and changed in the security portal, not here.</NoticeBody>
          </NoticeText>
        </Notice>
      </DetailSection>

      <DetailSection title="Your session" lede="Signed in on this device with a hardware key.">
        <RecordCard title="Nora Feld" layout="row" heading={false}>
          <RecordMark>
            <IconTile variant="inverse">
              <span aria-hidden>NF</span>
            </IconTile>
          </RecordMark>
          <RecordDetail>nora.feld@data-insights.ai · session ends 22:00</RecordDetail>
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
      </DetailSection>

      {dirty ? (
        <Toolbar label="Unsaved changes" role="region" frame="bar" sticky="bottom">
          <ToolbarStatus>Retention changed and is not saved yet.</ToolbarStatus>
          <ToolbarEnd>
            <Button variant="secondary" onClick={() => setRules(saved)}>
              Discard
            </Button>
            <Button onClick={() => setSaved(rules)}>Save changes</Button>
          </ToolbarEnd>
        </Toolbar>
      ) : null}
    </Page>
  );
}
