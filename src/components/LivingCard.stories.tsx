import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreVertical } from "lucide-react";
import { expect, fn, within } from "storybook/test";
import { Button } from "./Button";
import { LivingBody, LivingCard, LivingInsight, Sparkline } from "./LivingCard";
import { StatTile } from "./StatTile";

const bars = [
  { percent: 38 },
  { percent: 46 },
  { percent: 41 },
  { percent: 52 },
  { percent: 49 },
  { percent: 61 },
  { percent: 74, tone: "ink" as const },
  { percent: 96, tone: "danger" as const },
];

const meta = {
  title: "Blocks/LivingCard",
  component: LivingCard,
  tags: ["autodocs"],
  args: {
    title: "Unsealed entries",
    insightLabel: "ai insight",
    children: null,
  },
  argTypes: {
    title: { control: "text" },
    insightLabel: { control: "text" },
    actions: { control: false },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LivingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The insight lives inside the card it concerns, and stays quieter than
 * the measurement it is commenting on.
 */
export const Default: Story = {
  render: (args) => (
    <LivingCard
      {...args}
      actions={
        <Button variant="ghost" size="dense" iconOnly={true} aria-label="Card actions">
          <MoreVertical aria-hidden />
        </Button>
      }
    >
      <LivingBody>
        <StatTile index="03" label="Unsealed" value="1,284" delta="up 940 since 08:00Z" deltaTone="danger" compact={true} />
        <Sparkline bars={bars} label="Unsealed entries over the last eight hours, rising sharply in the last two." />
      </LivingBody>
      <LivingInsight
        body="The rise follows the pause on feed.example.io at 08:47Z. Resuming it clears the backlog."
        basis="inferred from 3 sources · confidence 0.88"
        actions={
          <>
            <Button variant="ai" size="dense">
              Review the proposal
            </Button>
            <Button variant="secondary" size="dense">
              Open the source
            </Button>
            <Button variant="ghost" size="dense">
              Dismiss
            </Button>
          </>
        }
      />
    </LivingCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("ai insight")).toBeVisible();
    await expect(canvas.getByRole("img", { name: /Unsealed entries over the last eight hours/ })).toBeVisible();
  },
};

/** The measurement alone, before a model has anything to say about it. */
export const WithoutInsight: Story = {
  render: (args) => (
    <LivingCard {...args} insightLabel="no insight">
      <LivingBody>
        <StatTile index="03" label="Unsealed" value="84" delta="steady" compact={true} />
        <Sparkline bars={bars.map((bar) => ({ percent: bar.percent }))} label="Unsealed entries, flat over the last eight hours." />
      </LivingBody>
    </LivingCard>
  ),
};

/** A short claim with a single action behind it. */
export const OneAction: Story = {
  render: (args) => (
    <LivingCard {...args} title="Coverage">
      <LivingBody>
        <StatTile index="02" label="Coverage" value="86.4%" delta="down 2.1 points" deltaTone="warn" compact={true} />
        <Sparkline bars={bars} label="Coverage over the last eight hours, falling in the last two." />
      </LivingBody>
      <LivingInsight
        body="Four archive sources stopped reporting at 08:44Z."
        basis="inferred from 1 source · confidence 0.71"
        actions={
          <Button variant="ai" size="dense" onClick={fn()}>
            Review the proposal
          </Button>
        }
      />
    </LivingCard>
  ),
};
