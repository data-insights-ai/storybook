import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";
import { Boxes, Eye, Laptop, Mail, MoreHorizontal, MoreVertical, Play, Smartphone, Webhook } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Menu, MenuItem } from "../../actions/Menu";
import { Grid } from "../../layout/arrange/Grid";
import { Panel } from "../../layout/page/Panel";
import { Icon } from "../../text/Icon";
import { IconTile } from "../IconTile";
import { StatusPill } from "../../status/StatusPill";
import { Tag } from "../../status/Tag";
import { TextLink } from "../../text/TextLink";
import { Figure, FigureNote } from "../../figures/Figure";
import { Sparkline } from "../../figures/Sparkline";
import { Fact, FactList } from "../FactList";
import {
  RecordActions,
  RecordBasis,
  RecordBody,
  RecordCard,
  RecordCount,
  RecordDetail,
  RecordFooter,
  RecordInsight,
  RecordLine,
  RecordLines,
  RecordMark,
  RecordStatus,
  RecordValue,
} from "./RecordCard";

const meta = {
  title: "Records/RecordCard",
  component: RecordCard,
  tags: ["layer:block", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** one record, read at a glance: what it is, its state, and what is on record against it.",
          "**When to use:** a few records side by side (sources, watched entities, channels), a measured value with what a model read into it, or a list of records as rows (sessions, devices). **When not to:** many rows to scan, sort or select are a `DataTable`; the facts of the one record a page is about are a `FactList` in a `Panel`; a proposal that asks for a decision is a `ProposalPanel`; a lone number is a `Figure`.",
          '**Anatomy:** the head (`RecordMark`, the title with `RecordCount` or `RecordDetail` under it, then `RecordStatus` and `RecordActions` at the end), the body in the order written (`RecordValue`, `RecordBody` with a `Figure` and a `Sparkline`, `RecordLines`, a `FactList layout="pairs"`, `RecordInsight` with `RecordBasis` and its actions), and `RecordFooter` last.',
          '**Variants:** `layout="card"` stands on its own surface; `layout="row"` is one line of a list inside a `Panel`, without a surface. `heading` sets the title\'s level (2, 3) or `false` when the record is not a section of the page (a row, a channel in a grid). A record that opens its own page takes `href` (or a router\'s link in `render`): the title is the link and the whole record the target, tinted on hover; a linked row without actions ends in a chevron.',
          "**Narrow:** below 400px the name keeps its line. The state and a labelled action move under the name; a control that is only an icon (a play button, a menu, the chevron) stays at the record's end, beside the name.",
          "**States:** the state is a `StatusPill` in `RecordStatus` (running, paused, failed, this device). A record without an insight has no `RecordInsight`; a claim waiting for review keeps it, with the asked-for action first.",
          '**Content rules:** the title names the record (a host, a person, a device), not its kind. Under it one count or one detail line; a detail string breaks only between its " · " items, so a timestamp never splits. An insight is one or two sentences; its basis names the sources and the confidence. One primary action, the one the insight asks for; the others are secondary.',
          "**Accessibility:** a card is an `article` named by its heading; a row is a `div` in the list it belongs to. The state is a word, never a colour alone. The sparkline names its shape in its label. A linked record is announced by its title as a link; the chevron is hidden from screen readers, and the record's own controls keep their own names and press.",
        ].join("\n\n"),
      },
    },
  },
  args: { title: "Registry sources", children: null },
  argTypes: {
    title: { control: "text" },
    heading: { control: "radio", options: [2, 3, false] },
    layout: { control: "radio", options: ["card", "row"] },
    href: { control: "text" },
    render: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof RecordCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function tile(label: string, glyph: ReactNode, inverse = false) {
  return (
    <RecordMark>
      <IconTile variant={inverse ? "inverse" : "neutral"}>
        <Icon size={16} label={label}>
          {glyph}
        </Icon>
      </IconTile>
    </RecordMark>
  );
}

/** A watchlist: each kind of source as a card, its state, its latest entries and the way into its register. */
export const Watchlist: Story = {
  render: () => (
    <Grid min="260px" gap={16}>
      <RecordCard title="Registry sources">
        {tile("Sources", <Boxes aria-hidden />, true)}
        <RecordCount>1,842 entries</RecordCount>
        <RecordStatus>
          <StatusPill tone="ok">running</StatusPill>
        </RecordStatus>
        <RecordLines>
          <RecordLine primary="registry.example.org">09:12:04Z</RecordLine>
          <RecordLine primary="mirror.example.net">09:11:52Z</RecordLine>
          <RecordLine primary="index.example.dev">09:09:38Z</RecordLine>
        </RecordLines>
        <RecordFooter>
          <TextLink href="#registry">Open the register</TextLink>
        </RecordFooter>
      </RecordCard>
      <RecordCard title="Feeds">
        {tile("Feeds", <Eye aria-hidden />)}
        <RecordCount>744 entries</RecordCount>
        <RecordStatus>
          <StatusPill tone="warn">1 paused</StatusPill>
        </RecordStatus>
        <RecordLines>
          <RecordLine primary="feed.example.io">paused 08:47Z</RecordLine>
          <RecordLine primary="news.example.com">09:10:21Z</RecordLine>
        </RecordLines>
        <RecordFooter>
          <TextLink href="#feeds">Open the register</TextLink>
        </RecordFooter>
      </RecordCard>
      <RecordCard title="Archive sources">
        {tile("Archive", <Boxes aria-hidden />)}
        <RecordCount>487 entries</RecordCount>
        <RecordStatus>
          <StatusPill tone="danger">failed</StatusPill>
        </RecordStatus>
        <RecordLines>
          <RecordLine primary="archive.example.com">failed 08:44Z</RecordLine>
        </RecordLines>
        <RecordFooter>
          <TextLink href="#archive">Open the register</TextLink>
        </RecordFooter>
      </RecordCard>
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Registry sources" })).toBeVisible();
    // The cards in a row end on one line, so their footers line up.
    const feet = [...canvasElement.querySelectorAll(".di-record-footer")].map((el) => el.getBoundingClientRect());
    if (window.innerWidth > 900) await expect(Math.abs(feet[0].bottom - feet[2].bottom)).toBeLessThanOrEqual(1);
  },
};

const rising = [38, 46, 41, 52, 49, 61, 74, 96];

/**
 * A measured value with what a model read into it, in place. The figure
 * stays the loudest thing; the insight is a step of tone below it, its
 * words on the title's edge, and its first action is the one it asks for.
 */
export const WithInsight: Story = {
  args: { title: "Unsealed entries" },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <RecordCard {...args}>
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
            values={rising}
            highlight={rising.length - 1}
            tone="danger"
            label="Unsealed entries over the last eight hours, rising sharply in the last hour."
          />
        </RecordBody>
        <RecordInsight body="The rise follows the pause on feed.example.io at 08:47Z. Resuming it clears the backlog.">
          <RecordBasis>inferred from 3 sources · confidence 0.88</RecordBasis>
          <Button size="sm">Review the proposal</Button>
          <Button variant="secondary" size="sm">
            Open the source
          </Button>
          <Button variant="secondary" size="sm">
            Dismiss
          </Button>
        </RecordInsight>
      </RecordCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("ai insight")).toBeVisible();
    await expect(canvas.getByRole("img", { name: /Unsealed entries over the last eight hours/ })).toBeVisible();
    const left = (selector: string) => canvasElement.querySelector(selector)!.getBoundingClientRect().left;
    const edge = left(".di-record-title");
    // One left edge: the title, the figure and the insight block; the insight's words and actions share the block's inner edge.
    for (const selector of [".di-figure-label", ".di-record-insight"]) {
      await expect(Math.abs(left(selector) - edge)).toBeLessThanOrEqual(1);
    }
    const inner = left(".di-record-insight-body");
    for (const selector of [".di-record-basis", ".di-record-insight-actions > *"]) {
      await expect(Math.abs(left(selector) - inner)).toBeLessThanOrEqual(1);
    }
    // The actions sit on one line, on one baseline.
    const tops = [...canvasElement.querySelectorAll(".di-record-insight-actions > *")].map(
      (el) => el.getBoundingClientRect().bottom,
    );
    if (tops.every((t) => Math.abs(t - tops[0]) < 20)) {
      for (const t of tops) await expect(Math.abs(t - tops[0])).toBeLessThanOrEqual(1);
    }
    // One highlighted bar.
    await expect(canvasElement.querySelectorAll('.di-sparkline-bar[class*="is-"]').length).toBe(1);
    // The sparkline takes the space beside the figure instead of leaving it empty.
    const body = canvasElement.querySelector(".di-record-body")!.getBoundingClientRect();
    const spark = canvasElement.querySelector(".di-sparkline")!.getBoundingClientRect();
    await expect(spark.right).toBeGreaterThan(body.right - 2);
  },
};

