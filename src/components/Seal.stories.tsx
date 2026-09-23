import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Eyebrow, Kbd, SealMark, SealValue, TickRule } from "./Seal";

const meta = {
  title: "Primitives/Seal",
  component: SealValue,
  tags: ["autodocs"],
  args: {
    state: "sealed",
    stateLabel: "Sealed",
    children: "a4f9c21e",
  },
  argTypes: {
    state: { control: "radio", options: ["sealed", "inferred", "absent"] },
    stateLabel: { control: "text" },
    children: { control: "text" },
  },
} satisfies Meta<typeof SealValue>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Recorded and verifiable. The filled dot is the register's own mark. */
export const Sealed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Sealed")).toBeInTheDocument();
  },
};

/** A model inferred it. The ring is open because nothing has vouched for it. */
export const Inferred: Story = {
  args: { state: "inferred", stateLabel: "Inferred, not sealed", children: "7f3a99e" },
};

/** No value on record. An absence is a statement, so it gets a shape. */
export const Absent: Story = {
  args: { state: "absent", stateLabel: "Not recorded", children: "—" },
};

/** The three states side by side. The dot never carries the word alone. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <SealValue state="sealed" stateLabel="Sealed">
        a4f9c21e · sealed 2026-09-18T09:12:04Z
      </SealValue>
      <SealValue state="inferred" stateLabel="Inferred, not sealed">
        7f3a99e · inferred from 3 sources
      </SealValue>
      <SealValue state="absent" stateLabel="Not recorded">
        no hash on record
      </SealValue>
    </div>
  ),
};

/** The mark at legend size, where it has to read on its own. */
export const Marks: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 28 }}>
      {(["sealed", "inferred", "absent"] as const).map((state) => (
        <span key={state} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SealMark state={state} size={20} />
          <span className="di-mono" style={{ fontSize: 12 }}>
            {state}
          </span>
        </span>
      ))}
    </div>
  ),
};

/** The one ornament: an 8px tick scale under a measured value. */
export const Tick: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <p className="di-mono" style={{ fontSize: 28, letterSpacing: "-0.015em" }}>
        4,182
      </p>
      <TickRule />
      <p className="di-mono" style={{ fontSize: 11, marginTop: 8, opacity: 0.75 }}>
        entries on record
      </p>
    </div>
  ),
};

/** The § mark, the seal and a rule to the edge. One gold dot per view. */
export const SectionMark: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 440, display: "flex", flexDirection: "column", gap: 20 }}>
      <Eyebrow>§ 04 — Coverage</Eyebrow>
      <Eyebrow dot={false}>§ 05 — Sources</Eyebrow>
    </div>
  ),
};

/** A shortcut in the mono track. */
export const Shortcut: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      Open the command bar
      <Kbd>⌘K</Kbd>
    </span>
  ),
};
