import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Stack } from "../../../layout/arrange/Stack";
import { PageHeader, PageHeaderTitle } from "../../../layout/page/PageHeader";
import { Panel } from "../../../layout/page/Panel";
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
  title: "Text/Blocks/CodeBlock",
  component: CodeBlock,
  tags: ["layer:primitive", "autodocs"],
  args: { label: "Raw record", children: JSON.stringify(record, null, 2) },
  argTypes: { children: { control: "text" }, variant: { control: "inline-radio", options: ["record", "log"] } },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Under a signal's facts: the row as Defender sent it, wrapped rather than
 * cut, reachable from the keyboard. A wrapped line hangs in from its own
 * indent, and the path breaks after a backslash, never inside "v1.0".
 */
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
    for (const line of region.querySelectorAll<HTMLElement>(".di-codeblock-line")) {
      const box = line.getBoundingClientRect();
      const hang = box.left + parseFloat(getComputedStyle(line).paddingInlineStart);
      const range = document.createRange();
      range.selectNodeContents(line);
      const rows = Array.from(range.getClientRects()).filter((rect) => rect.width > 0);
      const first = Math.min(...rows.map((rect) => rect.top));
      for (const rect of rows.filter((rect) => rect.top > first + 2)) {
        await expect(rect.left).toBeGreaterThanOrEqual(hang - 1);
      }
    }
    const walker = document.createTreeWalker(region, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const at = node.data.indexOf("v1.0");
      if (at < 0) continue;
      const range = document.createRange();
      range.setStart(node, at);
      range.setEnd(node, at + 4);
      await expect(new Set(Array.from(range.getClientRects()).map((rect) => Math.round(rect.top))).size).toBe(1);
    }
  },
};

/**
 * A long log scrolls inside its frame, so the page around it keeps its
 * length; here on a record page, under its section title. A log is read down
 * its line starts, so its lines never wrap: on a phone the block scrolls
 * sideways and its hiding edge fades.
 */
export const Long: Story = {
  args: {
    label: "Collector log",
    variant: "log",
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
    const code = region.querySelector("code")!;
    const row = parseFloat(getComputedStyle(code).lineHeight);
    await expect(code.getBoundingClientRect().height).toBeLessThanOrEqual(40 * row + 1);
    if (region.scrollWidth > region.clientWidth + 1) {
      await waitFor(() => expect(region).toHaveClass("is-more-end"));
      await expect(getComputedStyle(region).maskImage).toContain("gradient");
    }
  },
};
