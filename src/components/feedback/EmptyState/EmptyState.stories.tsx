import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchX, UserPlus } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Panel } from "../../layout/page/Panel";
import { EmptyState, EmptyStateAction, EmptyStateIcon } from "./EmptyState";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  subcomponents: { EmptyStateIcon, EmptyStateAction },
  tags: ["layer:block", "autodocs"],
  args: {
    eyebrow: "No results",
    title: "No source matches this filter.",
    body: "The register holds 24 sources. None of them was paused in the last 24 hours.",
    mono: false,
    children: null,
  },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A filter found nothing, so the empty state takes the list's place inside
 * its panel and offers the one way back. It has no frame and no tone of its
 * own: it stands on the panel's ground.
 */
export const InAPanel: Story = {
  render: (args) => (
    <Panel title="Sources" heading={2}>
      <EmptyState {...args}>
        <EmptyStateIcon>
          <SearchX />
        </EmptyStateIcon>
        <EmptyStateAction>
          <Button variant="secondary" size="sm">
            Clear filters
          </Button>
        </EmptyStateAction>
      </EmptyState>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole("status");
    await expect(status).toHaveTextContent("No source matches this filter.");
    const style = getComputedStyle(status);
    await expect(style.boxShadow).toBe("none");
    await expect(parseFloat(style.borderTopWidth)).toBe(0);
    await expect(style.backgroundColor).toBe("rgba(0, 0, 0, 0)");
    const frame = status.getBoundingClientRect();
    const title = canvas.getByText("No source matches this filter.").getBoundingClientRect();
    await expect(Math.abs(title.left - frame.left - (frame.right - title.right))).toBeLessThanOrEqual(1);
    const icon = status.querySelector(".di-empty-state-icon")!.getBoundingClientRect();
    await expect(icon.bottom).toBeLessThanOrEqual(title.top);
  },
};

/** First use: no eyebrow where the panel names the place, an icon and the one action. */
export const FirstUse: Story = {
  args: {
    eyebrow: "",
    title: "No invitations yet.",
    body: "Invite colleagues by email. They join with the role you choose.",
  },
  render: (args) => (
    <Panel title="Invitations" heading={2}>
      <EmptyState {...args}>
        <EmptyStateIcon>
          <UserPlus />
        </EmptyStateIcon>
        <EmptyStateAction>
          <Button>Invite people</Button>
        </EmptyStateAction>
      </EmptyState>
    </Panel>
  ),
};

/** Nothing configured: a different fact from no results, never on the same screen. */
export const NotConfigured: Story = {
  args: {
    eyebrow: "Nothing configured",
    title: "This workspace has no sources yet.",
    body: "Connect a source to start a register. Nothing is sealed until the first entry lands.",
  },
  render: (args) => (
    <Panel title="Sources" heading={2}>
      <EmptyState {...args}>
        <EmptyStateAction>
          <Button>Connect a source</Button>
        </EmptyStateAction>
      </EmptyState>
    </Panel>
  ),
};

/** The query that matched nothing, in the mono track. */
export const MonoBody: Story = {
  args: {
    title: "No source matches this query.",
    body: "host:*.example.io AND state:paused AND seen>2026-09-22T09:00:00Z",
    mono: true,
  },
  render: (args) => (
    <Panel title="Sources" heading={2}>
      <EmptyState {...args}>
        <EmptyStateAction>
          <Button variant="secondary" size="sm">
            Edit query
          </Button>
        </EmptyStateAction>
      </EmptyState>
    </Panel>
  ),
};

/** Nothing to do about it: no action. */
export const WithoutAction: Story = {
  args: {
    eyebrow: "Out of scope",
    title: "This view is limited to sealed entries.",
    body: "Unsealed entries exist, but an auditor key cannot read them.",
  },
  render: (args) => (
    <Panel title="Entries" heading={2}>
      <EmptyState {...args} />
    </Panel>
  ),
};

/** German: the measure holds and the action stays one centred button. */
export const German: Story = {
  args: {
    eyebrow: "Keine Ergebnisse",
    title: "Keine Datenquelle entspricht diesem Filter.",
    body: "Das Verzeichnis enthält 24 Datenquellen. Keine davon wurde in den letzten 24 Stunden pausiert.",
  },
  render: (args) => (
    <div lang="de">
      <Panel title="Datenquellen" heading={2}>
        <EmptyState {...args}>
          <EmptyStateIcon>
            <SearchX />
          </EmptyStateIcon>
          <EmptyStateAction>
            <Button variant="secondary" size="sm">
              Alle Filter zurücksetzen
            </Button>
          </EmptyStateAction>
        </EmptyState>
      </Panel>
    </div>
  ),
};
