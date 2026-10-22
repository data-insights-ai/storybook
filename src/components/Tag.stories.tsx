import type { Meta, StoryObj } from "@storybook/react-vite";
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
