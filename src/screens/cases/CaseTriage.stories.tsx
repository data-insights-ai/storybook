import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { toolbarRows } from "../../components/actions/Toolbar/rows.sample";
import { CaseTriage } from "./CaseTriage";

const meta = {
  title: "Patterns/Case triage",
  component: CaseTriage,
  tags: ["layer:screen", "!autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CaseTriage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * List and case side by side. The list is its own pane a step above the
 * ground, the open case carries the selection tint and the cornflower edge, the
 * Open | All switch a quiet thumb (no solid cornflower), and the case
 * opens on its verdict: the one gold object, with the action it asks for.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { current: true })).toHaveTextContent("Leaked VPN credentials");
    await expect(canvasElement.querySelectorAll(".is-emphasis")).toHaveLength(1);
    const track = canvasElement.querySelector(".di-split-list-head .di-choice-segments")!.getBoundingClientRect();
    const item = canvasElement.querySelector(".di-split-item")!.getBoundingClientRect();
    await expect(Math.abs(track.left - item.left)).toBeLessThanOrEqual(1);
    await Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined)));
    const thumb = getComputedStyle(canvasElement.querySelector(".di-choice-segment.is-chosen")!);
    const row = getComputedStyle(canvas.getByRole("button", { current: true }));
    const probe = canvasElement.appendChild(document.createElement("i"));
    probe.style.background = "var(--di-bg-selected)";
    const tint = getComputedStyle(probe).backgroundColor;
    probe.style.background = "var(--di-select)";
    const cornflower = getComputedStyle(probe).backgroundColor;
    probe.remove();
    await expect(row.backgroundColor).toBe(tint);
    await expect(thumb.backgroundColor).not.toBe(row.backgroundColor);
    await expect(thumb.backgroundColor).not.toBe(cornflower);
    await expect(thumb.color).toBe(getComputedStyle(canvas.getByRole("heading", { level: 1 })).color);
    if (window.innerWidth >= 900) {
      await expect(
        canvas.getByRole("heading", { level: 3, name: /Leaked VPN credentials reached the file server/ }),
      ).toBeVisible();
    }
  },
};

/** Another case opens beside the list; without a verdict it says so and points to the signals. */
export const AnotherCase: Story = {
  name: "Another case",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Periodic beaconing/ }));
    await expect(canvas.getByText("No verdict yet")).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 2, name: /Case 6/ })).toBeVisible();
  },
};

/** On a phone the two take turns: here the open case, with the way back to the list. */
export const CaseOpen: Story = {
  name: "Case open",
  args: { showing: "detail" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { level: 3, name: /Leaked VPN credentials reached the file server/ }),
    ).toBeVisible();
    const decision = canvas.getByRole("button", { name: "Isolate srv-fs-02" }).closest(".di-toolbar")!;
    const rows = toolbarRows(decision).map((row) => row.length);
    await expect(rows).toEqual(window.innerWidth <= 600 ? [1, 2] : [3]);
  },
};
