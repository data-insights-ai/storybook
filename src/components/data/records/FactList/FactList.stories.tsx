import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Fact, FactList } from "./FactList";
import { SealValue } from "../../../marks/SealValue";
import { StatusPill } from "../../../marks/StatusPill";

const meta = {
  title: "Data/Records/FactList",
  component: FactList,
  tags: ["layer:block", "autodocs"],
  args: { layout: "rows", children: null },
  argTypes: {
    layout: { control: "radio", options: ["rows", "grid", "columns", "inline"] },
    children: { control: false },
  },
} satisfies Meta<typeof FactList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * What an action will touch, stated before it runs. Scope and
 * reversibility belong here, never in a tooltip.
 *
 * It is not a modal's property: a `Drawer` states the same facts about
 * the row it opened from, which is why this is its own component.
 */
export const Scope: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <FactList {...args}>
      <Fact label="Scope">4 sources · WS-01</Fact>
      <Fact label="Sealed">1,284 entries stay on record</Fact>
      <Fact label="Reversible">No</Fact>
    </FactList>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Reversible")).toBeVisible();
  },
};

/**
 * Identifiers, addresses and user agents have no spaces to break at; they
 * wrap anywhere instead of pushing the pane wider than its frame.
 */
export const LongValues: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <FactList {...args}>
      <Fact label="Resource">org:395768980536623109/workspace:01a15463-15d1-78d1-a799-9c96d5e69c8b</Fact>
      <Fact label="Client">Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36</Fact>
    </FactList>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector("dl");
    await expect(list?.scrollWidth).toBeLessThanOrEqual(list?.clientWidth ?? 0);
  },
};

/** A value slot holds a component, which is why it is a slot and not a prop. */
export const WithMarks: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <FactList {...args}>
      <Fact label="Kind">Registry</Fact>
      <Fact label="Manifest">
        <SealValue state="sealed" stateLabel="Sealed">
          a4f9c21e
        </SealValue>
      </Fact>
      <Fact label="State">
        <StatusPill tone="ok">running</StatusPill>
      </Fact>
    </FactList>
  ),
};

/**
 * `grid` is the same `dl` on a brand page: a ruled grid, the term in seal
 * ink and the value set as a statement at 20px. The brand pages were
 * drawing their own copy of this in a stylesheet no product can import,
 * which made it a second name for one thing.
 */
export const Grid: Story = {
  args: { layout: "grid" },
  render: (args) => (
    <FactList {...args}>
      <Fact label="Promise">No guesses. Only traceable answers.</Fact>
      <Fact label="Proof">Knowledge graphs. Timestamps. Replayable evidence.</Fact>
      <Fact label="For">Government, finance, pharma, legal, infrastructure.</Fact>
      <Fact label="Against">Black-box models. Hallucinations. “Trust us” AI.</Fact>
    </FactList>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Promise")).toBeVisible();
  },
};

/** The facts of one record inside a section: label above value, as many columns as fit. */
export const Columns: Story = {
  args: { layout: "columns" },
  render: (args) => (
    <FactList {...args}>
      <Fact label="Kind">Customer</Fact>
      <Fact label="Your role">Owner</Fact>
      <Fact label="Created">3 Mar 2026</Fact>
      <Fact label="Members">14</Fact>
    </FactList>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Customer")).toBeVisible();
  },
};

/** A header’s key facts on one line that wraps. */
export const Inline: Story = {
  args: { layout: "inline" },
  render: (args) => (
    <FactList {...args}>
      <Fact label="Seats">12 of 25</Fact>
      <Fact label="Renews">1 Nov 2026</Fact>
    </FactList>
  ),
};

/**
 * Labels are prose: a long German label wraps inside its column instead
 * of running into the value. Identifiers take `mono`.
 */
export const LongLabels: Story = {
  decorators: [
    (Story) => (
      <div lang="de" style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <FactList {...args}>
      <Fact label="Zustellungen von Benachrichtigungen">365 Tage</Fact>
      <Fact label="Aufbewahrungsdauer des Prüfprotokolls">1.095 Tage</Fact>
      <Fact label="Kennung" mono>
        01a155a0-dd8b-79bb-a708-3841c4fc4562
      </Fact>
    </FactList>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText("Zustellungen von Benachrichtigungen");
    const value = canvas.getByText("365 Tage");
    await expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(value.getBoundingClientRect().left);
    await expect(getComputedStyle(label).textTransform).toBe("none");
    await expect(getComputedStyle(value).fontFamily).not.toMatch(/mono/i);
    await expect(canvas.getByText(/^01a155a0/)).toHaveClass("di-fact-mono");
  },
};
