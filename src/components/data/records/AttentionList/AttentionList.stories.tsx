import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../../actions/Button";
import { TextLink } from "../../../navigation/TextLink";
import { AttentionItem, AttentionList } from "./AttentionList";

const meta = {
  title: "Data/Records/AttentionList",
  component: AttentionList,
  tags: ["layer:block", "autodocs", "direction:a"],
  parameters: { direction: "a" },
  args: { label: "What needs you", children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof AttentionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <AttentionList {...args}>
      <AttentionItem
        rank="01"
        emphasis
        emphasisLabel="Start here"
        severity="critical"
        severityLabel="Critical"
        title="Case 4 · lateral movement from ws-fin-014"
        reason="Nobody owns it, and it reached the file server 1 hour ago."
        meta="Opened 7 h ago · 1,064 signals"
      >
        <Button>Take case 4</Button>
      </AttentionItem>
      <AttentionItem rank="02" severity="high" severityLabel="High" title="Two sources have gone quiet" reason="Identity sign-ins lost permission; mail audit was never set up." meta="Last data 7 h ago">
        <TextLink href="#sources">Fix sources</TextLink>
      </AttentionItem>
      <AttentionItem rank="03" severity="medium" severityLabel="Medium" title="One SIEM export is failing" reason="The forwarder rejects the token; 3,412 events wait." meta="14 failures since 06:10">
        <TextLink href="#exports">Open exports</TextLink>
      </AttentionItem>
    </AttentionList>
  ),
};
