import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader } from "./Heading";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Blocks/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  args: {
    eyebrow: "Watchlist",
    title: "Watched identities",
    lede: "Manage the people, companies, domains, and email addresses under automatic watch.",
  },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {};

export const WithStatus: Story = {
  render: (args) => (
    <PageHeader {...args}>
      <StatusPill tone="ok" dot={true}>
        Monitoring active
      </StatusPill>
    </PageHeader>
  ),
};
