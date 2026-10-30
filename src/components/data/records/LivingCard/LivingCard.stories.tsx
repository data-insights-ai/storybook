import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreVertical } from "lucide-react";
import { expect, fn, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { LivingActions, LivingBasis, LivingBody, LivingCard, LivingInsight } from "./LivingCard";
import { Figure, FigureRow } from "../../figures/FigureRow";
import { Sparkline } from "../../../charts/time/Sparkline";

const bars = [
  { percent: 38 },
  { percent: 46 },
  { percent: 41 },
  { percent: 52 },
  { percent: 49 },
  { percent: 61 },
  { percent: 74, tone: "series" as const },
  { percent: 96, tone: "danger" as const },
];

const meta = {
  title: "Data/Records/LivingCard",
  component: LivingCard,
  tags: ["layer:block", "autodocs"],
  args: {
    title: "Unsealed entries",
    insightLabel: "ai insight",
    children: null,
  },
  argTypes: {
    title: { control: "text" },
    insightLabel: { control: "text" },
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
    <LivingCard {...args}>
      <LivingActions>
        <Button variant="ghost" size="dense" iconOnly={true} aria-label="Card actions">
          <MoreVertical aria-hidden />
        </Button>
      </LivingActions>
      <LivingBody>
        <FigureRow label="Unsealed entries" variant="footer">
          <Figure label="Unsealed" value="1,284" tone="danger">
            up 940 since 08:00Z
          </Figure>
        </FigureRow>
        <Sparkline bars={bars} label="Unsealed entries over the last eight hours, rising sharply in the last two." />
      </LivingBody>
      <LivingInsight body="The rise follows the pause on feed.example.io at 08:47Z. Resuming it clears the backlog.">
        <LivingBasis>inferred from 3 sources · confidence 0.88</LivingBasis>
        <Button variant="inferred" size="dense">
          Review the proposal
        </Button>
        <Button variant="secondary" size="dense">
          Open the source
        </Button>
        <Button variant="ghost" size="dense">
          Dismiss
        </Button>
      </LivingInsight>
    </LivingCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("ai insight")).toBeVisible();
    await expect(canvas.getByRole("img", { name: /Unsealed entries over the last eight hours/ })).toBeVisible();
    // The sparkline takes the space beside the figure instead of leaving it empty.
    const body = canvasElement.querySelector(".di-living-body")!.getBoundingClientRect();
    const spark = canvasElement.querySelector(".di-sparkline")!.getBoundingClientRect();
    await expect(spark.right).toBeGreaterThan(body.right - 40);
  },
};

/** LivingActions written after the body still sit in the head, centred on the title. */
export const ActionsWrittenLast: Story = {
  render: (args) => (
    <LivingCard {...args}>
      <LivingBody>
        <FigureRow label="Unsealed entries" variant="footer">
          <Figure label="Unsealed" value="1,284" />
        </FigureRow>
      </LivingBody>
      <LivingActions>
        <Button variant="ghost" size="dense" iconOnly={true} aria-label="Card actions">
          <MoreVertical aria-hidden />
        </Button>
      </LivingActions>
    </LivingCard>
  ),
  play: async ({ canvasElement }) => {
    const head = canvasElement.querySelector(".di-living-head")!;
    const actions = canvasElement.querySelector(".di-living-actions")!;
    await expect(head.contains(actions)).toBe(true);
    const a = actions.getBoundingClientRect();
    const t = canvasElement.querySelector(".di-living-title")!.getBoundingClientRect();
    await expect(Math.abs(a.top + a.height / 2 - (t.top + t.height / 2))).toBeLessThanOrEqual(2);
  },
};

/** The measurement alone, before a model has anything to say about it. */
export const WithoutInsight: Story = {
  render: (args) => (
    <LivingCard {...args} insightLabel="no insight">
      <LivingBody>
        <FigureRow label="Unsealed entries" variant="footer">
          <Figure label="Unsealed" value="84">
            steady
          </Figure>
        </FigureRow>
        <Sparkline
          bars={bars.map((bar) => ({ percent: bar.percent }))}
          label="Unsealed entries, flat over the last eight hours."
        />
      </LivingBody>
    </LivingCard>
  ),
};

/** A short claim with a single action behind it. */
export const OneAction: Story = {
  render: (args) => (
    <LivingCard {...args} title="Coverage">
      <LivingBody>
        <FigureRow label="Coverage" variant="footer">
          <Figure label="Coverage" value="86.4%" tone="warn">
            down 2.1 points
          </Figure>
        </FigureRow>
        <Sparkline bars={bars} label="Coverage over the last eight hours, falling in the last two." />
      </LivingBody>
      <LivingInsight body="Four archive sources stopped reporting at 08:44Z.">
        <LivingBasis>inferred from 1 source · confidence 0.71</LivingBasis>
        <Button variant="inferred" size="dense" onClick={fn()}>
          Review the proposal
        </Button>
      </LivingInsight>
    </LivingCard>
  ),
};
