import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Globe, ShieldCheck, Timer } from "lucide-react";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Status/StatusPill",
  component: StatusPill,
  tags: ["layer:primitive", "autodocs"],
  args: {
    tone: "ok",
    dot: true,
    track: "record",
    children: "running",
  },
  argTypes: {
    tone: {
      control: "radio",
      options: ["ok", "warn", "danger", "recorded", "neutral", "inferred"],
    },
    dot: { control: "boolean" },
    track: { control: "radio", options: ["record", "prose"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Beside the names it qualifies, in a list a person scans: the word carries the state, the dot confirms it. */
export const InAList: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ul style={{ display: "grid", gap: "var(--di-gap-8)", maxWidth: 420, margin: 0, padding: 0, listStyle: "none" }}>
      {[
        ["Firewall feed, Vienna", "ok", "running"],
        ["Mail gateway", "warn", "paused"],
        ["Domain controller export", "danger", "failed"],
        ["Endpoint sensor fleet", "neutral", "queued"],
      ].map(([name, tone, word]) => (
        <li key={name} style={{ display: "flex", justifyContent: "space-between", gap: "var(--di-gap-12)" }}>
          <span>{name}</span>
          <StatusPill tone={tone as "ok" | "warn" | "danger" | "neutral"}>{word}</StatusPill>
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("running")).toBeVisible();
  },
};

/** Where a query is processed and how long it is kept: an icon in place of the dot. Both, or neither. */
export const Privacy: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
  ),
};

/** The whole set. Every word clears 5:1 on its own wash. */
export const AllTones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <StatusPill tone="ok">running</StatusPill>
      <StatusPill tone="warn">paused</StatusPill>
      <StatusPill tone="danger">failed</StatusPill>
      <StatusPill tone="recorded">sealed</StatusPill>
      <StatusPill tone="neutral">queued</StatusPill>
      <StatusPill tone="inferred">ai insight</StatusPill>
    </div>
  ),
};

/** The same six on the night sheet, each still above 5:1 on its wash. */
export const NightSheet: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      data-theme="dark"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--di-space-8)",
        padding: "var(--di-space-16)",
        borderRadius: "var(--di-radius-surface)",
        background: "var(--di-bg-page)",
      }}
    >
      <StatusPill tone="ok">running</StatusPill>
      <StatusPill tone="warn">paused</StatusPill>
      <StatusPill tone="danger">failed</StatusPill>
      <StatusPill tone="recorded">sealed</StatusPill>
      <StatusPill tone="neutral">queued</StatusPill>
      <StatusPill tone="inferred">ai insight</StatusPill>
    </div>
  ),
};

/** In the reading font, among prose, in German: the state of a licence on a page a person reads. */
export const Prose: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--di-gap-8)", maxWidth: 420 }}>
      Lizenz für den Arbeitsbereich Produktion
      <StatusPill tone="ok">Gültig bis 31. Dezember</StatusPill>
      <StatusPill tone="inferred">Verlängerung vorgeschlagen</StatusPill>
    </p>
  ),
};
