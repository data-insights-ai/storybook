import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Stack } from "../../layout/arrangement/Stack";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { Panel } from "../../layout/page/Panel";
import { CodeBlock } from "./CodeBlock";

const record = {
  Timestamp: "2026-10-22T08:12:04.221Z",
  DeviceName: "ws-vie-014.corp.example",
  ActionType: "LogonSuccess",
  LogonType: "RemoteInteractive",
  AccountName: "nora.feld",
  RemoteIP: "203.0.113.9",
  InitiatingProcessFileName: "lsass.exe",
  CommandLine:
    "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkA",
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

/** Under a signal's facts: the row as Defender sent it, wrapped rather than cut, reachable from the keyboard. */
export const Raw: Story = {
  render: (args) => (
    <Panel title="Logon on ws-vie-014" heading={2}>
      <CodeBlock {...args} />
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("region", { name: "Raw record" });
    await expect(region).toBeVisible();
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth);
  },
};

/** A long log scrolls inside its frame, so the page around it keeps its length; here on a record page, under its section title. */
export const Long: Story = {
  args: {
    label: "Collector log",
    children: Array.from(
      { length: 40 },
      (_, i) =>
        `2026-10-22T08:${String(12 + Math.floor(i / 6)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}Z info  forwarded batch ${4100 + i} (512 events) to splunk-hec`,
    ).join("\n"),
  },
  render: (args) => (
    <Stack gap={12}>
      <PageHeader level={2}>
        <PageHeaderTitle>Collector vie-01</PageHeaderTitle>
      </PageHeader>
      <CodeBlock {...args} />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole("region", { name: "Collector log" });
    await expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);
    await expect(region).toHaveAttribute("tabindex", "0");
  },
};
