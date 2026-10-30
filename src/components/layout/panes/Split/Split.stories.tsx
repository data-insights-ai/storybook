import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { Fact, FactList } from "../../../data/records/FactList";
import { Actions } from "../../arrangement/Actions";
import { Stack } from "../../arrangement/Stack";
import { Panel } from "../../page/Panel";
import { Select } from "../../../forms/select/Select";
import { Split, SplitAside, SplitMain } from "./Split";

const meta = {
  title: "Layout/Panes/Split",
  component: Split,
  tags: ["layer:pattern", "autodocs"],
  args: { asideFirst: false, children: null },
  argTypes: { children: { control: false } },
  render: (args) => (
    <Split {...args}>
      <SplitMain>
        <Panel title="What happened" padded>
          <p>
            An account signed in to a workstation from a public address, ran domain discovery, then signed in as local
            administrator on two servers and started a remote service on each.
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
    const aside = canvas.getByRole("complementary", { name: "Decide" });
    await expect(aside).toBeVisible();
    for (const card of Array.from(aside.children)) {
      await expect(card.scrollHeight).toBeLessThanOrEqual(card.clientHeight + 1);
    }
  },
};

/** On a phone the decisions come first when they must not be missed. */
export const AsideFirst: Story = { args: { asideFirst: true } };

/**
 * A form beside the live result of what it edits: from 1280px the preview is
 * a wide column that stays in view while the form scrolls; narrower, it
 * follows the form.
 */
export const Preview: Story = {
  args: { variant: "preview" },
  render: (args) => (
    <Split {...args}>
      <SplitMain>
        {["Event time", "Severity", "Source address", "Account", "Device", "Action"].map((label) => (
          <Panel key={label} title={label} padded>
            <Select id={`split-preview-${label}`} label="From" mono={false} value="a" onChange={() => {}}>
              <option value="a">The recorded value</option>
              <option value="b">A fixed value</option>
            </Select>
          </Panel>
        ))}
      </SplitMain>
      <SplitAside label="Preview">
        <Panel title="Preview" padded>
          <pre
            style={{ margin: 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontFamily: "var(--di-font-code)" }}
          >
            {'{"time":"2026-10-23T09:14:02Z","severity":"high","src":"203.0.113.7","user":"nora.feld"}'}
          </pre>
        </Panel>
      </SplitAside>
    </Split>
  ),
  play: async ({ canvasElement }) => {
    const aside = within(canvasElement).getByRole("complementary", { name: "Preview" });
    await expect(aside).toBeVisible();
    const sticky = getComputedStyle(aside).position === "sticky";
    await expect(sticky).toBe(window.innerWidth >= 1280);
  },
};
