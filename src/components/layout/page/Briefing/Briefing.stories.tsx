import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../../actions/Button";
import { StatusPill } from "../../../marks/StatusPill";
import { Breadcrumb } from "../../../navigation/Breadcrumb";
import { SeverityMark } from "../../../marks/SeverityMark";
import { Briefing, BriefingAside, BriefingCrumbs, BriefingMark, BriefingMeta, BriefingStatus } from "./Briefing";

const meta = {
  title: "Layout/Page/Briefing",
  component: Briefing,
  tags: ["layer:block", "autodocs", "direction:a"],
  parameters: { direction: "a" },
  args: { context: "Workspace", title: "Production", ruled: true, children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof Briefing>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The claim is computed from the data; the words that matter are gold. */
export const Overview: Story = {
  render: (args) => (
    <Briefing {...args}>
      Two things need you: <BriefingMark>a critical case nobody owns</BriefingMark>, and two sources have gone quiet.
      <BriefingStatus>
        <StatusPill tone="danger" dot>Needs attention</StatusPill>
      </BriefingStatus>
      <BriefingMeta>As of 10:00 · 14 sources · 3 open cases</BriefingMeta>
      <BriefingAside>
        <Button>Open case 4</Button>
      </BriefingAside>
    </Briefing>
  ),
};

/** A record: the way back, the state inline after the name, the verdict as the claim. */
export const Record: Story = {
  args: { context: "Case 4", title: "Lateral movement from ws-fin-014", ruled: false },
  render: (args) => (
    <Briefing {...args}>
      <BriefingCrumbs>
        <Breadcrumb label="Breadcrumb" items={[{ label: "Cases", href: "#cases" }, { label: "Case 4" }]} />
      </BriefingCrumbs>
      <BriefingStatus>
        <SeverityMark level="critical" label="Critical" variant="chip" />
        <StatusPill tone="neutral">In progress</StatusPill>
      </BriefingStatus>
      Leaked VPN credentials reached the file server. <BriefingMark>Isolate srv-fs-02 now.</BriefingMark>
      <BriefingMeta>Proved by rule 14 · 1,064 signals · 7 hosts</BriefingMeta>
    </Briefing>
  ),
};
