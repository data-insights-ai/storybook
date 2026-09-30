import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PullQuote } from "./PullQuote";

const meta = {
  title: "Primitives/PullQuote",
  component: PullQuote,
  tags: ["autodocs"],
  args: { children: "If you cannot cite it, we cannot say it." },
  argTypes: { children: { control: "text" } },
} satisfies Meta<typeof PullQuote>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The brand pages' one piece of rhetoric: a hairline down the left edge,
 * italic at the top of the type ramp, measured to 16em. A primitive,
 * because it frames nothing — there is no attribution slot, since a pull
 * quote with a byline is a testimonial and a different claim.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("If you cannot cite it, we cannot say it.")).toBeVisible();
  },
};

/** Four words, which is what it is actually for. */
export const Short: Story = {
  args: { children: "What writes is what commits." },
};

/** In place, between the paragraphs of a section. */
export const InProse: Story = {
  name: "In prose",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 620 }}>
      <p>
        A cool grey canvas with a blue accent is what every tool in this field looks like. Warm
        paper reads as a record before a single word is parsed.
      </p>
      <PullQuote>What writes is what commits.</PullQuote>
      <p>
        Body text is navy; the one filled control on a sheet is navy. An operator never has to ask
        which button commits, because only one of them is solid.
      </p>
    </div>
  ),
};
