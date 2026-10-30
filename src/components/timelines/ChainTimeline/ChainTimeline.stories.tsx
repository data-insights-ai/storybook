import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Panel } from "../../layout/page/Panel";
import { ChainTimeline } from "./ChainTimeline";

const lanes = [
  { id: "ws", label: "ws-vie-014", detail: "workstation · medium" },
  { id: "fs", label: "fs-muc-102", detail: "file server · high" },
  { id: "dc", label: "dc-vie-001", detail: "domain controller · crown jewel" },
];

const events = [
  { id: "1", lane: "ws", at: 0, label: "08:12 Sign-in from a public address" },
  { id: "2", lane: "ws", at: 14, label: "08:15 Domain trust discovery" },
  { id: "3", lane: "fs", at: 41, label: "08:21 Network sign-in as local admin" },
  { id: "4", lane: "fs", at: 45, label: "08:22 Remote service started" },
  { id: "5", lane: "dc", at: 86, label: "08:31 Network sign-in as local admin" },
  { id: "6", lane: "dc", at: 100, label: "08:34 Remote service started" },
];

const meta = {
  title: "Timelines/ChainTimeline",
  component: ChainTimeline,
  tags: ["layer:block", "autodocs"],
  args: {
    label: "Attack chain over three devices, 08:12 to 08:34",
    lanes,
    events,
    startLabel: "08:12",
    endLabel: "08:34",
    ticks: [
      { at: 23, label: "+5 min" },
      { at: 45, label: "+10 min" },
      { at: 68, label: "+15 min" },
      { at: 91, label: "+20 min" },
    ],
    onSelect: fn(),
    onHover: fn(),
  },
  decorators: [
    (Story, { parameters }) => (
      <Panel title={(parameters.panel as string | undefined) ?? "How it spread"}>
        <Story />
      </Panel>
    ),
  ],
  argTypes: {
    lanes: { control: false },
    events: { control: false },
    ticks: { control: false },
    onSelect: { control: false },
    onHover: { control: false },
  },
} satisfies Meta<typeof ChainTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Six steps over three devices: each hop to the next lane is one stepped line. */
export const Lateral: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: /attack chain/i })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: /08:22 remote service started/i }));
    await expect(args.onSelect).toHaveBeenCalledWith("4");
    // A pointer click leaves no ring; the test's synthetic click would, so the story ends without focus.
    (document.activeElement as HTMLElement | null)?.blur();
  },
};

/** The open step stays marked while its evidence is read beside the chain. */
export const Selected: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState("3");
    return <ChainTimeline {...args} selected={selected} onSelect={setSelected} />;
  },
};

/** A chain the AI SOC withdrew: its last step is marked as such. */
export const Withdrawn: Story = {
  args: {
    label: "Exclusion chain on one device, withdrawn after five minutes",
    lanes: [lanes[0]],
    events: [
      { id: "1", lane: "ws", at: 0, label: "09:00 Antivirus exclusion added" },
      { id: "2", lane: "ws", at: 20, label: "09:01 File dropped in the excluded folder" },
      { id: "3", lane: "ws", at: 100, label: "09:05 Exclusion removed by policy", tone: "danger" },
    ],
    startLabel: "09:00",
    endLabel: "09:05",
    onSelect: undefined,
  },
};

/** Two steps seconds apart on one lane are drawn as one marker named by their range. */
export const Clustered: Story = {
  args: {
    events: [
      { id: "1", lane: "ws", at: 0, label: "08:12 Sign-in from a public address" },
      { id: "2", lane: "ws", at: 0.4, label: "08:12 Domain trust discovery" },
      { id: "3", lane: "fs", at: 60, label: "08:25 Network sign-in as local admin" },
      { id: "4", lane: "fs", at: 100, label: "08:34 Remote service started" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: /public address; .*discovery/i })).toHaveTextContent("01–02");
  },
};

/**
 * German lane names and details, on a phone: the lane column takes about a
 * quarter of the width and ends a long name in an ellipsis; tick labels that
 * would touch give way, the two ends always stay.
 */
export const German: Story = {
  parameters: { panel: "Wie es sich ausgebreitet hat" },
  args: {
    label: "Angriffskette über drei Geräte, 08:12 bis 08:34",
    lanes: [
      { id: "ws", label: "Arbeitsplatzrechner-Wien-014", detail: "Arbeitsplatz · mittlere Kritikalität" },
      { id: "fs", label: "Dateiserver-München-102", detail: "Dateiserver · hohe Kritikalität" },
      { id: "dc", label: "Domänencontroller-Wien-001", detail: "Domänencontroller · Kronjuwel" },
    ],
    events: [
      { id: "1", lane: "ws", at: 0, label: "08:12 Anmeldung von einer öffentlichen Adresse" },
      { id: "2", lane: "ws", at: 14, label: "08:15 Erkundung der Domänenvertrauensstellungen" },
      { id: "3", lane: "fs", at: 41, label: "08:21 Netzwerkanmeldung als lokaler Administrator" },
      { id: "4", lane: "dc", at: 86, label: "08:31 Netzwerkanmeldung als lokaler Administrator" },
      { id: "5", lane: "dc", at: 100, label: "08:34 Remotedienst gestartet" },
    ],
    ticks: [
      { at: 23, label: "+5 Min." },
      { at: 45, label: "+10 Min." },
      { at: 68, label: "+15 Min." },
      { at: 91, label: "+20 Min." },
    ],
  },
  play: async ({ canvasElement }) => {
    const shown = [
      ...canvasElement.querySelectorAll(
        ".di-chain-axis > span:not(.di-chain-axis-ticks), .di-chain-axis-tick:not(.is-hidden)",
      ),
    ].map((el) => el.getBoundingClientRect());
    const ticks = shown.slice(1, -1).filter((box) => box.width > 0);
    for (let i = 1; i < ticks.length; i++) await expect(ticks[i]!.left).toBeGreaterThan(ticks[i - 1]!.right);
    const frame = canvasElement.querySelector(".di-chain")!.getBoundingClientRect();
    for (const box of shown) await expect(box.right).toBeLessThanOrEqual(frame.right + 0.5);
  },
};
