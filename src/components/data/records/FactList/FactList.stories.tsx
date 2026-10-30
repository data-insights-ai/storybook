import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Fact, FactList } from "./FactList";
import { Panel } from "../../../layout/page/Panel";
import { SealValue } from "../../../marks/status/SealValue";
import { StatusPill } from "../../../marks/status/StatusPill";

const meta = {
  title: "Data/Records/FactList",
  component: FactList,
  tags: ["layer:block", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** terms and what is on record against them, as one description list.",
          '**When to use:** the facts of a record, the scope of an action before it runs, the terms behind a figure, the basis of a proposal. **When not to:** a measured value with its label is a `Figure`; many records to scan are a `DataTable`; a proposal with its reasons is a `ProposalPanel`, which holds a `FactList layout="stacked"`.',
          "**Anatomy:** `FactList` (the `dl`) holding `Fact`s, each a label (`dt`) and a value slot (`dd`).",
          "**Layouts:** `rows` a screen's facts with a wrapping term column; `pairs` a short list, the value at the line's end (was `KeyValues`); `stacked` a label above each value, one under the other (was `ExplainRow`); `columns` a record's facts in as many columns as fit; `inline` a header's key facts on one line; `grid` a brand page's ruled statements. Labels beside values are sans; labels above values are the mono caption.",
          '**States:** a missing value is a word ("none", "not set"), never an empty cell; a value that is loading is a skeleton in the slot.',
          "**Content rules:** labels are short nouns in sentence case; a value is text or one mark (`StatusPill`, `SealValue`); identifiers, hashes and times take `mono` and never break inside a token.",
          "**Accessibility:** a `dl` with `dt`/`dd` pairs, so a screen reader announces the list and each term with its value.",
        ].join("\n\n"),
      },
    },
  },
  args: { layout: "rows", children: null },
  argTypes: {
    layout: { control: "radio", options: ["rows", "pairs", "stacked", "columns", "inline", "grid"] },
    children: { control: false },
  },
} satisfies Meta<typeof FactList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * What an action will touch, stated before it runs. Scope and
 * reversibility belong here, never in a tooltip.
 *
 * It is not a modal's property: a side `Dialog` states the same facts about
 * the row it opened from, which is why this is its own component.
 */
export const Scope: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Panel title="Revoke four sources">
      <FactList {...args}>
        <Fact label="Scope">4 sources · WS-01</Fact>
        <Fact label="Sealed">1,284 entries stay on record</Fact>
        <Fact label="Reversible">No</Fact>
      </FactList>
    </Panel>
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
    <Panel title="Northwind Health">
      <FactList {...args}>
        <Fact label="Kind">Customer</Fact>
        <Fact label="Your role">Owner</Fact>
        <Fact label="Created">3 Mar 2026</Fact>
        <Fact label="Members">14</Fact>
      </FactList>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Customer")).toBeVisible();
  },
};

/**
 * `pairs`: the terms behind a figure, the value at the line's end so
 * figures line up. A short list (up to six); a longer one is `rows`.
 */
export const Pairs: Story = {
  args: { layout: "pairs" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Panel title="Entries by source">
      <FactList {...args}>
        <Fact label="Registry">1,842</Fact>
        <Fact label="Mirror">1,109</Fact>
        <Fact label="Feed">744</Fact>
        <Fact label="Archive">487</Fact>
      </FactList>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const values = ["1,842", "744"].map((v) => canvas.getByText(v).getBoundingClientRect().right);
    await expect(Math.abs(values[0] - values[1])).toBeLessThan(1);
    await expect(getComputedStyle(canvas.getByText("Registry")).fontFamily).not.toMatch(/mono/i);
  },
};

/**
 * `stacked`: a mono caption above each value, one fact under the other,
 * for a narrow column or the basis of a proposal. Tokens never break
 * inside themselves.
 */
export const Stacked: Story = {
  args: { layout: "stacked" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Panel title="Merge basis">
      <FactList {...args}>
        <Fact label="Matched on">Host, manifest prefix and queue depth</Fact>
        <Fact label="Window" mono>
          2026-09-22 → 2026-09-23
        </Fact>
        <Fact label="Reversible">Yes, until the next seal</Fact>
      </FactList>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(getComputedStyle(canvas.getByText("Matched on")).textTransform).toBe("uppercase");
    await expect(getComputedStyle(canvas.getByText("2026-09-22 → 2026-09-23")).wordBreak).toBe("keep-all");
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
