import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Fact, FactList } from "./FactList";
import { SealValue } from "./Seal";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Blocks/FactList",
  component: FactList,
  tags: ["autodocs"],
  args: { children: null },
  argTypes: { children: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
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

/** A value slot holds a component, which is why it is a slot and not a prop. */
export const WithMarks: Story = {
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
