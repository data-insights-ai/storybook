import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { AppShellBar } from "./AppShell";
import { Button } from "./Button";
import { RouteProgress } from "./RouteProgress";
import { SkeletonPage } from "./SkeletonPage";

const meta = {
  title: "Primitives/Waiting/RouteProgress",
  component: RouteProgress,
  tags: ["autodocs"],
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
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <AppShellBar>
          <Button variant="secondary" size="dense" onClick={navigate}>
            Navigate
          </Button>
          <RouteProgress active={active} label="Loading page" />
        </AppShellBar>
        {active ? <SkeletonPage variant="detail" label="Loading page" /> : <p>The page has arrived.</p>}
      </div>
    );
  },
};
