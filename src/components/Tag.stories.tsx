import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Tag, TagList } from "./Tag";

const meta = { title: "Components/Tag", component: Tag, args: { children: "Workspace admin" } } satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Roles a person holds, each with its scope muted after the name. */
export const Grants: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <TagList>
        <Tag detail="whole organization">Organization admin</Tag>
        <Tag detail="Production">Workspace admin</Tag>
        <Tag detail="Vienna branch">Analyst</Tag>
      </TagList>
    </div>
  ),
};

/** In a table cell: two tags on one line, the rest behind "+N more". */
export const Compact: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <TagList max={2} moreLabel={(n) => `+${n} more`} onMore={() => undefined}>
        <Tag detail="whole organization">Organization admin</Tag>
        <Tag detail="test 001">Workspace admin</Tag>
        <Tag title="Handle cases: assign, status, verdict, comments">Handle cases</Tag>
      </TagList>
    </div>
  ),
};

/** A tag wider than its place wraps its scope onto a second line; nothing is cut. */
export const Narrow: Story = {
  render: () => (
    <div style={{ width: 120 }}>
      <TagList>
        <Tag detail="Production">Workspace administrator</Tag>
      </TagList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const detail = within(canvasElement).getByText("Production");
    await expect(detail.scrollWidth).toBeLessThanOrEqual(detail.clientWidth + 1);
  },
};
