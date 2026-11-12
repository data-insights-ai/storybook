import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Badge } from "../../status/Badge";
import { PlanAction, PlanCard, PlanFeature, PlanGrid, PlanStatus } from "./PlanGrid";

const meta = {
  title: "Records/PlanGrid",
  component: PlanGrid,
  tags: ["layer:block", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** the plans of one offer side by side, so a reader compares price, billing and what each plan adds row by row.",
          "**When to use:** a public price page or the plan choice in a product. **When not to:** a plan the organization already has is a `FactList` in a `Panel`; an offer for one customer is a `ProposalPanel`; a plan sold only by quote is a `Panel` band below the grid, not a card.",
          "**Anatomy:** each `PlanCard` has the same seven rows (name with an optional `Badge`, price, billing line, details, features, note, action), lined up across the cards of a row; the action sits at the foot of every card.",
          '**Content:** whole amounts without cents; the yearly price says what it saves only when the numbers do. A plan or feature not yet available takes the one `Badge` "Coming soon", and its action is a disabled button with the same words.',
        ].join("\n\n"),
      },
    },
  },
  args: { label: "Plans", children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof PlanGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plans: Story = {
  render: (args) => (
    <PlanGrid {...args}>
      <PlanCard
        heading={2}
        name="Free"
        price="€0"
        billing="No card needed"
        details={["One workspace", "Community support"]}
        note="Up to two free workspaces per person."
      >
        <PlanAction>
          <Button>Start free</Button>
        </PlanAction>
      </PlanCard>
      <PlanCard
        heading={2}
        name="Solo"
        price="€9"
        period="a month"
        billing="or €90 a year, 2 months free"
        details={["1 seat included"]}
      >
        <PlanStatus>
          <Badge tone="quiet" track="prose">
            For one person
          </Badge>
        </PlanStatus>
        <PlanFeature>Saved searches</PlanFeature>
        <PlanFeature>Daily digest</PlanFeature>
        <PlanAction>
          <Button disabled aria-label="Free: Coming soon">
            Coming soon
          </Button>
        </PlanAction>
      </PlanCard>
      <PlanCard
        heading={2}
        name="Team"
        price="€49"
        period="a month"
        billing="or €490 a year, 2 months free"
        details={["5 seats included"]}
        featuresLabel="Everything in Solo, and"
      >
        <PlanFeature>Webhooks</PlanFeature>
        <PlanAction>
          <Button disabled aria-label="Team: Coming soon">
            Coming soon
          </Button>
        </PlanAction>
      </PlanCard>
      <PlanCard
        heading={2}
        name="Business"
        price="€399"
        period="a month"
        billing="or €3,990 a year, 2 months free"
        details={["25 seats included", "Additional seat €6 a month"]}
        featuresLabel="Everything in Team, and"
      >
        <PlanFeature>Audit log export</PlanFeature>
        <PlanFeature>
          Single sign-on
          <Badge tone="quiet" track="prose">
            Coming soon
          </Badge>
        </PlanFeature>
        <PlanAction>
          <Button disabled aria-label="Business: Coming soon">
            Coming soon
          </Button>
        </PlanAction>
      </PlanCard>
    </PlanGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cards = canvas.getAllByRole("listitem").filter((li) => li.classList.contains("di-plan-card"));
    await expect(cards).toHaveLength(4);
    await expect(canvas.getByRole("button", { name: "Team: Coming soon" })).toBeDisabled();
    // Cards that share a row of the grid share their price and action lines.
    const rows = new Map<number, HTMLElement[]>();
    for (const card of cards) {
      const top = Math.round(card.getBoundingClientRect().top);
      rows.set(top, [...(rows.get(top) ?? []), card]);
    }
    for (const row of rows.values()) {
      for (const slot of [".di-plan-price", ".di-plan-action"]) {
        const tops = row.map((card) => Math.round(card.querySelector(slot)!.getBoundingClientRect().top));
        await expect(new Set(tops).size).toBe(1);
      }
    }
  },
};

/** Three plans written through a map and Fragments: their slots are drawn, and the row takes three columns. */
export const InFragments: Story = {
  render: (args) => (
    <PlanGrid {...args}>
      {["Free", "Team", "Business"].map((name) => (
        <PlanCard key={name} heading={2} name={name} price="€0">
          <>
            <PlanFeature>Webhooks</PlanFeature>
            <PlanAction>
              <Button>Choose {name}</Button>
            </PlanAction>
          </>
        </PlanCard>
      ))}
    </PlanGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText("Webhooks")).toHaveLength(3);
    await expect(canvas.getByRole("button", { name: "Choose Team" })).toBeVisible();
    const cards = [...canvasElement.querySelectorAll(".di-plan-card")];
    const lefts = new Set(cards.map((card) => Math.round(card.getBoundingClientRect().left)));
    await expect(lefts.size).toBe(canvasElement.clientWidth >= 960 ? 3 : canvasElement.clientWidth >= 544 ? 2 : 1);
  },
};

/** Two plans keep to two columns rather than leave two empty ones. */
export const TwoPlans: Story = {
  render: (args) => (
    <PlanGrid {...args}>
      <PlanCard heading={2} name="Free" price="€0" billing="No card needed">
        <PlanAction>
          <Button>Start free</Button>
        </PlanAction>
      </PlanCard>
      <PlanCard
        heading={2}
        name="Team"
        price="€49"
        period="a month"
        billing="or €490 a year, 2 months free"
        details={["5 seats included"]}
      >
        <PlanAction>
          <Button>Subscribe</Button>
        </PlanAction>
      </PlanCard>
    </PlanGrid>
  ),
};

/** The plan the page points to carries the gold edge and says why beside its name; each plan says who it is for. */
export const Recommended: Story = {
  render: (args) => (
    <PlanGrid {...args}>
      <PlanCard heading={2} name="Solo" lead="For one person" price="€9" period="a month">
        <PlanAction>
          <Button variant="secondary">Choose Solo</Button>
        </PlanAction>
      </PlanCard>
      <PlanCard heading={2} name="Team" lead="For a team, with webhooks" price="€49" period="a month" emphasis>
        <PlanStatus>
          <Badge tone="neutral" track="prose">
            Recommended
          </Badge>
        </PlanStatus>
        <PlanAction>
          <Button>Choose Team</Button>
        </PlanAction>
      </PlanCard>
    </PlanGrid>
  ),
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll(".di-plan-card");
    await expect(cards[1]).toHaveClass("di-surface-edge-one");
    await expect(cards[0]).not.toHaveClass("di-surface-edge-one");
    await expect(cards[1].querySelector(".di-plan-price")).toHaveTextContent("€49 a month");
    const [first, second] = [...cards].map((card) => card.getBoundingClientRect());
    const prices = [...canvasElement.querySelectorAll(".di-plan-price")].map((p) => p.getBoundingClientRect().top);
    if (Math.abs(first.top - second.top) < 2) await expect(Math.abs(prices[0] - prices[1])).toBeLessThan(2);
  },
};
