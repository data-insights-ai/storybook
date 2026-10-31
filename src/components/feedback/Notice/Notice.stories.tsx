import type { Meta, StoryObj } from "@storybook/react-vite";
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
          "**Purpose:** a message about the system that is part of the page: something to know or act on, or that nothing needs the reader.",
          "**When to use:** a state of the workspace or the record above the content, or in place of content that failed to load (`banner`); the first block of an overview when nothing is due (`line`). **When not to:** content that is absent (no rows, no results, nothing set up) is an `EmptyState`; a receipt for an action the reader just took is a `Toast`; a field's own error is its `FieldHint`; a question before a destructive action is a `ConfirmDialog`; a single state word beside a record is a `StatusPill`.",
          "**Anatomy:** `NoticeIcon` (optional; without children it draws the tone's own icon), `NoticeTitle` (with an optional `eyebrow`), `NoticeBody`, `NoticeAction`. In a `banner` the title and body sit in one `NoticeText`.",
          "**Variants:** `tone` neutral, ok, warn, danger colours the icon and, in a banner, its column. `variant` banner (the default) or `line` (one ruled line with the tone's dot).",
          '**States:** a failure to load is a banner with `tone="danger"` in place of the content, with the one way out.',
          "**Content rules:** the title says what happened or what is absent in one sentence; the body says why or what follows; a banner offers at most two ways out; `mono` only for a query, a path or an id.",
          "**Accessibility:** a banner is a `note`; `danger` is an `alert` in every variant. The icon is hidden from screen readers: the title carries the meaning.",
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
    variant: { control: "radio", options: ["banner", "line"] },
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
            <NoticeBody>
              After <time dateTime="2026-09-29">2026-09-29</time> no new entry can be sealed with it.
            </NoticeBody>
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
    const date = canvasElement.querySelector("time")!;
    await expect(date.getClientRects()).toHaveLength(1);
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
    <div style={{ maxWidth: 360 }}>
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
    const note = canvas.getByRole("note").getBoundingClientRect();
    await expect(note.right).toBeLessThanOrEqual(canvasElement.getBoundingClientRect().right + 0.5);
    await expect(note.width).toBeLessThanOrEqual(360);
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
 * Content that failed to load is a failure, not an absence: a danger
 * banner in place of the list, inside its panel, with the one way out.
 * Announced as an alert.
 */
export const LoadFailed: Story = {
  args: { tone: "danger" },
  render: (args) => (
    <Panel title="Sources" heading={2}>
      <Notice {...args}>
        <NoticeIcon />
        <NoticeText>
          <NoticeTitle>The register could not be read.</NoticeTitle>
          <NoticeBody>
            The seal store did not answer within 30 seconds. Nothing was written and nothing was lost.
          </NoticeBody>
        </NoticeText>
        <NoticeAction>
          <Button variant="secondary" size="sm">
            Retry
          </Button>
        </NoticeAction>
      </Notice>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("alert")).toHaveTextContent("The register could not be read.");
  },
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
