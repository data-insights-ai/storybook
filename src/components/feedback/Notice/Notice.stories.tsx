import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchX, UserPlus } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Stack } from "../../layout/arrange/Stack";
import { Panel } from "../../layout/page/Panel";
import { TextLink } from "../../text/TextLink";
import { MetaLine } from "../../text/MetaLine";
import { Notice, NoticeAction, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "./Notice";

const meta = {
  title: "Feedback/Notice",
  component: Notice,
  subcomponents: { NoticeIcon, NoticeText, NoticeTitle, NoticeBody, NoticeAction },
  tags: ["layer:block", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** a message about the system that is part of the page: something to know or act on, something absent, or that nothing needs the reader.",
          "**When to use:** a state of the workspace or the record above the content (`banner`); in place of a list, a table or a panel's content that is empty or failed to load (`empty`); the first block of an overview when nothing is due (`line`). **When not to:** a receipt for an action the reader just took is a `Toast`; a field's own error is its `FieldHint`; a question before a destructive action is a `ConfirmDialog`; a single state word beside a record is a `StatusPill`.",
          "**Anatomy:** `NoticeIcon` (optional; without children it draws the tone's own icon), `NoticeTitle` (with an optional `eyebrow`), `NoticeBody`, `NoticeAction`. In a `banner` the title and body sit in one `NoticeText`.",
          "**Variants:** `tone` neutral, ok, warn, danger colours the icon and, in a banner, its column. `variant` banner (the default), `empty` (centred in place of content), `line` (one ruled line with the tone's dot).",
          '**States:** an empty result and an absent configuration are different facts and never share a screen; a failure to load is `empty` with `tone="danger"`.',
          "**Content rules:** the title says what happened or what is absent in one sentence; the body says why or what follows; an `empty` notice offers exactly one way out, a banner at most two; `mono` only for a query, a path or an id.",
          "**Accessibility:** a banner is a `note`; an `empty` notice is a `status`, so a search that found nothing is announced; `danger` is an `alert` in every variant. The icon is hidden from screen readers: the title carries the meaning.",
        ].join("\n\n"),
      },
    },
  },
  args: {
    tone: "neutral",
    variant: "banner",
    children: null,
  },
  argTypes: {
    tone: { control: "radio", options: ["neutral", "ok", "warn", "danger"] },
    variant: { control: "radio", options: ["banner", "empty", "line"] },
    children: { control: false },
  },
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

/** In use: a banner above the content it concerns, with the one action that answers it. */
export const OnAPage: Story = {
  args: { tone: "warn" },
  render: (args) => (
    <Stack gap={16}>
      <Notice {...args}>
        <NoticeIcon />
        <NoticeText>
          <div>
            <NoticeTitle>The signing key expires in six days.</NoticeTitle>
            <NoticeBody>After 2026-09-29 no new entry can be sealed with it.</NoticeBody>
          </div>
          <NoticeAction>
            <Button variant="secondary" size="sm">
              Rotate key
            </Button>
          </NoticeAction>
        </NoticeText>
      </Notice>
      <Panel title="Signing keys" heading={2}>
        <MetaLine items="2 keys · 1 active · rotated 2026-03-29" />
      </Panel>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("note")).toBeVisible();
  },
};

export const Neutral: Story = {
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon />
      <NoticeText>
        <div>
          <NoticeTitle>Six sources are waiting on a first seal.</NoticeTitle>
          <NoticeBody>They are ingesting, but nothing from them can be cited yet.</NoticeBody>
        </div>
        <NoticeAction>
          <Button variant="secondary" size="sm">
            Review
          </Button>
        </NoticeAction>
      </NoticeText>
    </Notice>
  ),
};

export const Ok: Story = {
  args: { tone: "ok" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon />
      <NoticeText>
        <div>
          <NoticeTitle>The register is sealed through 2026-09-18.</NoticeTitle>
          <NoticeBody>Every entry up to that point carries a verifiable hash.</NoticeBody>
        </div>
      </NoticeText>
    </Notice>
  ),
};

/** `danger` takes `role="alert"`, so it is announced when it appears. */
export const Danger: Story = {
  args: { tone: "danger" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon />
      <NoticeText>
        <div>
          <NoticeTitle>Ingest from archive.example.com failed.</NoticeTitle>
          <NoticeBody>Connection reset after 2 of 14 batches. Nothing was written.</NoticeBody>
        </div>
        <NoticeAction>
          <Button variant="secondary" size="sm">
            Open log
          </Button>
        </NoticeAction>
      </NoticeText>
    </Notice>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("alert")).toBeVisible();
  },
};

/** The body in the mono track, where it holds an identifier. */
export const MonoBody: Story = {
  args: { tone: "danger" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon />
      <NoticeText>
        <div>
          <NoticeTitle>The manifest did not verify.</NoticeTitle>
          <NoticeBody mono={true}>expected a4f9c21e · found 5e0d3a91</NoticeBody>
        </div>
      </NoticeText>
    </Notice>
  ),
};

