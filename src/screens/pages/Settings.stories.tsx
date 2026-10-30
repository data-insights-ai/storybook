import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ProductShell } from "../shell/ProductShell";
import { expectEndClearOfFootBand } from "./footBand.sample";
import { SettingsScreen } from "./Settings";

const meta = {
  title: "Patterns/Settings",
  tags: ["layer:screen", "!autodocs"],
  component: SettingsScreen,
  parameters: { layout: "fullscreen" },
  args: { changed: false },
  decorators: [
    (Story) => (
      <ProductShell area="workspace" active="settings" crumbs={["Example Security GmbH", "Production", "Settings"]}>
        <Story />
      </ProductShell>
    ),
  ],
} satisfies Meta<typeof SettingsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Three sections, each named by what it governs; nothing to save while nothing changed. */
export const Workspace: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Settings" })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Notification channels" })).toBeVisible();
    await expect(canvas.queryByRole("region", { name: "Unsaved changes" })).toBeNull();
    // The webhook address wraps only at its boundaries: every line after the first starts on a separator.
    const address = Array.from(canvasElement.querySelectorAll(".di-record-value > span")).find(
      (value) => value.textContent === "https://hooks.data-insights.ai/events",
    )!;
    for (const line of linesOf(address).slice(1)) await expect(line).toMatch(/^[/.\-_?#%~&=@]/);
  },
};

/** The text of each rendered line of an element, read glyph by glyph. */
function linesOf(element: Element) {
  const lines = new Map<number, string>();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    for (let i = 0; i < node.textContent!.length; i++) {
      const range = document.createRange();
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const top = Math.round(range.getBoundingClientRect().top);
      lines.set(top, (lines.get(top) ?? "") + node.textContent![i]);
    }
  }
  return [...lines.entries()].sort(([a], [b]) => a - b).map(([, text]) => text);
}

/**
 * Retention changed: the band at the foot of the content column holds Discard and Save until the change is kept
 * or dropped. Scrolled to the end, the last section ends above the band, and the sidebar's column runs the page's
 * full height.
 */
export const UnsavedChanges: Story = {
  name: "Unsaved changes",
  args: { changed: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("region", { name: "Unsaved changes" });
    await expect(bar).toBeVisible();
    await expect(within(bar).getByRole("button", { name: "Save changes" })).toHaveClass("di-btn-primary");
    await expect(within(bar).getByRole("button", { name: "Discard" })).toBeVisible();

    await expectEndClearOfFootBand(bar);
  },
};
