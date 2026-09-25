import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { Notice, NoticeAction, NoticeBody, NoticeIcon, NoticeText, NoticeTitle } from "./Notice";

const meta = {
  title: "Blocks/Notice",
  component: Notice,
  tags: ["autodocs"],
  args: {
    tone: "neutral",
    children: null,
  },
  argTypes: {
    tone: { control: "radio", options: ["info", "ok", "warn", "danger"] },
    children: { control: false },
  },
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  name: "Neutral",
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon>
        <Info aria-hidden />
      </NoticeIcon>
      <NoticeText>
        <div>
          <NoticeTitle>Six sources are waiting on a first seal.</NoticeTitle>
          <NoticeBody>They are ingesting, but nothing from them can be cited yet.</NoticeBody>
        </div>
        <NoticeAction>
          <Button variant="secondary" size="dense">
            Review
          </Button>
        </NoticeAction>
      </NoticeText>
    </Notice>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("note")).toBeVisible();
  },
};

export const Ok: Story = {
  args: { tone: "ok" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon>
        <CheckCircle2 aria-hidden />
      </NoticeIcon>
      <NoticeText>
        <div>
          <NoticeTitle>The register is sealed through 2026-09-18.</NoticeTitle>
          <NoticeBody>Every entry up to that point carries a verifiable hash.</NoticeBody>
        </div>
      </NoticeText>
    </Notice>
  ),
};

export const Warn: Story = {
  args: { tone: "warn" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon>
        <AlertTriangle aria-hidden />
      </NoticeIcon>
      <NoticeText>
        <div>
          <NoticeTitle>The signing key expires in six days.</NoticeTitle>
          <NoticeBody>After 2026-09-29 no new entry can be sealed with it.</NoticeBody>
        </div>
        <NoticeAction>
          <Button variant="seal" size="dense">
            Rotate key
          </Button>
        </NoticeAction>
      </NoticeText>
    </Notice>
  ),
};

/** `danger` takes `role="alert"`, so it is announced when it appears. */
export const Danger: Story = {
  args: { tone: "danger" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon>
        <OctagonAlert aria-hidden />
      </NoticeIcon>
      <NoticeText>
        <div>
          <NoticeTitle>Ingest from archive.example.com failed.</NoticeTitle>
          <NoticeBody>Connection reset after 2 of 14 batches. Nothing was written.</NoticeBody>
        </div>
        <NoticeAction>
          <Button variant="secondary" size="dense">
            Open log
          </Button>
        </NoticeAction>
      </NoticeText>
    </Notice>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toBeVisible();
  },
};

/** The body in the mono track, where it holds a path or a query. */
export const MonoBody: Story = {
  args: { tone: "danger" },
  render: (args) => (
    <Notice {...args}>
      <NoticeIcon>
        <OctagonAlert aria-hidden />
      </NoticeIcon>
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
      <NoticeIcon>
        <Info aria-hidden />
      </NoticeIcon>
      <NoticeText>
        <div>
          <NoticeTitle>Demo data is on. Nothing on this page is sealed.</NoticeTitle>
        </div>
      </NoticeText>
    </Notice>
  ),
};
