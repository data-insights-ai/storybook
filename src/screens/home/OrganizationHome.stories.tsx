import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { OrganizationHome } from "./OrganizationHome";
import { allRunning, decisionDue } from "./home.sample";

const meta = {
  title: "Patterns/Organization home",
  component: OrganizationHome,
  tags: ["layer:screen", "!autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof OrganizationHome>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The normal state: one quiet line says everything runs, and no gold anywhere. */
export const AllRunningOwner: Story = {
  name: "All running (owner)",
  args: { role: "owner", state: allRunning },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Everything is running")).toBeVisible();
    await expect(canvasElement.querySelectorAll(".is-emphasis")).toHaveLength(0);
  },
};

/** A licence ends within 30 days: it becomes the one gold item, with its action. */
export const DecisionDueOwner: Story = {
  name: "Decision due (owner)",
  args: { role: "owner", state: decisionDue },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 2, name: "1 decision is due" })).toBeVisible();
    await expect(canvasElement.querySelectorAll(".is-emphasis")).toHaveLength(1);
  },
};

/** An administrator: the team and recent changes, no cost; the licence is not theirs to decide. */
export const Administrator: Story = {
  args: { role: "admin", state: decisionDue },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Everything is running")).toBeVisible();
    await expect(canvas.queryByText("Credit")).toBeNull();
  },
};

/** A billing administrator: the decision, licences and cost; no team management, no changes. */
export const BillingAdministrator: Story = {
  name: "Billing administrator",
  args: { role: "billing", state: decisionDue },
};

/** A member: the line and their products, nothing about team, cost or licences. */
export const Member: Story = {
  args: { role: "member", state: decisionDue },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("your products are ready")).toBeVisible();
    await expect(canvas.queryByText("Team")).toBeNull();
  },
};
