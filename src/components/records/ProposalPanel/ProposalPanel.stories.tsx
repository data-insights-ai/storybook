import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Grid } from "../../layout/arrange/Grid";
import { Panel } from "../../layout/page/Panel";
import { SealValue } from "../../status/SealValue";
import { StatusPill } from "../../status/StatusPill";
import { Figure } from "../../figures/Figure";
import { Fact, FactList } from "../FactList";
import {
  ProposalActions,
  ProposalAnswer,
  ProposalIgnored,
  ProposalNote,
  ProposalPanel,
  ProposalQuestion,
} from "./ProposalPanel";

const meta = {
  title: "Records/ProposalPanel",
  component: ProposalPanel,
  tags: ["layer:block", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** what a model proposes, why, and how sure it is, on one surface; when it asks for a decision, the question and its actions too.",
          "**When to use:** beside the record a proposal concerns: a merge, a resume, a revoke a model suggests. **When not to:** a destructive action the operator started themselves asks in a `ConfirmDialog`; a claim that belongs to one figure on a card is a `RecordCard`'s `RecordInsight`; plain facts of a record are a `FactList`.",
          "**Anatomy:** the mono label, the `ProposalQuestion` (a heading, when it asks), the `ProposalAnswer` (one sentence), a confidence `Figure`, the evidence or the decision's facts as a `FactList` in rows (the same fact style as the record beside it), `ProposalIgnored` (folded), the `ProposalNote` (the caveat) and `ProposalActions`.",
          "**Variants:** without `ProposalActions` it explains, everything in view. With them it asks: the facts stay in view and the explanation folds under `whyLabel`, in the same panel.",
          "**States:** the fold starts closed when it asks; an action that is running shows its busy state on the button, and the receipt afterwards is a `Toast`, not a second panel.",
          '**Content rules:** the question is answered by the primary action ("Resume feed.example.io?" → Resume). The answer is one sentence. The facts state scope and whether it can be reversed, never in a tooltip. Tokens (hosts, ranges, ids) take `mono`; sentences never do.',
          "**Accessibility:** a region named by its question, or by its label when it only explains. The fold is a button with `aria-expanded`; what was not considered is a native `details`.",
        ].join("\n\n"),
      },
    },
  },
  args: { label: "Proposed action", whyLabel: "Why was this proposed?", heading: 2, children: null },
  argTypes: {
    label: { control: "text" },
    whyLabel: { control: "text" },
    heading: { control: "radio", options: [2, 3, 4] },
    children: { control: false },
  },
} satisfies Meta<typeof ProposalPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

function Beside(args: Parameters<typeof ProposalPanel>[0]) {
  return (
    <Grid min="280px" gap={16}>
      <div>
        <Panel label="Source" title="feed.example.io">
          <FactList>
            <Fact label="State">
              <StatusPill tone="warn">paused</StatusPill>
            </Fact>
            <Fact label="Queued">1,284 entries</Fact>
            <Fact label="Paused since" mono>
              08:47Z
            </Fact>
          </FactList>
        </Panel>
      </div>
      <ProposalPanel {...args}>
        <ProposalQuestion>Resume feed.example.io?</ProposalQuestion>
        <FactList>
          <Fact label="Scope">1 source in WS-01</Fact>
          <Fact label="Reversible">Yes, the source can be paused again</Fact>
        </FactList>
        <ProposalAnswer>Proposed because 1,284 entries are queued behind one paused host.</ProposalAnswer>
        <Figure size="compact" label="Confidence" value="0.88">
          high
        </Figure>
        <ProposalNote>This does not account for sources added in the last hour.</ProposalNote>
        <ProposalActions>
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
          <Button size="sm">Resume</Button>
        </ProposalActions>
      </ProposalPanel>
    </Grid>
  );
}

/**
 * Beside the source it concerns: the question, the facts it rests on, and
 * the asked-for action as the primary button. The reasons fold under
 * "Why was this proposed?" in the same panel, here opened by a reader who
 * asked. The facts read in the same rows as the record's, the answer at
 * body size, and the open fold is one object: its head and its content
 * share one text edge, one inset apart.
 */
export const BesideTheRecord: Story = {
  args: { defaultWhyOpen: true },
  render: (args) => <Beside {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("region", { name: "Resume feed.example.io?" });
    await expect(within(region).getByRole("heading", { level: 2 })).toHaveTextContent("Resume feed.example.io?");
    await expect(canvas.getByRole("button", { name: "Resume" })).toHaveClass("di-btn-primary");
    const [record, proposal] = [...canvasElement.querySelectorAll(".di-facts")];
    await expect(proposal.className).toBe(record.className);
    const answer = canvas.getByText(/queued behind one paused host/);
    await expect(parseFloat(getComputedStyle(answer).fontSize)).toBeLessThanOrEqual(14);
    const fold = canvasElement.querySelector<HTMLElement>(".di-proposal-why")!;
    const title = fold.querySelector(".di-disclosure-title")!.getBoundingClientRect();
    const head = fold.querySelector(".di-disclosure-head")!.getBoundingClientRect();
    const first = answer.getBoundingClientRect();
    await expect(Math.abs(first.left - title.left)).toBeLessThanOrEqual(1);
    await expect(Math.abs(first.top - head.bottom - parseFloat(getComputedStyle(fold).paddingTop))).toBeLessThanOrEqual(
      1,
    );
    await expect(canvasElement.querySelector(".di-proposal-label .di-seal-mark, .di-proposal-label svg")).toBeNull();
  },
};

