import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { UserPlus } from "lucide-react";
import { EmptyState, EmptyStateAction, EmptyStateIcon } from "./EmptyState";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["layer:block", "autodocs"],
  args: {
    index: "00",
    eyebrow: "No results",
    title: "No source matches this filter.",
    body: "The register holds 24 sources. None of them is paused in the last 24 hours.",
    mono: false,
    tone: "neutral",
    children: null,
  },
  argTypes: {
    index: { control: "text" },
    eyebrow: { control: "text" },
    title: { control: "text" },
    body: { control: "text" },
    mono: { control: "boolean" },
    tone: { control: "radio", options: ["neutral", "danger"] },
    children: { control: false },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Zero results: the register has entries, this filter found none. */
export const NoResults: Story = {
  render: (args) => (
    <EmptyState {...args}>
      <EmptyStateAction>
        <Button variant="secondary" size="dense">
          Clear filters
        </Button>
      </EmptyStateAction>
    </EmptyState>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("No source matches this filter.")).toBeVisible();
  },
};

/** Zero configuration: a different fact, and never on the same screen. */
export const NotConfigured: Story = {
  args: {
    index: "00",
    eyebrow: "Nothing configured",
    title: "This workspace has no sources yet.",
    body: "Connect a source to start a register. Nothing is sealed until the first entry lands.",
  },
  render: (args) => (
    <EmptyState {...args}>
      <EmptyStateAction>
        <Button variant="primary" size="dense">
          Connect a source
        </Button>
      </EmptyStateAction>
    </EmptyState>
  ),
};

/** The query itself, in the mono track. */
export const MonoBody: Story = {
  args: {
    mono: true,
    body: "host:*.example.io AND state:paused AND seen>2026-09-22T09:00:00Z",
  },
  render: (args) => (
    <EmptyState {...args}>
      <EmptyStateAction>
        <Button variant="secondary" size="dense">
          Edit query
        </Button>
      </EmptyStateAction>
    </EmptyState>
  ),
};

/** A boundary the system hit, not an absence it found. */
export const Failure: Story = {
  args: {
    index: "!!",
    tone: "danger",
    eyebrow: "Boundary",
    title: "The register could not be read.",
    body: "The seal store did not answer within 30 seconds. Nothing was written and nothing was lost.",
  },
  render: (args) => (
    <EmptyState {...args}>
      <EmptyStateAction>
        <Button variant="primary" size="dense">
          Retry
        </Button>
      </EmptyStateAction>
    </EmptyState>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("!!")).toBeVisible();
  },
};

/** No action, where the operator has nothing to do about it. */
export const WithoutAction: Story = {
  args: {
    eyebrow: "Out of scope",
    title: "This view is limited to sealed entries.",
    body: "Unsealed entries exist, but an auditor key cannot read them.",
  },
};

/** An ordinary first-use action needs no decorative record number. */
export const WithoutIndex: Story = {
  args: {
    index: undefined,
    eyebrow: "Get started",
    title: "No sources connected",
    body: "Connect your first source to start receiving records.",
  },
  render: (args) => (
    <EmptyState {...args}>
      <EmptyStateAction>
        <Button>Connect source</Button>
      </EmptyStateAction>
    </EmptyState>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Connect source" })).toBeVisible();
    await expect(canvasElement.querySelector(".di-empty-index")).toBeNull();
  },
};

/** First use inside a page that already names the place: no eyebrow, an icon, the one action. */
export const FirstUse: Story = {
  args: {
    index: undefined,
    eyebrow: "",
    title: "No invitations yet.",
    body: "Invite colleagues by email. They join with the role you choose.",
  },
  render: (args) => (
    <EmptyState {...args}>
      <EmptyStateIcon>
        <UserPlus />
      </EmptyStateIcon>
      <EmptyStateAction>
        <Button>Invite people</Button>
      </EmptyStateAction>
    </EmptyState>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Invite people" })).toBeVisible();
  },
};
