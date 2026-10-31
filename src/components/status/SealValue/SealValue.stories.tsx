import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { SealMark, SealValue } from "./SealValue";
import { onPanel } from "../../../../.storybook/onPanel";

const meta = {
  title: "Status/SealValue",
  component: SealValue,
  tags: ["layer:primitive", "autodocs"],
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
  decorators: [onPanel("Manifest")],
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

/**
 * In an operational view the mark is neutral, so the view's one gold object
 * stays alone. Inside a brand moment — sign-in, onboarding, a licence or
 * certificate seal — `data-brand` maps it back to the seal's gold.
 */
export const BrandMoment: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 28 }}>
      <SealValue state="sealed" stateLabel="Sealed">
        operational
      </SealValue>
      <div data-brand="">
        <SealValue state="sealed" stateLabel="Sealed">
          licence 2026-0042
        </SealValue>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [plain, brand] = [...canvasElement.querySelectorAll(".di-seal-mark-sealed")].map(
      (mark) => getComputedStyle(mark).backgroundColor,
    );
    await expect(plain).not.toBe(brand);
    await expect(brand).toBe("rgb(201, 162, 74)");
  },
};