/** Title only, with no second line and no action. */
export const TitleOnly: Story = {
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon />
      <NoticeText>
        <div>
          <NoticeTitle>Demo data is on. Nothing on this page is sealed.</NoticeTitle>
        </div>
      </NoticeText>
    </Notice>
  ),
};

/** Two actions: the requested one as the button, a way to the full page as a link. */
export const TwoActions: Story = {
  args: { tone: "warn" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon />
      <NoticeText>
        <div>
          <NoticeTitle>Nobody reviews the register yet.</NoticeTitle>
          <NoticeBody>Appoint a reviewer to seal entries.</NoticeBody>
        </div>
        <NoticeAction>
          <Button size="sm">Appoint me</Button>
          <TextLink href="#reviewers">Choose someone</TextLink>
        </NoticeAction>
      </NoticeText>
    </Notice>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Appoint me" }).getBoundingClientRect();
    const link = canvas.getByRole("link", { name: "Choose someone" }).getBoundingClientRect();
    const frame = canvas.getByRole("note").getBoundingClientRect();
    const apart = document.documentElement.dataset.density === "compact" ? 8 : 12;
    await expect(link.left - button.right).toBeGreaterThanOrEqual(apart);
    await expect(frame.right - link.right).toBeGreaterThanOrEqual(12);
  },
};

/** Long German wording: the title wraps balanced, the action goes under the copy on a phone. */
export const German: Story = {
  args: { tone: "warn" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon />
      <NoticeText>
        <div>
          <NoticeTitle>Die Lizenz ist abgelaufen. Der Arbeitsbereich ist schreibgeschützt.</NoticeTitle>
          <NoticeBody>
            Anzeige, Datenerfassung und Alarmierung laufen weiter; Änderungen warten auf eine erneuerte Lizenz.
          </NoticeBody>
        </div>
        <NoticeAction>
          <Button variant="secondary" size="sm">
            Lizenzdetails anzeigen
          </Button>
        </NoticeAction>
      </NoticeText>
    </Notice>
  ),
};

/** On a phone the action moves under the copy, so the copy keeps its width. */
export const PhoneWidth: Story = {
  render: (args) => (
    <div style={{ width: 360 }}>
      <Notice {...args} tone="warn">
        <NoticeIcon />
        <NoticeText>
          <div>
            <NoticeTitle>The license has expired. The workspace is read-only.</NoticeTitle>
            <NoticeBody>Viewing, collection and alerting continue; changes wait for a renewed license.</NoticeBody>
          </div>
          <NoticeAction>
            <Button variant="secondary" size="sm">
              License details
            </Button>
          </NoticeAction>
        </NoticeText>
      </Notice>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByText(/license has expired/);
    const action = canvas.getByRole("button", { name: "License details" });
    await expect(action.getBoundingClientRect().top).toBeGreaterThan(title.getBoundingClientRect().bottom);
  },
};

/**
 * Title and body straight inside `NoticeText`, the action beside it rather
 * than inside: the action still keeps the notice's inset and sits in line
 * with the copy, and the title keeps the copy's full width.
 */
export const ActionBesideText: Story = {
  args: { tone: "warn" },
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 16 }}>
      <div style={{ width: 720, maxWidth: "100%" }} data-testid="wide">
        <Notice {...args}>
          <NoticeIcon />
          <NoticeText>
            <NoticeTitle>Staff account required</NoticeTitle>
            <NoticeBody>The operator console opens only with a staff account. Sign out and sign in with it.</NoticeBody>
          </NoticeText>
          <NoticeAction>
            <Button variant="secondary" size="sm">
              Sign out
            </Button>
          </NoticeAction>
        </Notice>
      </div>
      <div style={{ width: 360, maxWidth: "100%" }} data-testid="phone">
        <Notice {...args}>
          <NoticeIcon />
          <NoticeText>
            <NoticeTitle>Staff account required</NoticeTitle>
            <NoticeBody>The operator console opens only with a staff account.</NoticeBody>
          </NoticeText>
          <NoticeAction>
            <Button variant="secondary" size="sm">
              Sign out
            </Button>
          </NoticeAction>
        </Notice>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const id of ["wide", "phone"]) {
      const area = within(within(canvasElement).getByTestId(id));
      const frame = area.getByRole("note").getBoundingClientRect();
      const button = area.getByRole("button", { name: "Sign out" }).getBoundingClientRect();
      const title = area.getByText("Staff account required").getBoundingClientRect();
      const body = area.getByText(/opens only with a staff account/).getBoundingClientRect();
      await expect(frame.right - button.right).toBeGreaterThanOrEqual(12);
      await expect(button.top - frame.top).toBeGreaterThanOrEqual(12);
      await expect(body.top).toBeGreaterThan(title.bottom - 1);
      if (id === "wide" && frame.width > 600) {
        await expect(button.left).toBeGreaterThan(body.right - 1);
      } else {
        await expect(button.top).toBeGreaterThan(body.bottom);
      }
    }
  },
};

/**
 * Empty, in use: a filter found nothing, so the notice takes the list's
 * place inside its panel and offers the one way back. It sinks to the inset
 * tone, never a card on the card.
 */
