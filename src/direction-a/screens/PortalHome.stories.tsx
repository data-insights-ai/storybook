import type { Meta, StoryObj } from "@storybook/react-vite";
import { PortalHomeA } from "./PortalHomeA";
import { PortalHomeToday } from "./PortalHomeToday";
import { allRunning, decisionDue } from "./portal.sample";

const meta = {
  title: "Direction A/Screens/Portal home",
  component: PortalHomeA,
  tags: ["layer:screen", "!autodocs", "direction:a"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PortalHomeA>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Today: the products in a panel holding one small button, then five equal cards with charts. */
export const Today: Story = { render: () => <PortalHomeToday /> };

/** The normal state: the claim says everything runs, licences are one status line, no gold anywhere. */
export const AllRunningOwner: Story = {
  name: "All running (owner)",
  parameters: { direction: "a" },
  render: () => <PortalHomeA role="owner" state={allRunning} />,
};

/** A licence ends within 30 days: the claim names it, and it becomes the one gold item with its action. */
export const DecisionDueOwner: Story = {
  name: "Decision due (owner)",
  parameters: { direction: "a" },
  render: () => <PortalHomeA role="owner" state={decisionDue} />,
};

/** An administrator: the team and recent changes, no cost; the billing decision is not theirs, so the claim says everything runs. */
export const Administrator: Story = {
  name: "Administrator",
  parameters: { direction: "a" },
  render: () => <PortalHomeA role="admin" state={decisionDue} />,
};

/** A billing administrator: the decision, licences and cost; no team management, no recent changes. */
export const BillingAdministrator: Story = {
  name: "Billing administrator",
  parameters: { direction: "a" },
  render: () => <PortalHomeA role="billing" state={decisionDue} />,
};

/** A plain member: the claim and their products, nothing about team, cost or licences. */
export const Member: Story = {
  name: "Member",
  parameters: { direction: "a" },
  render: () => <PortalHomeA role="member" state={decisionDue} />,
};
