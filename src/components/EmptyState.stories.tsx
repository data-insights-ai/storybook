import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Blocks/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    index: "00",
    eyebrow: "No results",
    title: "No source matches this filter.",
    body: "The register holds 24 sources. None of them is paused in the last 24 hours.",
    mono: false,
    tone: "default",
  },
  argTypes: {
    index: { control: "text" },
    eyebrow: { control: "text" },
    title: { control: "text" },
    body: { control: "text" },
    mono: { control: "boolean" },
    tone: { control: "radio", options: ["default", "danger"] },
    action: { control: false },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Zero results: the register has entries, this filter found none. */
export const NoResults: Story = {
  render: (args) => (
    <EmptyState
      {...args}
      action={
        <Button variant="secondary" size="dense">
          Clear filters
        </Button>
      }
    />
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
    <EmptyState
      {...args}
      action={
        <Button variant="primary" size="dense">
          Connect a source
        </Button>
      }
    />
  ),
};

/** The query itself, in the mono track. */
export const MonoBody: Story = {
  args: {
    mono: true,
    body: "host:*.example.io AND state:paused AND seen>2026-09-22T09:00:00Z",
  },
  render: (args) => (
    <EmptyState
      {...args}
      action={
        <Button variant="secondary" size="dense">
          Edit query
        </Button>
      }
    />
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
    <EmptyState
      {...args}
      action={
        <Button variant="primary" size="dense">
          Retry
        </Button>
      }
    />
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
