import { useState } from "react";
import { Globe, MoreVertical, Radar, Search, Settings2, ShieldCheck, Timer } from "lucide-react";
import {
  Button,
  CommandBar,
  CommandGroup,
  CommandRow,
  Fact,
  FactList,
  Figure,
  FigureNote,
  PageHeader,
  PageHeaderTitle,
  Panel,
  ProposalActions,
  ProposalAnswer,
  ProposalIgnored,
  ProposalNote,
  ProposalPanel,
  ProposalQuestion,
  RecordActions,
  RecordBasis,
  RecordBody,
  RecordCard,
  RecordInsight,
  RecordStatus,
  Sparkline,
  StatusPill,
  TextField,
  Toast,
  ToastAction,
  ToastRegion,
} from "../..";
import { ProductShell } from "../shell/ProductShell";
import "./Inference.css";

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
        <RecordCard title="Unsealed entries">
          <RecordStatus>
            <StatusPill tone="inferred">ai insight</StatusPill>
          </RecordStatus>
          <RecordActions>
            <Button variant="ghost" size="sm" iconOnly={true} aria-label="Card actions">
              <MoreVertical aria-hidden />
            </Button>
          </RecordActions>
          <RecordBody>
            <Figure label="Unsealed" value="1,284" tone="danger" size="compact">
              <FigureNote tone="danger">up 940 since 08:00Z</FigureNote>
            </Figure>
            <Sparkline
              values={[38, 46, 41, 52, 49, 61, 74, 96]}
              highlight={7}
              tone="danger"
              label="Unsealed entries over the last eight hours, rising sharply in the last hour."
            />
          </RecordBody>
          <RecordInsight body="The rise follows the pause on feed.example.io at 08:47Z. Resuming it clears the backlog.">
            <RecordBasis>inferred from 3 sources · confidence 0.88</RecordBasis>
            <Button size="sm">Review the proposal</Button>
            <Button variant="secondary" size="sm">
              Dismiss
            </Button>
          </RecordInsight>
        </RecordCard>
        <ProposalPanel label="Proposed action" whyLabel="Why was this proposed?">
          <ProposalQuestion>Resume feed.example.io?</ProposalQuestion>
          <FactList>
            <Fact label="Basis">1,284 entries are queued behind one paused host</Fact>
            <Fact label="Scope">One source in this workspace</Fact>
            <Fact label="Reversible">Yes, the source can be paused again</Fact>
          </FactList>
          <ProposalAnswer>Proposed because 1,284 entries are queued behind one paused host.</ProposalAnswer>
          <Figure size="compact" label="Confidence" value="0.88">
            high
          </Figure>
          <ProposalIgnored
            summary="Not considered (2)"
            items={["Entries sealed before 2026-09-01", "Unsealed drafts"]}
          />
          <ProposalNote>This does not account for sources added in the last hour.</ProposalNote>
          <ProposalActions>
            <Button variant="secondary" size="sm">
              Cancel
            </Button>
            <Button size="sm">Resume</Button>
          </ProposalActions>
        </ProposalPanel>
        <div className="inference-column">
          <Panel title="Where a query goes">
            <div className="inference-badges">
              <StatusPill tone="ok" track="record" icon={<ShieldCheck />}>
                local processing
              </StatusPill>
              <StatusPill tone="warn" track="record" icon={<Globe />}>
                model · eu-central
              </StatusPill>
              <StatusPill tone="neutral" track="record" icon={<Timer />}>
                retained 30 days
              </StatusPill>
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
