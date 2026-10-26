import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CopyValue } from "./CopyValue";
import { Fact, FactList } from "../data/FactList";

const meta = {
  title: "Primitives/CopyValue",
  component: CopyValue,
  tags: ["autodocs"],
  args: {
    value: "6f1c2a9e-4b7d-4e0a-9c55-2f3d8a71b0c4",
    copyLabel: "Copy organization ID",
    copiedLabel: "Copied",
    mono: true,
  },
} satisfies Meta<typeof CopyValue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Identifier: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Copy organization ID" })).toBeVisible();
  },
};

/** In a fact list, beside the other facts of a record. */
export const InFacts: Story = {
  render: (args) => (
    <FactList layout="columns">
      <Fact label="Name">Northwind Survey</Fact>
      <Fact label="Organization ID">
        <CopyValue {...args} />
      </Fact>
    </FactList>
  ),
};
