import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PullQuote } from "./PullQuote";
import { onPanel } from "../../../../../.storybook/onPanel";

const meta = {
  title: "Text/Blocks/PullQuote",
  component: PullQuote,
  tags: ["layer:primitive", "autodocs"],
  args: { children: "If you cannot cite it, we cannot say it." },
  argTypes: { children: { control: "text" } },
  decorators: [onPanel("Why a register")],
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
    <div style={{ display: "grid", gap: "var(--di-space-24)", maxWidth: "var(--di-measure-prose)" }}>
      <p>
        A cool grey canvas with a blue accent is what every tool in this field looks like. Warm paper reads as a record
        before a single word is parsed.
      </p>
      <PullQuote>What writes is what commits.</PullQuote>
      <p>
        Body text is navy; the one filled control on a sheet is navy. An operator never has to ask which button commits,
        because only one of them is solid.
      </p>
    </div>
  ),
};

/** German compounds are long: at phone width the sentence hyphenates instead of running past the edge. */
export const German: Story = {
  args: { children: "Nachvollziehbarkeit ist keine Zusatzfunktion." },
  render: (args) => (
    <div lang="de">
      <PullQuote {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const quote = canvasElement.querySelector("blockquote")!;
    await expect(quote.scrollWidth).toBeLessThanOrEqual(quote.clientWidth + 1);
  },
};

/** Sized by its column, not the window: in half a page the quote is set for half a page. */
export const HalfColumn: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "var(--di-space-24)" }}>
      <PullQuote {...args} />
      <p>Every answer is tied to its source, and every source carries the time it was recorded.</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const quote = canvasElement.querySelector("blockquote")!;
    const column = quote.parentElement!.getBoundingClientRect().width;
    const expected = Math.min(44, Math.max(28, 16 + 0.03 * column));
    await expect(Math.abs(parseFloat(getComputedStyle(quote).fontSize) - expected)).toBeLessThan(1);
  },
};