export const EmptyInAPanel: Story = {
  args: { variant: "empty" },
  render: (args) => (
    <Panel title="Sources" heading={2}>
      <Notice {...args}>
        <NoticeIcon>
          <SearchX />
        </NoticeIcon>
        <NoticeTitle eyebrow="No results">No source matches this filter.</NoticeTitle>
        <NoticeBody>The register holds 24 sources. None of them was paused in the last 24 hours.</NoticeBody>
        <NoticeAction>
          <Button variant="secondary" size="sm">
            Clear filters
          </Button>
        </NoticeAction>
      </Notice>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole("status");
    await expect(status).toHaveTextContent("No source matches this filter.");
    const frame = status.getBoundingClientRect();
    const title = canvas.getByText("No source matches this filter.").getBoundingClientRect();
    await expect(Math.abs(title.left - frame.left - (frame.right - title.right))).toBeLessThanOrEqual(1);
  },
};

/** Empty, first use: no eyebrow where the page names the place, an icon and the one action. */
export const EmptyFirstUse: Story = {
  args: { variant: "empty" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon>
        <UserPlus />
      </NoticeIcon>
      <NoticeTitle>No invitations yet.</NoticeTitle>
      <NoticeBody>Invite colleagues by email. They join with the role you choose.</NoticeBody>
      <NoticeAction>
        <Button>Invite people</Button>
      </NoticeAction>
    </Notice>
  ),
};

/** Empty because nothing is configured: a different fact from no results, never on the same screen. */
export const EmptyNotConfigured: Story = {
  args: { variant: "empty" },
  render: (args) => (
    <Notice {...args}>
      <NoticeTitle eyebrow="Nothing configured">This workspace has no sources yet.</NoticeTitle>
      <NoticeBody>Connect a source to start a register. Nothing is sealed until the first entry lands.</NoticeBody>
      <NoticeAction>
        <Button>Connect a source</Button>
      </NoticeAction>
    </Notice>
  ),
};

/** Empty, with the query itself in the mono track. */
export const EmptyMonoBody: Story = {
  args: { variant: "empty" },
  render: (args) => (
    <Notice {...args}>
      <NoticeTitle eyebrow="No results">No source matches this query.</NoticeTitle>
      <NoticeBody mono={true}>host:*.example.io AND state:paused AND seen&gt;2026-09-22T09:00:00Z</NoticeBody>
      <NoticeAction>
        <Button variant="secondary" size="sm">
          Edit query
        </Button>
      </NoticeAction>
    </Notice>
  ),
};

/** Empty because loading failed: a boundary the system hit, announced as an alert. */
export const EmptyFailure: Story = {
  args: { variant: "empty", tone: "danger" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon />
      <NoticeTitle eyebrow="Could not load">The register could not be read.</NoticeTitle>
      <NoticeBody>
        The seal store did not answer within 30 seconds. Nothing was written and nothing was lost.
      </NoticeBody>
      <NoticeAction>
        <Button>Retry</Button>
      </NoticeAction>
    </Notice>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("alert")).toHaveTextContent("The register could not be read.");
  },
};

/** Empty with nothing to do about it: no action. */
export const EmptyWithoutAction: Story = {
  args: { variant: "empty" },
  render: (args) => (
    <Notice {...args}>
      <NoticeTitle eyebrow="Out of scope">This view is limited to sealed entries.</NoticeTitle>
      <NoticeBody>Unsealed entries exist, but an auditor key cannot read them.</NoticeBody>
    </Notice>
  ),
};

/** Empty, in German: the measure holds and the action stays one centred button. */
export const EmptyGerman: Story = {
  args: { variant: "empty" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon>
        <SearchX />
      </NoticeIcon>
      <NoticeTitle eyebrow="Keine Ergebnisse">Keine Datenquelle entspricht diesem Filter.</NoticeTitle>
      <NoticeBody>
        Das Verzeichnis enthält 24 Datenquellen. Keine davon wurde in den letzten 24 Stunden pausiert.
      </NoticeBody>
      <NoticeAction>
        <Button variant="secondary" size="sm">
          Alle Filter zurücksetzen
        </Button>
      </NoticeAction>
    </Notice>
  ),
};

/** Line: the first block of an overview when nothing needs the reader, and what the calm rests on. */
export const LineAllClear: Story = {
  args: { variant: "line", tone: "ok" },
  render: (args) => (
    <Notice {...args}>
      <NoticeTitle>Everything is running</NoticeTitle>
      <NoticeBody>
        <MetaLine items="14 sources delivering · nothing to decide before 30 Apr" />
      </NoticeBody>
    </Notice>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("note")).toHaveTextContent("Everything is running");
  },
};

/** Line, on a phone and in German: the facts drop under the title, breaking only between items. */
export const LineGerman: Story = {
  args: { variant: "line", tone: "ok" },
  render: (args) => (
    <div style={{ width: 360, maxWidth: "100%" }}>
      <Notice {...args}>
        <NoticeTitle>Alles läuft</NoticeTitle>
        <NoticeBody>
          <MetaLine items="14 Datenquellen liefern · vor dem 30. April ist nichts zu entscheiden" />
        </NoticeBody>
      </Notice>
    </div>
  ),
};
