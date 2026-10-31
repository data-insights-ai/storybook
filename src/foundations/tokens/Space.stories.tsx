import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Plus } from "lucide-react";
import { Button, Grid, MetaLine, Panel, Stack, TextField, Toolbar } from "../../index";
import { Doc, Section } from "../guide/Doc";
import { brokenTokenNames, Tile, Tiles, TokenName, useResolved } from "../guide/Tokens";
import "./Space.css";

const space = [
  "--di-space-4",
  "--di-space-8",
  "--di-space-12",
  "--di-space-16",
  "--di-space-24",
  "--di-space-32",
  "--di-space-48",
];

const radius = [
  { token: "--di-radius-micro", name: "Field, tag, tooltip" },
  { token: "--di-radius-control", name: "Button, menu" },
  { token: "--di-radius-inset", name: "Inset group, code" },
  { token: "--di-radius-surface", name: "Panel, dialog" },
];

const elevation = [
  { token: "--di-bg-subtle", name: "Inset", className: "is-inset" },
  { token: "--di-elevation-surface", name: "Surface", className: "is-surface" },
  { token: "--di-shadow-plane", name: "Menu", className: "is-plane" },
  { token: "--di-shadow-window", name: "Dialog", className: "is-window" },
];

const measured = ["--di-control-h-md", "--di-row-h", "--di-inset", "--di-gap-16"];

function Spacing() {
  const { ref, values } = useResolved(space);
  return (
    <div ref={ref}>
      {space.map((token) => (
        <div key={token} className="di-doc-row di-space-row">
          <span className="di-space-bar" style={{ inlineSize: `var(${token})` }} aria-hidden />
          <span className="di-space-spec">
            <TokenName token={token} />
            <span className="di-space-px">{values[token]}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function DensityPanel({ density }: { density: "comfortable" | "compact" }) {
  const { ref, values } = useResolved(measured);
  return (
    <div data-density={density} ref={ref}>
      <Panel title={density === "comfortable" ? "Comfortable" : "Compact"} heading={3}>
        <Stack gap={16}>
          <Toolbar fillFirst>
            <TextField id={`space-${density}`} label="Collector" placeholder="edge-gw-01" />
            <Button size="sm" variant="secondary">
              Small
            </Button>
            <Button variant="secondary">Medium</Button>
            <Button size="lg">
              <Plus /> Large
            </Button>
          </Toolbar>
          <MetaLine
            items={[
              `field ${values["--di-control-h-md"] ?? ""}`,
              `row ${values["--di-row-h"] ?? ""}`,
              `inset ${values["--di-inset"] ?? ""}`,
              `gap ${values["--di-gap-16"] ?? ""}`,
            ]}
          />
        </Stack>
      </Panel>
    </div>
  );
}

function SpacePage() {
  return (
    <Doc title="Space and shape" lede="Every length is a step of a ramp; density scales the steps.">
      <Grid min="320px" gap={16}>
        <Panel title="Spacing" heading={2}>
          <Spacing />
        </Panel>
        <Panel title="Radius" heading={2}>
          <Tiles>
            {radius.map(({ token, name }) => (
              <Tile
                key={token}
                token={token}
                name={name}
                drawing={<span className="di-radius-corner" style={{ borderRadius: `var(${token})` }} />}
              />
            ))}
          </Tiles>
        </Panel>
      </Grid>
      <Panel title="Elevation" heading={2}>
        <div className="di-elevation-ground">
          <Tiles>
            {elevation.map(({ token, name, className }) => (
              <Tile
                key={token}
                token={token}
                name={name}
                drawing={<span className={`di-elevation-sample ${className}`} />}
              />
            ))}
          </Tiles>
        </div>
      </Panel>
      <Section title="Density">
        <Stack gap={16}>
          <DensityPanel density="comfortable" />
          <DensityPanel density="compact" />
        </Stack>
      </Section>
    </Doc>
  );
}

const meta = {
  title: "Foundations/Space and shape",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

/** Each bar is as long as its token, and no token name wraps. */
export const SpaceAndShape: StoryObj = {
  name: "Space and shape",
  render: () => <SpacePage />,
  play: async ({ canvasElement }) => {
    await expect(brokenTokenNames(canvasElement)).toEqual([]);
    const bars = Array.from(canvasElement.querySelectorAll<HTMLElement>(".di-space-bar"), (bar) => bar.offsetWidth);
    await expect(bars).toEqual(space.map((token) => parseInt(token.split("-").pop()!, 10)));
  },
};