/** Asking, the reasons start folded; the head opens them in place. */
export const FoldedAtFirst: Story = {
  render: (args) => <Beside {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const why = canvas.getByRole("button", { name: "Why was this proposed?" });
    await expect(why).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.queryByText(/queued behind one paused host/)).not.toBeVisible();
    await userEvent.click(why);
    await expect(canvas.getByText(/queued behind one paused host/)).toBeVisible();
  },
};

/** It only explains: the answer, its confidence, the evidence, what was not considered, and the caveat. */
export const Explain: Story = {
  args: { label: "Why this was proposed" },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <ProposalPanel {...args}>
        <ProposalAnswer>Proposed because 1,284 entries are queued behind one paused host.</ProposalAnswer>
        <Figure size="compact" label="Confidence" value="0.88">
          high
        </Figure>
        <FactList>
          <Fact label="Matched on">Host, manifest prefix and queue depth</Fact>
          <Fact label="Window" mono>
            2026-09-22 → 2026-09-23
          </Fact>
        </FactList>
        <ProposalIgnored summary="Not considered (2)" items={["Entries sealed before 2026-09-01", "Unsealed drafts"]} />
        <ProposalNote>This does not account for sources added in the last hour.</ProposalNote>
      </ProposalPanel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: /Why this was proposed/ })).toBeVisible();
    await expect(canvas.queryByText("Unsealed drafts")).not.toBeVisible();
    await userEvent.click(canvas.getByText("Not considered (2)"));
    await expect(canvas.getByText("Unsealed drafts")).toBeVisible();
    await expect(getComputedStyle(canvas.getByText("Unsealed drafts")).textDecorationLine).toBe("none");
    const window = canvas.getByText("2026-09-22 → 2026-09-23");
    await expect(getComputedStyle(window).wordBreak).toBe("keep-all");
    const bold = [...canvasElement.querySelectorAll(".di-proposal *")].filter(
      (el) => el.children.length === 0 && Number(getComputedStyle(el).fontWeight) >= 600,
    );
    await expect(bold.map((el) => el.textContent)).toEqual(["0.88"]);
  },
};

/** Nothing was left out: the caveat names the sealed cut-off the model read up to. */
export const Complete: Story = {
  args: { label: "Why this was proposed" },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <ProposalPanel {...args}>
        <ProposalAnswer>Proposed because both entries carry the same manifest hash.</ProposalAnswer>
        <Figure size="compact" label="Confidence" value="0.99">
          very high
        </Figure>
        <FactList>
          <Fact label="Matched on">Manifest hash</Fact>
          <Fact label="Sources">3 of 3</Fact>
        </FactList>
        <ProposalNote>
          Every available input was used, up to{" "}
          <SealValue state="sealed" stateLabel="Sealed">
            2026-09-23T09:12:04Z
          </SealValue>
        </ProposalNote>
      </ProposalPanel>
    </div>
  ),
};

/** An irreversible proposal says so in its facts, and its action is the final commit: the filled danger button. */
export const Irreversible: Story = {
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <ProposalPanel {...args}>
        <ProposalQuestion>Revoke four stale sources?</ProposalQuestion>
        <FactList>
          <Fact label="Basis">No entry from these hosts since 2026-08-12</Fact>
          <Fact label="Scope">4 sources · 0 sealed entries affected</Fact>
          <Fact label="Reversible">No</Fact>
        </FactList>
        <ProposalAnswer>Proposed because the four hosts have sent nothing for 49 days.</ProposalAnswer>
        <ProposalActions>
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
          <Button variant="danger" size="sm">
            Revoke
          </Button>
        </ProposalActions>
      </ProposalPanel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const revoke = within(canvasElement).getByRole("button", { name: "Revoke" });
    await expect(revoke).toHaveClass("di-btn-danger");
    const probe = document.createElement("span");
    probe.style.color = "var(--di-status-danger-dot)";
    revoke.append(probe);
    await expect(getComputedStyle(revoke).backgroundColor).toBe(getComputedStyle(probe).color);
    probe.remove();
  },
};

/** Long German labels in a narrow column: labels wrap, the actions stack, nothing runs past the edge. */
export const LongLabelsNarrow: Story = {
  args: { label: "Vorgeschlagene Maßnahme", whyLabel: "Warum wurde das vorgeschlagen?", defaultWhyOpen: true },
  render: (args) => (
    <div lang="de" style={{ maxWidth: 300 }}>
      <ProposalPanel {...args}>
        <ProposalQuestion>Die Datenquelle feed.example.io wieder aufnehmen?</ProposalQuestion>
        <FactList>
          <Fact label="Entscheidungsgrundlage">1.284 Einträge warten hinter einem pausierten Host</Fact>
          <Fact label="Wirkungsbereich">1 Quelle in WS-01</Fact>
          <Fact label="Rückgängig machbar">Ja, die Quelle kann wieder pausiert werden</Fact>
        </FactList>
        <ProposalAnswer>Vorgeschlagen, weil 1.284 Einträge hinter einem pausierten Host warten.</ProposalAnswer>
        <Figure size="compact" label="Zuverlässigkeit" value="0,88">
          hoch
        </Figure>
        <ProposalIgnored
          summary="Nicht berücksichtigt (2)"
          items={["Vor dem 2026-09-01 versiegelte Einträge", "Unversiegelte Entwürfe"]}
        />
        <ProposalActions>
          <Button variant="secondary" size="sm">
            Abbrechen
          </Button>
          <Button size="sm">Wieder aufnehmen</Button>
        </ProposalActions>
      </ProposalPanel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Warum wurde das vorgeschlagen?" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    const panel = canvasElement.querySelector(".di-proposal")!;
    await expect(panel.scrollWidth).toBeLessThanOrEqual(panel.clientWidth);
  },
};
