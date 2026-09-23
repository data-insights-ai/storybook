import { useState } from "react";
import { Globe, MoreVertical, Radar, Search, Settings2, ShieldCheck, Timer } from "lucide-react";
import { Console } from "../components/AppShell";
import { Button } from "../components/Button";
import { CommandBar, CommandGroup, CommandRow } from "../components/CommandBar";
import { PageHeader, SectionTitle } from "../components/Heading";
import {
  ConfidenceField,
  ConfirmPanel,
  ExplainPanel,
  ExplainRow,
  PrivacyBadge,
} from "../components/Inference";
import { Grid, Stack } from "../components/Layout";
import { LivingBody, LivingCard, LivingInsight, Sparkline } from "../components/LivingCard";
import { Panel } from "../components/Panel";
import { StatTile } from "../components/StatTile";
import { Toast } from "../components/Toast";
import { sampleChrome } from "../sample/chrome";

const bars = [
  { percent: 38 },
  { percent: 46 },
  { percent: 41 },
  { percent: 52 },
  { percent: 49 },
  { percent: 61 },
  { percent: 74, tone: "ink" as const },
  { percent: 96, tone: "danger" as const },
];

/**
 * Everything a model touches, on one screen: the bar it is asked through,
 * the claim it makes in place, the confirmation before anything runs, and
 * the receipt afterwards. The ring appears on all four.
 */
export function InferenceScreen() {
  const [query, setQuery] = useState("paused sources");
  const [receipt, setReceipt] = useState(true);

  return (
    <Console
      title="Inference"
      crumb={["WS-01", "Record", "Overview"]}
      active="overview"
      chrome={sampleChrome}
    >
      <Stack>
        <PageHeader
          eyebrow="§ 12 — Inference"
          title="What a model may say, and how it says it"
          lede="An output is a claim until something seals it. Every surface here marks the difference with the same hollow ring, and nothing runs before an operator agrees to it."
        />

        <SectionTitle title="The claim, in place" lede="Inside the card it concerns, never floating over it">
          <PrivacyBadge tone="local" icon={<ShieldCheck aria-hidden />}>
            local processing
          </PrivacyBadge>
        </SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16, alignItems: "start" }}>
          <LivingCard
            title="Unsealed entries"
            insightLabel="ai insight"
            actions={
              <Button variant="ghost" size="dense" iconOnly={true} aria-label="Card actions">
                <MoreVertical aria-hidden />
              </Button>
            }
          >
            <LivingBody>
              <StatTile
                index="03"
                label="Unsealed"
                value="1,284"
                delta="up 940 since 08:00Z"
                deltaTone="danger"
                compact={true}
              />
              <Sparkline
                bars={bars}
                label="Unsealed entries over the last eight hours, rising sharply in the last two."
              />
            </LivingBody>
            <LivingInsight
              body="The rise follows the pause on feed.example.io at 08:47Z. Resuming it clears the backlog."
              basis="inferred from 3 sources · confidence 0.88"
              actions={
                <>
                  <Button variant="ai" size="dense">
                    Review the proposal
                  </Button>
                  <Button variant="secondary" size="dense">
                    Open the source
                  </Button>
                  <Button variant="ghost" size="dense">
                    Dismiss
                  </Button>
                </>
              }
            />
          </LivingCard>

          <ConfirmPanel
            eyebrow="Proposed action"
            question="Resume feed.example.io?"
            whyLabel="why was this proposed?"
            onWhy={() => undefined}
            actions={
              <>
                <Button variant="secondary" size="dense">
                  Cancel
                </Button>
                <Button variant="ai" size="dense">
                  Resume
                </Button>
              </>
            }
          >
            <ExplainRow label="Basis">1,284 entries queued behind one paused host</ExplainRow>
            <ExplainRow label="Scope">1 source · WS-01</ExplainRow>
            <ExplainRow label="Reversible">Yes, the source can be paused again</ExplainRow>
          </ConfirmPanel>
        </div>

        <SectionTitle title="Asking, and being answered" lede="One field for navigating, searching and asking" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, alignItems: "start" }}>
          <CommandBar
            id="screen-command"
            label="Navigate, search or ask"
            placeholder="go to, search, or ask a question"
            value={query}
            onValueChange={setQuery}
            hints={["/ commands", "↑↓ select", "↵ open"]}
            privacyNote="local processing"
          >
            <CommandGroup label="Records">
              <CommandRow
                icon={<Radar aria-hidden />}
                label="feed.example.io"
                meta="03 · paused"
                active={true}
                onSelect={() => undefined}
              />
              <CommandRow
                icon={<Radar aria-hidden />}
                label="beta.example.dev"
                meta="11 · paused"
                onSelect={() => undefined}
              />
            </CommandGroup>
            <CommandGroup label="Answer">
              <CommandRow
                inferred={true}
                label="Two of 24 sources are paused, both on rate limits."
                meta="inferred"
                onSelect={() => undefined}
              />
            </CommandGroup>
            <CommandGroup label="Go to">
              <CommandRow icon={<Search aria-hidden />} label="Coverage" meta="G then C" onSelect={() => undefined} />
              <CommandRow icon={<Settings2 aria-hidden />} label="Settings" meta="G then S" onSelect={() => undefined} />
            </CommandGroup>
          </CommandBar>

          <Stack>
            <ExplainPanel
              heading="Why this was proposed"
              footer="This does not account for sources added in the last hour."
            >
              <ExplainRow label="Matched on">host, manifest prefix, queue depth</ExplainRow>
              <ExplainRow label="Window">2026-09-22 → 2026-09-23</ExplainRow>
              <ExplainRow label="Confidence">0.88</ExplainRow>
              <ExplainRow label="Ignored" ignored={true}>
                entries sealed before 2026-09-01
              </ExplainRow>
              <ExplainRow label="Ignored" ignored={true}>
                unsealed drafts
              </ExplainRow>
            </ExplainPanel>

            <Panel index="§" title="Where a query goes" meta="§ 12.4">
              <Grid>
                <PrivacyBadge tone="local" icon={<ShieldCheck aria-hidden />}>
                  local processing
                </PrivacyBadge>
                <PrivacyBadge tone="external" icon={<Globe aria-hidden />}>
                  model · eu-central
                </PrivacyBadge>
                <PrivacyBadge tone="retention" icon={<Timer aria-hidden />}>
                  retained 30 days
                </PrivacyBadge>
              </Grid>
            </Panel>
          </Stack>
        </div>

        <SectionTitle title="Fields that state their own confidence" lede="A rule, and the number in words" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
          <ConfidenceField
            id="screen-c-high"
            label="Resolved operator"
            confidence={0.94}
            confidenceLabel="0.94 · matched on 3 of 4 inputs"
            whyLabel="why?"
            onWhy={() => undefined}
          >
            Nora Feld
          </ConfidenceField>
          <ConfidenceField
            id="screen-c-review"
            label="Resolved host"
            tone="review"
            confidence={0.42}
            confidenceLabel="0.42 · below the threshold, review before sealing"
            whyLabel="why?"
            onWhy={() => undefined}
          >
            mirror.example.net
          </ConfidenceField>
        </div>

        {receipt ? (
          <Toast
            title="feed.example.io resumed."
            body="The queue drained at 09:16:40Z. 1,284 entries are now sealed."
            auditId="audit c18b70d4"
            onDismiss={() => setReceipt(false)}
            dismissLabel="Dismiss this receipt"
            action={
              <Button variant="secondary" size="dense">
                Open record
              </Button>
            }
          />
        ) : null}
      </Stack>
    </Console>
  );
}
