import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { onPanel } from "../../../../.storybook/onPanel";
import { ClampText } from "./ClampText";

const reasoning =
  "The gateway's management interface is reachable from the internet on most installations, and the vendor's advisory confirms exploitation in the wild against unpatched appliances. A proof of concept is public and needs no authentication. Coverage is broad: two national CERTs and the major security press report it, and the affected release line is the one most operators run.";

const meta = {
  title: "Text/ClampText",
  component: ClampText,
  tags: ["layer:block", "autodocs"],
  args: { lines: 3, moreLabel: "Show more", lessLabel: "Show less", children: reasoning },
  argTypes: { lines: { control: "inline-radio", options: [2, 3, 4, 5, 6] }, children: { control: "text" } },
  decorators: [onPanel("Candidate · Example Gateway")],
} satisfies Meta<typeof ClampText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Held to two lines in a narrow column; Show more opens it in place, Show less closes it. */
export const Long: Story = {
  args: { lines: 2 },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const more = await canvas.findByRole("button", { name: "Show more" });
    await expect(more).toHaveAttribute("aria-expanded", "false");
    const text = canvasElement.querySelector<HTMLElement>(".di-clamp-text")!;
    await expect(text.scrollHeight).toBeGreaterThan(text.clientHeight);
    await userEvent.click(more);
    const less = canvas.getByRole("button", { name: "Show less" });
    await expect(less).toHaveAttribute("aria-expanded", "true");
    await expect(text.scrollHeight).toBeLessThanOrEqual(text.clientHeight + 1);
  },
};

/** Text that fits needs no button. */
export const Short: Story = {
  args: { children: "A proof of concept exists; no exploitation is reported." },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("button")).toBeNull();
  },
};
