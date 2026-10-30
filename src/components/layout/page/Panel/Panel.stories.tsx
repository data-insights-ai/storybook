import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { Toolbar } from "../../../actions/Toolbar";
import { Grid } from "../../arrange/Grid";
import { TrendChart } from "../../../charts/TrendChart";
import { FigureRow } from "../../../figures/FigureRow";
import { Figure } from "../../../figures/Figure";
import { SeverityMark } from "../../../status/SeverityMark";
import { TextLink } from "../../../text/TextLink";
import { DangerAction } from "./DangerAction";
import {
  Panel,
  PanelActions,
  PanelFigure,
  PanelFooter,
  PanelLead,
  PanelMeta,
  PanelNote,
  PanelStatus,
  PanelVisual,
} from "./Panel";
import { SealValue } from "../../../status/SealValue";
import { StatusPill } from "../../../status/StatusPill";

const meta = {
  title: "Layout/Page/Panel",
  component: Panel,
  tags: ["layer:block", "autodocs"],
  args: {
    surface: "sheet",
    emphasis: false,
    title: "Graz office",
    padded: true,
    children: "Fourteen sources report here; the last event arrived two minutes ago.",
  },
  argTypes: {
    surface: { control: "radio", options: ["sheet", "inset", "hero"] },
    tone: { control: "radio", options: ["neutral", "danger"] },
    wide: { control: "boolean" },
    emphasis: { control: "boolean" },
    label: { control: "text" },
    heading: { control: "radio", options: [2, 3, 4] },
    title: { control: "text" },
    padded: { control: "boolean" },
    children: { control: "text" },
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={{ maxWidth: parameters.wide ? undefined : 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

const days = Array.from({ length: 30 }, (_, i) => new Date(Date.UTC(2026, 9, 1 + i)).toISOString().slice(0, 10));
const balance = days.map((at, i) => ({ at, balance: 300 - i * 4 }));
const seats = days.map((at, i) => ({ at, used: Math.min(5, 2 + Math.floor(i / 8)) }));
const short = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const usage = days.map((at, i) => ({ at, soc: 20 + ((i * 7) % 13), reports: 4 + ((i * 3) % 5) }));

/* The inset of the surface, measured: the same above the first line as below the last. */
async function sameInset(canvasElement: HTMLElement) {
  const panel = canvasElement.querySelector<HTMLElement>(".di-panel")!;
  const style = getComputedStyle(panel);
  await expect(style.paddingTop).toBe(style.paddingBottom);
  await expect(style.paddingLeft).toBe(style.paddingTop);
}

/** The default sheet: a title in the display face over its content, the same inset all round. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await sameInset(canvasElement);
    const title = within(canvasElement).getByText("Graz office");
    await expect(getComputedStyle(title).fontFamily).toContain("Space Grotesk");
  },
};

/**
 * The header's trailing line is a slot, so what a panel reports about
 * itself can carry the seal and the mono track. A string could not.
 */
export const WithMeta: Story = {
  args: { children: null },
  render: (args) => (
    <Panel {...args}>
      <PanelMeta>
        <SealValue stateLabel="Sealed">09:12:04Z</SealValue>
      </PanelMeta>
      Fourteen sources report here; the last event arrived two minutes ago.
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("09:12:04Z")).toBeVisible();
  },
};

/** A state sits beside the title it qualifies: a failure says so in words, next to the run that failed. */
export const Status: Story = {
  args: { title: "Ingest run", children: null },
  render: (args) => (
    <Panel {...args}>
      <PanelStatus>
        <StatusPill tone="danger">failed</StatusPill>
      </PanelStatus>
      Connection reset by the upstream host after 2 of 14 batches.
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText("Ingest run").getBoundingClientRect();
    const pill = canvas.getByText("failed").getBoundingClientRect();
    await expect(Math.abs(pill.top + pill.height / 2 - (title.top + title.height / 2))).toBeLessThanOrEqual(3);
    await expect(pill.left - title.right).toBeLessThanOrEqual(12);
  },
};

/** A step below the surface it sits in: a group inside a panel, a quoted extract. */
export const Inset: Story = {
  args: { surface: "inset", title: "Extract" },
  render: (args) => (
    <Panel title="Manifest">
      <Panel {...args}>a4f9c21e · 2026-09-18T09:12:04Z</Panel>
    </Panel>
  ),
};

/**
 * A mono label above the title, and the title as a heading the page outline
 * reads. The label is a kind or a source; the title says what the block shows.
 */
export const Labelled: Story = {
  args: {
    label: "Coverage · last 24 h",
    title: "Two of nine tables are not arriving",
    heading: 2,
    children: "Sign-in logs and audit events stopped at 06:10; the other seven tables are current.",
  },
};

/**
 * The one block that matters in the view carries the gold edge. One per
 * view. `PanelLead` says what it asks for, above the actions, in regular
 * weight: the title is the block's one bold line.
 */
export const Emphasis: Story = {
  args: {
    emphasis: true,
    label: "Verdict",
    title: "Credentials were used to reach the file server",
    heading: 2,
    children: null,
  },
  render: (args) => (
    <Panel {...args}>
      <PanelLead>Isolate the server before the next sync window.</PanelLead>
      <Toolbar align="start">
        <Button>Isolate the server</Button>
        <Button variant="secondary">Reset the account</Button>
      </Toolbar>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lead = canvas.getByText("Isolate the server before the next sync window.");
    await expect(lead).toHaveClass("di-panel-lead");
    await expect(Number(getComputedStyle(lead).fontWeight)).toBeLessThan(500);
    await expect(Number(getComputedStyle(canvas.getByRole("heading", { level: 2 })).fontWeight)).toBeGreaterThanOrEqual(
      600,
    );
  },
};

const counts = [10, 4, 2, 1, 4, 16, 0, 1, 4, 10, 3, 0, 12, 20, 8, 2, 7, 9, 1, 0, 8, 7, 4, 2, 9, 15, 4, 1];
const weekDays = ["6 Oct", "7 Oct", "8 Oct", "9 Oct", "10 Oct", "11 Oct", "12 Oct"];
const activity = counts.map((detections, i) => ({
  at: `${weekDays[Math.floor(i / 4)]} ${String((i % 4) * 6).padStart(2, "0")}h`,
  detections,
}));

/**
 * `surface="hero"`: the navy zone behind the page's signature visual, one
 * per page. The one figure stands beside the chart (`PanelFigure`,
 * `PanelVisual`), the link to the full list stays in the head, and the
 * supporting figures close it under the fine rule (`PanelFooter`).
 */
export const Hero: Story = {
  parameters: { wide: true },
  args: {
    surface: "hero",
    label: "Detections · last 7 days",
    title: "Three bursts this week, the largest on 9 October",
    heading: 2,
    children: null,
  },
  render: (args) => (
    <Panel {...args}>
      <PanelActions>
        <TextLink href="#cases">All cases</TextLink>
      </PanelActions>
      <PanelFigure>
        <Figure size="hero" label="Open cases" value="3">
          <SeverityMark level="critical" label="1 critical" />
          <SeverityMark level="high" label="1 high" />
          <SeverityMark level="medium" label="1 medium" />
        </Figure>
      </PanelFigure>
      <PanelVisual>
        <TrendChart
          label="Detections per 6 hours, last 7 days"
          height="lg"
          data={activity}
          series={[{ key: "detections", label: "Detections", kind: "bar" }]}
        />
      </PanelVisual>
      <PanelFooter>
        <FigureRow label="Supporting figures" variant="footer">
          <Figure label="New in 24 h" value="1">
            1 escalated
          </Figure>
          <Figure label="Unassigned" value="2" tone="warn">
            of 3 open
          </Figure>
          <Figure label="Time to acknowledge" value="2.9 h">
            median · 7 days
          </Figure>
        </FigureRow>
      </PanelFooter>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const hero = canvas.getByRole("region", { name: "Three bursts this week, the largest on 9 October" });
    await expect(hero).toHaveAttribute("data-theme", "dark");
    const link = canvas.getByRole("link", { name: "All cases" }).getBoundingClientRect();
    const figure = canvas.getByText("Open cases").getBoundingClientRect();
    await expect(link.bottom).toBeLessThanOrEqual(figure.top);
  },
};

/**
 * `tone="danger"`: the end of a record, what cannot be taken back. The
 * danger edge, no band; each `DangerAction` names the action, states its
 * cost and carries one destructive button that opens a `ConfirmDialog`.
 */
export const Danger: Story = {
  parameters: { wide: true },
  args: { tone: "danger", title: "Danger zone", heading: 2, children: null },
  render: (args) => (
    <Panel {...args}>
      <PanelLead>These actions remove access and cannot be undone.</PanelLead>
      <DangerAction
        title="Leave organization"
        body="You lose access to Northwind Survey and its products at once."
        note="You are the last owner. Make someone else an owner first."
      >
        <Button variant="danger" disabled>
          Leave
        </Button>
      </DangerAction>
      <DangerAction
        title="Delete organization"
        body="Members, invitations, connections and seats are removed. This cannot be undone."
      >
        <Button variant="danger">Delete organization</Button>
      </DangerAction>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    await sameInset(canvasElement);
    const canvas = within(canvasElement);
    const title = canvas.getByRole("heading", { level: 2, name: "Danger zone" });
    await expect(getComputedStyle(title).fontFamily).toContain("Space Grotesk");
    const action = canvas.getByText("Delete organization", { selector: "p" });
    await expect(Number(getComputedStyle(action).fontWeight)).toBeLessThan(600);
    // The edge is the one red object: a full-strength danger line, the words inside stay ink.
    const panel = canvasElement.querySelector<HTMLElement>(".di-panel")!;
    const resolve = (token: string) => {
      const probe = document.createElement("span");
      probe.style.color = `var(${token})`;
      panel.append(probe);
      const colour = getComputedStyle(probe).color;
      probe.remove();
      return colour;
    };
    await expect(getComputedStyle(panel).boxShadow).toContain(resolve("--di-status-danger-dot"));
    const lead = canvas.getByText("These actions remove access and cannot be undone.");
    for (const words of [lead, title])
      await expect([resolve("--di-status-danger-dot"), resolve("--di-status-danger-fg")]).not.toContain(
        getComputedStyle(words).color,
      );
  },
};

/**
 * Dashboard figures: a panel each in a `Grid`, the figure said in words as
 * the lead, the chart it rests on, and the link to the page that changes
 * it at the head's end. `wide` gives a chart that needs it the whole row.
 */
export const Dashboard: Story = {
  parameters: { wide: true, controls: { disable: true } },
  render: () => (
    <>
      {/* The dashboard sits under the page's section heading; the story supplies it so the heading order holds. */}
      <h2 className="di-sr">Organization at a glance</h2>
      <Grid min="480px" gap={24}>
        <Panel title="Credit" heading={3}>
          <PanelActions>
            <TextLink href="#credits">Credits</TextLink>
          </PanelActions>
          <PanelLead>186 credits, about 31 days at 6 credits a day.</PanelLead>
          <TrendChart
            label="Credit balance by day"
            data={balance}
            series={[{ key: "balance", label: "Balance", kind: "area" }]}
            formatX={short}
            height="sm"
          />
        </Panel>
        <Panel title="Seats" heading={3}>
          <PanelStatus>
            <StatusPill tone="warn">full</StatusPill>
          </PanelStatus>
          <PanelActions>
            <TextLink href="#seats">Manage seats</TextLink>
          </PanelActions>
          <PanelLead>5 of 5 in use, 1 person waiting.</PanelLead>
          <TrendChart
            label="Seats in use by day"
            data={seats}
            series={[{ key: "used", label: "In use", kind: "area" }]}
            formatX={short}
            height="sm"
          />
        </Panel>
        <Panel title="Usage per product" heading={3} wide>
          <PanelActions>
            <TextLink href="#usage">Usage</TextLink>
          </PanelActions>
          <PanelLead>812 GB ingested in the last 30 days.</PanelLead>
          <TrendChart
            label="Usage per product by day"
            data={usage}
            series={[
              { key: "soc", label: "AI SOC", kind: "bar", stack: "u" },
              { key: "reports", label: "Reports", kind: "bar", stack: "u", tone: "compare" },
            ]}
            formatX={short}
            formatValue={(v) => `${v} GB`}
          />
        </Panel>
      </Grid>
    </>
  ),
  play: async ({ canvasElement }) => {
    const panels = [...canvasElement.querySelectorAll(".di-panel")].map((el) => el.getBoundingClientRect());
    const grid = canvasElement.querySelector(".di-panel")!.parentElement!.getBoundingClientRect();
    await expect(Math.round(panels[2]!.width)).toBe(Math.round(grid.width));
  },
};

/** A short tile: no title, only what it reports, at the same inset. */
export const Tile: Story = {
  args: {
    title: undefined,
    children: "Four sources ingested since the last seal.",
  },
};

/**
 * The footer is a row inside the surface, 16px under the content and at
 * the same inset as the head: what it reports at its start, the action at
 * its end. The state sits beside the title it qualifies.
 */
export const WithFooter: Story = {
  args: {
    title: "Key rotation",
    children: "The signing key for this workspace expires on 2026-09-29.",
  },
  render: (args) => (
    <Panel {...args}>
      <PanelStatus>
        <StatusPill tone="warn">expiring</StatusPill>
      </PanelStatus>
      <p>{args.children}</p>
      <PanelFooter>Rotated last on 2025-09-29 by Nora Feld</PanelFooter>
      <PanelActions>
        <Button variant="secondary" size="sm">
          Rotate now
        </Button>
      </PanelActions>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    await sameInset(canvasElement);
    const canvas = within(canvasElement);
    const body = canvas.getByText(/expires on/).getBoundingClientRect();
    const footer = canvas.getByText(/Rotated last/).getBoundingClientRect();
    const action = canvas.getByRole("button", { name: "Rotate now" }).getBoundingClientRect();
    const frame = canvasElement.querySelector(".di-panel")!;
    const panel = frame.getBoundingClientRect();
    // The rows are one gap apart: 16px comfortable, 12px compact.
    await expect(footer.top - body.bottom).toBeGreaterThanOrEqual(parseFloat(getComputedStyle(frame).rowGap));
    await expect(Math.round(panel.right - action.right)).toBe(Math.round(footer.left - panel.left));
  },
};

/** With nothing else to say below the content, the action goes to the head's end. */
export const ActionInHead: Story = {
  args: {
    title: "Retention",
    children: "Entries are kept for 400 days, then sealed into the cold archive.",
  },
  render: (args) => (
    <Panel {...args}>
      <PanelActions>
        <Button variant="secondary" size="sm">
          Edit
        </Button>
      </PanelActions>
      {args.children}
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText("Retention").getBoundingClientRect();
    const edit = canvas.getByRole("button", { name: "Edit" }).getBoundingClientRect();
    await expect(edit.bottom).toBeLessThanOrEqual(title.bottom + 6);
  },
};

/** What a panel holds in practice: a measured value under its seal. */
export const WithSealedValue: Story = {
  args: { title: "Manifest" },
  render: (args) => (
    <Panel {...args}>
      <SealValue state="sealed" stateLabel="Sealed">
        a4f9c21e · 2026-09-18T09:12:04Z
      </SealValue>
    </Panel>
  ),
};

/**
 * The quiet line under a panel's content: the caveat, the unit, the
 * thing the numbers above do not say. It is never where a fact lives.
 */
export const WithNote: Story = {
  args: { title: "Coverage" },
  render: (args) => (
    <Panel {...args}>
      <SealValue state="sealed" stateLabel="Sealed">
        86.4%
      </SealValue>
      <PanelNote>Measured against sealed entries only. Unsealed drafts are not counted.</PanelNote>
    </Panel>
  ),
};

/** The slots written in reverse: the panel still places lead first, then the body, the note, and the footer last. */
export const SlotsWrittenReversed: Story = {
  args: { title: "Delivery" },
  render: (args) => (
    <Panel {...args}>
      <PanelActions>
        <Button size="sm">Retry</Button>
      </PanelActions>
      <PanelFooter>3 attempts left</PanelFooter>
      <PanelNote>Retries stop after three attempts.</PanelNote>
      <p>The Sentinel export has failed since 08:40; the other two deliver.</p>
      <PanelLead>Three exports, one failing.</PanelLead>
      <PanelMeta>live</PanelMeta>
      <PanelStatus>
        <StatusPill tone="warn">degraded</StatusPill>
      </PanelStatus>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const order = [
      "Delivery",
      "Three exports, one failing.",
      "The Sentinel export has failed since 08:40; the other two deliver.",
      "Retries stop after three attempts.",
      "3 attempts left",
    ].map((text) => canvas.getByText(text).getBoundingClientRect().top);
    await expect([...order].sort((a, b) => a - b)).toEqual(order);
    const meta = canvas.getByText("live").getBoundingClientRect();
    const title = canvas.getByText("Delivery").getBoundingClientRect();
    await expect(Math.abs(meta.top + meta.height / 2 - (title.top + title.height / 2))).toBeLessThanOrEqual(4);
    const retry = canvas.getByRole("button", { name: "Retry" }).getBoundingClientRect();
    const footer = canvas.getByText("3 attempts left").getBoundingClientRect();
    await expect(Math.abs(retry.top + retry.height / 2 - (footer.top + footer.height / 2))).toBeLessThanOrEqual(2);
  },
};
