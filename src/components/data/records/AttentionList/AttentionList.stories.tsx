import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { TextLink } from "../../../navigation/TextLink";
import { AttentionClear, AttentionItem, AttentionList } from "./AttentionList";

const meta = {
  title: "Data/Records/AttentionList",
  component: AttentionList,
  tags: ["layer:block", "autodocs"],
  args: { label: "What needs you, most urgent first", title: "3 things need you", children: null },
  argTypes: {
    label: { control: "text" },
    title: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof AttentionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The point of an overview: three items at most, the first across the
 * row with the page's one button and the gold edge, the others beside each
 * other with a link each.
 */
export const Default: Story = {
  render: (args) => (
    <AttentionList {...args}>
      <AttentionItem
        rank="01"
        emphasis
        emphasisLabel="Start here"
        severity="critical"
        severityLabel="Critical"
        title="Case 4 · leaked VPN credentials, moving through finance"
        reason="Data is leaving srv-fs-02 for cloud storage, and nobody has acknowledged the last escalation."
        meta="Opened 7 h ago · 1,064 signals · 39 hosts"
      >
        <Button href="#case-4">Open case 4</Button>
      </AttentionItem>
      <AttentionItem
        rank="02"
        severity="high"
        severityLabel="High"
        title="Two sources stopped delivering"
        reason="Identity sign-ins lost its read permission; sign-in detections are blind."
        meta="Last data 7.2 h ago"
      >
        <TextLink href="#sources">Fix the sources</TextLink>
      </AttentionItem>
      <AttentionItem
        rank="03"
        severity="medium"
        severityLabel="Medium"
        title="One SIEM export is failing"
        reason="The forwarder rejects the token; 3,412 findings wait to be delivered."
        meta="14 failures since 06:10"
      >
        <TextLink href="#exports">Open the export</TextLink>
      </AttentionItem>
    </AttentionList>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 2, name: "3 things need you" })).toBeVisible();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
    await expect(canvas.getAllByRole("link", { name: "Open case 4" })).toHaveLength(1);
    const [first, second] = canvas.getAllByRole("listitem");
    await expect(first.getBoundingClientRect().width).toBeGreaterThan(second.getBoundingClientRect().width);
  },
};

/** One decision, with its deadline said beside the gold edge. */
export const OneDecision: Story = {
  args: { title: "1 decision is due" },
  render: (args) => (
    <AttentionList {...args}>
      <AttentionItem
        rank="01"
        emphasis
        emphasisLabel="Due 23 Oct"
        title="The team add-on ends in 11 days"
        reason="Three seats lapse with it; the members keep their accounts but lose the product."
        meta="Renews by hand · 3 seats"
      >
        <Button>Renew the add-on</Button>
      </AttentionItem>
    </AttentionList>
  ),
};

/** Nothing is due: no empty list, one quiet line and what it rests on. */
export const Clear: Story = {
  render: () => <AttentionClear title="Everything is running" note="14 sources delivering · nothing to decide before 30 Apr" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Everything is running")).toBeVisible();
    await expect(canvas.queryByRole("list")).toBeNull();
  },
};
