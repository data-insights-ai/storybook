import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { AppShellBar, AppShellBarEnd } from "../../../shell/AppShellBar";
import { Button } from "../../../actions/Button";
import { Stack } from "../../../layout/arrangement/Stack";
import { RouteProgress } from "./RouteProgress";
import { Loading as Skeleton } from "../Loading";

const meta = {
  title: "Feedback/Waiting/RouteProgress",
  component: RouteProgress,
  tags: ["layer:primitive", "autodocs"],
  args: { active: true, label: "Loading page", delay: 150 },
  argTypes: {
    active: { control: "boolean" },
    label: { control: "text" },
    delay: { control: { type: "number" } },
  },
  render: (args) => (
    <AppShellBar>
      <span>Sources</span>
      <RouteProgress {...args} />
    </AppShellBar>
  ),
} satisfies Meta<typeof RouteProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The hairline along the bar's bottom rule, easing towards the end. */
export const Loading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("progressbar", { name: "Loading page" })).toBeInTheDocument());
  },
};

/**
 * A page change: the bar stays, the line fills, a skeleton in the shape
 * of the next page holds its place until it arrives. Press Navigate to
 * run it again.
 */
export const Navigating: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [active, setActive] = useState(true);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const navigate = () => {
      setActive(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setActive(false), 1800);
    };
    useEffect(() => {
      timer.current = setTimeout(() => setActive(false), 1800);
      return () => clearTimeout(timer.current);
    }, []);
    return (
      <Stack gap={24}>
        <AppShellBar>
          <span>feed.example.io</span>
          <AppShellBarEnd moreLabel="More">
            <Button variant="secondary" size="sm" onClick={navigate}>
              Navigate again
            </Button>
          </AppShellBarEnd>
          <RouteProgress active={active} label="Loading page" />
        </AppShellBar>
        {active ? <Skeleton shape="detail" label="Loading the source" /> : <p>The source has arrived.</p>}
      </Stack>
    );
  },
};
