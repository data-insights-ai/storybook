import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Fact, FactList } from "../../../records/FactList";
import { Notice, NoticeBody, NoticeText, NoticeTitle } from "../../../feedback/Notice";
import { Panel } from "../../page/Panel";
import { PageHeader, PageHeaderTitle } from "../../page/PageHeader";
import { Button } from "../../../actions/Button";
import { Toolbar } from "../../../actions/Toolbar";
import { Select } from "../../../forms/select/Select";
import { TextField } from "../../../forms/text/TextField";
import { Stack } from "./Stack";

/**
 * One rhythm down a page or a panel.
 *
 * - **Use it** to space blocks: a section's title and its panels (24), the
 *   blocks inside a panel (16), a line and its detail (8), the parts of a
 *   brand page (48 to 96); and, as `variant="form"`, the fields of a form.
 * - **Not** for a row of controls (`Toolbar`), for columns of equal blocks
 *   (`Grid`), or for two panes (`Split`).
 *
 * Content: the children carry no margin of their own; the stack owns the
 * distance. A `form` stack holds fields and, last, the form's buttons.
 */

const meta = {
  title: "Layout/Arrange/Stack",
  component: Stack,
  tags: ["layer:pattern", "autodocs"],
  args: { gap: 24, children: null },
  argTypes: {
    gap: { control: "select", options: [8, 12, 16, 24, 32, 48, 64, 96] },
    variant: { control: "radio", options: ["flow", "form"] },
    children: { control: false },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One section of a screen: its title, then its panels at 24, so the page sees it as one block. */
export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <PageHeader level={2} lede="Where events come from, and whether they still arrive.">
        <PageHeaderTitle>Collection</PageHeaderTitle>
      </PageHeader>
      <Panel title="Graz office">
        <FactList layout="columns">
          <Fact label="Last event">2 min ago</Fact>
          <Fact label="Events today">48,120</Fact>
        </FactList>
      </Panel>
      <Panel title="Linz branch">
        <FactList layout="columns">
          <Fact label="Last event">3 h ago</Fact>
          <Fact label="Events today">1,204</Fact>
        </FactList>
      </Panel>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Collection" })).toBeVisible();
  },
};

/**
 * Inside a panel the blocks are 16 apart: a notice, then the facts it is
 * about. `gap` is named by the value it sets, so a wrong number shows up in
 * the diff rather than behind a word like "loose".
 */
export const InAPanel: Story = {
  name: "In a panel",
  args: { gap: 16 },
  render: (args) => (
    <Panel title="Linz branch">
      <Stack {...args}>
        <Notice tone="warn">
          <NoticeText>
            <NoticeTitle>No events for 3 hours</NoticeTitle>
            <NoticeBody>The collector is running, but its source stopped sending.</NoticeBody>
          </NoticeText>
        </Notice>
        <FactList layout="columns">
          <Fact label="Collector">2.14.0</Fact>
          <Fact label="Last event">09:12</Fact>
        </FactList>
      </Stack>
    </Panel>
  ),
};

/**
 * A form read down one column, inside the panel that holds it: text and
 * email span the column, a select fits its options, a number is short, and
 * the buttons close it.
 */
export const Form: Story = {
  args: { variant: "form" },
  render: (args) => (
    <Panel title="Organization">
      <form>
        <Stack {...args}>
          <TextField id="st-name" label="Name" defaultValue="Northwind Survey" />
          <TextField id="st-email" type="email" label="Billing email" defaultValue="nora.feld@data-insights.ai" />
          <Select id="st-role" label="Default role for new members" mono={false} defaultValue="member">
            <option value="member">Member</option>
            <option value="admin">Administrator</option>
          </Select>
          <TextField id="st-seats" type="number" label="Seats" defaultValue="25" />
          <Toolbar align="end">
            <Button variant="secondary">Cancel</Button>
            <Button type="submit">Save</Button>
          </Toolbar>
        </Stack>
      </form>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("Billing email").getBoundingClientRect().width;
    const seats = canvas.getByLabelText("Seats").getBoundingClientRect().width;
    await expect(email).toBeGreaterThan(seats * 2);
  },
};

/**
 * 64 and 96 are the brand tier. Below 48 the distance separates blocks;
 * above it the distance separates the parts of an argument, which is what
 * a brand page is made of.
 */
export const Brand: Story = {
  args: { gap: 64 },
  render: (args) => (
    <Stack {...args}>
      <PageHeader
        level={2}
        tier="brand"
        eyebrow="Source"
        lede="Every claim on a screen is tied to the source it came from."
      >
        <PageHeaderTitle>Each entry has a source.</PageHeaderTitle>
      </PageHeader>
      <PageHeader
        level={2}
        tier="brand"
        eyebrow="Time"
        lede="A source carries the time it was recorded, so a finding can be replayed."
      >
        <PageHeaderTitle>Each source has a timestamp.</PageHeaderTitle>
      </PageHeader>
    </Stack>
  ),
};