/** The measurement alone, before a model has anything to say about it. */
export const WithoutInsight: Story = {
  args: { title: "Unsealed entries" },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <RecordCard {...args}>
        <RecordBody>
          <Figure label="Unsealed" value="84" size="compact">
            <FigureNote>steady since 06:00Z</FigureNote>
          </Figure>
          <Sparkline
            values={rising.map((percent) => Math.round(percent / 3) + 20)}
            label="Unsealed entries, flat over the last eight hours."
          />
        </RecordBody>
      </RecordCard>
    </div>
  ),
};

/** Sessions as rows in a panel: the device, when it was last seen, and the way to end it. */
export const Rows: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Panel title="Sessions" heading={2}>
        <RecordCard title="MacBook Pro · Vienna" layout="row" heading={false}>
          {tile("Laptop", <Laptop aria-hidden />, true)}
          <RecordDetail>Last seen 09:12:04Z · 10.4.2.18</RecordDetail>
          <RecordStatus>
            <StatusPill tone="ok">this device</StatusPill>
          </RecordStatus>
        </RecordCard>
        <RecordCard title="iPhone · Graz" layout="row" heading={false}>
          {tile("Phone", <Smartphone aria-hidden />)}
          <RecordDetail>Last seen 2026-09-21T18:40:11Z · 10.4.9.71</RecordDetail>
          <RecordActions>
            <Button variant="danger" size="sm">
              End session
            </Button>
          </RecordActions>
        </RecordCard>
        <RecordCard title="Firefox · Linz" layout="row" heading={false}>
          {tile("Laptop", <Laptop aria-hidden />)}
          <RecordDetail>Last seen 2026-09-19T07:02:44Z · 2001:db8::4f</RecordDetail>
          <RecordActions>
            <Button variant="danger" size="sm">
              End session
            </Button>
          </RecordActions>
        </RecordCard>
      </Panel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = [...canvasElement.querySelectorAll(".di-record-row")];
    await expect(rows).toHaveLength(3);
    // A timestamp never breaks inside itself.
    for (const item of canvasElement.querySelectorAll(".di-meta-line-item")) {
      const text = item.textContent ?? "";
      if (/\d{4}-\d{2}-\d{2}T/.test(text)) {
        const range = document.createRange();
        range.selectNodeContents(item);
        const lines = new Set([...range.getClientRects()].map((r) => Math.round(r.top)));
        await expect(lines.size).toBe(1);
      }
    }
  },
};

