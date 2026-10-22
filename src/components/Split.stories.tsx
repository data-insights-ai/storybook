import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { Fact, FactList } from "./FactList";
import { Actions, Stack } from "./Layout";
import { Panel } from "./Panel";
import { Select } from "./Select";
import { Split, SplitAside, SplitMain } from "./Split";

const meta = {
  title: "Patterns/Layout/Split",
  component: Split,
  tags: ["autodocs"],
  args: { asideFirst: false, children: null },
  argTypes: { children: { control: false } },
  render: (args) => (
    <Split {...args}>
      <SplitMain>
        <Panel title="What happened" padded>
          <p>
            An account signed in to a workstation from a public address, ran domain discovery, then signed in as
            local administrator on two servers and started a remote service on each.
          </p>
        </Panel>
        <Panel title="Affected" padded>
          <FactList layout="columns">
            <Fact label="Devices">3</Fact>
            <Fact label="Accounts">1</Fact>
          </FactList>
        </Panel>
      </SplitMain>
      <SplitAside label="Decide">
        <Panel title="Decide" padded>
          <Stack gap={12}>
            <Select id="split-status" label="Status" mono={false} value="in_progress" onChange={() => {}}>
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
            </Select>
            <Actions>
              <Button>Save</Button>
            </Actions>
          </Stack>
        </Panel>
      </SplitAside>
    </Split>
  ),
} satisfies Meta<typeof Split>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The story on the left, the decisions in a rail that stays in view. */
export const Record: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("complementary", { name: "Decide" })).toBeVisible();
  },
};

/** On a phone the decisions come first when they must not be missed. */
export const AsideFirst: Story = { args: { asideFirst: true } };
