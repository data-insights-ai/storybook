import { useState } from "react";
import { Globe, MoreVertical, Radar, Search, Settings2, ShieldCheck, Timer } from "lucide-react";
import {
  Button,
  CommandBar,
  CommandGroup,
  CommandRow,
  ConfirmActions,
  ConfirmPanel,
  ExplainFooter,
  ExplainIgnored,
  ExplainPanel,
  ExplainRow,
  Figure,
  FigureRow,
  LivingActions,
  LivingBasis,
  LivingBody,
  LivingCard,
  LivingInsight,
  PageHeader,
  PageHeaderTitle,
  Panel,
  PrivacyBadge,
  Sparkline,
  TextField,
  Toast,
  ToastAction,
  ToastRegion,
} from "../..";
import { ProductShell } from "../shell/ProductShell";
import "./Inference.css";

const bars = [
  { percent: 38 },
  { percent: 46 },
  { percent: 41 },
  { percent: 52 },
  { percent: 49 },
  { percent: 61 },
  { percent: 74, tone: "series" as const },
  { percent: 96, tone: "danger" as const },
];

/**
 * Everything a model touches, on one screen: the claim in place, the
 * question before anything runs and the reason behind it, the bar it is
 * asked through, the fields that state their confidence, and the receipt.
 * One two-column grid; every row shares its edges.
 */
export function InferenceScreen() {
  const [query, setQuery] = useState("paused sources");
  const [receipt, setReceipt] = useState(true);

  return (
    <ProductShell area="workspace" active="sources" crumbs={["Example Security GmbH", "Production", "Sources"]}>
      <PageHeader>
        <PageHeaderTitle>Sources</PageHeaderTitle>
      </PageHeader>

      <PageHeader level={2}>
        <PageHeaderTitle>The claim, and the question before it runs</PageHeaderTitle>
      </PageHeader>
      <div className="inference-grid">
        <LivingCard title="Unsealed entries" insightLabel="ai insight">
          <LivingActions>
            <Button variant="ghost" size="sm" iconOnly={true} aria-label="Card actions">
              <MoreVertical aria-hidden />
            </Button>
          </LivingActions>
          <LivingBody>
            <FigureRow label="Unsealed entries" variant="footer">
              <Figure label="Unsealed" value="1,284" tone="danger">
                up 940 since 08:00
              </Figure>
            </FigureRow>
            <Sparkline
              bars={bars}
              label="Unsealed entries over the last eight hours, rising sharply in the last two."
            />
          </LivingBody>
          <LivingInsight body="The rise follows the pause on feed.example.io at 08:47. Resuming it clears the backlog.">
            <LivingBasis>inferred from 3 sources · confidence 0.88</LivingBasis>
            <Button variant="inferred" size="sm">
              Review the proposal
            </Button>
            <Button variant="ghost" size="sm">
              Dismiss
            </Button>
          </LivingInsight>
        </LivingCard>
        <ConfirmPanel
          label="Proposed action"
          question="Resume feed.example.io?"
          whyLabel="Why was this proposed?"
          onWhy={() => undefined}
        >
          <ExplainRow label="Basis">1,284 entries are queued behind one paused host</ExplainRow>
          <ExplainRow label="Scope">One source in this workspace</ExplainRow>
          <ExplainRow label="Reversible">Yes, the source can be paused again</ExplainRow>
          <ConfirmActions>
            <Button variant="secondary" size="sm">
              Cancel
            </Button>
            <Button size="sm">Resume</Button>
          </ConfirmActions>
        </ConfirmPanel>
        <ExplainPanel
          label="Why this was proposed"
          answer="Proposed because 1,284 entries are queued behind one paused host."
          confidenceLabel="Confidence"
          confidence="0.88"
          confidenceWord="high"
        >
          <ExplainRow label="Matched on">Host, manifest prefix and queue depth</ExplainRow>
          <ExplainRow label="Window" mono>
            2026-09-22 → 2026-09-23
          </ExplainRow>
          <ExplainIgnored
            summary="Not considered (2)"
            items={["Entries sealed before 2026-09-01", "Unsealed drafts"]}
          />
          <ExplainFooter>This does not account for sources added in the last hour.</ExplainFooter>
        </ExplainPanel>
        <div className="inference-column">
          <Panel title="Where a query goes">
            <div className="inference-badges">
              <PrivacyBadge scope="local">
                <ShieldCheck aria-hidden />
                local processing
              </PrivacyBadge>
              <PrivacyBadge scope="external">
                <Globe aria-hidden />
                model · eu-central
              </PrivacyBadge>
              <PrivacyBadge scope="retention">
                <Timer aria-hidden />
                retained 30 days
              </PrivacyBadge>
            </div>
          </Panel>
          <Panel title="Resolved by a model">
            <div className="inference-fields">
              <TextField
                id="screen-c-high"
                label="Resolved operator"
                readOnly
                value="Nora Feld"
                confidence={{
                  value: 0.94,
                  label: "0.94 · matched on 3 of 4 inputs",
                  whyLabel: "Why?",
                  onWhy: () => undefined,
                }}
              />
              <TextField
                id="screen-c-review"
                label="Resolved host"
                readOnly
                mono
                value="mirror.example.net"
                confidence={{
                  value: 0.42,
                  label: "0.42 · below the threshold, review before sealing",
                  level: "review",
                  whyLabel: "Why?",
                  onWhy: () => undefined,
                }}
              />
            </div>
          </Panel>
        </div>
      </div>

      <PageHeader level={2}>
        <PageHeaderTitle>Asking</PageHeaderTitle>
      </PageHeader>
      <div className="inference-grid">
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
            <CommandRow label="feed.example.io" meta="03 · paused" active={true} onSelect={() => undefined}>
              <Radar aria-hidden />
            </CommandRow>
            <CommandRow label="beta.example.dev" meta="11 · paused" onSelect={() => undefined}>
              <Radar aria-hidden />
            </CommandRow>
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
            <CommandRow label="Coverage" meta="G then C" onSelect={() => undefined}>
              <Search aria-hidden />
            </CommandRow>
            <CommandRow label="Settings" meta="G then S" onSelect={() => undefined}>
              <Settings2 aria-hidden />
            </CommandRow>
          </CommandGroup>
        </CommandBar>
      </div>

      <ToastRegion>
        {receipt ? (
          <Toast
            title="feed.example.io resumed."
            body="The queue drained at 09:16. 1,284 entries are now sealed."
            auditId="audit c18b70d4"
            onDismiss={() => setReceipt(false)}
            dismissLabel="Dismiss this receipt"
          >
            <ToastAction>
              <Button variant="secondary" size="sm">
                Open record
              </Button>
            </ToastAction>
          </Toast>
        ) : null}
      </ToastRegion>
    </ProductShell>
  );
}
