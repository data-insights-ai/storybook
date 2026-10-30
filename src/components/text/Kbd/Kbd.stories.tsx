import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Kbd } from "./Kbd";

const meta = {
  title: "Text/Kbd",
  component: Kbd,
  tags: ["layer:primitive", "autodocs"],
  args: { children: "⌘K" },
  argTypes: { children: { control: "text" } },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

/** In the sentence that names the shortcut, on the line's baseline. */
export const InProse: Story = {
  render: (args) => (
    <p style={{ margin: 0, maxWidth: "var(--di-measure-prose)" }}>
      Press <Kbd {...args} /> to open the command bar from any page.
    </p>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const key = canvas.getByText("⌘K");
    await expect(key.tagName).toBe("KBD");
    const line = canvasElement.querySelector("p")!.getBoundingClientRect();
    const box = key.getBoundingClientRect();
    await expect(box.top).toBeGreaterThanOrEqual(line.top);
    await expect(box.bottom).toBeLessThanOrEqual(line.bottom);
  },
};

/** A combination is one key cap per key, with the `+` written in the sentence. German keyboards print Strg. */
export const German: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p lang="de" style={{ margin: 0, maxWidth: "var(--di-measure-prose)" }}>
      Drücken Sie <Kbd>Strg</Kbd> + <Kbd>K</Kbd>, um die Befehlsleiste von jeder Seite aus zu öffnen, oder{" "}
      <Kbd>Umschalt</Kbd> + <Kbd>?</Kbd> für alle Tastenkürzel.
    </p>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll("kbd")).toHaveLength(4);
  },
};

/**
 * The key a button carries is `tone="onControl"`: a tone of the button's ink,
 * with no frame, so the button stays the one outline. `Button shortcut`
 * renders it; hidden on touch screens.
 */
export const OnAButton: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--di-gap-8)" }}>
      <Button shortcut="n">New entry</Button>
      <Button variant="secondary" shortcut="e">
        Edit
      </Button>
      <Button variant="ghost" shortcut="r">
        Refresh
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const key of canvasElement.querySelectorAll(".di-kbd-on-control")) {
      await expect(getComputedStyle(key).borderTopColor).toMatch(/rgba\(.*,\s*0\)|transparent/);
    }
  },
};