/** Notification channels: the state, the address each resolves to, and the terms behind it. */
export const Channels: Story = {
  render: () => (
    <Grid min="260px" gap={16}>
      <RecordCard title="Email notifications">
        <RecordStatus>
          <StatusPill tone="ok">enabled</StatusPill>
        </RecordStatus>
        <RecordValue>
          <Mail aria-hidden />
          n****@data-insights.ai
        </RecordValue>
        <FactList layout="pairs">
          <Fact label="Kind">Email</Fact>
          <Fact label="Events">All severities</Fact>
          <Fact label="Last sent" mono={true}>
            09:12:04Z
          </Fact>
        </FactList>
      </RecordCard>
      <RecordCard title="Webhook">
        <RecordStatus>
          <StatusPill tone="warn">paused</StatusPill>
        </RecordStatus>
        <RecordValue>
          <Webhook aria-hidden />
          hooks.example.io/soc
        </RecordValue>
        <FactList layout="pairs">
          <Fact label="Kind">Webhook</Fact>
          <Fact label="Events">High and above</Fact>
          <Fact label="Last sent" mono={true}>
            08:47:10Z
          </Fact>
        </FactList>
      </RecordCard>
      <RecordCard title="Archive registry">
        <RecordStatus>
          <StatusPill tone="danger">failed</StatusPill>
        </RecordStatus>
        <RecordValue>archive.example.com</RecordValue>
        <FactList layout="pairs">
          <Fact label="Kind">Registry</Fact>
          <Fact label="Manifest" mono={true}>
            a4f9c21e
          </Fact>
          <Fact label="Last seen" mono={true}>
            08:44:02Z
          </Fact>
        </FactList>
      </RecordCard>
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    // A term never wraps: "Last seen" keeps its line.
    for (const term of canvasElement.querySelectorAll("dt")) {
      const range = document.createRange();
      range.selectNodeContents(term);
      await expect(new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size).toBe(1);
    }
  },
};

