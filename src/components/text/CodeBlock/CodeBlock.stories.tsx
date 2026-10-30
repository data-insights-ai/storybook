import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CodeBlock } from "./CodeBlock";

const record = {
  Timestamp: "2026-10-22T08:12:04.221Z",
  DeviceName: "ws-vie-014.corp.example",
  ActionType: "LogonSuccess",
  LogonType: "RemoteInteractive",
  AccountName: "nora.feld",
  RemoteIP: "203.0.113.9",
  InitiatingProcessFileName: "lsass.exe",
};

const meta = {
  title: "Text/CodeBlock",
  component: CodeBlock,
  tags: ["layer:primitive", "autodocs"],
  args: { label: "Raw record", children: JSON.stringify(record, null, 2) },
  argTypes: { children: { control: "text" } },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A raw row, wrapped rather than cut, reachable from the keyboard. */
export const Raw: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: "Raw record" })).toBeVisible();
  },
};