/** Long German words in a narrow card: the title breaks, the state moves under it, nothing overflows. */
export const LongLabels: Story = {
  args: { title: "Benachrichtigungsweiterleitung an Bereitschaftsdienst" },
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <RecordCard {...args}>
        <RecordStatus>
          <StatusPill tone="warn">vorübergehend angehalten</StatusPill>
        </RecordStatus>
        <RecordValue>bereitschaft@beispiel.at</RecordValue>
        <RecordFooter>
          <TextLink href="#settings">Einstellungen öffnen</TextLink>
        </RecordFooter>
      </RecordCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector(".di-record")!;
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
  },
};

// A German page lists a CVE by its English title: the title says its own
// language, so a screen reader reads it in English.
export const DataTitle: Story = {
  args: { title: "Example Firewall OS heap overflow in the SSL VPN portal", lang: "en" },
  render: (args) => (
    <div lang="de">
      <RecordCard {...args}>
        <Tag mono lang="en" title="Example Firewall OS heap overflow in the SSL VPN portal">
          CVE-2026-900010
        </Tag>
      </RecordCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector(".di-record-title")?.getAttribute("lang")).toBe("en");
    await expect(canvasElement.querySelector(".di-tag")?.getAttribute("lang")).toBe("en");
  },
};

/** Projects as rows that each open their page: the whole row is the target, a chevron at its end says so without hover. */
export const LinkedRows: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <Panel title="Projects" heading={2}>
        <RecordCard title="Weekly digest" layout="row" heading={false} href="#weekly-digest">
          {tile("Project", <Boxes aria-hidden />)}
          <RecordDetail>4 editions · latest week 24</RecordDetail>
          <RecordStatus>
            <StatusPill tone="warn">1 awaiting</StatusPill>
          </RecordStatus>
        </RecordCard>
        <RecordCard
          title="Team updates"
          layout="row"
          heading={false}
          // eslint-disable-next-line jsx-a11y/anchor-has-content -- the record renders its title into the router's anchor
          render={<a href="#team-updates" />}
        >
          {tile("Project", <Boxes aria-hidden />)}
          <RecordDetail>3 editions · latest week 23</RecordDetail>
        </RecordCard>
      </Panel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The title names the link, with href and with a router's element in render.
    const first = canvas.getByRole("link", { name: "Weekly digest" });
    await expect(first).toHaveAttribute("href", "#weekly-digest");
    await expect(canvas.getByRole("link", { name: "Team updates" })).toHaveAttribute("href", "#team-updates");
    // Any point of the row lands on its link: the detail, the state, the chevron.
    for (const row of canvasElement.querySelectorAll(".di-record-row")) {
      const link = row.querySelector(".di-record-link");
      for (const part of row.querySelectorAll(".di-record-detail, .di-record-status, .di-record-go")) {
        part.scrollIntoView({ block: "center" });
        const box = part.getBoundingClientRect();
        const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
        await expect(hit?.closest(".di-record-link")).toBe(link);
      }
    }
    // A linked row without actions ends in a chevron a screen reader does not read.
    await expect(canvasElement.querySelectorAll(".di-record-go")).toHaveLength(2);
    await expect(canvasElement.querySelector(".di-record-go")).toHaveAttribute("aria-hidden", "true");
  },
};

/** A record's menu: a "⋯" button that opens its actions. */
function RowMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Menu
      open={open}
      onOpenChange={setOpen}
      label={`Actions for ${name}`}
      align="end"
      trigger={(props) => (
        <Button {...props} variant="ghost" iconOnly={true} aria-label={`Actions for ${name}`}>
          <MoreHorizontal aria-hidden />
        </Button>
      )}
    >
      <MenuItem onSelect={() => setOpen(false)}>Archive</MenuItem>
      <MenuItem tone="danger" onSelect={() => setOpen(false)}>
        Delete
      </MenuItem>
    </Menu>
  );
}

/**
 * On a phone the name keeps its line. A linked row keeps its chevron and a
 * row keeps its play button or its menu at its end, beside the name, the
 * state going under the name; a labelled action goes under the name with it.
 */
export const RowsOnAPhone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  render: () => (
    <Panel title="Recently heard" heading={2}>
      <RecordCard title="Weekly digest" layout="row" heading={false} href="#weekly-digest">
        {tile("Project", <Boxes aria-hidden />)}
        <RecordDetail>4 editions · latest week 24</RecordDetail>
        <RecordStatus>
          <StatusPill tone="warn">1 awaiting</StatusPill>
        </RecordStatus>
      </RecordCard>
      <RecordCard title="Team updates" layout="row" heading={false}>
        {tile("Project", <Boxes aria-hidden />)}
        <RecordDetail>Week 23 · heard 2026-09-21</RecordDetail>
        <RecordActions>
          <Button variant="secondary" iconOnly={true} aria-label="Play">
            <Play aria-hidden />
          </Button>
        </RecordActions>
      </RecordCard>
      <RecordCard title="iPhone · Graz" layout="row" heading={false}>
        {tile("Phone", <Smartphone aria-hidden />)}
        <RecordDetail>Last seen 2026-09-21T18:40:11Z</RecordDetail>
        <RecordActions>
          <Button variant="danger" size="sm">
            End session
          </Button>
        </RecordActions>
      </RecordCard>
      <RecordCard title="Archive sources" layout="row" heading={false}>
        {tile("Project", <Boxes aria-hidden />)}
        <RecordDetail>487 entries · paused</RecordDetail>
        <RecordStatus>
          <StatusPill tone="warn">paused</StatusPill>
        </RecordStatus>
        <RecordActions>
          <RowMenu name="Archive sources" />
        </RecordActions>
      </RecordCard>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    await expect(window.innerWidth).toBe(390);
    const [linked, played, ended, menued] = [...canvasElement.querySelectorAll<HTMLElement>(".di-record-row")];
    const box = (row: HTMLElement, selector: string) => row.querySelector(selector)!.getBoundingClientRect();
    const sameLine = (a: DOMRect, b: DOMRect) => a.top < b.bottom && b.top < a.bottom;
    // An icon stays at the row's end, beside the name, never under it.
    for (const [row, selector] of [
      [linked, ".di-record-go"],
      [played, ".di-btn"],
      [menued, ".di-menu-anchor"],
    ] as const) {
      await expect(sameLine(box(row, selector), box(row, ".di-record-name"))).toBe(true);
      await expect(box(row, selector).left).toBeGreaterThanOrEqual(box(row, ".di-record-name").right);
    }
    // The state goes under the name, on its edge.
    await expect(box(linked, ".di-record-status").top).toBeGreaterThanOrEqual(box(linked, ".di-record-title").bottom);
    await expect(
      Math.abs(box(linked, ".di-record-status").left - box(linked, ".di-record-title").left),
    ).toBeLessThanOrEqual(1);
    // A labelled action goes under the name, so the name keeps its line.
    await expect(box(ended, ".di-btn").top).toBeGreaterThanOrEqual(box(ended, ".di-record-title").bottom);
  },
};
